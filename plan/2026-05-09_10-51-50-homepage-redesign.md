---
mode: plan
cwd: /Volumes/Code/homesite
task: 个人主页 UI 改版计划
complexity: medium
tool: mcp__sequential-thinking__sequentialthinking
tool_status: unavailable_in_current_session
total_thoughts: 7
created_at: 2026-05-09T10:51:50+08:00
---

# 个人主页 UI 改版计划

## 任务概述

目标：把当前个人主页从“markdown 介绍页”升级为一个更有品牌识别、更清晰表达 Finley Ge 个人身份的 homesite 首屏，同时保留现有轻快、个人化、博客友好的气质。

当前主页的优势是粉蓝渐变背景、Victor 手写签名、彩色下划线链接和内容驱动的亲近感。当前短板是首屏层级偏平、字体系统偏默认、导航在小屏上容易拥挤、主页缺少明确的视觉主张。

本计划只覆盖主页和全站可见的轻量视觉基础，不重写博客、搜索、内容系统和后台功能。

## 现实检查

- 当前分支：`main`
- 当前未提交变更：`.gitignore` 已有 1 行修改，本计划不触碰它。
- 当前没有 `DESIGN.md`，后续实现前建议把本计划作为临时设计依据。
- 当前没有 `plan/` 目录，本计划创建为首个计划文件。
- 本轮未使用浏览器截图验证，因为本地端口和 headless browser 在当前环境中受限；计划基于 SSR HTML、线上 HTML、源码和组件样式形成。

## 现有设计资产

| 资产 | 当前位置 | 复用方式 |
|---|---|---|
| 粉蓝渐变背景 | `projects/app/app.vue` | 保留为站点环境色，改成更细腻的纸张/天空氛围 |
| Victor 签名 Logo | `projects/app/components/LogoTitle.vue` | 保留为个人品牌标记，避免扩大到正文 |
| 彩色下划线链接 | `projects/app/components/common/ColorfulButton.vue` | 保留为站点特色交互，补充 focus/active 状态 |
| 搜索弹窗视觉语言 | `projects/app/components/BlogContentSearch.vue` | 复用其圆角、阴影、粉蓝渐变、轻 glass 质感 |
| About markdown 内容 | `projects/app/content/about/index.zh.md` 和 `index.en.md` | 继续作为详细介绍来源，主页首屏用更结构化的摘要承接 |

## 设计方向

### Aesthetic

方向：`Personal Lab Journal`

感觉：像一个认真做技术、也有审美兴趣的人留下的工作台。它应该有开发者的清晰结构，也有个人站的温度，避免泛 SaaS 营销页的模板味。

### 视觉关键词

- `sky paper`：浅天空蓝、暖白、微弱纸张颗粒
- `rose annotation`：粉色用于标题、强调、交互下划线
- `personal signature`：Victor 签名只用于站点名
- `lab notes`：技能、语言、兴趣用笔记式分组
- `quiet craft`：轻动效、少装饰、强层级

### 字体系统

推荐默认：

| 用途 | 字体 | 原因 |
|---|---|---|
| 英文 display | `Fraunces` | 有一点文学和个人气质，能让 hero 更像个人站 |
| 英文正文/UI | `Source Sans 3` | 阅读舒适，技术内容友好，比 Roboto 更少模板感 |
| 中文正文 | `Noto Sans SC` | 稳定、清晰，覆盖中文内容 |
| 签名 Logo | `victor` | 继续保留现有个性资产 |
| 代码块 | `Fira Code` | 项目已有本地字体，继续复用 |

实现建议：在 `main.css` 定义 CSS 变量和 font stack，避免在 `html *` 上强制 Roboto。

```css
:root {
  --font-display: "Fraunces", "Noto Serif SC", serif;
  --font-body: "Source Sans 3", "Noto Sans SC", sans-serif;
  --font-signature: victor, "Source Sans 3", sans-serif;
  --font-code: "Fira Code", monospace;
}
```

### 色彩系统

保留粉蓝气质，降低默认 Tailwind 色阶拼贴感。

| Token | Hex | 用途 |
|---|---:|---|
| `--color-canvas` | `#F6FBFF` | 页面浅色底 |
| `--color-canvas-warm` | `#FFF7F9` | 卡片和 highlight 背景 |
| `--color-ink` | `#172033` | 正文 |
| `--color-muted` | `#64748B` | 次级文本 |
| `--color-rose` | `#D94F86` | 主 accent |
| `--color-rose-soft` | `#F8C9DC` | 下划线、柔和状态 |
| `--color-sky` | `#8DD7F7` | 环境色和次级 accent |
| `--color-mint` | `#7AC7A4` | 成功/成长感点缀 |
| `--color-warning` | `#EAB857` | 警示 |
| `--color-error` | `#D94A4A` | 错误 |

深色模式策略：背景从纯黑改为深蓝灰，粉色降低亮度，天空蓝减少饱和，避免夜间高亮刺眼。

## 设计系统对齐

当前仓库没有 `DESIGN.md`。本计划在实现前作为临时设计系统源；实现完成并通过视觉 QA 后，应把稳定下来的字体、色彩、间距、组件规则沉淀到 `DESIGN.md`。

### Token 使用规则

| Token 类型 | 来源 | 使用规则 |
|---|---|---|
| Font | 本计划 `字体系统` | 新主页组件必须通过 CSS variables 使用，不在组件内硬编码 font-family |
| Color | 本计划 `色彩系统` | 新主页组件优先使用 `--color-*`，减少直接使用 Tailwind 默认 `pink-* / sky-*` |
| Radius | 沿用搜索弹窗层级 | 小控件 `8-12px`，卡片 `20-28px`，圆形头像/按钮 `9999px` |
| Shadow | 沿用搜索弹窗但更克制 | 只用于 identity card、contact strip、浮层；普通内容区不靠阴影分层 |
| Motion | 本计划 `动效约束` | 使用短时、低幅度、服务层级的动效 |

### 组件对齐表

| 组件/模式 | 当前状态 | 改版使用方式 |
|---|---|---|
| `LogoTitle` | Victor 签名 Logo 已有辨识度 | 保留，只调整尺寸、focus、点击语义 |
| `ColorfulButton` | 彩色下划线是站点特色 | 升级为可用于内部/外部链接的统一 inline/action pattern |
| `Button` | 粉色按钮可用但偏 Tailwind 默认 | 改为使用 rose token，并补全 focus/disabled/pressed 状态 |
| `BlogContentSearch` | 视觉成熟，有 glass、圆角、粉蓝渐变 | 作为 homepage card 和 overlay 质感参考，但主页要更轻 |
| `Avatar` | 当前只有图片和 hover scale | 升级为 identity card 的一部分，增加 alt、fallback initials、状态文案 |
| Prose components | 内容页已有粉色标题和链接 | 主页新组件不复用 markdown 标题视觉，避免继续像文章页 |

