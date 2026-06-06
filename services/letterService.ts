// ============================================================
// 信件数据服务 —— 封装 AsyncStorage 中所有信件操作
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Letter, generateId, nowISO } from '../types/letter';
import { seedLetters } from '../data/seedLetters';
import { getLetterImage } from '../data/letterAssets';

const STORAGE_KEY = '@parallel_universe_letters';

/** 首次启动时导入种子数据 */
export async function seedIfNeeded(): Promise<void> {
  const existing = await AsyncStorage.getItem(STORAGE_KEY);
  if (existing) return; // 已有数据，不重复导入

  const letters: Letter[] = seedLetters.map(seed => ({
    id: generateId(),
    title: seed.title,
    body: seed.body,
    stepThreshold: seed.stepThreshold,
    isUnlocked: false,
    unlockedAt: null,
    sortOrder: seed.sortOrder,
    createdAt: nowISO(),
    photos: seed.photos.map(p => ({
      id: generateId(),
      imageUri: getLetterImage(p.imageName),
      caption: p.caption,
    })),
  }));

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

/** 获取所有信件 */
export async function fetchAllLetters(): Promise<Letter[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

/** 获取已解锁的信件（按解锁时间倒序） */
export async function fetchUnlockedLetters(): Promise<Letter[]> {
  const all = await fetchAllLetters();
  return all
    .filter(l => l.isUnlocked)
    .sort((a, b) => {
      const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return dateB - dateA;
    });
}

/** 标记信件为已解锁 */
export async function markAsUnlocked(letterId: string): Promise<void> {
  const all = await fetchAllLetters();
  const updated = all.map(l =>
    l.id === letterId
      ? { ...l, isUnlocked: true, unlockedAt: nowISO() }
      : l
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/** 寻找第一封达标但未解锁的信 */
export async function findNextUnlockableLetter(
  currentSteps: number
): Promise<Letter | null> {
  const all = await fetchAllLetters();
  return all
    .filter(l => l.stepThreshold <= currentSteps && !l.isUnlocked)
    .sort((a, b) => a.stepThreshold - b.stepThreshold)
    .at(0) ?? null;
}
