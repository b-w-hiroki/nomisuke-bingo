/**
 * グループ管理とセッション保存のユーティリティ
 */

export interface GroupSession {
  groupId: string;
  password: string;
  size: number;
  freeCount: number;
  tiles: Array<{
    label: string;
    image?: string;
    description?: string;
    isFree?: boolean;
  }>;
  checked: boolean[][];
  uploadedImages: { [key: string]: string };
  createdAt: number;
  updatedAt: number;
}

export interface GroupInfo {
  groupId: string;
  password: string;
  usedItems: Set<string>; // 使用済みアイテムのラベル
  usedLayouts: Set<string>; // 使用済みレイアウト（フリーマスの位置）
  createdAt: number;
}

const GROUP_INFO_PREFIX = 'bingo_group_';
const SESSION_PREFIX = 'bingo_session_';

/**
 * グループ情報を保存
 */
export function saveGroupInfo(groupInfo: GroupInfo): void {
  if (typeof window === 'undefined') return;
  
  const key = `${GROUP_INFO_PREFIX}${groupInfo.groupId}`;
  const data = {
    ...groupInfo,
    usedItems: Array.from(groupInfo.usedItems),
    usedLayouts: Array.from(groupInfo.usedLayouts),
  };
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * グループ情報を取得
 */
export function getGroupInfo(groupId: string): GroupInfo | null {
  if (typeof window === 'undefined') return null;
  
  const key = `${GROUP_INFO_PREFIX}${groupId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  try {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      usedItems: new Set(parsed.usedItems || []),
      usedLayouts: new Set(parsed.usedLayouts || []),
    };
  } catch {
    return null;
  }
}

/**
 * セッションを保存
 */
export function saveSession(session: GroupSession): void {
  if (typeof window === 'undefined') return;
  
  const key = `${SESSION_PREFIX}${session.groupId}`;
  const sessionData = {
    ...session,
    updatedAt: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(sessionData));
}

/**
 * セッションを取得
 */
export function getSession(groupId: string): GroupSession | null {
  if (typeof window === 'undefined') return null;
  
  const key = `${SESSION_PREFIX}${groupId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * セッションを削除
 */
export function deleteSession(groupId: string): void {
  if (typeof window === 'undefined') return;
  
  const key = `${SESSION_PREFIX}${groupId}`;
  localStorage.removeItem(key);
}

/**
 * グループIDを生成（合言葉から）
 */
export function generateGroupId(password: string): string {
  // シンプルなハッシュ関数
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `group_${Math.abs(hash)}`;
}