### 新组件设计契约

| 新组件 | 必须继承 | 不允许 |
|---|---|---|
| `HomeHero` | display font、brand-first 层级、rose CTA | 居中堆叠 generic hero、三 CTA 同权重 |
| `HomeIdentityCard` | glass-light surface、avatar fallback、current work | 大量 badges、社交平台 profile 卡片感 |
| `HomeNoteSection` | lab note 分组、最多 4 条重点 | 3-column feature grid、icon-in-circle 装饰 |
| `HomeContactStrip` | 温暖出口、真实链接、外链分组 | 社交按钮墙、无语义图标堆叠 |

### DESIGN.md 后续同步要求

实现完成后，如果视觉方向被采用，新增 `DESIGN.md`，至少写入：

- Product context：个人 homesite / blog / lab journal。
- Aesthetic：`Personal Lab Journal`。
- Typography：Fraunces、Source Sans 3、Noto Sans SC、victor、Fira Code。
- Color tokens：本计划定义的 `--color-*`。
- Components：Logo、inline action、identity card、lab note section、contact strip。
- Motion：3 类允许动效和 reduced-motion 规则。
- AI slop guardrails：本计划的 litmus checks。

## 信息架构

首页首屏只回答三个问题：

1. 这是谁：`Finley Ge`
2. 他做什么：`Full-stack builder across software, hardware, and AI tools`
3. 我该去哪里：`Read Blog`、`View Work`、`Contact`

页面结构：

```text
┌──────────────────────────────────────────────────────────────┐
│ Header: signature logo | Blog Link Exchange Donate Now | mode │
├──────────────────────────────────────────────────────────────┤
│ Hero                                                         │
│ ┌─────────────────────────────┐ ┌──────────────────────────┐ │
│ │ eyebrow: PERSONAL HOMESITE  │ │ avatar / status note     │ │
│ │ h1: Finley Ge               │ │ currently working on...  │ │
│ │ one-line identity           │ │ compact facts            │ │
│ │ CTA group                   │ └──────────────────────────┘ │
│ └─────────────────────────────┘                              │
├──────────────────────────────────────────────────────────────┤
│ Lab Notes: About / Stack / Interests                         │
├──────────────────────────────────────────────────────────────┤
│ Latest direction: FastGPT, blog, now page                    │
├──────────────────────────────────────────────────────────────┤
│ Contact strip                                                │
└──────────────────────────────────────────────────────────────┘
```

移动端结构：

```text
Header compact
Hero headline
Avatar/status card
Primary CTA row
Lab Notes as stacked sections
Contact strip
Footer
```

### 信息层级规格

首屏采用 `brand-first` 层级，用户扫描顺序必须稳定：

1. `Finley Ge`：页面最大文本，是第一视觉锚点。
2. 一句话身份：说明这是一个探索软件、硬件和 AI 工具的全栈开发者。
3. 主行动：`Read Blog`，让新访客快速进入最有内容密度的区域。
4. 次行动：`What I'm doing now`，给熟人或回访用户一个近况入口。
5. 低优先级行动：`Contact`，放在 CTA group 末位和页面底部 contact strip 重复出现。

如果首屏只能保留三件事，保留 `Finley Ge`、一句话身份、`Read Blog`。头像、状态卡、兴趣标签都可以下移；识别和行动优先于装饰。

### Section 任务边界

| Section | 唯一任务 | 第一视觉 | 第二视觉 | 第三视觉 |
|---|---|---|---|---|
| Header | 帮用户在站内移动 | 签名 Logo | 主导航 | 主题/语言切换 |
| Hero | 建立身份和下一步 | `Finley Ge` | 身份句 | CTA group |
| Identity card | 给个人可信度和近况 | Avatar/status | FastGPT/current work | compact facts |
| Lab Notes | 展示个人轮廓 | About | Stack | Interests/Languages |
| Latest direction | 把访客引向高价值内容 | Blog/Now headline | 简短说明 | 入口按钮 |
| Contact strip | 提供联系出口 | Email/GitHub | Mastodon | 中文平台链接 |

每个 section 只允许一个主标题和一个主要动作。需要展示更多内容时，用折叠、链接或下移处理，避免首屏变成信息墙。

### 导航流

```text
Home
├─ Read Blog → /blog → blog detail → back to /blog
├─ What I'm doing now → /now
├─ Contact → mailto / external profiles
├─ Header nav: Blog / Link Exchange / Donate / Now
└─ Logo → Home
```

导航原则：

- 首页 CTA 和 header nav 可以重复，但 CTA 使用更强视觉权重。
- `Donate` 在主页 hero 中不作为主 CTA，避免个人介绍第一屏出现交易感。
- `Link Exchange` 保留在 header 中，属于探索型入口，不进入首屏主叙事。
- 外部链接在 contact strip 中分组，避免散落在正文段落里造成阅读断裂。

## 内容策略

### 英文 hero copy

```text
PERSONAL HOMESITE
Finley Ge
Full-stack builder exploring software, hardware, and AI-native tools.
Keep learning, keep coding, keep thinking.
```

CTA：

- `Read Blog`
- `What I'm doing now`
- `Contact`

### 中文 hero copy

```text
个人主页
Finley Ge
正在探索软件、硬件与 AI 工具的全栈开发者。
keep learning, keep coding, keep thinking.
```

CTA：

- `读博客`
- `看看此刻`
- `联系我`

### 内容保留

- 保留 ZJUT、FastGPT、INTJ-A、古典音乐、京剧、SC2、技能、语言、联系方式。
- 把这些信息从纯列表转换为 `Lab Notes`，每组最多 4 条，信息更像个人档案卡。
- 联系方式保留 GitHub、Email、Mastodon、知乎、BiliBili。

## 用户旅程与情绪弧

目标体验：访客应该感觉“这是一个真实的人在认真做东西”，同时知道下一步该点哪里。情绪不是热闹营销，而是清晰、轻快、有一点个人温度。

### 旅程 storyboard

