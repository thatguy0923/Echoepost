// ============================================================
// 步数服务 —— 原型阶段使用模拟数据
// HealthKit 真实集成需要 Mac + Development Build
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_STEPS_KEY = '@parallel_universe_mock_steps';
const MOCK_INITIAL_STEPS = 5000; // 默认步数：可解锁前2封信

/** 获取累计总步数（当前为模拟数据） */
export async function fetchTotalSteps(): Promise<number> {
  const stored = await AsyncStorage.getItem(MOCK_STEPS_KEY);
  if (stored) {
    return parseInt(stored, 10);
  }
  await AsyncStorage.setItem(MOCK_STEPS_KEY, String(MOCK_INITIAL_STEPS));
  return MOCK_INITIAL_STEPS;
}

/** 模拟增加步数（用于原型测试） */
export async function addMockSteps(amount: number): Promise<number> {
  const current = await fetchTotalSteps();
  const newSteps = current + amount;
  await AsyncStorage.setItem(MOCK_STEPS_KEY, String(newSteps));
  return newSteps;
}

/**
 * 未来真实 HealthKit 实现：
 * - 需要 react-native-health 库
 * - 需要 Mac + Xcode 做 Development Build
 * - 替换上面 fetchTotalSteps 为 HealthKit API 调用
 */
