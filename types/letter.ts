// ============================================================
// 信件和照片的核心类型定义
// ============================================================

/** 数据库中存储的信件（含运行时状态） */
export interface Letter {
  id: string;
  title: string;
  body: string;
  stepThreshold: number;
  isUnlocked: boolean;
  unlockedAt: string | null;   // ISO 8601 日期字符串，未解锁时为 null
  sortOrder: number;
  createdAt: string;
  photos: Photo[];
}

/** 照片 */
export interface Photo {
  id: string;
  imageUri: string;            // require() 返回的静态资源引用
  caption: string | null;
}

/** 种子数据中的一封信（图片用文件名引用） */
export interface SeedLetter {
  title: string;
  body: string;
  stepThreshold: number;
  sortOrder: number;
  photos: SeedPhoto[];
}

/** 种子数据中的照片 */
export interface SeedPhoto {
  imageName: string;
  caption: string | null;
}

/** 生成简单的 UUID（不需要额外库） */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15);
}

/** 创建当前时间的 ISO 字符串 */
export function nowISO(): string {
  return new Date().toISOString();
}