| Step | 用户做什么 | 用户应该感到 | 计划如何支撑 |
|---|---|---|---|
| 1 | 打开首页 | “我知道这是谁” | `Finley Ge` 是最大文字，签名 Logo 作为个人标记，背景柔和不抢信息 |
| 2 | 扫描第一屏 | “这个人做技术，也有自己的审美” | 身份句直接说明 software/hardware/AI tools，视觉使用 lab journal 而非 SaaS 模板 |
| 3 | 看头像和状态卡 | “这是活着的站，不是静态名片” | identity card 展示 avatar、FastGPT/current work、compact facts |
| 4 | 决定下一步 | “我可以先读内容，也可以看近况或联系” | CTA 优先级为 Blog → Now → Contact，减少选择压力 |
| 5 | 下滑看 Lab Notes | “我更了解这个人的技术栈和兴趣” | About/Stack/Interests/Languages 分区，每组最多 4 条 |
| 6 | 到达联系区 | “如果我想交流，有清楚出口” | contact strip 聚合 Email/GitHub/Mastodon/中文平台 |
| 7 | 回访 | “我知道去哪里看更新” | Blog 和 Now 在 header 与 CTA 中持续可见 |

### 时间尺度设计

| 时间尺度 | 设计目标 | 成功信号 | 需要避免 |
|---|---|---|---|
| 前 5 秒 | 识别身份和主行动 | 用户能说出“这是 Finley 的个人站，可以读博客” | 首屏信息墙、装饰抢标题、CTA 太多 |
| 前 5 分钟 | 建立可信度和兴趣 | 用户读到一篇博客、点开 Now，或通过 Contact 找到出口 | 纯自我介绍没有路径、外链散落、导航挤压 |
| 5 年关系 | 成为可回访的个人档案 | 老访客知道 Blog/Now 是更新入口，主页审美仍不过时 | 过度趋势化、重动画、依赖短期流行视觉 |

### 情绪节奏

```text
calm arrival → quick recognition → small personal delight → focused exploration → warm exit
```

实现约束：

- `calm arrival`：背景提供氛围，不使用高对比大面积装饰。
- `quick recognition`：首屏文字层级比卡片、头像、标签都更强。
- `small personal delight`：只允许 2-3 个记忆点，例如 Victor 签名、rose underline、轻微纸张纹理。
- `focused exploration`：主 CTA 不超过 3 个，且视觉权重有主次。
- `warm exit`：联系区文案像邀请交流，不像社交账号堆叠。

## 执行计划

### Scope reduction 决策

`/plan-eng-review` 决定收窄首个实现 PR，先交付主页核心体验，避免一次性触碰全站导航和通用按钮体系。

首 PR 范围：

- `projects/app/assets/styles/main.css`：新增设计 token、字体栈、focus 基础样式，保持现有页面兼容。
- `projects/app/pages/index.vue`：从 markdown renderer 改为结构化主页入口，负责数据查询、fallback、locale 文案拼装。
- `projects/app/i18n/i18n.config.ts`：新增主页文案。
- `projects/app/components/home/HomeHero.vue`
- `projects/app/components/home/HomeIdentityCard.vue`
- `projects/app/components/home/HomeNoteSection.vue`
- `projects/app/components/home/HomeContactStrip.vue`
- `projects/app/content/about/index.zh.md` 和 `index.en.md`：修正联系方式段落语义。

首 PR 不做：

- 不重构 `ToolBar.vue`、`LogoTitle.vue`、`Button.vue`、`ColorfulButton.vue`。
- 不把全站 header 改成新的 responsive rail。
- 不新增完整 `DESIGN.md`。
- 不调整博客列表、Now、Donate、Link Exchange 页面。

这些后续工作已在 `NOT in scope` 中明确延后。实现时可以在新主页组件内使用真实 `NuxtLink` / `<a>` 保证主页 CTA 可访问，而不需要先改全站 `ColorfulButton`。

### 1. 建立设计 token

修改：

- `projects/app/assets/styles/main.css`

动作：

- 替换全局 `Roboto` 强制字体。
- 增加 `:root` 和 `.dark` 颜色变量。
- 增加 `body` 背景和基础文本样式。
- 增加可复用的 focus ring 样式。
- 保留 Tailwind import 和 dark custom variant。

验收：

- 全站正文使用新的 body font stack。
- 代码块继续使用 Fira Code。
- 深浅色模式都有足够对比度。

### 2. 重构主页为结构化 layout

修改：

- `projects/app/pages/index.vue`
- `projects/app/i18n/i18n.config.ts`

动作：

- 增加本地化的 `home` 文案对象。
- 首页从单个 `ContentRenderer` 改为结构化 section。
- 继续读取 `about` collection，作为 fallback 或详细内容来源。
- 增加 loading、empty、error 风格展示。

验收：

- 首屏有明确 h1、身份说明和 CTA。
- 无内容数据时仍有温暖 fallback。
- 中文和英文首页都完整可读。

### 3. 新增主页组件

新增：

- `projects/app/components/home/HomeHero.vue`
- `projects/app/components/home/HomeIdentityCard.vue`
- `projects/app/components/home/HomeNoteSection.vue`
- `projects/app/components/home/HomeContactStrip.vue`

组件职责：

| 组件 | 职责 |
|---|---|
| `HomeHero` | 首屏标题、身份、CTA、主视觉构图 |
| `HomeIdentityCard` | 头像、当前工作、快速事实 |
| `HomeNoteSection` | About、Skills、Interests、Languages 分组 |
| `HomeContactStrip` | 联系入口与外部链接 |

验收：

- 组件只负责展示，不做复杂数据查询。
- 主页逻辑留在 `pages/index.vue`。
- 样式沿用 CSS variables 和 Tailwind utility。

### Architecture Review 决策

Scope：`SCOPE_REDUCED`。首 PR 控制在主页核心和必要 token/a11y 内，不重构全站 header/button。新增文件数仍然合理，因为 4 个 home 组件都是纯展示组件，不引入 service、store、API 或新基础设施。

#### 数据流

```text
/ or /zh
  │
  ├─ pages/index.vue
  │   ├─ useI18n().locale
  │   ├─ useAsyncData('home-about', queryCollection('about').where(...).all())
  │   ├─ selectedAbout = aboutContents.find(meta.locale === locale)
  │   ├─ home copy = i18n messages.home
  │   └─ link model = localePath('/blog' | '/now' | ...)
  │
  ├─ HomeHero
  │   └─ receives text + CTA links as props
  ├─ HomeIdentityCard
  │   └─ receives avatar/current work/facts as props
  ├─ HomeNoteSection
  │   └─ receives normalized note groups as props
  └─ HomeContactStrip
      └─ receives contact links as props
```

Boundary rule：只有 `pages/index.vue` 查询 content 和拼装 locale-aware route；`components/home/*` 只接收 props 并渲染 UI。这样避免每个组件都知道 Nuxt Content、i18n 和路由细节。

