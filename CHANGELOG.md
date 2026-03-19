# CHANGELOG

PCゲーム遅延最適化ツール — バージョン履歴

---

## [v21.1] - 2025-03 ※コードレビュー修正版

### 🔴 バグ修正（致命的）

- **`detectCpu()` ビットシフトオーバーフロー修正**  
  32コア超（Threadripper PRO等）の環境で `(1 << gameCores)` が負数になりアフィニティマスク値が壊れていたバグを修正。`gameCores < 31` 時のみビットシフトを使用し、31以上の場合は `Math.pow(2, gameCores)` にフォールバック。

- **`nipExport()` XMLインジェクション修正**  
  カスタムゲーム名・EXEパスをXMLにそのまま埋め込んでいたため、`& < > " '` を含む入力で `.nip` ファイルが破損する問題を修正。`escXml()` 関数を新設して全フィールドをエスケープ。

- **`APP_VERSION` 未定義による .ps1 バージョン表記の空欄**  
  `const APP_VERSION = 'v21'` をJS先頭に追加。生成される `.ps1` のヘッダーコメントにバージョンが正しく表示されるよう修正。

- **`URL.createObjectURL()` メモリリーク修正**  
  `nipExport` / `exportBat` / `exportRollbackBat` の3箇所でBlobオブジェクトURLを作成後に `revokeObjectURL()` していなかった問題を修正。ダウンロード10秒後に自動解放するよう変更。

- **`onclick` 属性の残存（イベント方式違反）**  
  `showPs1Guide()` で動的生成するトースト通知の閉じるボタンに `onclick=` が直書きされていた問題を修正。`data-toast-close` 属性 + `DOMContentLoaded` 内のclickデリゲーションに統一。

- **`navigator.clipboard` の `.catch()` 欠落**  
  全7箇所のクリップボード操作にエラーハンドリングがなく、HTTP環境やブラウザ権限ブロック時にコピー失敗が無言になっていた問題を修正。共通ヘルパー `clipboardCopy(btn, text, resetLabel)` を新設し全箇所を統一。失敗時は `⚠ コピー失敗` をボタンに表示。

### 🟡 改善・最適化

- **`copyAll()` がチェック状態を無視していた問題を修正**  
  「📋 コマンドを全コピー」がチェック済み・未チェック問わず全コマンドをコピーしていた挙動を変更。チェック済みカードが1枚以上ある場合はチェック済みのみをコピー、0枚の場合は全件コピー（後方互換）。`exportBat()` との動作一貫性を確保。

- **未使用変数 `ftState` を削除**  
  `const ftState = { avg: null, max: null, low1pct: null }` が宣言のみで参照ゼロのため削除。

- **未使用関数 `copyCmd()` を削除**  
  `copyCmdFromTarget()` への統一完了後も残っていた旧関数を削除。

- **アクセシビリティ改善 — `aria-label` 追加（従来0件→8件）**  
  `rxSlider` / `txSlider` / `krTarget` / `krExportToggle` / `shareInput` / `pingInput` / `nipFpsLimit` に `aria-label` を追加。`krTarget` に `role="button" tabindex="0"` も付与しキーボード操作可能に。

- **480px以下のレスポンシブ対応追加**  
  スマートフォン縦持ち等の極小画面向け `@media (max-width: 480px)` を新設。ステッパーラベル非表示・ヒーローテキスト縮小・プリセットバー折り返しを追加。

---

## [v21] - 2025-02

### 追加

- **MPO（Multi-Plane Overlay）無効化カード追加** (`mpo`)  
  DWMのスタッタリング主要因を `OverlayTestMode=5` で排除。GPU カテゴリに追加。

- **MMCSS SystemResponsiveness カード追加** (`mmcss_sr`)  
  `SystemResponsiveness=0` + `NetworkThrottlingIndex=0xFFFFFFFF` + `Tasks\Games` 最大化を1カードに統合。

- **競合チェック3ペア追加**  
  `mpo + hags` / `mmcss_sr + network_throttle` / `mmcss_sr + registry` の競合警告を追加。

- **ロールバックに v2追加カード対応**  
  `mpo` / `mmcss_sr` / `hags` / `shader_cache` / `usb_suspend` / `rss` / `tcp_autotuning` / `timer` / `coreparking` のロールバック定義を追加。`mmcss_sr` チェック時は `network_throttle` と `registry` のロールバックを自動除外する排他制御を実装。

### 修正

- `hpet` ロールバック `psCode` の `bcdedit` を `Start-Process bcdedit -Wait -NoNewWindow` 経由に変更（PowerShell直書き禁止ルール対応）
- `usb_suspend` の `verify` フィールドで `powercfg` に `&` 演算子を追加
- `coreparking` の `verify` フィールドで `powercfg` に `&` 演算子を追加
- `tcp_autotuning` の `verify` フィールドで `netsh` に `&` 演算子を追加
- `hpet` の `verify` フィールドで `bcdedit` に `&` 演算子を追加

---

## [v20] - 2025-01

### 追加

- **エクスポート形式を .bat 単体から .zip（.ps1 + .bat）に変更**  
  PowerShellスクリプトをメインとし、.bat はUAC昇格ランチャーのみに分離。`chcp 65001` で日本語文字化けを解消。

- **ps1 実行モード選択（一括 / 個別確認）**  
  起動時メニューで `[1] 一括適用` / `[2] 個別確認（y/n）` を選択可能に。

