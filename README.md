# PCゲーム遅延最適化ツール

> **Windows PC向けの入力遅延・フレームタイム最適化設定ガイドツール**  
> GPU / OS / ジャンルを選ぶだけで、あなたの環境に最適な設定を絞り込みます。

🔗 **ツールURL**: https://ytty-pc.github.io/lateregtool/  
📝 **解説記事**: https://note.com/noted_pothos7691/n/n3016e5312a4f

---

## 概要

ゲームの遅延（ラグ）を引き起こす原因は多岐にわたります。GPU設定・OS電源管理・ネットワークスタック・CPUスケジューリングなど、各レイヤーに散在する最適化設定を1つのツールにまとめました。

- **環境フィルタリング**: NVIDIA / AMD × Win11 / Win10 × FPS / MMO の組み合わせで不要な設定を自動除外
- **診断機能**: Waveform連携によるBufferbloat判定・NICバッファ推奨・キーリピート計測
- **安全な出力**: UAC自己昇格付き `.bat` で確認コマンド付き一括適用
- **ロールバック**: 適用前バックアップ → レジストリ復元まで一括対応
- **共有**: v3コード（11文字固定）でチェック状態・環境設定をURL共有
- **Discord風UI**: 左サイドバー（ステップナビ・プリセット・競合警告・共有コード表示）+ トップバー（競合バッジ・.bat生成）

---

## 使い方（4ステップ）

```
Step 1  環境選択
        GPU（NVIDIA / AMD）・OS（Win11 / Win10）・ジャンル（FPS / MMO）を選択

Step 2  診断
        ① Waveform.netでBufferbloat測定 → グレードを入力
        ② NICバッファ推奨値をスライダーで確認
        ③ キーリピート計測でキーボード設定の最適化を判定

Step 3  設定一覧
        30枚のカードから適用したい設定をチェック
        プリセット6種（初心者 / 安定重視 / 競合なし / FPS特化 / 省電力ゲーミング / 全部盛り）も利用可能
        → サイドバーから .bat をダウンロード

Step 4  NVIDIA Inspector プロファイル生成（NVIDIA環境のみ）
        対応ゲーム4種 + カスタム対応の .nip ファイルを出力
```

### .bat の実行方法

1. ダウンロードした **`.bat` ファイル** を右クリック → **「管理者として実行」**
2. 完了後 PCを再起動

---

## 設定カード一覧（30枚）

### 📐 GPU（7枚）

| ID | 設定名 | 概要 |
|----|--------|------|
| `reflex` | NVIDIA Reflex / AMD Anti-Lag | GPU側の入力遅延を直接削減 |
| `ull` | Ultra Low Latency Mode | Reflex非対応ゲーム向けキューイング制限 |
| `shader_cache` | NVIDIAシェーダーキャッシュ無制限化 | レジストリで4GBキャップを解除 |
| `hypr_rx` | AMD HYPR-RX / AFMF 2 | Anti-Lag 2 + Frame Generation 統合 |
| `mpo` | MPO無効化 | DWMスタッタリングの主要因を排除 |
| `mmcss_sr` | MMCSS SystemResponsiveness | ゲームスレッドへのCPUタイム最大化 |
| `hags` | HAGS | GPUスケジューリングをOS→GPU委譲 |

### ⚙️ OS（15枚）

| ID | 設定名 | 概要 |
|----|--------|------|
| `power` | 高パフォーマンス電源プラン | CPUクロック変動によるフレームタイムばらつきを抑制 |
| `nagle` | Nagleアルゴリズム無効化 | TCPパケットのバッファリング遅延を排除 |
| `vbs` | VBS/HVCI無効化 ⚠️ | 仮想化セキュリティ層のオーバーヘッド削減（Win11のみ） |
| `spectre` | Spectre/Meltdownパッチ無効化 ⚠️ | セキュリティパッチのCPUオーバーヘッド削減 |
| `timer` | タイマー解像度設定 | カーネルタイマーをHPET/TSC最適化（Win10のみ） |
| `network_throttle` | NetworkThrottlingIndex無効化 | ゲーム中の帯域制限（デフォルト10Mbps）を解除 |
| `nic_lso` | NIC LSO・FlowControl・EEE無効化 | ネットワークスタックのバッファリングを削減 |
| `nic_buffer` | NICバッファ調整 | Bufferbloat診断に基づく送受信バッファ最適化 |
| `usb_suspend` | USBセレクティブサスペンド無効化 | 入力デバイスのウェイクアップ遅延を排除 |
| `rss` | RSS（Receive Side Scaling）設定 | NIC割り込みを特定コアに集中させCPU効率を向上 |
| `tcp_autotuning` | TCP自動チューニング制限 | 受信ウィンドウサイズの動的拡張を制限 |
| `hpet` | HPET無効化 | システムタイマーをTSCベースに統一 |
| `dpc_latency` | DPC/ISR レイテンシ軽減 | NDISコールバック制限・DPCウォッチドッグ調整でレイテンシスパイクを抑制 |
| `nvme_queue` | NVMe I/O レイテンシ軽減 | NVMeキュー深度を32に絞りI/O滞留を削減（NVMe SSD環境向け） |
| `gamedvr` | Game DVR無効化 | バックグラウンド録画によるGPU・CPU負荷を排除 |

### 🔲 CPU（8枚）

