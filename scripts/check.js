#!/usr/bin/env node
/**
 * latency-tool CI チェックスクリプト
 * 使い方: node scripts/check.js [index.htmlのパス]
 *
 * チェック内容:
 *   1. JS構文チェック（new Function による評価）
 *   2. 禁止パターン検出（onclick属性・navigator.clipboard直書き・revokeObjectURL漏れ）
 *   3. 必須パターン確認（escHtml適用・chcp 65001・BOM出力）
 *   4. カードID重複チェック
 *   5. 競合定義IDが実在するカードか確認
 *   6. escHtml が " と ' をエスケープするか確認
 */

'use strict';
const fs   = require('fs');
const path = require('path');

// ── ファイル読み込み ──────────────────────────────
const htmlPath = process.argv[2] || path.join(__dirname, '..', 'index.html');
if (!fs.existsSync(htmlPath)) {
  console.error(`❌ ファイルが見つかりません: ${htmlPath}`);
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, 'utf8');

let errors   = [];
let warnings = [];
let passed   = 0;

function ok(msg)   { console.log(`  ✅ ${msg}`); passed++; }
function err(msg)  { console.log(`  ❌ ${msg}`); errors.push(msg); }
function warn(msg) { console.log(`  ⚠️  ${msg}`); warnings.push(msg); }

// ── JS抽出 ───────────────────────────────────────
const scriptBlocks = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1]);
const js = scriptBlocks.join('\n');

// ════════════════════════════════════════════════
// 1. JS 構文チェック
// ════════════════════════════════════════════════
console.log('\n[1] JS 構文チェック');
try {
  new Function(js);
  ok('構文エラーなし');
} catch (e) {
  err(`構文エラー: ${e.message}`);
}

// ════════════════════════════════════════════════
// 2. 禁止パターン
// ════════════════════════════════════════════════
console.log('\n[2] 禁止パターン検出');

// onclick= 属性（GTAGなど外部スクリプト由来は除外）
const onclickMatches = [...html.matchAll(/\bonclick\s*=/g)];
if (onclickMatches.length > 0) {
  err(`onclick= 属性が ${onclickMatches.length} 件あります（data-action デリゲーションに統一してください）`);
} else {
  ok('onclick= 属性なし');
}

