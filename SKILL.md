---
name: ui-replica
description: 当用户要求根据 UI 设计图、产品截图、参考图或视觉稿精准还原前端页面时使用。适用于需要先拆结构化规格稿，再用原生 HTML、CSS 和 ES Modules 实现页面，并通过截图对比逐轮修正偏差的任务，也适用于不规则科技边框、HUD 外框、异形面板轮廓等需要先提取坐标再用 SVG 还原的场景。
---

# UI Replica

## Overview

这个 skill 用来把“看图写页面”约束成一条可校正的工程流程：先拆页面骨架和规格，再决定布局层与装饰层，最后基于固定尺寸截图对比逐轮修正。目标不是做一个风格类似的页面，而是尽量精确复刻设计图。

## When To Use

在下面这些场景触发：

- 用户明确要求“精准还原”“像素级还原”“按设计图实现”。
- 输入里包含设计稿截图、登录页视觉稿、活动页参考图、APP 页面截屏。
- 任务重点是布局、尺寸、位置、颜色、圆角、阴影、透明度、层级、留白的精确还原。
- 任务重点是还原不规则边框、科技感描边、HUD 外框、异形卡片轮廓。
- 任务需要从截图中提取图标、按钮标识、品牌标识或小型 UI 素材，并转成可复用透明背景资源。
- 需要先输出结构化规格稿，再开始写代码。

下面这些情况不要优先用这个 skill：

- 用户只要一个大致风格相似的页面。
- 用户主要诉求是交互逻辑、接口联调、状态管理，而不是视觉还原。
- 设计信息严重缺失，且用户也不接受不确定项标记。

## Core Workflow

### 1. Read The Design Before Coding

先读取设计图基础信息，再开始任何代码实现：

- 记录设计图尺寸。
- 判断页面主体范围，剔除设备边框、状态栏、拍摄背景等非页面主体内容。
- 先拆一级结构，不要一上来细拆按钮和图标。

任务开始时必须先输出：

- 设计图尺寸
- 页面主体范围判断
- 一级结构拆分结果
- 真实布局元素清单
- 纯视觉元素清单

### 2. Produce A Structured Spec

编码前必须先给出结构化规格稿，至少包含：

- 画布尺寸
- 一级结构划分
- 关键容器边界框
- 文本节点样式
- 主要装饰资源
- 布局方式
- 全局颜色 token
- 全局圆角 token
- 全局阴影 token

对关键元素优先记录这些字段：

- `name`
- `role`
- `parent`
- `x`
- `y`
- `width`
- `height`
- `z_index`
- `layout_type`
- `gap`
- `padding`
- `margin`
- `background`
- `border`
- `border_radius`
- `shadow`
- `blur`
- `opacity`
- `font_family`
- `font_size`
- `font_weight`
- `line_height`
- `color`
- `text_align`
- `asset_ref`

如果某个值无法精准判断，明确写“待确认”，不要脑补一个看起来合理的数值。

### 3. Separate Layout From Decoration

元素必须分成两类：

- 真实布局元素：参与排版、影响留白和对齐、承载文本或交互、后续需要维护。
- 纯视觉元素：背景图、插画、光效、漂浮装饰、纯氛围层。

实现时采用两层结构：

- 骨架层：优先用 `flex`、`grid`、普通文档流完成主结构。
- 装饰层：只放纯视觉装饰，允许绝对定位。

不要把真实布局元素全部写成绝对定位，也不要把纯视觉内容拆成大量无意义 DOM。

### 4. Implement In Maintainable Files

默认优先使用免构建的原生 `HTML + CSS + ES Modules`。

- `HTML` 只保留薄壳。
- 页面结构、组件结构、样式、资源引用分别拆分。
- 不要把结构、样式、行为混在一个超大文件里。
- 不要用一整段 `innerHTML` 字符串充当主要架构。

推荐结构：

- `index.html`
- `main.js`
- `pages/`
- `components/`
- `styles/`
- `assets/`

如果页面明显包含多个独立区域，就拆组件；如果只是静态片段，再考虑是否保持为局部片段。

