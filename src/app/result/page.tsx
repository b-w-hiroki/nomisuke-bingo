"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const html2canvas = typeof window !== 'undefined' ? require('html2canvas') : null;

interface Tile {
  label: string;
  image?: string;
  description?: string;
  isFree?: boolean;
}

interface ResultData {
  size: number;
  tiles: Tile[];
  checked: boolean[][];
  uploadedImages: { [key: string]: string };
  achievementCount: number;
  bingoCount: number;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const screenshotRef = useRef<HTMLDivElement>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [snsConsent, setSnsConsent] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    // URLパラメータまたはlocalStorageから結果データを取得
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const data = JSON.parse(decoded);
        setResultData(data);
      } catch (e) {
        console.error('Failed to parse result data:', e);
        router.push('/');
      }
    } else {
      // localStorageから取得を試みる
      const savedData = localStorage.getItem('bingo_result');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setResultData(data);
        } catch (e) {
          console.error('Failed to parse saved result data:', e);
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }
  }, [searchParams, router]);

  const captureScreenshot = async () => {
    if (!screenshotRef.current || !resultData || !html2canvas) return;

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(screenshotRef.current, {
        backgroundColor: '#fef3c7',
        scale: 2,
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      setScreenshotUrl(url);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('スクリーンショットの撮影に失敗しました');
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadScreenshot = () => {
    if (!screenshotUrl) return;

    const link = document.createElement('a');
    link.download = `nomisuke-bingo-${Date.now()}.png`;
    link.href = screenshotUrl;
    link.click();
  };

  const generateSnsText = (): string => {
    if (!resultData) return '';
    
    const hashtags = [
      '#呑み助ビンゴ',
      '#ビンゴ',
      '#お酒',
      '#飲み会',
      '#ノミカイ',
    ];
    
    const messages = [
      `呑み助ビンゴで${resultData.bingoCount}回ビンゴ達成！🍺`,
      `達成数: ${resultData.achievementCount}/${resultData.size * resultData.size}マス`,
      `楽しい飲み会になりました！🎉`,
    ];
    
    return `${messages.join('\n')}\n\n${hashtags.join(' ')}`;
  };

  const shareToSns = (platform: string) => {
    if (!snsConsent) {
      alert('SNS投稿の許諾にチェックを入れてください');
      return;
    }
    if (platform !== 'copy' && !screenshotUrl) {
      alert('スクリーンショットを撮影してから共有してください');
      return;
    }

    const text = generateSnsText();
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(window.location.href)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
          '_blank'
        );
        break;
      case 'line':
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`,
          '_blank'
        );
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text}\n${window.location.href}`).then(() => {
          alert('テキストをクリップボードにコピーしました');
        });
        break;
    }
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  const { size, tiles, checked, uploadedImages, achievementCount, bingoCount } = resultData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            ビンゴ結果
          </h1>
        </div>

        {/* スクリーンショット用のコンテナ */}
        <div ref={screenshotRef} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          {/* 結果サマリー */}
          <div className="text-center mb-6">
            <div className="flex justify-center gap-6 mb-4">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl px-6 py-4 border-2 border-orange-400">
                <div className="text-sm text-gray-600 font-medium mb-1">達成数</div>
                <div className="text-3xl font-bold text-orange-600">{achievementCount}</div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl px-6 py-4 border-2 border-yellow-300">
                <div className="text-sm text-white/90 font-medium mb-1">ビンゴ数</div>
                <div className="text-3xl font-bold text-white">{bingoCount}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">呑み助ビンゴ</div>
            <div className="text-sm text-gray-600">お酒を楽しむビンゴゲーム</div>
          </div>

          {/* ビンゴグリッド */}
          <div
            className="grid gap-2 sm:gap-3 mb-4"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
            }}
          >
            {tiles.map((tile, index) => {
              const row = Math.floor(index / size);
              const col = index % size;
              const isChecked = checked[row]?.[col] || false;
              const isFree = tile.isFree || false;

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-xl
                    flex flex-col items-center justify-center
                    relative transition-all duration-300
                    ${isFree 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-green-300' 
                      : 'bg-white border-2 border-gray-300'
                    }
                    ${isChecked && !isFree ? 'bg-gray-100 border-orange-400' : ''}
                  `}
                >
                  {/* 画像表示 */}
                  {tile.image && !isFree && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={tile.image}
                        alt={tile.label}
                        fill
                        className="object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, 200px"
                        unoptimized={tile.image.startsWith('/images/')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
                    </div>
                  )}
                  
                  {/* テキスト表示 */}
                  <div className={`relative z-10 w-full h-full text-center p-2 flex flex-col items-center justify-end ${
                    tile.image && !isFree ? 'pb-2' : 'justify-center'
                  }`}>
                    <div className={`line-clamp-2 font-semibold text-xs sm:text-sm ${
                      isFree 
                        ? 'text-white drop-shadow-md' 
                        : tile.image 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-gray-800'
                    }`}>
                      {tile.label}
                    </div>
                  </div>

                  {/* 達成オーバーレイ */}
                  {isChecked && !isFree && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-emerald-600/90 rounded-xl flex items-center justify-center z-20">
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl mb-1">✓</div>
                        <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">達成</span>
                      </div>
                    </div>
                  )}

                  {/* アップロードされた写真 */}
                  {isChecked && !isFree && uploadedImages[`${row}-${col}`] && (
                    <div className="absolute inset-0 z-10 rounded-xl overflow-hidden">
                      <Image
                        src={uploadedImages[`${row}-${col}`]}
                        alt={`${tile.label}の達成写真`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* フッター */}
          <div className="text-center text-xs text-gray-500 mt-4">
            nomisuke-bingo.app
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {/* スクリーンショット撮影 */}
          <div className="space-y-3">
            <button
              onClick={captureScreenshot}
              disabled={isCapturing}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xl">📷</span>
              <span>{isCapturing ? '撮影中...' : 'スクリーンショットを撮影'}</span>
            </button>

            {screenshotUrl && (
              <div className="space-y-2">
                <button
                  onClick={downloadScreenshot}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span className="text-xl">💾</span>
                  <span>画像をダウンロード</span>
                </button>
              </div>
            )}
          </div>

          {/* SNS投稿 */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="sns-consent"
                checked={snsConsent}
                onChange={(e) => setSnsConsent(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="sns-consent" className="text-sm text-gray-700 cursor-pointer">
                スクリーンショットをSNSに投稿することを許可します
              </label>
            </div>

            {snsConsent && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareToSns('twitter')}
                  className="px-4 py-3 bg-[#1DA1F2] text-white rounded-xl font-semibold hover:bg-[#1a8cd8] transition-all flex items-center justify-center gap-2"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => shareToSns('facebook')}
                  className="px-4 py-3 bg-[#1877F2] text-white rounded-xl font-semibold hover:bg-[#166fe5] transition-all flex items-center justify-center gap-2"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => shareToSns('line')}
                  className="px-4 py-3 bg-[#06C755] text-white rounded-xl font-semibold hover:bg-[#05b84a] transition-all flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>LINE</span>
                </button>
                <button
                  onClick={() => shareToSns('copy')}
                  className="px-4 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>📋</span>
                  <span>コピー</span>
                </button>
              </div>
            )}
          </div>

          {/* トップに戻る */}
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-4 bg-white text-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border-2 border-gray-200 flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span>トップに戻る</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
