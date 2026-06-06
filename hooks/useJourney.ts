// ============================================================
// 核心业务逻辑 Hook（React 版的 ViewModel）
// Screen 只调用这个 Hook，不直接接触 Service
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { Letter } from '../types/letter';
import * as LetterService from '../services/letterService';
import * as StepService from '../services/stepService';
import * as Notifications from 'expo-notifications';

export interface JourneyState {
  totalSteps: number;
  unlockedLetters: Letter[];
  newLetter: Letter | null;
  isLoading: boolean;
  isPermissionDenied: boolean;
  errorMessage: string | null;
}

export interface JourneyActions {
  loadData: () => Promise<void>;
  checkForNewLetter: () => Promise<void>;
  requestPermission: () => Promise<void>;
  dismissNewLetter: () => void;
  addSteps: (amount: number) => Promise<void>;
}

export function useJourney(): JourneyState & JourneyActions {
  const [totalSteps, setTotalSteps] = useState(0);
  const [unlockedLetters, setUnlockedLetters] = useState<Letter[]>([]);
  const [newLetter, setNewLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ---- 首次启动：种子数据 + 加载 + 检查新信 ----
  useEffect(() => {
    const init = async () => {
      await LetterService.seedIfNeeded();
      await loadData();
      await checkForNewLetter();
    };
    init();
  }, []);

  // ---- 加载数据 ----
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [steps, unlocked] = await Promise.all([
        StepService.fetchTotalSteps(),
        LetterService.fetchUnlockedLetters(),
      ]);
      setTotalSteps(steps);
      setUnlockedLetters(unlocked);
      setErrorMessage(null);
    } catch (e) {
      setErrorMessage(`加载失败: ${e instanceof Error ? e.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---- 检查是否有新信需要解锁 ----
  const checkForNewLetter = useCallback(async () => {
    try {
      const currentSteps = await StepService.fetchTotalSteps();
      setTotalSteps(currentSteps);

      const letter = await LetterService.findNextUnlockableLetter(currentSteps);
      if (!letter) return;

      await LetterService.markAsUnlocked(letter.id);

      const updatedLetter: Letter = {
        ...letter,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      setNewLetter(updatedLetter);
      setUnlockedLetters(prev => [updatedLetter, ...prev]);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📮 另一个宇宙的你来信了",
          body: `"${letter.title}" 已送达`,
          sound: true,
        },
        trigger: null,
      });
    } catch (e) {
      setErrorMessage(`同步失败: ${e instanceof Error ? e.message : '未知错误'}`);
    }
  }, []);

  // ---- 请求步数权限（原型阶段直接通过） ----
  const requestPermission = useCallback(async () => {
    setIsPermissionDenied(false);
    await loadData();
    await checkForNewLetter();
  }, [loadData, checkForNewLetter]);

  // ---- 模拟增加步数（原型测试用） ----
  const addSteps = useCallback(async (amount: number) => {
    await StepService.addMockSteps(amount);
    await loadData();
    await checkForNewLetter();
  }, [loadData, checkForNewLetter]);

  // ---- 关闭新信动画 ----
  const dismissNewLetter = useCallback(() => {
    setNewLetter(null);
  }, []);

  return {
    totalSteps,
    unlockedLetters,
    newLetter,
    isLoading,
    isPermissionDenied,
    errorMessage,
    loadData,
    checkForNewLetter,
    requestPermission,
    dismissNewLetter,
    addSteps,
  };
}