#### Framework built-ins search check

- [Layer 1] Nuxt 官方 `useAsyncData` 已处理 SSR 数据、payload hydration、`status/error/refresh` 等状态；首 PR 继续使用它，不自建 fetch/cache 层。
- [Layer 1] Nuxt 官方文档说明默认 `useAsyncData` 会服务 SSR 并把结果传给客户端；如果需要真正的非阻塞 loading UI，才使用 `useLazyAsyncData`。本主页内容来自本地 content，SSR 优先更合适。
- [Layer 1] Nuxt i18n 提供 `useLocalePath` 和 `<NuxtLinkLocale>` 处理本地化内部链接；首 PR 使用内建能力，不自建 locale route helper。

#### Loading 状态工程解释

计划里的 skeleton 是兜底状态，不是首屏主路径。实现默认使用 `await useAsyncData` 保持 SSR 产物完整；只有 `status === 'pending'` 且客户端刷新/重新执行时显示 skeleton。初始 SSR 失败走错误状态，collection 为空走空状态。

#### 生产失败模式

| Codepath | 可能失败方式 | Plan 是否覆盖 | 用户看到什么 |
|---|---|---|---|
| `queryCollection('about')` | content collection 返回空数组 | 已覆盖 | 温暖空状态 + Blog/Now 出口 |
| `queryCollection('about')` | 查询异常或 payload 异常 | 已覆盖 | 错误状态 + Try again/Blog/Now |
| locale 切换 | 当前 locale 找不到 about 内容 | 已覆盖 | 英文 fallback 或默认介绍 |
| avatar 图片 | GitHub avatar 加载失败 | 已覆盖 | `FG` initials avatar |
| CTA links | locale route 解析错误 | 部分覆盖 | 使用 `localePath` 或 `<NuxtLinkLocale>`；实现时需要测试 |
| font loading | 外部字体慢或失败 | 部分覆盖 | fallback 字体显示；视觉略降级 |
| generated static page | prerender 缺路由或 payload 错误 | 验证计划覆盖 | `bun --cwd=projects/app run generate` 必须通过 |

Critical architecture gaps：`0`。当前没有需要新增服务、API、store 或持久化状态的理由。

### Code Quality Review 决策

Issues found：`0` blocking。当前计划的组件拆分合理，复杂度主要来自视觉表达，不来自业务逻辑。实现时按下面 guardrails 控制代码质量，避免主页从“结构化 layout”滑向一次性堆模板。

#### 模块边界

| Area | Rule | Reason |
|---|---|---|
| `pages/index.vue` | 只负责 content 查询、locale 选择、fallback 数据、route model 拼装 | 页面层是唯一知道 Nuxt Content、i18n、路由的地方 |
| `components/home/*` | 只接收 props 并渲染，不调用 `queryCollection`、`useI18n`、`useRoute` | 保持组件可读、可替换，避免隐藏依赖 |
| i18n copy | 所有用户可见主页文案进 `messages.home` | 中英文首屏同步，避免硬编码分叉 |
| link model | 内部链接用 `localePath` 生成，外链保留真实 `href` | 可访问、可复制、可被静态生成验证 |
| content fallback | 通过 small computed normalize，不新增 store/service | 这是单页面展示需求，YAGNI 不需要共享状态层 |

#### Type contract

首 PR 可以在组件内定义局部 props type；只有出现第二个消费者时再抽到共享 types 文件。

```ts
type HomeCta = {
  label: string;
  href: string;
  kind: "primary" | "secondary" | "quiet";
  external?: boolean;
};

type HomeNoteGroup = {
  title: string;
  items: string[];
};

type ContactLink = {
  label: string;
  href: string;
  platform: string;
  external: true;
};
```

#### Error handling guardrails

- 空 content、查询异常、locale 缺失、头像失败、外链缺失都必须走用户可见 fallback。
- 缺失数据不渲染空 badge、空标题或 disabled dead link。
- `console.warn` 只用于开发可诊断信息，UI 文案只说明影响和下一步。
- `eslint --fix` 会修改文件；实现后运行 lint 需要检查 diff，确保自动修复没有改坏 Vue template。

#### ASCII diagram comments

当前实现不需要在代码里写内联 ASCII 图。数据流已在 plan 中覆盖，组件本身应保持简单；如果实现时新增复杂状态机或多步 pipeline，再把图放到对应文件注释中。

### Test Review 决策

Test framework detection：当前仓库没有 `CLAUDE.md` testing section，没有 `jest` / `vitest` / `playwright` / `cypress` 配置，也没有 `test` / `tests` / `spec` / `e2e` 目录。`projects/app/package.json` 只有 `lint`、`generate`、`build`、`dev` 等脚本，没有 test script。

按 `/plan-eng-review` 规则，本次不在首 PR 内顺手搭建完整测试框架；首 PR 的 gate 是 `lint + static generate + browser QA`。自动化测试覆盖率会保持为 0，这是工程债务，但对这个纯静态主页改版不是 silent critical gap。

#### Code path coverage

```text
CODE PATH COVERAGE
==================
[+] projects/app/pages/index.vue
    |
    ├── [GAP] useAsyncData about query success
    |          Required: generate / and /zh, both render hero + notes
    ├── [GAP] about collection empty
    |          Required: force empty/fallback path during implementation QA
    ├── [GAP] about query error
    |          Required: force error state or stub failure during browser QA
    ├── [GAP] locale-specific about match
    |          Required: / uses English, /zh uses Chinese
    ├── [GAP] locale missing fallback
    |          Required: missing translation never renders raw key
    └── [GAP] link model
               Required: Blog/Now internal links use locale-aware paths

[+] projects/app/components/home/HomeHero.vue
    |
    ├── [GAP] primary CTA render + focus state
    ├── [GAP] secondary CTA render + focus state
    └── [GAP] reduced-motion entrance behavior

[+] projects/app/components/home/HomeIdentityCard.vue
    |
    ├── [GAP] avatar success path
    ├── [GAP] avatar failure fallback initials
    └── [GAP] missing optional facts hidden cleanly

[+] projects/app/components/home/HomeNoteSection.vue
    |
    ├── [GAP] all note groups render
    └── [GAP] empty group omitted without layout hole

[+] projects/app/components/home/HomeContactStrip.vue
    |
    ├── [GAP] external href + rel attributes
    └── [GAP] mobile stacked layout remains readable

[+] projects/app/content/about/index.zh.md + index.en.md
    |
    └── [GAP] BiliBili/contact paragraph stays inside semantic paragraph

AUTOMATED COVERAGE: 0/17 paths
REQUIRED VALIDATION: 17/17 paths via lint, generate, and browser QA
CRITICAL SILENT GAPS: 0
```

