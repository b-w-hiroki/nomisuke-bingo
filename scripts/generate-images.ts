/**
 * ビンゴアイテム用の画像を生成するスクリプト（DALL-E 3使用）
 * 
 * 使用方法:
 * 1. .env.local に OPENAI_API_KEY=your_api_key を設定
 * 2. npm run generate-images を実行
 * 
 * APIキーの取得: https://platform.openai.com/api-keys
 */

import { bingoItems } from '../src/data/bingoItems';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// .env.localファイルを読み込む
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 環境変数からAPIキーを取得
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ エラー: OPENAI_API_KEY が設定されていません');
  console.error('   .env.local ファイルに OPENAI_API_KEY=your_api_key を追加してください');
  console.error('   APIキーは https://platform.openai.com/api-keys から取得できます');
  process.exit(1);
}

// 画像保存先ディレクトリ
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'bingo');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * プロンプトを生成する関数
 */
function generatePrompt(item: { label: string; description?: string }): string {
  const basePrompt = `A cute, kawaii-style illustration of ${item.label}`;
  const stylePrompt = `in a simple, colorful, friendly illustration style, white background, square format, suitable for a drinking game bingo card`;
  
  return `${basePrompt}, ${stylePrompt}`;
}

/**
 * DALL-E 3 APIを使って画像を生成する関数
 */
async function generateImage(prompt: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        try {
          errorMessage = await response.text();
        } catch {
          // エラーメッセージが取得できない場合
        }
      }
      console.error(`   ⚠️  API エラー (${response.status}):`, errorMessage);
      return false;
    }

    const data = await response.json();
    
    // レスポンスから画像URLを取得
    if (data.data && data.data[0] && data.data[0].url) {
      const imageUrl = data.data[0].url;
      
      // 画像をダウンロードして保存
      const downloadResponse = await fetch(imageUrl);
      if (!downloadResponse.ok) {
        console.error(`   ⚠️  画像ダウンロードエラー`);
        return false;
      }
      
      const arrayBuffer = await downloadResponse.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const filePath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filePath, imageBuffer);
      
      // リビジョンプロンプトが返ってきた場合は表示（オプション）
      if (data.data[0].revised_prompt) {
        console.log(`   💡 リビジョンプロンプト: ${data.data[0].revised_prompt.substring(0, 60)}...`);
      }
      
      return true;
    }
    
    console.error('   ⚠️  レスポンスに画像URLが含まれていません');
    return false;
  } catch (error) {
    console.error(`   ⚠️  画像生成エラー:`, error instanceof Error ? error.message : String(error));
    return false;
  }
}


/**
 * 画像をダウンロードして保存する関数（URLから）
 */
async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return true;
  } catch (error) {
    console.error(`❌ ダウンロードエラー (${filename}):`, error);
    return false;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🎨 ビンゴ画像生成を開始します...\n');
  console.log(`📁 出力先: ${OUTPUT_DIR}\n`);

  let successCount = 0;
  let failCount = 0;
  const failedItems: string[] = [];

  for (let i = 0; i < bingoItems.length; i++) {
    const item = bingoItems[i];
    const filename = path.basename(item.image);
    const prompt = generatePrompt(item);
    
    console.log(`[${i + 1}/${bingoItems.length}] ${item.label} を生成中...`);
    console.log(`   プロンプト: ${prompt.substring(0, 80)}...`);

    // 既にファイルが存在する場合はスキップ
    const filePath = path.join(OUTPUT_DIR, filename);
    if (fs.existsSync(filePath)) {
      console.log(`   ⏭️  既に存在するためスキップ: ${filename}\n`);
      successCount++;
      continue;
    }

    // 画像生成（最大2回リトライ）
    let success = false;
    for (let retry = 0; retry < 2; retry++) {
      if (retry > 0) {
        console.log(`   🔄 リトライ ${retry + 1}/2...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
      }
      
      success = await generateImage(prompt, filename);
      if (success) {
        break;
      }
    }

    if (success) {
      console.log(`   ✅ 成功: ${filename}\n`);
      successCount++;
    } else {
      console.log(`   ❌ 失敗: ${filename}\n`);
      failCount++;
      failedItems.push(item.label);
    }

    // APIレート制限を避けるため、リクエスト間に待機
    if (i < bingoItems.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
    }
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(50));
  console.log('📊 生成結果サマリー');
  console.log('='.repeat(50));
  console.log(`✅ 成功: ${successCount}件`);
  console.log(`❌ 失敗: ${failCount}件`);
  
  if (failedItems.length > 0) {
    console.log('\n失敗したアイテム:');
    failedItems.forEach(item => console.log(`  - ${item}`));
  }
  
  console.log('\n💡 ヒント:');
  console.log('   - 失敗したアイテムは手動で再実行できます');
  console.log('   - OpenAI APIキーが正しく設定されているか確認してください');
  console.log('   - APIキーは https://platform.openai.com/api-keys から取得できます');
  console.log('   - クレジット残高を確認してください: https://platform.openai.com/usage');
}

// スクリプト実行
main().catch(error => {
  console.error('❌ 予期しないエラー:', error);
  process.exit(1);
});
