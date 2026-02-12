/**
 * ビンゴアイテム（ラベルとイラストのセット）のデータ
 * 
 * 使用方法:
 * 1. public/images/bingo/ ディレクトリに画像ファイルを配置
 * 2. 画像ファイル名を image プロパティに設定
 * 3. 例: 'beer.png' → image: '/images/bingo/beer.png'
 */

export interface BingoItem {
  label: string;
  image: string; // public/images/bingo/ からの相対パス
  description?: string; // 説明文（オプション）
}

/**
 * ビンゴアイテムのリスト
 * 画像は public/images/bingo/ ディレクトリに配置してください
 */
export const bingoItems: BingoItem[] = [
  { label: 'ビール', image: '/images/bingo/beer.png', description: 'ビールを飲んで達成！' },
  { label: '日本酒', image: '/images/bingo/sake.png', description: '日本酒を飲んで達成！' },
  { label: 'ワイン', image: '/images/bingo/wine.png', description: 'ワインを飲んで達成！' },
  { label: '焼酎', image: '/images/bingo/shochu.png', description: '焼酎を飲んで達成！' },
  { label: 'ウイスキー', image: '/images/bingo/whiskey.png', description: 'ウイスキーを飲んで達成！' },
  { label: 'カクテル', image: '/images/bingo/cocktail.png', description: 'カクテルを飲んで達成！' },
  { label: 'チューハイ', image: '/images/bingo/chu-hai.png', description: 'チューハイを飲んで達成！' },
  { label: 'サワー', image: '/images/bingo/sour.png', description: 'サワーを飲んで達成！' },
  { label: 'ハイボール', image: '/images/bingo/highball.png', description: 'ハイボールを飲んで達成！' },
  { label: '梅酒', image: '/images/bingo/umeshu.png', description: '梅酒を飲んで達成！' },
  { label: '紹興酒', image: '/images/bingo/shaoxing.png', description: '紹興酒を飲んで達成！' },
  { label: '泡盛', image: '/images/bingo/awamori.png', description: '泡盛を飲んで達成！' },
  { label: 'ジン', image: '/images/bingo/gin.png', description: 'ジンを飲んで達成！' },
  { label: 'ウォッカ', image: '/images/bingo/vodka.png', description: 'ウォッカを飲んで達成！' },
  { label: 'テキーラ', image: '/images/bingo/tequila.png', description: 'テキーラを飲んで達成！' },
  { label: 'ラム', image: '/images/bingo/rum.png', description: 'ラムを飲んで達成！' },
  { label: 'ブランデー', image: '/images/bingo/brandy.png', description: 'ブランデーを飲んで達成！' },
  { label: 'リキュール', image: '/images/bingo/liqueur.png', description: 'リキュールを飲んで達成！' },
  { label: 'シャンパン', image: '/images/bingo/champagne.png', description: 'シャンパンを飲んで達成！' },
  { label: 'スパークリング', image: '/images/bingo/sparkling.png', description: 'スパークリングを飲んで達成！' },
  { label: 'カシス', image: '/images/bingo/cassis.png', description: 'カシスを飲んで達成！' },
  { label: 'グレープフルーツ', image: '/images/bingo/grapefruit.png', description: 'グレープフルーツ系の飲み物を飲んで達成！' },
  { label: 'レモン', image: '/images/bingo/lemon.png', description: 'レモン系の飲み物を飲んで達成！' },
  { label: 'ライム', image: '/images/bingo/lime.png', description: 'ライム系の飲み物を飲んで達成！' },
  { label: 'オレンジ', image: '/images/bingo/orange.png', description: 'オレンジ系の飲み物を飲んで達成！' },
  { label: 'グレナデン', image: '/images/bingo/grenadine.png', description: 'グレナデンシロップを使った飲み物を飲んで達成！' },
  { label: 'ミント', image: '/images/bingo/mint.png', description: 'ミントを使った飲み物を飲んで達成！' },
  { label: 'ジンジャー', image: '/images/bingo/ginger.png', description: 'ジンジャーを使った飲み物を飲んで達成！' },
  { label: 'コーラ', image: '/images/bingo/cola.png', description: 'コーラを飲んで達成！' },
  { label: 'トニック', image: '/images/bingo/tonic.png', description: 'トニックウォーターを飲んで達成！' },
  { label: 'ソーダ', image: '/images/bingo/soda.png', description: 'ソーダを飲んで達成！' },
  { label: 'ジンジャーエール', image: '/images/bingo/ginger-ale.png', description: 'ジンジャーエールを飲んで達成！' },
  { label: 'グレープ', image: '/images/bingo/grape.png', description: 'グレープ系の飲み物を飲んで達成！' },
  { label: 'ピーチ', image: '/images/bingo/peach.png', description: 'ピーチ系の飲み物を飲んで達成！' },
  { label: 'メロン', image: '/images/bingo/melon.png', description: 'メロン系の飲み物を飲んで達成！' },
  { label: 'いちご', image: '/images/bingo/strawberry.png', description: 'いちご系の飲み物を飲んで達成！' },
  { label: 'ブルーハワイ', image: '/images/bingo/blue-hawaii.png', description: 'ブルーハワイを飲んで達成！' },
  { label: 'ミドリ', image: '/images/bingo/midori.png', description: 'ミドリを使った飲み物を飲んで達成！' },
  { label: '赤ワイン', image: '/images/bingo/red-wine.png', description: '赤ワインを飲んで達成！' },
  { label: '白ワイン', image: '/images/bingo/white-wine.png', description: '白ワインを飲んで達成！' },
  { label: 'ロゼ', image: '/images/bingo/rose.png', description: 'ロゼワインを飲んで達成！' },
  { label: 'シャルドネ', image: '/images/bingo/chardonnay.png', description: 'シャルドネを飲んで達成！' },
  { label: 'カベルネ', image: '/images/bingo/cabernet.png', description: 'カベルネを飲んで達成！' },
  { label: 'ピノノワール', image: '/images/bingo/pinot-noir.png', description: 'ピノノワールを飲んで達成！' },
  { label: 'マルティーニ', image: '/images/bingo/martini.png', description: 'マルティーニを飲んで達成！' },
  { label: 'モヒート', image: '/images/bingo/mojito.png', description: 'モヒートを飲んで達成！' },
  { label: 'マルガリータ', image: '/images/bingo/margarita.png', description: 'マルガリータを飲んで達成！' },
  { label: 'ダイキリ', image: '/images/bingo/daiquiri.png', description: 'ダイキリを飲んで達成！' },
  { label: 'ピニャコラーダ', image: '/images/bingo/pina-colada.png', description: 'ピニャコラーダを飲んで達成！' },
];

/**
 * 画像が存在しない場合のフォールバック画像
 */
export const FALLBACK_IMAGE = '/images/bingo/placeholder.png';
