# 呑み助ビンゴ

居酒屋や飲み会をもっと楽しくする、**静的サイト（HTML/CSS/JS）** のビンゴゲームです。  
お散歩ビンゴと同じ「クローン方式」で運用できるよう、実装方式を静的に統一しています。

## 公開URL（GitHub Pages）

`https://b-w-hiroki.github.io/nomisuke-bingo/`

## 使い方（ローカル）

- **そのまま開く**: `index.html` をダブルクリック
- **ローカルサーバー推奨**（PWA/Service Worker検証向け）:

```bash
npx --yes serve -l 3000
```

## 主なファイル構成（静的版）

```
nomisuke-bingo/
├── index.html
├── game.html
├── landing.css
├── styles.css
├── topics.js
├── app.js
├── manifest.json
└── service-worker.js
```

## 方針（重要）

- **Next.js 等のフレームワークは使いません**（複数方式の混在を避けるため）
- 追加の改善は、お散歩ビンゴと同じ粒度で横展開できる前提で行います

## ノンアル参加
作成・参加時に「ノンアル・発見と会話」を選べます。注文や飲酒は達成条件ではありません。会話・写真は相手の同意の範囲で楽しんでください。既存の難易度と保存データは維持します。

## 継続的な回帰確認

`node --test tests/*.cjs`（ノンアルのお題・PWA キャッシュ契約）を PR と `main` への push で実行します。回帰 workflow は手動でも実行できます。Pages の配信成功とは別に、対象コミットの回帰結果を確認してください。実端末・実利用者の評価や外部サービスの本番状態は、この自動テストの保証範囲に含みません。