#### User flow coverage

```text
USER FLOW COVERAGE
==================
[+] First visit /
    ├── [GAP] [->E2E later] user understands identity within 5 seconds
    ├── [GAP] [->E2E later] Read Blog goes to localized blog route
    └── [GAP] keyboard Tab order follows visual order

[+] First visit /zh
    ├── [GAP] Chinese hero copy renders
    ├── [GAP] Chinese CTA labels render
    └── [GAP] no long English text causes horizontal overflow

[+] Returning visitor
    ├── [GAP] Now CTA remains available
    ├── [GAP] dark mode keeps contrast
    └── [GAP] prefers-reduced-motion removes shimmer/translate

[+] Contact intent
    ├── [GAP] email/GitHub/Mastodon/Zhihu/BiliBili links are real anchors
    └── [GAP] external links open safely with rel attributes

AUTOMATED E2E COVERAGE: 0/11 flows
BROWSER QA REQUIRED: 11/11 flows
```

#### Test requirements for implementation

| Gate | Command / action | Must prove |
|---|---|---|
| Lint | `bun --cwd=projects/app run lint` | Vue, TS, style conventions pass; inspect auto-fix diff |
| Static generate | `bun --cwd=projects/app run generate` | `/`, `/zh`, `/blog`, `/now` and content payloads build |
| Browser QA | desktop `1440x1000`, tablet `768x1024`, phone `390x844`, narrow `360x740` | no overflow, readable hierarchy, CTA works |
| Keyboard QA | Tab through header, CTA, notes, contact links | focus visible and order matches spec |
| State QA | force empty/error/avatar failure states | user sees fallback, not blank page |
| Theme/locale QA | switch dark/light and en/zh | no raw i18n keys, no low-contrast text |

If the repo later adopts test infrastructure, the first useful automated suite is Playwright at `projects/app/e2e/home.spec.ts`, covering `/`, `/zh`, CTA hrefs, keyboard order, dark mode, and avatar fallback. That is a separate infra task, not part of the narrowed homepage PR.

#### Failure mode coverage audit

| Codepath | Production failure | Handling in plan | Test/QA coverage | Silent? |
|---|---|---|---|---|
| Content query | collection empty | warm empty state | state QA | No |
| Content query | query/payload error | visible error state + Blog/Now | state QA | No |
| Locale copy | missing key | English/default fallback | locale QA | No |
| Internal CTA | wrong localized route | `localePath` / `NuxtLink` | generate + browser QA | No |
| External CTA | missing href | hide link | browser QA | No |
| Avatar | image 404/slow | initials fallback | state QA | No |
| Fonts | custom font unavailable | fallback font stack | generate + visual QA | No |
| Motion | reduced-motion user preference | static fallback | browser QA | No |

Critical test gaps：`0`。There are many missing automated tests because no test runner exists, but each user-visible failure path has a planned manual or build verification gate.

### Performance Review 决策

Issues found：`1` resolved in plan。The only meaningful performance risk is typography assets; the page itself is static, content-backed, and has no N+1/API/database path.

#### Font loading decision

当前仓库只包含 `projects/app/public/fonts/firacode.ttf` 和 `projects/app/public/fonts/victor.ttf`。Fraunces、Source Sans 3、Noto Sans SC 还不是本地资产。

首 PR 规则：

- 不从 Google Fonts 或其他远程 CSS 运行时拉字体。
- 如果实现时加入 Fraunces / Source Sans 3，必须以本地 `woff2` 资产提交，并使用 `font-display: swap`。
- 如果本轮不提交字体资产，CSS variables 仍然保留设计意图，但实际 stack 使用系统 serif/sans fallback，视觉 QA 时记录差异。
- 中文字体优先走系统 fallback，不打包完整中文字体文件，避免首屏资产暴涨。

#### Runtime performance guardrails

| Area | Decision | Why |
|---|---|---|
| Data | `await useAsyncData` with Nuxt payload | SSR-first，避免客户端二次 loading |
| Cache | 不新增自定义 cache | 本地 Nuxt Content 已足够 |
| JS | home components 纯展示 | 避免新增 client state 和 watchers |
| Images | avatar 保留固定尺寸和 fallback | 降低 CLS，图片失败不影响布局 |
| Animation | 只用 opacity / small translate | 不触发布局抖动，reduced motion 可关闭 |
| CSS | token + utility，不引入 UI library | 保持 bundle 和维护面小 |

Performance critical gaps：`0`。

### 4. 全站 header 深度打磨（后续 PR）

修改：

- `projects/app/components/ToolBar.vue`
- `projects/app/components/LogoTitle.vue`
- `projects/app/components/common/Button.vue`
- `projects/app/components/common/ColorfulButton.vue`

后续动作：

- 保留现有导航项目。
- 移动端将导航横向滚动优化为更稳定的 compact rail。
- 给图标按钮和文字链接增加可见 focus 状态。
- `ColorfulButton` 使用真实 `href` 支持外链、键盘和复制链接。
- 修正下划线层级，让文字始终在彩条上方。

后续验收：

- 所有可点击元素键盘可达。
- 触摸目标不小于 44px。
- 小屏不出现导航挤压主体内容。

### 5. 修正内容语义

修改：

- `projects/app/content/about/index.zh.md`
- `projects/app/content/about/index.en.md`

动作：

- 修正联系方式结尾，让 BiliBili 保持在段落内。
- 确认中文标点与英文标点各自自然。
- 保留原有 hover comment 和 colorful link 语法。

验收：

- SSR HTML 中 BiliBili 不再落到段落外。
- 主页和 about 内容都保持语义完整。

## 交互状态覆盖

| Feature | Loading | Empty | Error | Success | Partial |
|---|---|---|---|---|---|
| About content | hero skeleton + soft shimmer | 显示默认自我介绍和 Blog CTA | 显示“内容暂时没加载出来”加重试/Blog CTA | 渲染完整主页 | 缺少某组资料时隐藏该组 |
| Avatar | initials circle | initials circle | initials circle + subtle border | GitHub avatar | 图片慢加载时先显示 initials |
| CTA links | disabled visual only during route pending | 不适用 | 外链失败由浏览器处理 | hover/focus/active 明确 | 外链缺失时隐藏该 CTA |
| Theme toggle | 保持当前系统偏好 | 不适用 | localStorage 不可用时仍可临时切换 | icon 和 aria label 同步 | SSR 初始状态避免闪烁 |
| Locale toggle | 保持当前 locale | fallback English | locale 数据缺失时回退英文 | 文案完整切换 | 某条翻译缺失时使用英文 |

