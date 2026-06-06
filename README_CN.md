# Echoepost

走路解锁来自平行宇宙另一个自己的信件。

一款基于 React Native 和 Expo 构建的 iOS 应用。步数达到隐藏门槛时，来自另一个宇宙的"你"会寄来一封信，附带文字和照片。没有进度条，没有社交功能，你只管走，信自会来。

## 工作原理

1. 你走路，iPhone 通过 HealthKit 在后台记录步数。
2. 当累计步数达到某个隐藏阈值，一封来自平行宇宙的信将被解锁。
3. 本地通知提醒你：来信了。
4. 打开 App，全屏阅读信件和查看照片。

你不会知道下一封信什么时候来。界面不显示进度、不提示目标、不透露还剩多少步。你能看到的只有自己走过的步数，以及已经抵达的信。

## 技术栈

- React Native (Expo SDK 54)
- TypeScript
- HealthKit (步数数据源)
- AsyncStorage (本地持久化)
- expo-notifications (本地推送)

## 架构

```
Screen (视图) --> Custom Hook (ViewModel) --> Service (数据访问) --> DataSource
```

- `hooks/useJourney.ts` — 核心业务逻辑，持有所有状态
- `services/stepService.ts` — 步数服务（目前为模拟数据，未来接入 HealthKit）
- `services/letterService.ts` — 信件存储与解锁逻辑
- `data/seedLetters.ts` — 种子信件内容
- `components/` — UI 组件（NewLetterModal, LetterDetail, PermissionDenied）

## 项目状态

原型阶段，已在 iPhone 14 Pro 上通过 Expo Go 测试通过。步数数据目前为模拟数据，真机 HealthKit 接入需 Mac 环境进行开发构建。

## 本地开发

```
npm install
npx expo start
```

用 iPhone 上的 Expo Go 扫描二维码即可预览。
