# 截图图标提取工作流

## 目标

UI 复刻中的图标提取不是一次性抠图，而是把截图里的小型视觉资产转成可复用、可复核、可重复生成的素材。

这份流程只服务于“确实值得素材化的对象”，不是鼓励把能用原生文本、原生 SVG、原生布局实现的内容统统抠出来。

默认目标：

- 保留图标核心元素。
- 背景透明。
- 输出可直接用于页面实现的 PNG。
- 保留配置、裁剪图和预览图，保证下次可以复现。

## 适用对象

- 第三方登录图标，例如微信、QQ、Apple、微博。
- App 图标、品牌 Logo、圆形/圆角图标按钮。
- 设计图里有特殊渐变、阴影、发光或材质的按钮图标。
- 图标库里没有同款样式，或者使用近似图标会明显降低还原度的元素。

下面对象不必优先走截图提取：

- 普通功能 icon，且 lucide/iconfont 中有相同语义和足够接近的线宽样式。
- 纯 CSS 可以稳定复刻的简单几何符号。
- 用户明确要求使用代码绘制或指定图标库的情况。
- 普通按钮文字、页脚链接、导航文案、标签、状态文字。
- 由多个标准组件组成的普通功能区，只是因为截图现成就想整块裁切。

## 先做“不该提取”的排除判断

在开始裁剪前，先判断是不是根本不该进入这份流程。

下面情况默认不要提取素材：

- 该对象本质上是文本、按钮、输入框、导航、页脚、卡片、列表等语义组件。
- 该对象可以用原生 SVG 稳定画出，且维护成本更低。
- 该对象后续需要响应式变化、hover、selected、disabled 或文案替换。
- 该对象尺寸并不小，只是裁下来比较省事。

只有当下面条件大致同时满足时，才值得继续：

- 对象足够小。
- 对象的风格或材质难以原生逼近。
- 对象不承担主要布局和文本职责。
- 对象后续状态变化极少。

## 交付目录建议

推荐在页面项目中使用下面结构：

```text
assets/
  extracted-icons/
    config/
      icons.json
    debug/
      wechat_crop.png
      circle_candidates.png
    buttons/
      wechat.png
    marks/
      wechat.png
    preview.png
    preview_marks_dark.png
```

目录含义：

- `config/icons.json`: 记录源图路径、输出路径、图标名称、裁剪框或圆心半径、处理参数。
- `debug`: 保留原始裁剪和候选标注图。
- `buttons`: 保留完整按钮、原始背景、透明外部区域。
- `marks`: 仅保留主体标识，背景透明。
- `preview*.png`: 把结果放在棋盘格或深色背景上复核。

## 总流程

### 1. 分析目标图标

先判断每个目标图标的类型，不要直接裁切：

- `circle_button`: 圆形社交按钮、登录方式按钮。
- `rounded_square`: 圆角 App 图标或桌面图标。
- `monochrome_mark`: 单色线性图标或纯白/纯黑品牌标识。
- `multi_color_logo`: 多色品牌 Logo。
- `decorative_symbol`: 背景里的音符、星光、箭头等装饰符号。

在结构化规格稿里记录：

- 图标名称和语义。
- 是否保留按钮背景。
- 是否需要只提取主体标识。
- 目标导出尺寸，例如 `64x64`、`128x128`、`256x256`。
- 是否存在版权或品牌替换风险。
- 为什么这个对象不选择原生 SVG / CSS / 文本实现。

### 2. 定位图标

定位策略按图标形态选择。

圆形按钮：

- 优先用 Hough 圆检测得到候选圆心和半径。
- 如果候选很多，限制 ROI，例如只扫描登录框底部。
- 自动结果只作为候选，最终写入配置前要用标注图复核。

圆角矩形或 App 图标：

- 用颜色阈值、边缘检测或轮廓检测找外框。
- 对明显圆角矩形，可以记录 `x, y, width, height, radius`。

单色线性图标：

- 用亮度/颜色阈值提取主体。
- 如果背景复杂，先裁出小图，再在小图内做阈值和连通域过滤。

复杂 Logo：

- 优先裁切完整区域，并用颜色范围或 alpha matting 思路去背景。
- 传统算法无法稳定分离时，明确切换到人工 mask 或图像 AI 抠图。

### 3. 裁剪小图

裁剪时必须留边：