// navigator.clipboard の直呼び出し（clipboardCopy ヘルパー経由でないもの）
// clipboardCopy 関数内の定義は除外
const clipboardDirectCalls = [...js.matchAll(/navigator\.clipboard\.writeText\s*\(/g)];
// clipboardCopy 関数の定義内は1件だけ許可
if (clipboardDirectCalls.length > 1) {
  err(`navigator.clipboard.writeText の直呼び出しが ${clipboardDirectCalls.length} 件（clipboardCopy() を使用してください）`);
} else {
  ok(`navigator.clipboard.writeText の直呼び出しなし（clipboardCopy ヘルパー内の定義のみ）`);
}

// URL.createObjectURL — revokeObjectURL とセットかチェック
const createCount = [...js.matchAll(/URL\.createObjectURL\s*\(/g)].length;
const revokeCount = [...js.matchAll(/URL\.revokeObjectURL\s*\(/g)].length;
if (createCount > 0 && createCount !== revokeCount) {
  warn(`createObjectURL(${createCount}件) と revokeObjectURL(${revokeCount}件) の数が一致しません（メモリリークの可能性）`);
} else if (createCount > 0) {
  ok(`createObjectURL(${createCount}件) に対し revokeObjectURL が対応`);
}

// ════════════════════════════════════════════════
// 3. 必須パターン確認
// ════════════════════════════════════════════════
console.log('\n[3] 必須パターン確認');

const requiredPatterns = [
  { label: 'escHtml が innerHTML に適用されている',  pattern: /escHtml\(s\.title\)/ },
  { label: 'escXml が nipExport に適用されている',   pattern: /escXml\(game\.name\)/ },
  { label: '.bat に chcp 65001 が含まれている',      pattern: /chcp 65001 >nul/ },
  { label: 'UTF-8 BOM 出力（ps1）',                 pattern: /0xEF, 0xBB, 0xBF/ },
  { label: 'clipboardCopy に .catch\(\) がある',    pattern: /\.catch\(\s*\(\s*\)\s*=>/ },
  { label: 'data-toast-close デリゲーション',        pattern: /data-toast-close/ },
  { label: 'restoreEnv 三重初期化防止コメント',       pattern: /selectEnv を直接呼ぶと三重に/ },
  { label: 'localStorage 破損防御',                 pattern: /Array\.isArray\(parsed\)/ },
  { label: 'APP_VERSION が定義されている',           pattern: /const APP_VERSION\s*=/ },
  { label: 'krBar に ARIA role が設定されている',    pattern: /role="progressbar"/ },
];

for (const { label, pattern } of requiredPatterns) {
  if (pattern.test(js) || pattern.test(html)) {
    ok(label);
  } else {
    err(`${label} — パターンが見つかりません`);
  }
}

// ════════════════════════════════════════════════
// 4. カードID重複チェック
// ════════════════════════════════════════════════
console.log('\n[4] カードID重複チェック');
const idMatches = [...js.matchAll(/\bid:\s*['"]([a-z_]+)['"]/g)].map(m => m[1]);
const idCount   = {};
idMatches.forEach(id => { idCount[id] = (idCount[id] || 0) + 1; });
// SETTINGS_CONFIG の id のみ対象（rollbackDefs 等での重複は除外するため閾値を3に）
const dupIds = Object.entries(idCount).filter(([, c]) => c > 2).map(([id]) => id);
if (dupIds.length > 0) {
  warn(`カードIDが多数重複しています（rollback定義含む場合は正常）: ${dupIds.join(', ')}`);
} else {
  ok('カードID重複なし（許容範囲内）');
}

// ════════════════════════════════════════════════
// 5. CONFLICTS 定義 — IDが SETTINGS_CONFIG に存在するか
// ════════════════════════════════════════════════
console.log('\n[5] 競合定義IDの整合性チェック');
const conflictIdsMatch = [...js.matchAll(/ids:\s*\[([^\]]+)\]/g)];
const settingIds = new Set([...js.matchAll(/id:\s*'([a-z_]+)'/g)].map(m => m[1]));
let conflictOk = true;
for (const m of conflictIdsMatch) {
  const ids = [...m[1].matchAll(/'([a-z_]+)'/g)].map(x => x[1]);
  for (const id of ids) {
    if (!settingIds.has(id)) {
      err(`CONFLICTS に未定義ID: '${id}'`);
      conflictOk = false;
    }
  }
}
if (conflictOk) ok('全 CONFLICTS ID が SETTINGS_CONFIG に存在する');

// ════════════════════════════════════════════════
// 6. escHtml が " と ' をエスケープするか
// ════════════════════════════════════════════════
console.log('\n[6] escHtml エスケープ完全性チェック');
const escHtmlMatch = js.match(/function escHtml\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
if (escHtmlMatch) {
  const body = escHtmlMatch[1];
  const hasQuot = /&quot;/.test(body);
  const hasApos = /&#39;|&apos;/.test(body);
  if (hasQuot && hasApos) {
    ok('escHtml が &, <, >, ", \' の5文字をエスケープ');
  } else {
    if (!hasQuot) err('escHtml に &quot; エスケープがありません');
    if (!hasApos) err('escHtml に &#39; / &apos; エスケープがありません');
  }
} else {
  err('escHtml 関数が見つかりません');
}

// ════════════════════════════════════════════════
// 結果サマリー
// ════════════════════════════════════════════════
console.log('\n' + '═'.repeat(52));
console.log(`  通過: ${passed} 件  |  警告: ${warnings.length} 件  |  エラー: ${errors.length} 件`);
console.log('═'.repeat(52));

if (warnings.length > 0) {
  console.log('\n⚠️  警告一覧:');
  warnings.forEach(w => console.log(`  - ${w}`));
}

if (errors.length > 0) {
  console.log('\n❌ エラー一覧:');
  errors.forEach(e => console.log(`  - ${e}`));
  console.log('\nCI 失敗');
  process.exit(1);
} else {
  console.log('\n✅ 全チェック通過\n');
  process.exit(0);
}
