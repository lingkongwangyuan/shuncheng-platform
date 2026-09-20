# 顺诚AI工作平台 · 选品中心

美客多跨境电商（顺诚）内部工作平台。当前聚焦「选品中心」，下分日用百货四大场景品类。

线上地址：https://lingkongwangyuan.github.io/shuncheng-platform/

---

## 目录结构

```
├── index.html          品类总览
├── kitchen.html        厨房用品
├── bathroom.html       卫生间用品
├── livingroom.html     客厅用品
├── bedroom.html        卧室用品
│
├── assets/
│   ├── theme.css       设计系统（全站唯一样式源）
│   ├── layout.js       顶部栏 + 左侧导航（统一注入）
│   └── render.js       页面内容渲染
│
├── data/
│   └── categories.js   品类树 / 导航 / 店铺池（唯一内容源）
│
└── _tools/
    └── check_contrast.py  配色对比度门禁（下划线开头，不会发布到线上）
```

五个页面都是 30 行左右的薄壳，只负责声明「我是哪一页」：

```html
<body data-page="kitchen">
  <div id="sc-header"></div>     <!-- layout.js 注入 -->
  <div id="sc-sidebar"></div>    <!-- layout.js 注入 -->
  <main class="main"><div id="sc-content"></div></main>  <!-- render.js 注入 -->
</body>
```

---

## 怎么改（不用碰页面）

| 想改什么 | 改哪里 |
|---|---|
| 加 / 删品类、改品类文案、改三级细分品类 | `data/categories.js` 的 `categories` |
| 改左侧导航（栏目、子项、顺序） | `data/categories.js` 的 `nav` |
| 改 AI 智能体清单 | `data/categories.js` 的 `agents` |
| 改某个页面的版式、颜色、间距 | `assets/theme.css` |
| 改页面区块结构（骨架） | `assets/render.js` |

**加一个新品类的完整步骤：**

1. 在 `data/categories.js` 的 `categories` 数组里加一条（参考现有条目字段）
2. 复制任一品类页（如 `kitchen.html`），改 `data-page` 为新的 `id`
3. 在 `nav` 的选品中心 `children` 里加一行，`page` 指向新文件
4. 完成——导航高亮、面包屑、统计数字全自动

---

## 配色铁律（改样式必须遵守）

1. **同色系禁止**：背景与文字不得同色相（浅橙底绝不配橙字）
2. **浅亮底**（相对亮度 > 0.85）文字对比度须 ≥ 4.5:1
3. **彩色浅底配深色字，深色实底才配白字**

改动样式后必须跑门禁：

```bash
python _tools/check_contrast.py
# 退出码 0 才可交付
```

该脚本会先把 `assets/theme.css` 内联，再调用对比度自检，覆盖全部五个页面。

---

## 部署

`git push` 到 `main` 分支即自动上线（GitHub Pages），无需手动操作。构建约 1 分钟。

---

## 数据说明

**平台当前不承载编造数据。** 未接入的数据一律显示「待采集 / 待接入」占位，不做推算填充。

| 模块 | 状态 | 待接入内容 |
|---|---|---|
| 品类结构 | ✅ 已就绪 | — |
| 三级细分品类 | ✅ 已就绪 | — |
| 产品清单 | ⏳ 待接入 | 产品数据源尚未确定 |
| 店铺布局 | ⏳ 待确认 | `storePool` 已列 18 家实名店铺，品类→店铺分配关系待管理人确认 |
| 市场分析 | ⏳ 待采集 | 指标口径与数据源待定 |
| AI 智能体 | ⏳ 待开发 | 五个智能体均未接入 |
