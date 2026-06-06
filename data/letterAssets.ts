// ============================================================
// 所有信件照片的静态引用映射
// React Native 中图片必须用 require() 静态引入
// ============================================================

const letterAssets: Record<string, ReturnType<typeof require>> = {
  'letter1_photo1': require('../assets/letters/letter1_photo1.jpg'),
  'letter2_photo1': require('../assets/letters/letter2_photo1.jpg'),
  'letter3_photo1': require('../assets/letters/letter3_photo1.jpg'),
};

/** 根据图片名获取 require 引用 */
export function getLetterImage(imageName: string) {
  const image = letterAssets[imageName];
  if (!image) {
    console.warn(`图片 "${imageName}" 未在 letterAssets 中注册`);
  }
  return image;
}