| ID | 設定名 | 概要 |
|----|--------|------|
| `msi_mode` | MSIモード有効化 | GPUのLine-Based割り込み→MSI割り込みへ変換 |
| `interrupt_affinity` | NVIDIA割り込みアフィニティ | GPU割り込みを専用コアに固定 |
| `coreparking` | コアパーキング無効化 | Cステートへの移行を防ぎレイテンシスパイクを排除 |
| `process` | プロセス優先度「高」 | ゲームプロセスのCPUスケジューリング優先度を上昇 |
| `affinity` | CPUアフィニティ設定 | ゲームプロセスを指定コアに固定 |
| `irq_affinity` | IRQアフィニティ設定 | 割り込み処理コアを分離しゲームコアへの干渉を抑制 |
| `win32priority` | Win32PrioritySeparation | フォアグラウンドプロセスへのCPUタイム増加 |
| `registry` | GPUスケジューラ優先度 | MMCSS Tasks\Gamesのスケジューリングカテゴリ最大化 |

---

## プリセット

| プリセット | 内容 |
|-----------|------|
| 🔰 初心者向け | `risk: 'none'` かつコマンドありのカード |
| 🛡️ 安定重視 | 固定18カード（`risk !== 'high'` + securityRisk除外 + 競合解消）|
| 🤝 競合なし | 固定20カード（競合9ペア全回避・securityRisk除外）|
| 🎯 FPS特化 | 固定18カード（入力遅延・描画遅延に直結する設定に特化）|
| 🔋 省電力ゲーミング | 固定8カード（発熱・消費電力を抑えつつ安定フレームタイム）|
| ⚡ 全部盛り | 環境適合する全設定（`available: true` のもの全て）|

---

## 競合チェック

同時有効化すると効果が干渉・重複する組み合わせを自動検出。競合発生時は左サイドバーに詳細を表示し、トップバーに赤バッジ（`⚠️ N件競合`）を表示します。競合なしプリセットを使うと全ペアを回避した状態で開始できます。

| 組み合わせ | 理由 |
|-----------|------|
| `nic_lso` + `coreparking` | CPU負荷増加で逆効果になるケースあり |
| `affinity` + `interrupt_affinity` | 同一コアへの競合 |
| `affinity` + `irq_affinity` | ゲームコアと割り込みコアの重複 |
| `hpet` + `timer` | システムタイマーへの二重干渉 |
| `vbs` + `spectre` | セキュリティ機能の重複無効化（高リスク警告） |
| `coreparking` + `win32priority` | CPUスケジューリングへの干渉 |
| `mpo` + `hags` | DWM/Presentパスへの二重干渉 |
| `mmcss_sr` + `network_throttle` | 同一レジストリキーへの二重書き込み |
| `mmcss_sr` + `registry` | Tasks\Gamesへの重複設定 |

---

## 共有コード仕様

### v3形式（現行）

```
LT3_[Base64url 7文字]  ← 常に11文字固定
```

40bit（5バイト）のビットマスク方式。`SHARE_IDS` 配列で固定された30枚のID順序でビットを割り当て。環境情報（GPU/OS/ジャンル）もビットに含む。URLパラメータ `?lt=LT3_xxx` でそのまま共有可能。

```
bit 0    : 未使用（将来拡張用）
bit 1–30 : 各カードのチェック状態（SHARE_IDS順）
bit 31–39: 環境情報（GPU/OS/ジャンル・NICバッファ等）
```

---

## NVIDIA Inspector プロファイル (.nip)

対応ゲーム4種 + カスタムで `.nip` ファイルを生成します。NVIDIA Profile Inspectorで直接インポートできます。

| ゲーム | EXE |
|--------|-----|
| Fortnite | `FortniteClient-Win64-Shipping.exe` |
| VALORANT | `VALORANT-Win64-Shipping.exe` |
| Apex Legends | `r5apex.exe` |
| Overwatch 2 | `Overwatch.exe` |
| カスタム | 任意入力 |

出力形式: **UTF-16LE BOM付き XML**（NVIDIA Inspector互換）

---

## ファイル構成

```
lateregtool/
├── index.html   # ツール本体（1ファイル完結・外部サーバー不要）
├── README.md    # このファイル
└── CHANGELOG.md # バージョン履歴
```

- GitHub Pages対応（静的ホスティング）
- 外部依存: Google Fonts / JSZip（CDN）/ Google Analytics

---

## 技術仕様

| 項目 | 内容 |
|------|------|
| 構成 | 1ファイル完結HTML |
| 状態管理 | `localStorage`（環境設定・チェック状態を永続化） |
| イベント | `DOMContentLoaded` 内 `data-action` デリゲーション方式 |
| 出力 | UAC自己昇格付き `.bat`（確認コマンド + pause） |
| ロールバック | Phase1バックアップ → Phase2逆操作の2段階 `.bat` |
| NIP出力 | UTF-16LE BOM付きXML（Blob API） |
| エンコーディング | .bat: chcp 65001（日本語文字化け防止） |
| 共有コード | v3: LT3_ + Base64 7文字（40bit ビットマスク・11文字固定） |

---

## 注意事項

- **本ツールが生成するコマンドはすべて管理者権限が必要です**
- `risk: 'high'` の設定（VBS・Spectre無効化）はセキュリティへの影響を十分理解した上で実行してください
- 企業環境・組織管理下のPCへの適用は禁止です
- 設定の効果は環境（CPU・GPU・NIC・ゲームタイトル）に依存します
- ロールバックツールを先に生成・保管しておくことを強く推奨します

---

## ライセンス

個人利用・非商用での利用は自由です。無断での商用転載・再配布はご遠慮ください。
