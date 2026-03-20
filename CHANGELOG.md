# CHANGELOG

PCゲーム遅延最適化ツール — バージョン履歴

---

## [v22.0] - 2026-03

### 追加

- **DPC/ISR レイテンシ軽減カード追加** (`dpc_latency`)  
  NDISコールバック数を64に制限・DpcWatchdogProfileOffsetを0に設定。OSカテゴリのimpact:high位置（spectre直後）に追加。

- **NVMe I/O レイテンシ軽減カード追加** (`nvme_queue`)  
  StorNVMeのキュー深度を254→32に絞りI/O滞留を削減。OSカテゴリのimpact:medium位置（tcp_autotuning直後）に追加。NVMe SSD搭載環境向け。

- **🎯 FPS特化プリセット追加** (`fps`)  
  固定18カード構成（競合解消・securityRisk除外）。reflex/ull/mpo/mmcss_sr/power/nagle/dpc_latency/hpet/rss/nic_buffer/usb_suspend/gamedvr/nvme_queue/msi_mode/win32priority/interrupt_affinity/process/shader_cache。

- **🔋 省電力ゲーミングプリセット追加** (`eco`)  
  固定8カード構成。nagle/gamedvr/dpc_latency/rss/nvme_queue/mmcss_sr/timer/shader_cache。ノートPC・小型PC向け。

### 変更

- **🛡️ 安全重視プリセット → 安定重視にリネーム・条件強化**  
  条件を `risk !== 'high' && !securityRisk` に変更し securityRisk カード（vbs・spectre）を除外。競合ペア内で両方含まれる場合はimpact高い方のみに絞り込む固定IDリスト（18カード）に変更。tcp_autotuning を除外。

- **🔒 セキュリティ優先プリセット削除**  
  安定重視との差異が薄いため廃止。

- **🤝 競合なしプリセットを固定IDリスト化**  
  自動選択ロジックから固定20カードのリストに変更。securityRisk（vbs・spectre）を除外。

- **カード並び順をimpact順に修正（OS）**  
  `dpc_latency`（impact:high）をspectre直後へ、`nvme_queue`（impact:medium）をtcp_autotuning直後へ移動。

- **`affinity` / `process` カードをRead-Host方式に変更**  
  ps1生成時にゲーム名プレースホルダー（`game_name`）が残っていた問題を修正。関数実行時に `Read-Host` でゲームの実行ファイル名を入力する方式に変更。

### バグ修正

- **ps1ヘッダーの `vv22.0` タイポ修正**  
  `APP_VERSION = 'v22.0'` に対しテンプレート側にも `v` が重複していた問題を修正。

- **`dpc_latency` / `nvme_queue` のレジストリパス破損修正**  
  テンプレートリテラル内のバックスラッシュがJSエスケープで消失し `HKLM:SYSTEMCurrentControlSet...` のような不正パスが生成されていた問題を修正。

---

## [v21.1] - 2026-03 ※コードレビュー修正版

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

## [v21] - 2026-03

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