### 用户可见状态规格

状态设计原则：主页不能把技术错误暴露成冷冰冰的空白。任何失败都要保留身份识别、一个可继续探索的入口，以及一句说明当前发生了什么。

| 状态 | 用户看到什么 | 主行动 | 视觉处理 |
|---|---|---|---|
| 首次加载 | `Finley Ge` 的 skeleton 字形占位、柔和头像圆、CTA 占位条 | 暂无，避免误点 | 使用低对比 rose/sky shimmer；`prefers-reduced-motion` 下改为静态占位 |
| About collection 为空 | `Still setting up this note.` + 默认身份句 + Blog CTA | `Read Blog` | 温暖空状态卡，使用签名 Logo 小标记，不显示“no data” |
| About collection 查询失败 | `The homepage note did not load, but the site is still here.` | `Read Blog` + `Try again` | 轻 warning 色边框，保留 hero 背景和 header，错误不占满屏 |
| 头像加载失败 | `FG` initials avatar | 无 | 圆形 initials，rose-soft 背景，保留 hover/focus 行为 |
| 外链缺失 | 不渲染该链接 | 无 | 不显示 disabled 外链，避免用户点到死路 |
| 路由跳转中 | CTA 轻微压低/显示 active ring | 当前 CTA | 不使用全屏 loading，站点很轻，保持页面稳定 |
| 本地化缺失 | 当前 locale 可用内容 + 英文 fallback | 继续浏览 | 不显示 key 名；缺失项在 dev console 可 warning |
| 深色模式初始化 | 使用系统偏好，避免白闪 | 无 | SSR class 与 color-mode 保持一致；切换时只过渡颜色 |

### 空状态文案

英文：

```text
Still setting up this note.
The homepage introduction is taking a detour, but the blog is ready.
```

中文：

```text
这页笔记还在整理中。
主页介绍暂时没准备好，但博客可以先逛逛。
```

空状态必须包含 `Read Blog / 读博客` 主按钮和 `What I'm doing now / 看看此刻` 次按钮。这样即使内容系统异常，用户仍能继续探索，而不是被一个空页面挡住。

### 错误状态文案

英文：

```text
The homepage note did not load.
You can still read the blog or check what I'm doing now.
```

中文：

```text
主页笔记暂时没有加载出来。
你仍然可以先读博客，或看看我最近在做什么。
```

错误状态不展示堆栈、接口名或 collection 名称；这些只进入 console。用户界面只解释影响和下一步。

## 响应式规格

| Viewport | Layout | Header | Hero | Notes |
|---|---|---|---|---|
| `>= 1024px` | 12 列感知，内容最大宽 `72rem` | logo 左，nav 居中，controls 右 | 左文案右 identity card | note section 可 2 列 |
| `768px - 1023px` | 单列为主，局部双列 | nav 保持横向，可滚动 | hero 上下结构 | note section 2 列或 stacked |
| `< 768px` | 单列，边距 16px | compact rail，controls 保持 44px | h1 优先，card 下移 | 所有 section stacked |
| `< 390px` | 最小手机适配 | 导航允许横滑 | CTA 可换行 | 避免长英文撑宽 |

### 断点行为细则

| 断点 | Header 具体行为 | Hero 具体行为 | 内容区具体行为 |
|---|---|---|---|
| `>= 1024px` | 三段式布局：Logo 固定左侧，导航居中，主题/语言固定右侧 | 视觉上左右不对称，文本列约 `58%`，identity card 约 `32%` | `Lab Notes` 两列，Contact strip 横向 |
| `768px - 1023px` | Logo 和 controls 保持两端，导航可换到第二行或保持横向滚动 | 文本在上，identity card 在下，最大宽不超过正文列 | `Lab Notes` 可两列；如果内容长度不均，使用单列 |
| `< 768px` | Header 高度允许增长，不固定 `h-10`；导航成为横向 rail，左右有 fade 提示可滚动 | `Finley Ge` 优先，CTA 可换行；identity card 下移且宽度 100% | Section 间距加大，避免一屏像列表压缩 |
| `< 390px` | Logo 可缩小，controls 不小于 44px；导航标签允许短文案 | h1 使用 `clamp()`，不截断姓名；CTA 垂直排列 | 长英文和 URL 必须 `overflow-wrap:anywhere` |

### 移动端导航规则

- 不默认使用 hamburger；这个站点导航项少，横向 rail 更直接。
- rail 必须支持触摸滑动、键盘 Tab 顺序和可见 focus。
- 当前页用 rose underline 或 soft pill 表示，不只靠颜色。
- 主题和语言按钮始终可见，不放进折叠菜单。
- Header 不覆盖内容，不使用 fixed header，避免小屏可视高度被吃掉。

## 可访问性规格

- 页面只保留一个可见 `h1`。
- Markdown 标题前的 `#` 如保留，应设为装饰语义，避免屏幕阅读器重复读。
- Avatar 增加 `alt` 文案，例如 `Finley Ge avatar`。
- 所有按钮和链接有 `aria-label` 或可读文本。
- 外链使用真实 `<a href>`，内部导航使用 `NuxtLink`。
- focus ring 明显，颜色与背景对比达标。
- 文字和背景对比至少满足 WCAG AA。
- 动效尊重 `prefers-reduced-motion`。

### 键盘顺序

Tab 顺序必须与视觉阅读顺序一致：

```text
Logo → Blog → Link Exchange → Donate → Now → Theme toggle → Locale toggle
→ Read Blog → What I'm doing now → Contact
→ Identity card link if interactive
→ Lab Notes links
→ Contact strip links
→ Footer hidden admin trigger remains mouse-only or gains explicit accessible label
```

要求：

- 所有 focus 状态至少 `2px` 可见 ring，使用 `--color-rose` 或高对比 fallback。
- `ColorfulButton` 的 focus 状态不能只依赖 hover underline；键盘 focus 也要显示 underline 或 outline。
- disabled/hidden 状态不能进入 Tab 顺序。

### 语义与屏幕阅读器

| 区域 | 语义要求 |
|---|---|
| Header | 使用 `<header>` + `<nav aria-label="Primary">` |
| Main | 使用 `<main>` 包住主页主体，首屏 h1 唯一 |
| Hero CTA | 内部链接用 `NuxtLink`，外链用 `<a>`；链接文本自身要可理解 |
| Identity card | 如果整卡可点击，需要单一明确链接；如果只有头像可点，头像链接需有 `aria-label` |
| Lab Notes | 使用 section + heading，不用无语义 div 列表堆内容 |
| Contact strip | 外链说明目标平台；外链可加 `rel="noopener noreferrer"` |
| Theme toggle | `aria-label` 随当前状态变化，例如 `Switch to dark mode` |
| Locale toggle | `aria-label` 写目标语言，例如 `Switch language to Chinese` |

