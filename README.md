# 呑み助ビンゴ

お酒を楽しむビンゴゲームアプリケーション

## 開発環境のセットアップ

### 必要な環境

- Node.js 18以上（推奨: 20以上）
- npm または yarn

### インストール手順

1. 依存関係のインストール
```bash
npm install
```

2. 開発サーバーの起動
```bash
npm run dev
```

3. ブラウザでアクセス
```
http://localhost:3000
```

## 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルドを作成
- `npm run start` - 本番サーバーを起動（ビルド後）
- `npm run lint` - ESLintでコードをチェック

## プロジェクト構成

```
nomisuke-bingo/
├── src/
│   ├── app/
│   │   ├── page.tsx          # トップページ（設定画面）
│   │   ├── room/
│   │   │   └── page.tsx      # ビンゴゲーム画面
│   │   ├── layout.tsx        # ルートレイアウト
│   │   └── globals.css       # グローバルスタイル
│   └── data/
│       └── bingoItems.ts     # ビンゴアイテム（ラベルと画像）のデータ定義
├── public/
│   └── images/
│       └── bingo/            # ビンゴアイテムのイラスト画像
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 技術スタック

- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **パッケージマネージャー**: npm

## 機能

- カスタマイズ可能なビンゴカードサイズ（3×3 〜 7×7）
- フリーマスの設定（0〜5個）
- ビンゴ達成数の自動カウント
- レスポンシブデザイン
- **イラストとラベルのセット表示**（各マスに画像とテキストを表示）

## イラスト画像の追加方法

各ビンゴマスに表示するイラスト画像を追加するには：

1. **画像ファイルを配置**
   ```
   public/images/bingo/
   ```
   ディレクトリに画像ファイルを配置してください。

2. **画像ファイル名の設定**
   `src/data/bingoItems.ts` で定義されているパスに合わせてファイル名を設定してください。
   
   例:
   - `beer.png` → ビールの画像
   - `sake.png` → 日本酒の画像
   - `wine.png` → ワインの画像

3. **推奨画像仕様**
   - **形式**: PNG, JPG, WebP
   - **サイズ**: 400x400px 以上（正方形推奨）
   - **背景**: 透明背景（PNG）または白背景
   - **ファイルサイズ**: 100KB以下を推奨

4. **新しいアイテムの追加**
   `src/data/bingoItems.ts` の `bingoItems` 配列に新しいエントリを追加：
   ```typescript
   { label: '新しいアイテム', image: '/images/bingo/new-item.png' }
   ```

5. **フォールバック画像**
   画像が読み込めない場合は、`placeholder.png` が使用されます。
   このファイルも `public/images/bingo/` に配置してください。

## 環境変数（オプション）

以下の環境変数を設定することで、デフォルト値を変更できます：

- `NEXT_PUBLIC_DEFAULT_SIZE` - デフォルトのマス数（3〜7）
- `NEXT_PUBLIC_DEFAULT_FREE_COUNT` - デフォルトのフリーマス数（0〜5）

`.env.local`ファイルを作成して設定してください：

```
NEXT_PUBLIC_DEFAULT_SIZE=5
NEXT_PUBLIC_DEFAULT_FREE_COUNT=1
```
