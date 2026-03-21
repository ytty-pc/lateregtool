# PCゲーム遅延最適化ツール / PC Game Latency Optimizer

> **Windows PC向けの入力遅延・フレームタイム最適化設定ガイドツール**  
> GPU / OS / ジャンルを選ぶだけで、あなたの環境に最適な設定を絞り込みます。

> **Input latency & frame time optimization guide for Windows PC gaming**  
> Select your GPU / OS / genre and get environment-specific settings instantly.

🔗 **ツール / Tool**: https://ytty-pc.github.io/lateregtool/  
📝 **解説記事 / Article**: https://note.com/noted_pothos7691/n/n3016e5312a4f

---

## 概要 / Overview

**[日本語]**

ゲームの遅延（ラグ）を引き起こす原因は多岐にわたります。GPU設定・OS電源管理・ネットワークスタック・CPUスケジューリングなど、各レイヤーに散在する最適化設定を1つのツールにまとめました。

- **環境フィルタリング**: NVIDIA / AMD × Win11 / Win10 × FPS / MMO の組み合わせで不要な設定を自動除外
- **診断機能**: Waveform連携によるBufferbloat判定・NICバッファ推奨・キーリピート計測
- **安全な出力**: UAC自己昇格付き `.bat` で確認コマンド付き一括適用
- **バックアップ**: 適用前バックアップ → レジストリ復元まで一括対応
- **共有**: v3コード（11文字固定）でチェック状態・環境設定をURL共有
- **多言語対応**: 日本語 / English / 简体中文
- **Discord風UI**: 左サイドバー（ステップナビ・プリセット・ゲームツリー・競合警告・共有コード表示）+ トップバー（競合バッジ・.bat生成）

**[English]**

Game latency has many causes — GPU pipeline, OS power management, network stack, and CPU scheduling all play a role. This tool consolidates optimization settings across every layer into a single guided workflow.

- **Environment filtering**: Auto-excludes irrelevant settings based on NVIDIA/AMD × Win11/Win10 × FPS/MMO
- **Diagnostics**: Bufferbloat grading via Waveform, NIC buffer recommendation, key-repeat measurement
- **Safe export**: Self-elevating `.bat` with per-setting verification commands
- **Backup & rollback**: Pre-apply backup → full registry restore in one click
- **Share codes**: 11-character v3 codes encode checked state + environment for URL sharing
- **Multilingual**: Japanese / English / Simplified Chinese
- **Discord-style UI**: Left sidebar (step nav, presets, game tree, conflict warnings, share code) + top bar (conflict badge, .bat export)

---

## 使い方 / How to Use（4ステップ / 4 Steps）

```
Step 1  環境選択 / Environment
        GPU（NVIDIA / AMD）・OS（Win11 / Win10）・ジャンル（FPS / MMO）を選択
        Select GPU, OS, and genre — 3 selections unlock the Next button

Step 2  診断 / Diagnostics
        ① Waveform.net で Bufferbloat 測定 → グレードを入力
          Run Waveform Bufferbloat Test → enter your grade
        ② NICバッファ推奨値をスライダーで確認
          Confirm NIC buffer recommendation via slider
        ③ キーリピート計測でキーボード設定を最適化
          Key-repeat measurement for keyboard optimization

Step 3  設定一覧 / Settings
        30枚のカードから適用したい設定をチェック
        Check the cards you want to apply from 30 setting cards
        プリセット6種も利用可能 / 6 presets available
        ゲーム別推奨ハイライト機能あり / Per-game highlight available
        → .bat をサイドバーからダウンロード / Download .bat from sidebar

Step 4  NVIDIAプロファイル生成（NVIDIA環境のみ）/ NVIDIA Profile （NVIDIA only）
        対応ゲーム9種 + カスタムの .nip ファイルを出力
        Generate .nip for 9 supported games + custom
        ゲーム選択でStep3の推奨カードが自動ハイライト
        Game selection auto-highlights recommended cards in Step 3
```

### .bat の実行方法 / Running the .bat

1. ダウンロードした **`.bat` ファイル** を右クリック → **「管理者として実行」**  
   Right-click the downloaded **`.bat` file** → **"Run as administrator"**
2. 完了後 PCを再起動 / Restart your PC after completion

---

## キーボードショートカット / Keyboard Shortcuts

| キー / Key | 操作 / Action |
|-----------|--------------|
| `Ctrl + F` | カード検索にフォーカス / Focus card search |
| `Ctrl + E` | 設定をエクスポート / Export settings |
| `Ctrl + B` | バックアップ作成 / Create backup |
| `Ctrl + Shift + Z` | 全チェック解除 / Uncheck all |
| `Escape` | 検索クリア / Clear search |
| `?` | ショートカット一覧表示 / Show shortcut help |