### 对比度与触摸目标

- 正文和背景对比至少 `4.5:1`。
- 大标题和装饰性大字至少 `3:1`。
- focus ring 和相邻背景至少 `3:1`。
- 所有可点目标最小 `44px x 44px`，inline text link 例外，但周围文本不能影响点击准确性。
- rose underline 不能作为唯一状态表达；active/focus 需配合形状、粗细或背景变化。
- 深色模式中 `--color-rose` 和 `--color-sky` 需要单独调暗/降饱和，避免霓虹感。

### Reduced motion

当用户启用 `prefers-reduced-motion`：

- 禁用 hero entrance translate，只保留静态 opacity 或直接显示。
- 禁用 skeleton shimmer，改为静态占位块。
- hover/focus 不使用位移，只使用颜色、下划线或 outline。
- 页面切换的 blur transition 关闭或降到 `opacity 100ms`。

## AI Slop 防线

- 首屏不使用三栏 feature card。
- 不使用紫色渐变作为默认方案。
- 不使用“Unlock the power of”这类泛营销文案。
- 卡片只用于身份信息和联系入口，不把所有内容都塞进同款大圆角卡片。
- 第一屏按 poster composition 设计，品牌和身份优先。
- 每个 section 只做一件事。

### UI 分类

分类：`HYBRID`

- Hero 和联系区按 landing page 规则处理：品牌优先、构图优先、行动清楚。
- Lab Notes 和状态卡按 app/info UI 规则处理：信息密度可读、少装饰、强分组。
- 博客与内容入口按已有站点模式处理：延续文章阅读体验，避免另起一套视觉语言。

### 首屏视觉锚点

唯一强视觉锚点：大号 `Finley Ge` 排版 + 右侧偏移的 identity card。

实现规则：

- `Finley Ge` 必须是首屏最大元素，字号在桌面端至少是正文的 4 倍。
- identity card 只能作为第二视觉，不允许比标题更抢眼。
- 头像尺寸适中，避免变成社交平台 profile page。
- 背景纹理只提供氛围，透明度保持低，不能与文字竞争。
- hero 不使用多卡片 mosaic，不使用 icon-in-circle 装饰。

### Litmus checks

实现前后都必须逐条回答：

| Check | 目标答案 | 失败时处理 |
|---|---|---|
| 首屏是否 5 秒内知道这是 Finley 的个人站？ | YES | 放大姓名、压缩副信息 |
| 是否只有一个强视觉锚点？ | YES | 删除抢眼卡片、图标或装饰 |
| 只扫标题能否理解页面？ | YES | 重写 section 标题，让标题承担语义 |
| 每个 section 是否只有一个任务？ | YES | 拆分或删除多余行动 |
| 卡片是否真的承载交互或分组？ | YES | 纯装饰卡片改为普通排版 |
| 动效是否帮助层级或氛围？ | YES | 删除不服务阅读的动效 |
| 去掉阴影后是否仍然高级？ | YES | 依靠排版、间距、颜色，而不是 shadow 堆质感 |

### 动效约束

允许 3 类动效：

1. 页面进入：hero 文本轻微上移淡入，`150-250ms`。
2. 链接 hover/focus：rose underline 高度或透明度变化，`80-140ms`。
3. identity card：悬停时只做 `translateY(-2px)` 或轻微光感，不做 3D 翻转。

禁止：

- 视差大图。
- 滚动触发的连续复杂动画。
- 所有卡片统一弹跳。
- 主题切换时全页面大幅 blur 或 scale。

### Copy slop 检查

禁用泛化句式：

- `Welcome to my homepage`
- `Explore my journey`
- `Passionate developer`
- `Building the future`
- `Your gateway to...`

推荐具体表达：

- `Full-stack builder exploring software, hardware, and AI-native tools.`
- `Currently working on FastGPT.`
- `Notes on systems, tools, and the odd detour.`

文案原则：能用一个具体名词替代抽象形容词时，使用具体名词。能删除 30% 而不损失信息时，继续删除。

## 非目标

| 项目 | 原因 |
|---|---|
| 重写博客列表页 | 本次目标是主页，博客已有搜索和列表体系 |
| 改内容系统模型 | 当前 markdown/content collection 足够支撑 |
| 新增大型动画系统 | 个人站应轻量，避免性能和维护成本 |
| 改 donate/link-exchange/now 页面信息架构 | 属于后续全站设计系统同步 |
| 引入大型 UI 组件库替换现有组件 | 现有 Nuxt/Tailwind/Vue 模式已经够用 |

## 风险与注意事项

| 风险 | 影响 | 应对 |
|---|---|---|
| 字体加载影响性能 | 首屏文字闪动或包体变大 | 控制 2 个主字体，使用 `font-display: swap` |
| 中文字体和英文 display 不协调 | 中英切换割裂 | 中英分别指定 fallback，实际视觉 QA 后微调 |
| 主页内容与 markdown 重复 | 维护成本上升 | hero 文案放 i18n，详细介绍继续放 markdown |
| Header 小屏复杂度 | 首屏压迫感 | compact rail 和 44px controls 优先 |
| 深色模式粉色过亮 | 夜间刺眼 | dark token 单独调色，降低 saturation |

## 验证计划

### 自动验证

- 运行 `bun --cwd=projects/app run lint`
- 运行 `bun --cwd=projects/app run generate`
- 检查生成的 `/`, `/zh`, `/blog` 是否成功 prerender。
- 注意 `lint` 脚本当前是 `eslint --fix`，运行后必须检查 diff，确认自动修复只改变预期格式。
- 当前没有自动测试框架；测试覆盖按 `Test Review 决策` 的 coverage diagram 通过 generate 和 browser QA 验证。

### 手动视觉验证

- 桌面：`1440x1000`
- 笔记本：`1280x800`
- 平板：`768x1024`
- 手机：`390x844`
- 极窄手机：`360x740`

检查点：

- 5 秒内能知道这是 Finley 的个人站。
- 头像、标题、身份、CTA 的阅读顺序清楚。
- 导航不遮挡、不挤压、不产生横向页面滚动。
- 深浅色模式都自然。
- hover、focus、active 状态可见。
- 中文和英文都没有布局溢出。

### 可访问性验证