- **ロールバック .zip 生成**  
  Phase 1（バックアップJSON出力）→ Phase 2（デフォルト復元）の2段構成。バックアップからのJSON復元オプション（選択肢3）も追加。

- **`showPs1Guide` トースト通知**  
  ZIP ダウンロード後に「展開 → .bat を管理者実行」手順をトーストで案内。

### 修正

- `power` カードの `powercfg /setactive` を `Start-Process powercfg -ArgumentList ...` に変更
- `usb_suspend` カードの `powercfg /setacvalueindex` を `Start-Process powercfg` + `& powercfg` に変更
- `coreparking` カードを同様に修正
- `hags` カードの `reg add` を `Set-ItemProperty` に変更

---

## [v19] - 2024-12

### 追加

- **共有コード v2 形式** (`LT2_[Base64url JSON]`)  
  旧v1（12設定固定ビットマスク）から全カード対応のJSONエンコード方式に変更。v1後方互換デコードを維持。

- **URLハッシュ自動インポート** (`tryImportFromUrl()`)  
  `#LT2_...` 形式のURLを開くと自動的に設定を復元。

- **URLコピーボタン追加** (`copyShareUrl`)

### 修正

- `verify` フィールドに `findstr` が含まれていたカードを `Select-String` に置き換え（PowerShell互換性修正）

---

## [v18] - 2024-11

### 追加

- **NVIDIA Inspector プロファイル生成（Step 4）**  
  Fortnite / VALORANT / Apex Legends / Overwatch 2 + カスタムの `.nip` ファイルを生成。UTF-16LE BOM付きXML出力でNVIDIA Profile Inspectorに直接インポート可能。

- **rBAR（Resizable BAR）設定** — `rbar_feature` / `rbar_options` / `rbar_size` の3セット自動処理
- **FPSリミッター設定**（NIP内オプション、`SettingID: 274183178`）
- **CUDA Force P2 State** / **Memory Allocation Policy** / **Async Compute** / **AA Transparency** / **Predefined Aniso** 設定追加

### 変更

- Step 4 はNVIDIA選択時のみ表示するよう制御を追加

---

## [v17] - 2024-10

### 追加

- **キーリピート計測機能**  
  キー入力イベントの間隔を20サンプル収集し、リピート遅延・周期・Hz・判定（最速 / 標準 / 低速）を表示。結果が「標準」以下の場合にエクスポートトグルを表示し、.bat に `KeyboardDelay=0 / KeyboardSpeed=31` の設定を自動挿入。

- **キーリピート最速化をエクスポートに含めるトグル** (`krExportToggle`)

---

## [v16] - 2024-09

### 追加

- **Waveform.net 連携（Bufferbloat診断）**  
  グレード選択（A/B/C/D/F）と Ping under load 入力からNICバッファ推奨値を自動計算してスライダーに反映。グレード別メッセージを表示。

- **NICバッファスライダー** (Rx: 64〜1024 / Tx: 64〜1024, 64刻み)
- **ジャンル別スライダーマーカー**（FPS推奨 / MMO推奨の基準線を表示）
- **バッファコマンドの即時プレビュー** — スライダー操作に連動してPS命令をリアルタイム更新

---

## [v15] - 2024-08

### 追加

- **プリセット機能**（4種）  
  🔰 初心者 / 🛡️ 安全重視 / 🔒 セキュリティ優先 / ⚡ 全部盛り。プリセットボタンにカード枚数バッジを表示。

- **`securityRisk: true` フィールド** — VBS・Spectre を「セキュリティ優先」プリセットから除外するフラグ
- **プリセット数プレビューカウント** (`updatePresetCounts()`)

---

## [v14] - 2024-07

### 追加

- **競合チェック機能**（6ペア）  
  `nic_lso+coreparking` / `affinity+interrupt_affinity` / `affinity+irq_affinity` / `hpet+timer` / `vbs+spectre` / `coreparking+win32priority` の同時チェック時にサイドバーへ警告を表示。

- **適用確認コマンド（verify フィールド）** — 21枚のカードに追加。カード内表示と .bat への自動挿入に対応。

---

## [v13] - 2024-06

### 変更

- **イベント方式を `onclick` から `data-action` デリゲーション方式に全面移行**  
  `DOMContentLoaded` 内で `document.addEventListener('click', e => { ... })` による一元管理に変更。

- **チェック状態の `localStorage` 永続化** (`saveCheckedCards` / `restoreCheckedCards`)

---

## [v12] - 2024-05

### 追加

- **Step 3 サイドバーレイアウト（3:1グリッド）**  
  設定カードグリッドとサイドバー（エクスポート・共有・競合警告）を分離。sticky配置で常時表示。

- **進捗バー** (`progressBar` / `stickyProgressFill`)
- **効果バッジ** (`impact: high/medium/low`) / FPSタグ・MMOタグ

---

## [v11] - 2024-04

### 追加

- **ステッパー型ナビゲーション**（Step 1〜3 + Step 4）  
  完了ステップはチェックマークに変化。`expandStep()` で折りたたんだステップを再展開可能。

- **環境別フィルタリング** — `available: fn(env)` による動的表示制御
- **関数型カードフィールド** (`title/sub/desc/commands/manual/verify: fn(env)`)

---

## [v10] - 2024-03

### 初期リリース相当

- GPU / OS / CPUカテゴリ別設定カード（基本18枚）
- 環境選択（GPU / OS / ジャンル）
- .bat 生成（UAC自己昇格付き）
- ダークモード対応（`prefers-color-scheme`）
- `localStorage` による環境設定の永続化