---

## 設定カード一覧（30枚）/ Setting Cards (30)

### 📐 GPU（7枚）

| ID | 設定名 / Setting | 概要 / Summary |
|----|-----------------|----------------|
| `reflex` | NVIDIA Reflex / AMD Anti-Lag | GPU側の入力遅延を直接削減 / Directly reduces GPU-side input latency |
| `ull` | Ultra Low Latency Mode | Reflex非対応ゲーム向けキューイング制限 / Frame queue limit for non-Reflex games |
| `shader_cache` | NVIDIAシェーダーキャッシュ無制限化 | レジストリで4GBキャップを解除 / Removes 4 GB registry cap |
| `hypr_rx` | AMD HYPR-RX / AFMF 2 | Anti-Lag 2 + Frame Generation 統合 / Integrated Anti-Lag 2 + Frame Generation |
| `mpo` | MPO無効化 / MPO Disable | DWMスタッタリングの主要因を排除 / Eliminates primary DWM stutter cause |
| `mmcss_sr` | MMCSS SystemResponsiveness | ゲームスレッドへのCPUタイム最大化 / Maximizes CPU time for game threads |
| `hags` | HAGS | GPUスケジューリングをOS→GPU委譲 / Delegates GPU scheduling from OS to GPU |

### ⚙️ OS（15枚）

| ID | 設定名 / Setting | 概要 / Summary |
|----|-----------------|----------------|
| `power` | 高パフォーマンス電源プラン / High Performance Power Plan | CPUクロック変動を抑制 / Stabilizes CPU clock |
| `nagle` | Nagleアルゴリズム無効化 / Nagle Disable | TCPパケット遅延を排除 / Eliminates TCP packet buffering delay |
| `vbs` | VBS/HVCI無効化 ⚠️ | 仮想化セキュリティ層のオーバーヘッド削減（Win11のみ）/ Reduces virtualization security overhead (Win11 only) |
| `spectre` | Spectre/Meltdown無効化 ⚠️ | セキュリティパッチのCPUオーバーヘッド削減 / Reduces CPU overhead from security patches |
| `timer` | タイマー解像度 / Timer Resolution | カーネルタイマーをHPET/TSC最適化（Win10のみ）/ Kernel timer optimization (Win10 only) |
| `network_throttle` | NetworkThrottlingIndex無効化 | ゲーム中の帯域制限を解除 / Removes in-game bandwidth throttle |
| `nic_lso` | NIC LSO・FlowControl・EEE無効化 | ネットワークバッファリングを削減 / Reduces network stack buffering |
| `nic_buffer` | NICバッファ調整 / NIC Buffer | Bufferbloat診断に基づく最適化 / Optimized based on Bufferbloat diagnosis |
| `usb_suspend` | USBセレクティブサスペンド無効化 | 入力デバイスのウェイクアップ遅延を排除 / Eliminates input device wake-up latency |
| `rss` | RSS（Receive Side Scaling） | NIC割り込みをCPUコアに分散 / Distributes NIC interrupts across CPU cores |
| `tcp_autotuning` | TCP自動チューニング無効化 | 受信ウィンドウサイズの動的変動を固定化 / Fixes receive window size |
| `hpet` | HPET無効化 / HPET Disable | システムタイマーをTSCベースに統一 / Unifies system timer to TSC |
| `dpc_latency` | DPC/ISR レイテンシ軽減 | NDISコールバック制限でスパイクを抑制 / Suppresses latency spikes via NDIS callback limit |
| `nvme_queue` | NVMe I/O レイテンシ軽減 | NVMeキューサイズを32に絞りI/O滞留を削減 / Reduces NVMe queue depth to 32 |
| `gamedvr` | Game DVR無効化 / Game DVR Disable | バックグラウンド録画の負荷を排除 / Eliminates background recording overhead |

### 🔲 CPU（8枚）

