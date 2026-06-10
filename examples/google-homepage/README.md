# Google Homepage Example

这个示例展示了 `ui-replica` 如何把一张 Google 首页截图还原成可维护的原生前端页面。

## 包含内容

- `reference.png`：原始参考图
- `result.png`：浏览器中实际打开页面后的成图
- `overview.png`：参考图与成图并排总览
- `spec.md`：结构化规格稿
- `index.html` / `main.js` / `styles/main.css`：页面实现
- `scripts/capture.js`：截图验证脚本

## 实现策略

- 主体布局、搜索框、页脚、文字链接使用原生 HTML/CSS。
- 麦克风、镜头、AI 图标和九宫格入口使用原生 SVG / CSS 几何。
- `Google` 字标和右上角头像按钮属于高保真且体积很小的视觉资产，采用小范围截图复用。

## 本地验证

```bash
npm install
npm run capture
```

执行后会输出 `preview.png`，用于和 `reference.png` 继续比对。
