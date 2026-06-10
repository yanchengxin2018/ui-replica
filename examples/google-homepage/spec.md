# UI 结构化规格稿

## 1. 设计图基础信息

- 设计图尺寸：`1109 x 652`
- 页面主体范围判断：整张图就是浏览器内的 Google 首页主体，包含圆角白色页面容器、顶部导航、中央搜索区和底部页脚；不包含外部操作系统桌面。
- 一级结构拆分结果：
  - 画布：`1109 x 652` 白色页面，四角圆角，浅灰描边
  - 顶部导航区：右上 `Gmail`、`图片`、九宫格应用入口、账户头像
  - 中央主搜索区：Google 字标、搜索框、两个按钮、多语言提示
  - 底部页脚区：地区栏、链接栏
- 真实布局元素清单：
  - 页面外框
  - 顶部导航文字链接
  - 应用入口按钮
  - 账户按钮
  - 搜索框主体
  - 搜索框左侧加号按钮
  - 搜索框右侧语音按钮
  - 搜索框右侧以图搜图按钮
  - `AI 模式` 按钮
  - `Google 搜索` 与 `手气不错` 按钮
  - 多语言提示文本和链接
  - 页脚地区文本
  - 页脚左右链接组
- 纯视觉元素清单：
  - Google 品牌字标
  - 账户头像贴图
  - 搜索框轻阴影
  - 页脚浅灰底色与分隔线

## 2. 全局 Token

- 颜色：
  - `--page-bg`: `#ffffff`
  - `--frame-border`: `#dfe1e5`
  - `--text-main`: `#1f1f1f`
  - `--text-soft`: `#3c4043`
  - `--text-link`: `#1a0dab`
  - `--button-bg`: `#f8f9fa`
  - `--footer-bg`: `#f2f2f2`
  - `--footer-border`: `#dadce0`
  - `--search-border`: `#dfe1e5`
- 圆角：
  - `--radius-page`: `14px`
  - `--radius-search`: `25px`
  - `--radius-button`: `4px`
  - `--radius-avatar`: `20px`
- 阴影：
  - `--search-shadow`: `0 1px 6px rgba(32, 33, 36, 0.16)`

## 3. 关键元素规格

| name | role | parent | x | y | width | height | z_index | layout_type | gap | padding | background | border | border_radius | shadow | font_size | font_weight | line_height | color | asset_ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| page-frame | 页面容器 | canvas | 0 | 0 | 1109 | 652 | 1 | block | 0 | 0 | `#fff` | `1px solid #dfe1e5` | `14px` | none | 待确认 | 待确认 | 待确认 | 待确认 | none |
| topbar | 顶部导航区 | page-frame | 919 | 13 | 176 | 40 | 2 | flex-row | `7px` | `0` | transparent | none | 0 | none | `13px` | `400` | `1` | `#202124` | none |
| hero | 中央搜索区 | page-frame | 210 | 71 | 689 | 291 | 2 | flex-column | `0` | `0` | transparent | none | 0 | none | mixed | mixed | mixed | mixed | mixed |
| google-logo | 品牌字标 | hero | 415 | 72 | 276 | 80 | 3 | block | 0 | 0 | transparent | none | 0 | none | 待确认 | 待确认 | 待确认 | 待确认 | `assets/google-logo.png` |
| search-shell | 搜索框 | hero | 211 | 182 | 689 | 51 | 3 | flex-row | `0` | `0 13px` | `#fff` | `1px solid #dfe1e5` | `25px` | `--search-shadow` | none | none | none | none | none |
| left-plus | 左侧加号按钮 | search-shell | 225 | 198 | 18 | 18 | 4 | block | 0 | 0 | transparent | none | 0 | none | none | none | none | `#202124` | inline css |
| ai-button | AI 模式按钮 | search-shell | 806 | 189 | 94 | 36 | 4 | flex-row | `4px` | `0 13px 0 11px` | transparent | `left separator #dadce0` | `20px` | none | `14px` | `400` | `36px` | `#3c4043` | inline svg |
| primary-actions | 主按钮组 | hero | 444 | 264 | 222 | 36 | 3 | flex-row | `11px` | 0 | transparent | none | 0 | none | `14px` | `400` | `36px` | `#3c4043` | none |
| language-row | 语言提示 | hero | 462 | 345 | 185 | 28 | 3 | flex-row | `6px` | 0 | transparent | none | 0 | none | `14px` | `400` | `28px` | mixed | none |
| footer-region | 地区栏 | footer | 31 | 548 | 1047 | 51 | 2 | block | 0 | `0 0 0 31px` | `#f2f2f2` | `1px solid #dadce0` | 0 | none | `14px` | `400` | `51px` | `#1f1f1f` | none |
| footer-links | 链接栏 | footer | 195 | 600 | 719 | 50 | 2 | flex-row | mixed | 0 | `#f2f2f2` | none | 0 | none | `14px` | `400` | `1` | `#1f1f1f` | none |

## 4. 布局策略

- 骨架层：
  - 整页使用固定画布尺寸实现，底部页脚绝对定位到底部。
  - 顶部导航使用右对齐 `flex`。
  - 中央搜索区使用纵向 `flex`，仅内部微控件使用局部 `flex`。
  - 页脚链接区使用左右两组 `flex`。
- 装饰层：
  - Google 字标与账户头像为截图裁切素材。
  - 九宫格、麦克风、镜头、AI 图标使用原生 SVG / CSS 几何。
  - 搜索框阴影与分隔线由 CSS 完成。

## 5. 资源说明

- `assets/google-logo.png`：从参考图裁切的 Google 品牌字标，裁切框约为 `(415,72) - (691,152)`。
- `assets/account-avatar.png`：从参考图裁切的右上角账户按钮，裁切框约为 `(1055,13) - (1100,58)`。

## 6. 不确定项

- 参考图左侧搜索框图标不是常规 Google 首页放大镜，当前按截图视觉以 CSS 加号还原。
- 字体环境缺少 Google Sans，正文以 `Arial` 系列近似；品牌字标已使用裁切素材避免字形偏差。
