# 画像生成スクリプト（DALL-E 3使用）

ビンゴアイテム用の画像を自動生成するスクリプトです。OpenAIのDALL-E 3を使用します。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. APIキーの設定

`.env.local` ファイルを作成し、OpenAI APIキーを設定してください：

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

APIキーは [OpenAI Platform](https://platform.openai.com/api-keys) から取得できます。

**APIキーの取得方法：**
1. [OpenAI Platform](https://platform.openai.com/) にログイン
2. 「API keys」セクションに移動
3. 「Create new secret key」をクリック
4. キーをコピーして `.env.local` に貼り付け

### 3. スクリプトの実行

```bash
npm run generate-images
```

## 動作について

- `src/data/bingoItems.ts` に定義されている全アイテムの画像を生成します
- 既に存在する画像はスキップされます
- 生成された画像は `public/images/bingo/` に保存されます
- 失敗した場合は最大3回までリトライします

## APIについて

このスクリプトは **OpenAI DALL-E 3 API** を使用します。

- **モデル**: `dall-e-3`
- **画像サイズ**: 1024x1024（正方形）
- **品質**: standard（HD品質に変更可能）
- **コスト**: 約$0.04/画像（standard品質の場合）

**料金について：**
- Standard品質（1024×1024）: $0.04/画像
- HD品質（1024×1024）: $0.08/画像
- 50画像生成の場合: 約$2-4（約300-600円）

詳細は [OpenAI Pricing](https://openai.com/api/pricing/) を確認してください。

## トラブルシューティング

### APIキーが認識されない

- `.env.local` ファイルがプロジェクトルートに存在するか確認
- 環境変数名が `OPENAI_API_KEY` であることを確認
- ファイルに余分なスペースや引用符がないか確認

### 画像生成が失敗する

- OpenAI APIキーが有効か確認
- クレジット残高を確認: https://platform.openai.com/usage
- ネットワーク接続を確認
- レート制限に達していないか確認

### 特定のアイテムだけ再生成したい

スクリプトを編集して、`bingoItems` 配列をフィルタリングしてください。
