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
- **安全な出力**: PowerShell (.ps1) + ランチャー (.bat) のZIPでまとめてダウンロード
- **ロールバック**: 適用前バックアップ → レジストリ復元まで一括対応
- **共有**: Base64 JSONコードでチェック状態・環境設定をURL共有

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
        28枚のカードから適用したい設定をチェック
        プリセット4種（初心者 / 安全重視 / セキュリティ優先 / 全部盛り）も利用可能
        → サイドバーから .zip をダウンロード

Step 4  NVIDIA Inspector プロファイル生成（NVIDIA環境のみ）
        対応ゲーム4種 + カスタム対応の .nip ファイルを出力
```

### .zip の実行方法

1. ZIPを右クリック → **「すべて展開」**
2. 展開されたフォルダ内の **`.bat` ファイル** を右クリック → **「管理者として実行」**
3. メニューから「一括適用」または「個別確認」を選択
4. 完了後 PCを再起動

---

## 設定カード一覧（28枚）

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

### ⚙️ OS（13枚）

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

| プリセット | 対象 | 除外条件 |
|-----------|------|---------|
| 🔰 初心者向け | リスクなし（`risk: 'none'`）かつコマンドあり | 手動操作のみの設定を含まない |
| 🛡️ 安全重視 | リスクが高くない設定（`risk !== 'high'`） | MSIモードを除外 |
| 🔒 セキュリティ優先 | `securityRisk: true` を除いた全設定 | VBS・Spectre無効化を除外 |
| ⚡ 全部盛り | 環境適合する全設定 | 対象外（`available: false`）のみ除外 |

---

## 競合チェック

同時有効化すると効果が干渉・重複する組み合わせを自動検出してサイドバーに警告を表示します。

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

### v2形式（現行）

```
LT2_[Base64url-encoded JSON]
```

```json
{
  "g": "nvidia",       // GPU: "nvidia" | "amd"
  "o": "win11",        // OS: "win11" | "win10"
  "genre": "fps",      // ジャンル: "fps" | "mmo"
  "rx": 256,           // 受信バッファ (64〜1024, 64刻み)
  "tx": 256,           // 送信バッファ (64〜1024, 64刻み)
  "c": ["reflex","power","nagle"]  // チェック済みカードID配列
}
```

### v1形式（後方互換のみ）

```
LT[Base64url 4文字]
```

24bitパック形式。12設定のみ対応。デコードのみサポート（エンコードはv2のみ）。

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
| テーマ | CSS変数 + `prefers-color-scheme` ダークモード対応 |
| 出力 | .ps1 + .bat → JSZip でZIPダウンロード |
| NIP出力 | UTF-16LE BOM付きXML（Blob API） |
| エンコーディング | .ps1: UTF-8 BOM付き / .bat: chcp 65001 |

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
