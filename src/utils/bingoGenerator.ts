/**
 * ビンゴ生成ロジック（グループ対応）
 */

import { bingoItems, type BingoItem } from '@/data/bingoItems';

export interface Tile {
  label: string;
  image?: string;
  description?: string;
  isFree?: boolean;
  isBlank?: boolean;
}

export interface GenerateBingoOptions {
  size: number;
  freeCount: number;
  usedItems?: Set<string>; // グループで使用済みのアイテム
  usedLayouts?: Set<string>; // グループで使用済みのレイアウト（フリーマスの位置）
  allowOverlap?: number; // 重複許容率（0-1、デフォルト0.15 = 15%）
}

/**
 * レイアウトのハッシュを生成（フリーマスの位置から）
 */
function generateLayoutHash(freeIndices: Set<number>, size: number): string {
  const sorted = Array.from(freeIndices).sort((a, b) => a - b);
  return `${size}_${sorted.join(',')}`;
}

/**
 * ビンゴを生成
 */
export function generateBingo(options: GenerateBingoOptions): {
  tiles: Tile[];
  layoutHash: string;
  usedItemLabels: string[];
} {
  const {
    size,
    freeCount,
    usedItems = new Set(),
    usedLayouts = new Set(),
    allowOverlap = 0.15, // 15%の重複は許容
  } = options;

  const totalTiles = size * size;
  const newTiles: Tile[] = [];
  const freeIndices = new Set<number>();

  // フリーマスの位置を決定（中央 + 残りをランダム）
  const centerIndex = Math.floor(totalTiles / 2);
  
  if (freeCount > 0) {
    freeIndices.add(centerIndex);
  }
  
  // 残りのフリーマスをランダムに配置
  while (freeIndices.size < freeCount && freeIndices.size < totalTiles) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    if (!freeIndices.has(randomIndex)) {
      freeIndices.add(randomIndex);
    }
  }

  // レイアウトのハッシュを生成
  const layoutHash = generateLayoutHash(freeIndices, size);

  // レイアウトが既に使用されている場合、再生成を試みる（最大10回）
  let attempts = 0;
  while (usedLayouts.has(layoutHash) && attempts < 10) {
    freeIndices.clear();
    if (freeCount > 0) {
      freeIndices.add(centerIndex);
    }
    while (freeIndices.size < freeCount && freeIndices.size < totalTiles) {
      const randomIndex = Math.floor(Math.random() * totalTiles);
      if (!freeIndices.has(randomIndex)) {
        freeIndices.add(randomIndex);
      }
    }
    const newLayoutHash = generateLayoutHash(freeIndices, size);
    if (!usedLayouts.has(newLayoutHash)) {
      break;
    }
    attempts++;
  }
  layoutHash = generateLayoutHash(freeIndices, size);

  // フリーマスを除いたアイテムの数を計算
  const itemCount = totalTiles - freeIndices.size;
  
  // アイテムを選択（重複を避けつつ、許容範囲内なら重複OK）
  const shuffledItems = [...bingoItems].sort(() => Math.random() - 0.5);
  const selectedItems: BingoItem[] = [];
  const usedItemLabels: string[] = [];
  const maxOverlap = Math.floor(itemCount * allowOverlap);
  let overlapCount = 0;

  const L = shuffledItems.length;
  for (let i = 0; i < itemCount; i++) {
    let selectedItem: BingoItem | null = null;
    let attempts2 = 0;
    
    // 未使用のアイテムを優先的に選択（インデックスは 0 ～ L-1 に収める）
    while (attempts2 < L * 2) {
      const idx = (i + attempts2) % L;
      const candidate = shuffledItems[idx];
      
      if (!usedItems.has(candidate.label)) {
        selectedItem = candidate;
        break;
      }
      if (overlapCount < maxOverlap) {
        selectedItem = candidate;
        overlapCount++;
        break;
      }
      attempts2++;
    }
    
    if (!selectedItem) {
      selectedItem = shuffledItems[i % L];
    }
    
    selectedItems.push(selectedItem);
    usedItemLabels.push(selectedItem.label);
  }

  // タイルを生成
  let itemIndex = 0;
  for (let i = 0; i < totalTiles; i++) {
    if (freeIndices.has(i)) {
      newTiles.push({
        label: 'FREE',
        isFree: true,
      });
    } else {
      const item = selectedItems[itemIndex];
      if (item) {
        newTiles.push({
          label: item.label,
          image: item.image,
          description: item.description || `${item.label}を達成しましょう！`,
        });
      } else {
        // フォールバック
        newTiles.push({
          label: `アイテム${itemIndex + 1}`,
          image: '/images/bingo/placeholder.png',
          description: `アイテム${itemIndex + 1}を達成しましょう！`,
        });
      }
      itemIndex++;
    }
  }

  return {
    tiles: newTiles,
    layoutHash,
    usedItemLabels,
  };
}