### 5. Handle Irregular Borders As Vector Reconstruction

当用户要还原的是不规则边框、科技感外框、异形描边，而不是普通矩形卡片时，不要急着用 `border-radius`、`clip-path` 或大量绝对定位去猜。

应改用“坐标提取 + SVG 绘制”的流程：

- 先确认最终只需边框本体，还是边框加整页布局。
- 记录参考图原始尺寸，`SVG viewBox` 默认和原图一致。
- 先拆成 `outer frame`、`inner frame`、`accent lines`、`corner chips` 这类轮廓层，不要把整张图一次性塞成单一路径。
- 可以先用脚本做阈值筛选、边缘采样、行列扫描来找大致锚点，但最终交付的坐标必须是可读、可改、可复核的显式数组。
- 当局部存在折线、缺口、切角、短刻线时，优先用多个 `polyline` / `path` 组合，而不是强行压成单个复杂 `clip-path`。
- 如果用户明确要求白底展示，就先在白底下把边框本体做准，不要附带额外卡片和说明文案。

涉及这类任务时，继续细化的执行细则见 [references/ui-replication-workflow.md](references/ui-replication-workflow.md) 中的“不规则边框与 SVG 坐标还原”。

### 6. Extract Screenshot Icons As Assets

当设计图里的图标不是现成 icon font / lucide 图标，或者截图中的图标样式、颜色、渐变、圆形按钮背景需要精确保留时，不要用近似 SVG 随手替代。应先把图标作为素材提取出来，再放入页面实现。

图标提取按“分析目标 -> 定位裁剪 -> 处理透明背景 -> 提取主体 -> 观察复核 -> 固化配置”的流程执行：

- 先识别图标类型：圆形按钮、圆角方形 App 图标、单色线性图标、复杂品牌图标、背景氛围中的小装饰。
- 对圆形按钮优先用 Hough 圆检测或人工确认圆心半径，再做圆形 alpha mask。
- 对白色或单色标识优先用亮度阈值、饱和度约束、连通域过滤和形态学开闭运算提取主体。
- 同时保留完整按钮版和主体标识版，方便后续分别用于“按原图复刻”和“重组到新背景”。
- 每次提取都保留 debug 裁剪图、预览图和配置文件，避免素材来源变成不可复现的手工操作。

涉及这类任务时，继续细化的执行细则、函数清单和参数策略见 [references/icon-extraction-workflow.md](references/icon-extraction-workflow.md)。

### 7. Validate By Screenshot Diff

第一版页面目标是骨架正确、主元素齐全、位置关系正确、样式方向正确，不要为了第一版就堆过量细节代码。

完成后必须按设计图基准尺寸截图对比，重点检查：

- 整体布局比例
- 卡片位置
- 标题位置
- 输入框高度
- 按钮尺寸
- 留白
- 对齐方式
- 圆角
- 阴影
- 透明度
- 装饰层位置

修正时必须给出具体偏差，例如“右侧卡片偏窄 24 像素”，不能只说“再优化一下”。

## Output Contract

完整输出顺序固定为：

1. 设计图尺寸、主体范围、一级结构、真实布局元素、纯视觉元素
2. 结构化规格稿
3. 实现方案、文件结构、页面代码
4. 截图对比结论、当前仍存在的偏差、下一轮修正点

## Hard Rules

- 禁止跳过结构化规格稿直接写页面。
- 禁止在缺失信息时私自补设计。
- 禁止把布局问题全部用 `absolute` 糊过去。
- 禁止把纯视觉资源拆成大量无意义 DOM。
- 禁止为了省事忽略局部重构需求。
- 禁止使用“逻辑兜底”“防御性处理”“大概类似”这类模糊说法。

## Reference

完整工作流细则和字段说明见 [references/ui-replication-workflow.md](references/ui-replication-workflow.md)。图标提取、透明背景处理、截图素材沉淀见 [references/icon-extraction-workflow.md](references/icon-extraction-workflow.md)。当任务需要更细的约束、验收顺序、禁止事项或不确定项处理方式时，再读取对应 reference。