- 圆形按钮裁剪半径建议为 `radius + 6~10px`。
- 单色主体裁剪建议先比视觉边界多留 `4~12px`。
- 裁剪结果放入 `debug`，不要只保留最终图。

裁剪函数要接受配置输入，而不是把坐标散落在一次性脚本里。
不要为了省事把整段按钮栏、整条导航或整块页脚当成“一个图标”去裁。

### 4. 背景透明化

常见策略：

- 圆形按钮：生成圆形 alpha mask，按钮外部透明。
- 圆角矩形：生成圆角矩形 alpha mask。
- 纯色背景：用颜色距离替换 alpha。
- 白色/黑色单色标识：用亮度阈值和饱和度约束提取 alpha。
- 复杂背景：先裁切，再组合边缘、颜色、连通域、人工 mask 或 AI 抠图。

透明边缘应保留 1px 左右软边，避免页面里出现锯齿。

### 5. 主体标识提取

当按钮里有白色标识时，推荐同时导出一份 `marks/*.png`：

- 灰度值高于阈值，例如 `gray >= 210`。
- 饱和度低于阈值，例如 `saturation <= 90`，避免把彩色背景误提取为主体。
- alpha 必须大于 0，避免裁剪区域外部噪声进入。
- 使用 `MORPH_OPEN` 去掉孤立噪点。
- 使用 `MORPH_CLOSE` 补齐小断裂。
- 使用连通域面积过滤去掉小碎片。
- 再按 alpha 边界裁切，居中缩放到统一画布。

如果主体是彩色 Logo，不能套用白色阈值；应改用颜色范围、背景移除或完整按钮保留策略。

### 6. 输出尺寸与命名

推荐规则：

- 统一输出 `128x128` 或 `256x256`，页面中再用 CSS 控制显示尺寸。
- 文件名使用稳定英文名，例如 `wechat.png`、`qq.png`、`apple.png`、`weibo.png`。
- 中文名和语义写在 `config/icons.json` 的 `label`、`notes` 等字段中。
- 不要用 `icon1.png`、`new.png` 这类不可维护命名。
- 如果素材其实是“微控件整组裁切”，命名中要能看出其功能区语义，例如 `title-actions.png`，不要伪装成单图标。

### 7. 观察与复核

至少检查：

- 透明背景是否生效。
- 图标是否居中。
- 主体是否被截断。
- 圆形/圆角边缘是否有锯齿。
- 细线图标是否因为阈值过高而断裂。
- 是否有背景噪点被误提取。
- 在浅色和深色背景上是否都能看清。

推荐生成两类预览：

- 棋盘格背景预览：检查透明和边缘。
- 深色背景预览：检查白色主体标识。

## 方法与参数

### Hough 圆检测

用途：定位圆形按钮候选。

推荐初始参数：

- `dp=1.2`
- `minDist=50~70`
- `param1=80`
- `param2=18~28`
- `minRadius` / `maxRadius` 按截图尺寸估计

如果漏检：

- 降低 `param2`。
- 放宽半径范围。
- 先裁 ROI 再检测。

如果误检：

- 提高 `param2`。
- 收窄半径范围。
- 用 ROI 限定目标区域。

### 阈值提取白色标识

推荐条件：

```text
gray >= 210
saturation <= 90
alpha > 0
```

调参方向：

- 白色主体缺失：降低 `gray` 阈值到 `190~205`。
- 背景被误提取：提高 `gray` 阈值或降低 `saturation` 阈值。
- 细线断裂：增大 close 核或降低阈值。
- 噪点多：增大 min area 或使用 open。

### 连通域过滤

用途：去除阈值后的小碎片。

建议：

- 小图标从 `min_area=8~20` 起调。
- 不要只保留最大连通域，因为微信双气泡、微博多段线、装饰波纹可能天然是多个组件。
- 按面积过滤比按数量过滤更稳定。

### Alpha 裁切与居中

主体标识提取后必须按 alpha 边界裁切，再加 padding 放入统一画布。这样页面里同一排图标更容易对齐。

建议：

- `mark_padding=16~32`
- `canvas_size=128` 或 `256`
- 缩放使用 `LANCZOS`

## 可复用函数清单

下面是建议在任务脚本中沉淀的函数边界。实现可以用 OpenCV + NumPy + Pillow。

