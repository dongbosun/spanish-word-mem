# spanish-vocab-list

一个面向手机网页优先使用的西班牙语-英语词汇记忆应用。应用界面使用简体中文，词汇内容为西班牙语和英语。

## 这是什么

`spanish-vocab-list` 是一个列表优先的词汇学习工具。它的核心体验不是每天推荐少量新词，而是让用户自由浏览完整词库、按章节和小节查看大量单词，并按照自己的节奏标记掌握程度。

目标词库规模约为 3000 个单词。MVP 阶段内置示例数据，但数据模型、列表 UI、统计逻辑和测试逻辑都应支持后续替换为完整词库。

## 这不是什么

本应用不是传统的每日间隔复习应用。

- 不提供“今日新词”
- 不提供“每日任务”
- 不创建“today queue”
- 不使用到期日或 SRS 调度
- 不把完整词库隐藏在每日推荐后面
- 不要求用户输入英文或西语答案
- MVP 不实现选择题翻译测试
- 不使用后端、登录、支付、广告或 OpenAI API

## 核心体验

用户可以：

- 浏览完整词库
- 按章节和小节浏览词汇
- 一次看到大量紧凑的单词行
- 搜索所有单词
- 按状态筛选词汇：全部、收藏、不认识、模糊、熟悉、完全会了、未掌握、薄弱词
- 收藏和取消收藏单词
- 从列表直接标记单词为不认识、模糊、熟悉、完全会了
- 撤销“完全会了”
- 重置单个词的进度
- 按全部词、章节、小节、收藏词、薄弱词或未掌握词开始自测
- 导出和导入本地学习进度

## 技术栈

- Expo
- Expo Router
- React Native Web
- TypeScript
- 本地 JSON 词库数据
- 本地浏览器或设备存储
- React hooks + Context 状态管理
- `FlatList` 或其他虚拟列表方案展示大量词汇

应用应优先适配手机网页和 PWA，同时保持未来迁移到 Expo iOS/Android 原生应用的可能性。

## 本地开发

安装依赖：

```bash
npm install
```

启动网页版本：

```bash
npm run web
```

类型检查：

```bash
npm run typecheck
```

运行测试：

```bash
npm run test
```

代码检查：

```bash
npm run lint
```

导出 Web 构建：

```bash
npm run build:web
```

## 推荐脚本

`package.json` 应包含：

```json
{
  "scripts": {
    "web": "expo start --web",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "expo lint",
    "build:web": "expo export --platform web"
  }
}
```

测试工具可以根据 Expo TypeScript 项目集成情况调整，但必须覆盖纯逻辑函数。

## 路由结构

使用 Expo Router。

主要页面：

- `app/(tabs)/index.tsx`：总览
- `app/(tabs)/chapters.tsx`：词库 / 章节
- `app/chapter/[chapterId].tsx`：章节详情
- `app/section/[sectionId].tsx`：小节详情
- `app/words.tsx`：全部词汇
- `app/word/[wordId].tsx`：单词详情
- `app/(tabs)/test.tsx`：测试中心
- `app/test/session.tsx`：测试过程
- `app/(tabs)/stats.tsx`：统计
- `app/(tabs)/settings.tsx`：设置
- `app/sources.tsx`：数据来源 / 授权说明

底部标签建议：

- 总览
- 词库
- 测试
- 统计
- 设置

## 数据文件

示例数据放在：

- `src/data/chapters.json`
- `src/data/sections.json`
- `src/data/words.json`

MVP 示例数据应包含：

- 3 个章节
- 6 个小节
- 至少 50 个真实可测试的西英词卡

建议章节：

- 基础高频词
- 人物与生活
- 食物与出行

建议小节：

- 基础动词
- 常用名词
- 家庭与人物
- 情绪与描述
- 食物餐饮
- 城市出行

## 数据模型

```ts
type Chapter = {
  id: string;
  title: string;
  description?: string;
  order: number;
};

type Section = {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  order: number;
};

type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "preposition"
  | "conjunction"
  | "phrase"
  | "other";

type WordCard = {
  id: string;
  spanish: string;
  english: string[];
  partOfSpeech: PartOfSpeech;
  chapterId: string;
  sectionId: string;
  tags: string[];
  frequencyRank?: number;
  exampleSpanish?: string;
  exampleEnglish?: string;
  notes?: string;
};

type SelfGrade = "unknown" | "fuzzy" | "familiar";

type WordProgress = {
  wordId: string;
  mastery: number;
  favorite: boolean;
  manuallyMastered: boolean;
  selfGradeCounts: {
    unknown: number;
    fuzzy: number;
    familiar: number;
  };
  testCount: number;
  lastTestedAt?: string;
  lastUpdatedAt?: string;
};

type ProgressMap = Record<string, WordProgress>;
```