| ID | 設定名 / Setting | 概要 / Summary |
|----|-----------------|----------------|
| `msi_mode` | MSIモード有効化 / MSI Mode | GPU割り込みをLine-Based→MSIに変換 / Converts GPU interrupts to MSI |
| `interrupt_affinity` | NVIDIA割り込みアフィニティ / NVIDIA Interrupt Affinity | GPU割り込みを専用コアに固定 / Pins GPU interrupt to dedicated core |
| `coreparking` | コアパーキング無効化 / Core Parking Disable | Cステート移行コストを排除 / Eliminates C-state transition cost |
| `process` | プロセス優先度「高」/ Process Priority High | ゲームプロセスのスケジューリング優先度を向上 / Elevates game process scheduling priority |
| `affinity` | CPUアフィニティ / CPU Affinity | ゲームプロセスを指定コアに固定 / Pins game process to specific cores |
| `irq_affinity` | IRQアフィニティ / IRQ Affinity | 割り込み処理コアを分離 / Isolates interrupt handling cores |
| `win32priority` | Win32PrioritySeparation | フォアグラウンドへのCPUタイム最大化 / Maximizes foreground CPU time |
| `registry` | GPUスケジューラ優先度 / GPU Scheduler Priority | MMCSS Tasks\Gamesのカテゴリ最大化 / Maximizes MMCSS Tasks\Games category |

---

## プリセット / Presets

| プリセット / Preset | 枚数 / Cards | 内容 / Contents |
|-------------------|-------------|-----------------|
| 🔰 初心者向け / Beginner | 環境依存 / Env-based | `risk: 'none'` かつコマンドありのカード / Cards with no risk and commands |
| 🛡️ 安定重視 / Stable | 19枚 | 競合解消・securityRisk除外 / Conflict-free, no security risk |
| 🤝 競合なし / No Conflict | 20枚 | 競合10ペア全回避・securityRisk除外 / Avoids all 10 conflict pairs |
| 🎯 FPS特化 / FPS Focused | 19枚 | 入力遅延・描画遅延に直結する設定 / Settings directly tied to input/render latency |
| 🔋 省電力ゲーミング / Eco Gaming | 8枚 | 発熱・消費電力を抑えつつ安定化 / Stable performance with reduced heat/power |
| ⚡ 全部盛り / All | 環境依存 / Env-based | 環境適合する全設定 / All available settings for the environment |

### ゲーム別推奨ハイライト / Per-Game Highlight

サイドバーのゲームツリーまたはStep4のゲーム選択から、ゲームごとの推奨カードをStep3でハイライト表示できます。  
Select a game from the sidebar game tree or Step 4 to highlight recommended cards in Step 3.

| ジャンル / Genre | 対応ゲーム / Supported Games |
|----------------|---------------------------|
| タクティカルFPS / Tactical FPS | VALORANT / Counter-Strike 2 / Rainbow Six Siege / Escape from Tarkov |
| バトルロイヤル / Battle Royale | Fortnite / Apex Legends / PUBG |
| その他 / Other | Overwatch 2 / Battlefield 2042 |

---

## 競合チェック / Conflict Detection

同時有効化すると効果が干渉・重複する組み合わせを自動検出（全10ペア）。競合発生時は左サイドバーに詳細を表示し、トップバーに赤バッジ（`⚠️ N件競合`）を表示します。  
Automatically detects 10 conflict pairs. Conflicts show detailed warnings in the sidebar and a red badge in the top bar.

| 組み合わせ / Pair | 理由 / Reason |
|-----------------|---------------|
| `nic_lso` + `coreparking` | CPU負荷増加で逆効果 / May be counterproductive due to CPU load increase |
| `affinity` + `interrupt_affinity` | 同一コアへの競合 / Same-core conflict |
| `affinity` + `irq_affinity` | ゲームコアと割り込みコアの重複 / Game core / interrupt core overlap |
| `hpet` + `timer` | システムタイマーへの二重干渉 / Double interference on system timer |
| `vbs` + `spectre` | セキュリティ機能の重複無効化 / Redundant security feature disabling |
| `coreparking` + `win32priority` | CPUスケジューリングへの干渉 / CPU scheduling interference |
| `mpo` + `hags` | DWM/Presentパスへの二重干渉 / Double interference on DWM/Present path |
| `mmcss_sr` + `network_throttle` | 同一レジストリキーへの二重書き込み / Duplicate write to same registry key |
| `network_throttle` + `registry` | NetworkThrottlingIndex重複設定 / Duplicate NetworkThrottlingIndex setting |
| `mmcss_sr` + `registry` | Tasks\Gamesへの重複設定 / Duplicate Tasks\Games setting |

---

## 共有コード仕様 / Share Code Specification

### v3形式（現行）/ v3 Format (Current)

```
LT3_[Base64url 7文字]  ← 常に11文字固定 / Always 11 characters
```