```python
def crop_square(image, center, radius, padding):
    """按圆心和半径裁剪正方形小图，保留额外 padding。"""


def apply_circle_alpha(crop, radius, padding):
    """给圆形按钮生成 alpha mask，圆外透明，边缘保留轻微软化。"""


def apply_rounded_rect_alpha(crop, radius):
    """给圆角矩形图标生成 alpha mask，适合 App 图标和圆角按钮。"""


def replace_color_with_alpha(image, target_rgb, tolerance):
    """把接近目标颜色的背景替换为透明，适合纯色背景。"""


def extract_white_mark(crop, threshold=210, max_saturation=90, min_area=12):
    """用亮度、饱和度、连通域过滤提取白色主体标识。"""


def remove_small_components(mask, min_area):
    """删除小连通域噪声，但保留多个有效主体组件。"""


def trim_alpha(image, padding):
    """按 alpha 非透明区域裁切，并保留 padding。"""


def centered_resize(image, size):
    """等比缩放到统一透明画布中央。"""


def write_preview(items, background):
    """生成浅色棋盘格或深色背景预览图。"""
```

## OpenCV/Pillow API 对照

常用 API：

- `cv2.imread(path, cv2.IMREAD_COLOR)`: 读取源图。
- `cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)`: 转灰度。
- `cv2.cvtColor(image, cv2.COLOR_BGR2HSV)`: 获取饱和度辅助筛选。
- `cv2.medianBlur(gray, 5)`: 圆检测前降噪。
- `cv2.HoughCircles(...)`: 检测圆形候选。
- `cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)`: 去小噪点。
- `cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)`: 补小断裂。
- `cv2.connectedComponentsWithStats(mask, connectivity=8)`: 连通域面积过滤。
- `cv2.findNonZero(alpha)` + `cv2.boundingRect(points)`: 按 alpha 找裁切框。
- `cv2.resize(..., interpolation=cv2.INTER_LANCZOS4)`: 高质量缩放。
- `PIL.Image.alpha_composite(...)`: 生成复核预览。

## 示例配置

```json
{
  "source": "../img.png",
  "output": "../assets/extracted-icons",
  "icons": [
    {
      "name": "wechat",
      "label": "微信",
      "type": "circle_button",
      "center": [928, 815],
      "radius": 25
    }
  ],
  "export": {
    "canvas_size": 128,
    "padding": 8,
    "mark_padding": 24,
    "mark_white_threshold": 210,
    "mark_max_saturation": 90,
    "mark_min_area": 12
  }
}
```

## 示例流程伪代码

```python
source, output, icons, export = read_config("config/icons.json")
image = cv2.imread(source, cv2.IMREAD_COLOR)

for icon in icons:
    if icon["type"] == "circle_button":
        crop = crop_square(image, icon["center"], icon["radius"], export["padding"])
        button = apply_circle_alpha(crop, icon["radius"], export["padding"])
        mark = extract_white_mark(
            button,
            threshold=export["mark_white_threshold"],
            max_saturation=export["mark_max_saturation"],
            min_area=export["mark_min_area"],
        )
        mark = trim_alpha(mark, export["mark_padding"])

        write_png(output / "debug" / f"{icon['name']}_crop.png", crop)
        write_png(output / "buttons" / f"{icon['name']}.png", centered_resize(button, 128))
        write_png(output / "marks" / f"{icon['name']}.png", centered_resize(mark, 128))
```

## 何时改用 AI 或人工处理

传统算法不适合所有截图。出现下面情况时，应明确切换策略：

- 图标主体和背景颜色接近，阈值无法稳定分离。
- 图标边缘有复杂半透明、阴影、毛发状细节。
- 背景不是纯色或规则渐变，且主体细节很多。
- 品牌 Logo 需要高度准确，算法结果破坏关键曲线。

推荐顺序：

1. 先保存高质量裁剪小图。
2. 手工或 AI 生成透明背景版本。
3. 把最终素材放回 `assets/extracted-icons`。
4. 在 `assets/extracted-icons/config/icons.json` 中记录“此素材经人工/AI 抠图处理”，不要伪装成脚本完全可复现。

## 验收标准

完成图标提取后，必须能回答：

- 源截图是哪一张。
- 每个图标的裁剪坐标或圆心半径是什么。
- 使用了哪些阈值和形态学参数。
- 输出了哪些完整按钮和主体标识。
- 透明背景是否经过 alpha 检查。
- 是否生成了 debug 裁剪图和预览图。
- 为什么这个对象值得提取，而不是原生实现。

如果这些信息缺失，素材不能视为完成，只能视为临时截图切片。
