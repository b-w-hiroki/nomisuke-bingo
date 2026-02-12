"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { generateBingo as generateBingoUtil } from '@/utils/bingoGenerator';
import { saveGroupInfo, getGroupInfo, saveSession, getSession, generateGroupId, type GroupSession } from '@/utils/groupStorage';

interface Tile {
  label: string;
  image?: string;
  description?: string;
  isFree?: boolean;
  isBlank?: boolean;
}

function RoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // クエリパラメータから値を取得（デフォルト値付き）
  const sizeParam = Number(searchParams.get('size')) || 5;
  const freeCountParam = Number(searchParams.get('free')) || 1;
  const groupPassword = searchParams.get('group') || '';
  
  // 値を安全に丸める
  const size = Math.max(3, Math.min(7, Math.floor(sizeParam) || 5));
  const freeCount = Math.max(0, Math.min(5, Math.floor(freeCountParam) || 0));

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [checked, setChecked] = useState<boolean[][]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [groupId, setGroupId] = useState<string | null>(null);
  
  // モーダル状態管理
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number; tile: Tile } | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // グループIDを初期化
  useEffect(() => {
    if (groupPassword) {
      const id = generateGroupId(groupPassword);
      setGroupId(id);
      
      // グループ情報が存在しない場合は作成
      let groupInfo = getGroupInfo(id);
      if (!groupInfo) {
        groupInfo = {
          groupId: id,
          password: groupPassword,
          usedItems: new Set(),
          usedLayouts: new Set(),
          createdAt: Date.now(),
        };
        saveGroupInfo(groupInfo);
      }
    }
  }, [groupPassword]);

  // セッション自動保存（checkedやuploadedImagesが変更されたとき）
  useEffect(() => {
    if (groupId && tiles.length > 0 && checked.length > 0) {
      const session: GroupSession = {
        groupId,
        password: groupPassword || '',
        size,
        freeCount,
        tiles,
        checked,
        uploadedImages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveSession(session);
    }
  }, [groupId, groupPassword, size, freeCount, tiles, checked, uploadedImages]);

  // ビンゴを生成する関数
  const generateBingo = useCallback(() => {
    let usedItems = new Set<string>();
    let usedLayouts = new Set<string>();
    
    if (groupId) {
      const groupInfo = getGroupInfo(groupId);
      if (groupInfo) {
        usedItems = groupInfo.usedItems;
        usedLayouts = groupInfo.usedLayouts;
      }
    }

    const result = generateBingoUtil({
      size,
      freeCount,
      usedItems,
      usedLayouts,
      allowOverlap: 0.15, // 15%の重複は許容
    });

    // グループ情報を更新
    if (groupId) {
      const groupInfo = getGroupInfo(groupId);
      if (groupInfo) {
        result.usedItemLabels.forEach(label => groupInfo.usedItems.add(label));
        groupInfo.usedLayouts.add(result.layoutHash);
        saveGroupInfo(groupInfo);
      }
    }

    // checked配列を初期化（フリーマスは達成済み）
    const newChecked: boolean[][] = [];
    for (let row = 0; row < size; row++) {
      newChecked[row] = [];
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        newChecked[row][col] = result.tiles[index]?.isFree || false;
      }
    }

    setTiles(result.tiles);
    setChecked(newChecked);
    setUploadedImages({});
  }, [size, freeCount, groupId]);

  // 初回: セッション復帰があれば復帰、なければビンゴ生成
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (groupId) {
      const session = getSession(groupId);
      if (session && session.size === size && session.freeCount === freeCount) {
        setTiles(session.tiles);
        setChecked(session.checked);
        setUploadedImages(session.uploadedImages);
        setImageErrors(new Set());
        return;
      }
    }
    generateBingo();
    setImageErrors(new Set());
  }, [generateBingo, groupId, size, freeCount]);

  // マスをクリックしてモーダルを開く
  const handleTileClick = useCallback((row: number, col: number) => {
    if (tiles.length === 0) return;
    
    const index = row * size + col;
    const tile = tiles[index];
    
    // FREEマスはクリックできない（既存仕様）
    if (tile?.isFree) {
      return;
    }

    // 既に達成済みの場合は何もしない
    if (checked[row]?.[col]) {
      return;
    }

    // モーダルを開く
    setSelectedTile({ row, col, tile });
    setModalOpen(true);
    const tileKey = `${row}-${col}`;
    setUploadedImagePreview(uploadedImages[tileKey] || null);
  }, [tiles, size, checked, uploadedImages]);

  // モーダルを閉じる
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTile(null);
    setUploadedImagePreview(null);
  }, []);

  // 写真アップロード処理
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 画像ファイルの検証
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      alert('画像ファイルは5MB以下にしてください');
      return;
    }

    // 画像をプレビュー用に読み込み
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImagePreview(result);
    };
    reader.readAsDataURL(file);
  }, []);

  // 達成ボタンを押したときの処理
  const handleAchieve = useCallback(() => {
    if (!selectedTile) return;

    const { row, col } = selectedTile;
    const tileKey = `${row}-${col}`;

    // 達成状態を更新
    setChecked(prev => {
      if (!prev || prev.length === 0) return prev;
      const newChecked = [...prev];
      if (!newChecked[row]) {
        newChecked[row] = [];
      }
      newChecked[row] = [...newChecked[row]];
      newChecked[row][col] = true;
      
      // セッションを保存
      if (groupId) {
        const session: GroupSession = {
          groupId,
          password: groupPassword || '',
          size,
          freeCount,
          tiles,
          checked: newChecked,
          uploadedImages: uploadedImagePreview ? { ...uploadedImages, [tileKey]: uploadedImagePreview } : uploadedImages,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveSession(session);
      }
      
      return newChecked;
    });

    // アップロードされた画像を保存
    if (uploadedImagePreview) {
      setUploadedImages(prev => {
        const newImages = {
          ...prev,
          [tileKey]: uploadedImagePreview,
        };
        
        // セッションを保存
        if (groupId) {
          const session: GroupSession = {
            groupId,
            password: groupPassword || '',
            size,
            freeCount,
            tiles,
            checked,
            uploadedImages: newImages,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          saveSession(session);
        }
        
        return newImages;
      });
    }

    // モーダルを閉じる
    handleCloseModal();
  }, [selectedTile, uploadedImagePreview, handleCloseModal, groupId, groupPassword, size, freeCount, tiles, checked, uploadedImages]);

  // 達成数とビンゴ数を計算
  const achievementCount = useMemo(() => {
    if (!checked || checked.length === 0) return 0;
    return checked.flat().filter(Boolean).length;
  }, [checked]);

  const bingoCount = useMemo(() => {
    if (!checked || checked.length === 0) return 0;
    
    let count = 0;
    
    // 横列
    for (let row = 0; row < size; row++) {
      if (checked[row] && checked[row].length === size && checked[row].every(c => c)) {
        count++;
      }
    }
    
    // 縦列
    for (let col = 0; col < size; col++) {
      let allChecked = true;
      for (let row = 0; row < size; row++) {
        if (!checked[row] || !checked[row][col]) {
          allChecked = false;
          break;
        }
      }
      if (allChecked) count++;
    }
    
    // 斜め（左上から右下）
    let diagonal1 = true;
    for (let i = 0; i < size; i++) {
      if (!checked[i] || !checked[i][i]) {
        diagonal1 = false;
        break;
      }
    }
    if (diagonal1) count++;
    
    // 斜め（右上から左下）
    let diagonal2 = true;
    for (let i = 0; i < size; i++) {
      if (!checked[i] || !checked[i][size - 1 - i]) {
        diagonal2 = false;
        break;
      }
    }
    if (diagonal2) count++;
    
    return count;
  }, [checked, size]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-3 sm:p-4 md:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダーセクション */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={() => router.push('/')}
              className="px-3 sm:px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-orange-200"
              aria-label="トップページに戻る"
            >
              <span>←</span>
              <span className="hidden sm:inline">トップに戻る</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            呑み助ビンゴ
          </h1>
        </div>
        
        {/* 達成数とビンゴ数の表示 */}
        <div className="flex justify-center gap-4 mb-6 md:mb-8 animate-slide-up">
          <div className={`bg-white rounded-xl shadow-medium px-6 py-4 border-2 ${
            achievementCount > 0 ? 'border-orange-400 shadow-strong' : 'border-orange-200'
          } flex items-center gap-3 min-w-[140px] justify-center transition-all duration-300 ${
            achievementCount > 0 ? 'scale-105' : ''
          }`}>
            <span className={`text-2xl transition-transform ${achievementCount > 0 ? 'animate-bounce-soft' : ''}`}>✅</span>
            <div>
              <div className="text-xs text-gray-500 font-medium">達成</div>
              <div className={`text-2xl font-bold text-orange-600 transition-all ${
                achievementCount > 0 ? 'scale-110' : ''
              }`}>{achievementCount}</div>
            </div>
          </div>
          <div className={`bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-medium px-6 py-4 border-2 ${
            bingoCount > 0 ? 'border-yellow-300 shadow-glow' : 'border-red-400'
          } flex items-center gap-3 min-w-[140px] justify-center transition-all duration-300 ${
            bingoCount > 0 ? 'scale-105 animate-pulse-soft' : ''
          }`}>
            <span className={`text-2xl transition-transform ${bingoCount > 0 ? 'animate-bounce-soft' : ''}`}>🎉</span>
            <div>
              <div className="text-xs text-white/90 font-medium">ビンゴ</div>
              <div className={`text-2xl font-bold text-white transition-all ${
                bingoCount > 0 ? 'scale-110' : ''
              }`}>{bingoCount}</div>
            </div>
          </div>
        </div>

        {/* ビンゴグリッド */}
        <div
          className="grid gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 p-1 sm:p-2"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
          }}
        >
          {tiles.length > 0 ? tiles.map((tile, index) => {
            const row = Math.floor(index / size);
            const col = index % size;
            const isChecked = checked[row]?.[col] || false;
            const isFree = tile.isFree || false;

            return (
              <div
                key={index}
                onClick={() => handleTileClick(row, col)}
                role="button"
                tabIndex={isFree ? -1 : 0}
                aria-label={isFree ? `フリーマス: ${tile.label}` : `マス ${row + 1}-${col + 1}: ${tile.label}`}
                aria-pressed={isChecked}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isFree) {
                    e.preventDefault();
                    handleTileClick(row, col);
                  }
                }}
                className={`
                  aspect-square rounded-xl
                  flex flex-col items-center justify-center
                  relative transition-all duration-300
                  ${isFree 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-green-300 shadow-lg cursor-default animate-pulse-soft' 
                    : 'bg-white border-2 border-gray-300 shadow-medium hover:shadow-strong cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-200'
                  }
                  ${isChecked && !isFree ? 'bg-gray-100 border-orange-400 shadow-strong' : ''}
                  ${!isFree ? 'hover:scale-105 active:scale-95 hover:border-orange-400' : ''}
                  transform
                `}
              >
                {/* 画像表示エリア */}
                {tile.image && !isFree && !imageErrors.has(`${row}-${col}`) && (
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={tile.image}
                      alt={tile.label}
                      fill
                      className="object-cover rounded-xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={tile.image.startsWith('/images/')}
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(`${row}-${col}`));
                      }}
                    />
                    {/* 画像の上にオーバーレイ（テキストを見やすくする） */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
                  </div>
                )}
                
                {/* 画像エラー時のフォールバック表示 */}
                {tile.image && !isFree && imageErrors.has(`${row}-${col}`) && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center p-2">
                      <span className="text-4xl mb-2 block">🍺</span>
                      <span className="text-xs text-gray-600 font-medium">{tile.label}</span>
                    </div>
                  </div>
                )}
                
                {/* テキスト表示（画像の上に表示） */}
                <div className={`relative z-10 w-full h-full text-center p-1 sm:p-2 md:p-3 flex flex-col items-center justify-end ${
                  tile.image && !isFree ? 'pb-2' : 'justify-center'
                }`}>
                  <div className={`line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] font-semibold text-xs sm:text-sm md:text-base ${
                    isFree 
                      ? 'text-white drop-shadow-md' 
                      : tile.image 
                        ? 'text-white drop-shadow-lg' 
                        : 'text-gray-800'
                  }`}>
                    {tile.label}
                  </div>
                </div>

                {/* FREEマス用の装飾 */}
                {isFree && (
                  <div className="absolute top-1 right-1 bg-white/30 rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-xs">🎁</span>
                  </div>
                )}

                {/* 達成オーバーレイ（FREEマスには表示しない） */}
                {isChecked && !isFree && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-emerald-600/90 rounded-xl flex items-center justify-center animate-fade-in z-20">
                    <div className="text-center transform animate-bounce-soft">
                      <div className="text-4xl md:text-5xl mb-2 animate-bounce-soft">✓</div>
                      <span className="text-white font-bold text-base md:text-lg drop-shadow-lg">達成！</span>
                    </div>
                  </div>
                )}

                {/* アップロードされた写真の表示 */}
                {isChecked && !isFree && uploadedImages[`${row}-${col}`] && (
                  <div className="absolute inset-0 z-10 rounded-xl overflow-hidden">
                    <Image
                      src={uploadedImages[`${row}-${col}`]}
                      alt={`${tile.label}の達成写真`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={generateBingo}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-lg font-bold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="ビンゴを再シャッフルする"
          >
            <span className="text-xl">🔀</span>
            <span>再シャッフル</span>
          </button>
          <button
            onClick={() => {
              // 結果データを準備
              const resultData = {
                size,
                tiles,
                checked,
                uploadedImages,
                achievementCount,
                bingoCount,
              };
              
              // localStorageに保存
              localStorage.setItem('bingo_result', JSON.stringify(resultData));
              
              // リザルトページに遷移
              router.push('/result');
            }}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-lg font-bold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-purple-300"
            aria-label="ビンゴを終わる"
          >
            <span className="text-xl">🏁</span>
            <span>ビンゴを終わる</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border-2 border-gray-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-label="トップページに戻る"
          >
            <span>🏠</span>
            <span>トップに戻る</span>
          </button>
        </div>
      </div>

      {/* モーダル */}
      {modalOpen && selectedTile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-800">{selectedTile.tile.label}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                aria-label="モーダルを閉じる"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 space-y-6">
              {/* 説明文 */}
              {selectedTile.tile.description && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {selectedTile.tile.description}
                  </p>
                </div>
              )}

              {/* 元の画像表示 */}
              {selectedTile.tile.image && !imageErrors.has(`${selectedTile.row}-${selectedTile.col}`) && (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                  <Image
                    src={selectedTile.tile.image}
                    alt={selectedTile.tile.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    unoptimized={selectedTile.tile.image.startsWith('/images/')}
                    onError={() => {
                      setImageErrors(prev => new Set(prev).add(`${selectedTile.row}-${selectedTile.col}`));
                    }}
                  />
                </div>
              )}
              
              {/* 画像エラー時のフォールバック表示 */}
              {selectedTile.tile.image && imageErrors.has(`${selectedTile.row}-${selectedTile.col}`) && (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center p-4">
                    <span className="text-6xl mb-4 block">🍺</span>
                    <span className="text-lg text-gray-700 font-semibold">{selectedTile.tile.label}</span>
                  </div>
                </div>
              )}

              {/* 写真アップロードセクション */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  達成写真をアップロード（オプション）
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-center font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">📷</span>
                      <span>写真を選択</span>
                    </span>
                  </label>

                  {/* アップロードされた画像のプレビュー */}
                  {uploadedImagePreview && (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-green-400 shadow-lg">
                      <Image
                        src={uploadedImagePreview}
                        alt="アップロードされた画像"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <button
                        onClick={() => setUploadedImagePreview(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        aria-label="画像を削除"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 達成ボタン */}
              <button
                onClick={handleAchieve}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-green-300"
                aria-label="達成する"
              >
                <span className="text-2xl">✓</span>
                <span>達成する</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <RoomContent />
    </Suspense>
  );
}