40bit（5バイト）のビットマスク方式。`SHARE_IDS` 配列で固定された30枚のID順序でビットを割り当て。環境情報（GPU/OS/ジャンル）もビットに含む。URLパラメータ `?lt=LT3_xxx` でそのまま共有可能。  
40-bit (5-byte) bitmask. Bit order fixed by `SHARE_IDS` array (30 cards). Environment info (GPU/OS/genre) also encoded. Shareable as `?lt=LT3_xxx` URL parameter.

```
bit 0    : 未使用（将来拡張用）/ Reserved
bit 1–30 : 各カードのチェック状態（SHARE_IDS順）/ Card check state (SHARE_IDS order)
bit 31–39: 環境情報（GPU/OS/ジャンル・NICバッファ等）/ Environment info
```

---

## NVIDIA Inspector プロファイル (.nip)

対応ゲーム9種 + カスタムで `.nip` ファイルを生成します。NVIDIA Profile Inspectorで直接インポートできます。  
Generates `.nip` files for 9 games + custom. Import directly with NVIDIA Profile Inspector.

| ゲーム / Game | EXE |
|--------------|-----|
| Fortnite | `FortniteClient-Win64-Shipping.exe` |
| VALORANT | `VALORANT-Win64-Shipping.exe` |
| Apex Legends | `r5apex.exe` |
| Overwatch 2 | `Overwatch.exe` |
| Counter-Strike 2 | `cs2.exe` |
| Rainbow Six Siege | `RainbowSix.exe` |
| PUBG: Battlegrounds | `TslGame.exe` |
| Escape from Tarkov | `EscapeFromTarkov.exe` |
| Battlefield 2042 | `BF2042.exe` |
| カスタム / Custom | 任意入力 / User-defined |

出力形式 / Output format: **UTF-16LE BOM付き XML / UTF-16LE BOM XML**（NVIDIA Inspector互換 / compatible）

---

## ファイル構成 / File Structure

```
lateregtool/
├── index.html    # ツール本体（1ファイル完結・外部サーバー不要）
│                 # Tool body (self-contained, no server required)
├── README.md     # このファイル / This file
└── CHANGELOG.md  # バージョン履歴 / Version history
```

- GitHub Pages対応（静的ホスティング）/ GitHub Pages compatible (static hosting)
- 外部依存 / External dependencies: Google Fonts / JSZip (CDN) / Google Analytics

---

## 技術仕様 / Technical Specifications

| 項目 / Item | 内容 / Details |
|------------|----------------|
| 構成 / Structure | 1ファイル完結HTML / Self-contained single HTML file |
| 状態管理 / State | `localStorage`（環境設定・チェック状態を永続化）/ Persists environment & check state |
| イベント / Events | `DOMContentLoaded` 内 `data-action` デリゲーション方式 / data-action delegation pattern |
| 出力 / Export | UAC自己昇格付き `.bat`（確認コマンド + pause）/ Self-elevating .bat with verify commands |
| バックアップ / Backup | Phase1バックアップ → Phase2逆操作の2段階 `.bat` / 2-phase backup + rollback .bat |
| NIP出力 / NIP export | UTF-16LE BOM付きXML（Blob API）/ UTF-16LE BOM XML via Blob API |
| エンコーディング / Encoding | .bat: chcp 65001 |
| 共有コード / Share code | v3: LT3_ + Base64 7文字（40bit ビットマスク・11文字固定）/ 40-bit bitmask, 11 chars |
| 多言語 / i18n | JP / EN / ZH — `switchLang()` で動的切替 / Dynamic switching via switchLang() |
| アクセシビリティ / A11y | ARIA landmark roles, `aria-live`, `aria-expanded`, `role="dialog"`, skip link, `:focus-visible` |

---

## 注意事項 / Notes

- **本ツールが生成するコマンドはすべて管理者権限が必要です**  
  All commands generated by this tool require administrator privileges.
- `risk: 'high'` の設定（VBS・Spectre無効化）はセキュリティへの影響を十分理解した上で実行してください  
  Settings marked `risk: 'high'` (VBS, Spectre disable) carry security implications — proceed only if you understand the risks.
- 企業環境・組織管理下のPCへの適用は禁止です  
  Do not apply to corporate or organization-managed PCs.
- 設定の効果は環境（CPU・GPU・NIC・ゲームタイトル）に依存します  
  Results vary by hardware (CPU, GPU, NIC) and game title.
- バックアップツールを先に生成・保管しておくことを強く推奨します  
  It is strongly recommended to generate and keep a backup before applying any settings.

---

## ライセンス / License

個人利用・非商用での利用は自由です。無断での商用転載・再配布はご遠慮ください。  
Free for personal and non-commercial use. Unauthorized commercial redistribution is not permitted.
