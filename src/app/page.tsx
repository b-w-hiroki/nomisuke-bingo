"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [size, setSize] = useState<number>(5);
  const [freeCount, setFreeCount] = useState<number>(1);
  const [isGroupMode, setIsGroupMode] = useState<boolean>(false);
  const [groupPassword, setGroupPassword] = useState<string>('');

  useEffect(() => {
    // 環境変数からデフォルト値を取得（NEXT_PUBLIC_*はクライアント側でも利用可能）
    const envSize = process.env.NEXT_PUBLIC_DEFAULT_SIZE;
    const envFreeCount = process.env.NEXT_PUBLIC_DEFAULT_FREE_COUNT;
    
    const defaultSize = envSize ? Number(envSize) : 5;
    const defaultFreeCount = envFreeCount ? Number(envFreeCount) : 1;
    
    // 値が有効な範囲内かチェック
    if (defaultSize >= 3 && defaultSize <= 7) {
      setSize(defaultSize);
    }
    if (defaultFreeCount >= 0 && defaultFreeCount <= 5) {
      setFreeCount(defaultFreeCount);
    }
  }, []);

  const clampSize = (value: number): number => {
    return Math.max(3, Math.min(7, Math.floor(value) || 5));
  };

  const clampFreeCount = (value: number): number => {
    return Math.max(0, Math.min(5, Math.floor(value) || 0));
  };

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    const clamped = clampSize(value);
    setSize(clamped);
  }, []);

  const handleFreeCountChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    const clamped = clampFreeCount(value);
    setFreeCount(clamped);
  }, []);

  const handleStart = useCallback(() => {
    if (isGroupMode && !groupPassword.trim()) {
      alert('合言葉を入力してください');
      return;
    }
    
    const params = new URLSearchParams({
      size: size.toString(),
      free: freeCount.toString(),
    });
    
    if (isGroupMode && groupPassword.trim()) {
      params.append('group', groupPassword.trim());
    }
    
    router.push(`/room?${params.toString()}`);
  }, [router, size, freeCount, isGroupMode, groupPassword]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        {/* タイトルセクション */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg text-shadow-lg">
            呑み助ビンゴ
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">お酒を楽しむビンゴゲーム</p>
        </div>

        {/* カード型フォーム */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 border border-gray-100 animate-fade-in overflow-visible">
          <div>
            <label htmlFor="size" className="block text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span>マスの数（N×N）</span>
            </label>
            <select
              id="size"
              value={size}
              onChange={handleSizeChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none text-lg font-medium text-gray-900 appearance-none cursor-pointer pr-10 custom-select-arrow"
              aria-label="マスの数（N×N）"
              aria-describedby="size-help"
            >
              <option value="3">3×3</option>
              <option value="4">4×4</option>
              <option value="5">5×5</option>
              <option value="6">6×6</option>
              <option value="7">7×7</option>
            </select>
            <p id="size-help" className="text-xs text-gray-500 mt-2 ml-1">3〜7の範囲から選択してください</p>
          </div>

          <div>
            <label htmlFor="freeCount" className="block text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <span>フリーマスの数</span>
            </label>
            <select
              id="freeCount"
              value={freeCount}
              onChange={handleFreeCountChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none text-lg font-medium text-gray-900 appearance-none cursor-pointer pr-10 custom-select-arrow"
              aria-label="フリーマスの数"
              aria-describedby="free-help"
            >
              <option value="0">0個</option>
              <option value="1">1個</option>
              <option value="2">2個</option>
              <option value="3">3個</option>
              <option value="4">4個</option>
              <option value="5">5個</option>
            </select>
            <p id="free-help" className="text-xs text-gray-500 mt-2 ml-1">0〜5の範囲から選択してください</p>
          </div>

          {/* グループモード切り替え */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="group-mode"
                checked={isGroupMode}
                onChange={(e) => setIsGroupMode(e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 shrink-0"
              />
              <label htmlFor="group-mode" className="text-base font-semibold text-gray-800 flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xl">👥</span>
                <span>グループで遊ぶ</span>
              </label>
            </div>
            {isGroupMode && (
              <div className="space-y-2">
                <label htmlFor="group-password" className="block text-sm font-medium text-gray-700">
                  合言葉（グループメンバーと共有してください）
                </label>
                <input
                  id="group-password"
                  type="text"
                  value={groupPassword}
                  onChange={(e) => setGroupPassword(e.target.value)}
                  placeholder="例: 飲み会2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all outline-none text-base"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">
                  同じ合言葉を入力したメンバー同士で、異なるビンゴマスが配られます
                </p>
              </div>
            )}
          </div>

          {/* ビンゴをはじめるボタン（クリック領域を確実に） */}
          <div className="pt-2 relative z-10">
            <button
              type="button"
              onClick={handleStart}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-lg font-bold hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-red-300 cursor-pointer relative z-10 touch-manipulation"
              aria-label="ビンゴを開始する"
            >
              <span className="text-2xl">🍺</span>
              <span>ビンゴをはじめる</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