## 掌握状态

优先使用 `progress.manuallyMastered` 判断。

如果 `manuallyMastered` 为 `true`，状态为：

- 完全会了

否则根据 `mastery` 判断：

- `0-24`：不认识
- `25-59`：模糊
- `60-89`：熟悉
- `90-100`：完全会了

薄弱词定义：

- 未手动完全掌握，且 `mastery < 60`

未掌握词定义：

- 未手动完全掌握，且 `mastery < 90`

## 掌握度算法

纯函数放在：

- `src/lib/mastery.ts`

核心函数：

- `createDefaultProgress(wordId)`
- `applySelfGrade(progress, grade, source)`
- `markMastered(progress)`
- `undoMastered(progress)`

`applySelfGrade` 规则：

- 没有进度时创建默认进度，初始 `mastery = 0`
- `unknown` 目标分为 `10`，增加 unknown 计数，取消手动完全掌握
- `fuzzy` 目标分为 `45`，增加 fuzzy 计数，取消手动完全掌握
- `familiar` 目标分为 `75`，增加 familiar 计数，取消手动完全掌握
- 来源为 `list` 时：`round(old mastery * 0.65 + target * 0.35)`
- 来源为 `test` 时：`round(old mastery * 0.5 + target * 0.5)`
- 结果限制在 `0-100`
- 来源为 `test` 时增加 `testCount` 并更新 `lastTestedAt`
- 每次都更新 `lastUpdatedAt`

`markMastered`：

- `mastery = 100`
- `manuallyMastered = true`
- 更新 `lastUpdatedAt`

`undoMastered`：

- `manuallyMastered = false`
- 如果 `mastery` 为 `100`，降为 `85`
- 更新 `lastUpdatedAt`

## 本地存储

不要直接在 UI 中写死 `localStorage`。必须通过存储抽象层访问。

建议文件：

- `src/storage/progressStorage.ts`

存储 key：

```ts
const STORAGE_KEY = "spanish-vocab-list-progress-v1";
```

存储层暴露：

- `loadProgress()`
- `saveProgress()`
- `updateWordProgress(wordId, patch)`
- `resetWordProgress(wordId)`
- `exportProgress()`
- `importProgress(json)`

Web 端使用 `window.localStorage`，并且必须处理 `window` 不存在的情况，方便 SSR、测试和未来原生端适配。

导入进度时需要校验 JSON，避免损坏数据导致应用崩溃。

## 状态管理

使用 `ProgressProvider`：

- `src/state/ProgressContext.tsx`

Context 提供：

- `progressMap`
- `gradeWord(wordId, grade, source)`
- `toggleFavorite(wordId)`
- `markWordMastered(wordId)`
- `undoWordMastered(wordId)`
- `resetWord(wordId)`
- `resetAllProgress()`
- `importProgress()`
- `exportProgress()`

任何单词缺失进度时都不能崩溃，应使用默认进度或默认状态。

## 组件

推荐组件：

- `src/components/WordRow.tsx`
- `src/components/MasteryBadge.tsx`
- `src/components/ProgressBar.tsx`
- `src/components/ChapterProgressCard.tsx`
- `src/components/SectionProgressCard.tsx`
- `src/components/EmptyState.tsx`
- `src/components/ConfirmDialog.tsx`
- `src/components/SearchBar.tsx`

`WordRow` 应保持紧凑，便于用户快速扫视大量词汇。每行显示：

- 西语单词
- 英语释义
- 词性
- 掌握状态
- 收藏按钮
- 完全掌握标记
- 快捷按钮：不认识、模糊、熟悉、完全会了

## 数据工具

建议放在：

- `src/lib/deck.ts`
- `src/lib/stats.ts`
- `src/lib/testSelection.ts`

`deck.ts`：

- `getAllWords()`
- `getWordById(id)`
- `getChapters()`
- `getSections()`
- `getSectionsForChapter(chapterId)`
- `getWordsForChapter(chapterId)`
- `getWordsForSection(sectionId)`
- `searchWords(query, filters)`
- `sortWords(words, sortMode, progressMap)`

`stats.ts`：

- `getWordStatus(word, progress)`
- `getMasteryLabel(progress)`
- `computeOverallStats(words, progressMap)`
- `computeChapterStats(chapterId, words, progressMap)`
- `computeSectionStats(sectionId, words, progressMap)`

`testSelection.ts`：

- `buildTestPool(options, words, progressMap)`
- `sampleTestWords(pool, count, samplingMode, progressMap)`
- `assignDirection(word, directionMode)`

## 自测模式

测试只做自评，不做输入题。

测试范围：

- 全部词
- 选择 Chapter
- 选择 Section
- 收藏词
- 薄弱词
- 未掌握词

测试方向：

- 西语 → 英语
- 英语 → 西语
- 混合