- Tab 顺序：Logo、导航、主题、语言、主页 CTA、内容链接。
- 屏幕阅读器结构：header、main、footer landmark 清楚。
- 图片 alt、按钮 aria-label、外链 href 完整。
- `prefers-reduced-motion` 下动效减少。

## 设计完成标准

| 维度 | 当前估计 | 完成目标 |
|---|---:|---:|
| 信息架构 | 5/10 | 9/10 |
| 视觉识别 | 6/10 | 9/10 |
| 字体系统 | 4/10 | 8/10 |
| 交互状态 | 5/10 | 8/10 |
| 响应式 | 6/10 | 9/10 |
| 可访问性 | 5/10 | 8/10 |
| AI slop 风险 | 7/10 | 9/10 |

完成后的主页应该像一个“个人实验室入口”，首屏有清楚身份、明显行动入口、轻微但真实的个人审美，同时和博客阅读体验保持一致。

## What already exists

| Existing pattern | Keep / change | Why |
|---|---|---|
| 粉蓝渐变 shell | Keep, refine | 这是站点当前最明显的环境氛围，改版只需要更细腻 |
| Victor 签名 Logo | Keep | 它是最有个人识别度的资产 |
| 彩色下划线链接 | Keep, make accessible | 它比普通按钮更像个人站，但需要键盘 focus 和真实 href |
| Blog search glass panel | Reuse as quality bar | 它已经有圆角、阴影、粉蓝渐变和浮层层级，可作为新卡片质感参考 |
| Markdown prose components | Keep for content pages | 主页新组件要避免继续像文章页，内容页则继续沿用 prose 视觉 |

## NOT in scope

| Deferred decision | Rationale |
|---|---|
| 全站完整设计系统改造 | 本次先把主页改版落地，避免一次性牵动博客、捐赠、友链和 Now 页面 |
| 博客列表视觉重做 | 博客列表已有标签、归档、搜索等复杂交互，适合单独计划 |
| 新增复杂动效/scroll choreography | 个人站需要轻快和长期耐看，重动效会增加维护和性能风险 |
| 新增新内容模型 | 当前 Nuxt Content markdown 已足够支撑主页摘要和详细介绍 |
| 立即创建完整 `DESIGN.md` | 先用本计划约束实现，视觉 QA 稳定后再沉淀成设计系统文档 |
| 首 PR 内搭建完整测试框架 | 当前仓库没有 test runner；本轮用 lint、generate、browser QA 作为 gate，测试基础设施单独评估 |
| 运行时远程字体加载 | 会引入外部依赖和首屏性能不确定性；字体资产必须本地提交或使用 fallback |

## 未决设计决策

| Decision | Resolution | If deferred, what happens |
|---|---|---|
| 首屏主行动是什么 | `Read Blog` 为主 CTA，`Now` 次之，`Contact` 末位 | 三个按钮同权重会削弱下一步 |
| 移动端导航模式 | 使用横向 rail，不默认 hamburger | hamburger 会隐藏少量但重要的站内入口 |
| Hero 视觉锚点 | 大号 `Finley Ge` + 第二视觉 identity card | 头像或卡片过强会变成普通 profile page |
| 字体方向 | Fraunces + Source Sans 3 + Noto Sans SC + victor | 继续 Roboto 会维持默认工具感 |
| 空/错状态 | 保留身份识别和 Blog/Now 出口 | 空白或技术错误会打断信任 |
| `DESIGN.md` 时间点 | 实现和视觉 QA 后沉淀 | 现在写会把尚未验证的 token 过早固化 |

当前未决数：`0`。所有会阻塞实现的设计选择已经在本计划内给出默认决策。

## TODOS.md 判断

本轮不新增 `TODOS.md`。原因：本次设计债务都已写回计划，并且计划本身就是下一步实现输入；额外 TODO 会把同一件事拆成两个来源，增加维护分叉。实现完成后如果仍未创建 `DESIGN.md`，再把“沉淀 DESIGN.md”作为 release/documentation TODO 处理。

### Engineering TODOS.md 判断

本轮不新增工程 TODO。候选项 `引入 Playwright/Vitest 测试基础设施` 已识别，但不直接写入 `TODOS.md`，原因是当前任务已经明确收窄到主页首 PR；测试基础设施会改变项目工程面，适合在实现后结合真实 QA 结果单独决策。当前计划用 `lint + generate + browser QA` 覆盖首 PR 的发布门槛。

## Engineering Review Summary

- Step 0: Scope Challenge — scope reduced per recommendation.
- Architecture Review: `0` unresolved issues found.
- Code Quality Review: `0` blocking issues found; guardrails written.
- Test Review: coverage diagram produced, `28` validation gaps identified, `0` critical silent gaps.
- Performance Review: `1` issue found and resolved in plan: no runtime remote font loading.
- NOT in scope: written and updated after engineering review.
- What already exists: written.
- TODOS.md updates: `0` items proposed.
- Failure modes: `0` critical gaps flagged.
- Outside voice: skipped; no cross-model review requested in this run.
- Lake Score: `4/4` recommendations chose the complete bounded option inside the reduced scope.

## 后续审查建议

1. 设计计划已通过 `/plan-design-review`，工程计划已通过 `/plan-eng-review`，可以进入收窄后的主页实现。
2. 实现时按 `Scope reduction 决策` 控制首 PR，不顺手重构 header/button 或搭建测试框架。
3. 实现后运行 `lint`、`generate` 和真实浏览器视觉 QA。
4. 视觉 QA 稳定后运行 `/design-review`，再新增 `DESIGN.md` 沉淀最终 token 和组件规则。

## 参考

- `projects/app/app.vue`：全站背景、布局 shell、页面 transition。
- `projects/app/pages/index.vue`：当前主页入口。
- `projects/app/assets/styles/main.css`：当前全局字体和 Tailwind 入口。
- `projects/app/components/ToolBar.vue`：导航、主题切换、语言切换。
- `projects/app/components/LogoTitle.vue`：Victor 签名 Logo。
- `projects/app/components/common/ColorfulButton.vue`：彩色下划线链接。
- `projects/app/components/BlogContentSearch.vue`：当前最成熟的粉蓝 glass 视觉语言。
- `projects/app/content/about/index.zh.md`：中文主页内容。
- `projects/app/content/about/index.en.md`：英文主页内容。

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | clean | 29 issues/checks, 0 critical gaps, mode: SCOPE_REDUCED |
| Design Review | `/plan-design-review` | UI/UX gaps | 2 | clean | score: 7/10 → 9/10, 6 decisions |

**UNRESOLVED:** 0
**VERDICT:** DESIGN + ENG CLEARED — ready to implement the narrowed homepage PR.