混合模式为每张卡片随机选择方向。

测试数量：

- 10
- 20
- 50
- 全部

抽样方式：

- 随机
- 薄弱优先

卡片流程：

1. 显示题面
2. 点击“显示答案”
3. 显示答案
4. 用户选择：不认识、模糊、熟悉
5. 使用 `applySelfGrade(..., source = "test")` 更新进度
6. 进入下一张卡片

测试结束后显示：

- 测试总数
- 标记为不认识的数量
- 标记为模糊的数量
- 标记为熟悉的数量
- 更新后的不认识、模糊、熟悉、完全会了数量
- 再测一次
- 返回测试中心
- 查看薄弱词

## 设置与隐私

设置页包含：

- 导出进度
- 导入进度
- 重置全部进度，带确认
- 数据来源 / 授权说明
- App 版本
- 隐私说明

隐私文案：

> 所有学习进度仅保存在本设备/浏览器，本应用不上传数据。

## 数据来源与授权

MVP 包含示例词库数据，仅用于验证产品体验和开发流程。

后续替换为完整 3000 词词库时，必须补充真实来源和授权信息。不要声称示例数据是经过验证的官方 3000 词词库。

建议在 `app/sources.tsx` 中预留：

- 当前示例数据说明
- 未来完整词库来源
- 授权或许可证
- 数据更新时间

## 替换为 3000 词词库

替换数据时保持 JSON 格式不变：

1. 更新 `src/data/chapters.json`
2. 更新 `src/data/sections.json`
3. 更新 `src/data/words.json`
4. 确保每个 `WordCard.chapterId` 能匹配章节
5. 确保每个 `WordCard.sectionId` 能匹配小节
6. 保持 `id` 稳定，避免用户历史进度失效
7. 运行测试、类型检查和 Web 构建

如果需要调整词库来源，应同步更新数据来源页面和本 README。

导入或替换完整词库后，先运行：

```bash
npm run validate:deck
```

校验脚本会检查：

- 每个词卡包含 `id`、`spanish`、`english`、`partOfSpeech`、`chapterId`、`sectionId` 和 `tags`
- 词卡 `id` 唯一
- 每个词卡引用的 `chapterId` 和 `sectionId` 存在
- 每个小节引用的 `chapterId` 存在
- 词卡的小节归属与章节归属一致

当前仓库中的词库仍是 MVP 示例/生成数据，用于测试应用结构和导入流程，不是权威公开 3000 词表。

## PWA 说明

应用应尽量支持手机网页体验：

- 移动端优先布局
- 底部标签导航
- 足够大的点击区域
- 紧凑但不拥挤的单词行
- 快速滚动
- 离线友好的本地数据
- 可添加到 iPhone 主屏幕

可以添加：

- 应用图标占位
- Web manifest
- 移动端 metadata

如果当前 Expo 版本中完整 service worker 配置较复杂，先保持简单可靠，并在 README 中记录后续 PWA 离线缓存增强计划。

## 未来原生应用

当前版本优先作为手机网页运行。未来发布为 iOS/Android Expo 应用时，重点替换或扩展：

- 本地存储实现，例如 AsyncStorage 或 SQLite
- 图标和启动屏
- 原生分享 / 文件导入导出体验
- 原生导航细节

业务逻辑、数据模型、纯函数和大部分 React Native 组件应尽量保持复用。

## 测试要求

必须为纯逻辑添加单元测试：

- 掌握度更新
- 状态标签
- 总体统计
- 章节和小节统计
- 测试池选择
- 抽样数量
- 混合方向分配

## 验收标准

- `npm install` 可以安装依赖
- `npm run web` 可以启动 Web 应用
- `npm run typecheck` 通过
- `npm run test` 通过
- `npm run build:web` 通过
- 可以浏览所有章节
- 可以打开小节并看到紧凑的大量单词列表
- 可以在列表中直接标记不认识、模糊、熟悉、完全会了
- 可以收藏和取消收藏
- 可以搜索词汇
- 可以按状态筛选
- 可以按全部词、章节、小节、收藏词、薄弱词或未掌握词开始自测
- 测试支持西语 → 英语、英语 → 西语、混合
- 测试不要求输入答案
- 测试只使用不认识、模糊、熟悉三个自评按钮
- 刷新浏览器后进度仍然存在
- 统计会随着标记和测试更新
- 可以导出进度 JSON
- 可以导入进度 JSON
- 手机尺寸浏览器可用

## 开发原则

- 使用 TypeScript
- 纯逻辑与 UI 分离
- 不把全部逻辑塞进页面组件
- 不重复实现状态判断
- 文件命名清晰
- 组件保持小而明确
- 提供空状态
- 处理无效路由参数
- 安全处理损坏的导入 JSON
- 单词没有进度时不崩溃
- 保持依赖最小
