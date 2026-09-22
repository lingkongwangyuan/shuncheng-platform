/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 数据层
   ───────────────────────────────────────────────────────────────
   全站唯一内容源。加品类、改文案、调导航，只改本文件，不动页面。

   数据原则（沿用项目约定）：
     · 忠实原文，不做推断式释义
     · 未采集的信息一律标 status:'todo'，不填假数字
     · 每条数据保留来源标记，便于回溯
   ═══════════════════════════════════════════════════════════════ */

window.SC_DATA = {

  /* ── 平台元信息 ── */
  meta: {
    name: '顺诚AI工作平台',
    shortName: '顺诚',
    logo: '顺',
    user: '顺诚',
    subtitle: '美客多跨境电商 · 工作平台',
    version: 'v3.0',
    updated: '2026-09-21'
  },

  /* ── 左导航结构（全站唯一副本） ──
     page  : 有独立页面的，直接跳转
     todo  : 尚无页面的，点击给出提示（不再是无反应的死链接） */
  nav: [
    {
      id: 'selection', name: '选品中心', icon: '🎯', expanded: true,
      children: [
        { name: '品类总览', icon: '📋', page: 'index.html' },
        /* 2026-09-21：原「市场分析」导航项已删除，其页面（market.html）下线。
           原因：与本品类总览重复——「家居大类大盘」「二级分类结构底数」两页同源同数据。
           独有内容（分析框架 / 在营店铺 / 承接矩阵 / 布局待定）已并入品类总览页。 */
        /* ── 家居大类 · 11 个官方二级分类 ──
           排序：厨房第一（老周指定），其余按官方大盘月销售额降序。
           厨房大类的分类数据源为 data/kitchen.js（由 17_build_kitchendata.py 生成）；
           其余 10 个二级分类数据源为 data/home.js（由 16_build_homedata.py 生成）。
           indent: 1 = 二级缩进项，仅用于导航视觉层级。 */
        { name: '厨房大类', icon: '🍳', page: 'cat-kitchen.html' },
        /* 2026-09-22 老周定：「存储和组织」四级专页（cat-kitchen-storage.html）整块下线，
           导航项与页面文件一并删除。四级渲染代码（render-kitchen.js 的 renderStorage）
           与 data/kitchen.js 的 storage 数据保留，需要时可恢复。 */
        { name: '家具', icon: '🛋️', page: 'cat-furniture.html' },
        { name: '花园和户外', icon: '🌿', page: 'cat-garden.html' },
        { name: '床垫及配件', icon: '🛏️', page: 'cat-mattress.html' },
        { name: '家居装饰和装饰品', icon: '🖼️', page: 'cat-decor.html' },
        { name: '家居照明', icon: '💡', page: 'cat-lighting.html' },
        { name: '家庭安全', icon: '🔒', page: 'cat-security.html' },
        { name: '家用纺织品和装饰品', icon: '🧵', page: 'cat-textiles.html' },
        { name: '家庭护理和洗衣', icon: '🧺', page: 'cat-homecare.html' },
        { name: '浴室', icon: '🚿', page: 'cat-bath.html' },
        { name: '收纳整理', icon: '📦', page: 'cat-storage.html' }
      ]
    },
    {
      id: 'shops', name: '店铺矩阵', icon: '🏬',
      children: [
        { name: '店铺总览', icon: '🏬', page: 'shops.html' },
        { name: '店铺规划', icon: '📐', page: 'shops-plan.html' },
        { name: '店群分析', icon: '📊', page: 'shops-group.html' }
      ]
    },
    {
      id: 'ops', name: '经营数据', icon: '📊',
      children: [
        { name: '经营概览', icon: '📈', page: 'ops.html' },
        /* 2026-09-22 新增「经营报表」：每天填 6 个数 → 自动算变动费 →
           自动汇总到周和月 → 输出经营利润 → 分红测算。数据源 report-config.js，
           交互与计算在 assets/render-report.js，数据存浏览器本地。 */
        { name: '经营报表', icon: '📝', page: 'report.html' },
        { name: '独立核算', icon: '💰', page: 'acct.html' },
        { name: '产品核算', icon: '🏷️', page: 'acct-products.html' },
        { name: '数据体检', icon: '🩺', page: 'ops-quality.html' },
        { name: '作业节奏', icon: '📅', page: 'ops-rhythm.html' },
        { name: '广告分析', icon: '📣', todo: true }
      ]
    },
    {
      id: 'parter', name: '店铺合伙', icon: '🤝',
      children: [
        { name: '合伙总览', icon: '🤝', page: 'parter.html' },
        { name: '李源', icon: '👤', page: 'parter-liyuan.html' },
        { name: '石老师', icon: '👤', page: 'parter-shi.html' }
      ]
    },
    {
      id: 'stock', name: '库存管理', icon: '📦',
      children: [
        { name: '库存看板', todo: true },
        { name: '补货预警', todo: true }
      ]
    },
    { divider: true },
    { sectionTitle: 'AI 智能体' },
    {
      id: 'agents', items: [
        { name: '选品智能体', icon: '🎯', todo: true },
        { name: '数据采集智能体', icon: '📊', todo: true },
        { name: '经营分析智能体', icon: '📈', todo: true },
        { name: '生图智能体', icon: '🖼️', todo: true },
        { name: 'Listing优化智能体', icon: '✍️', todo: true }
      ]
    },
    { divider: true },
    { sectionTitle: '系统' },
    { id: 'system', items: [{ name: '设置', icon: '⚙️', todo: true }] }
  ],

  /* ── AI 智能体工作台（首页展示用） ── */
  agents: [
    { name: '选品智能体', icon: '🎯', cls: 'ai-orange', desc: '分析市场数据，推荐高潜力品类和产品', status: 'todo' },
    { name: '数据采集智能体', icon: '📊', cls: 'ai-blue', desc: '抓取竞品、价格、销量趋势数据', status: 'todo' },
    { name: '经营分析智能体', icon: '📈', cls: 'ai-green', desc: '利润 / 转化率 / 广告 ROI 深度分析', status: 'todo' },
    { name: '生图智能体', icon: '🖼️', cls: 'ai-amber', desc: 'AI 生成主图和详情页素材', status: 'todo' }
  ],

  /* ── 一级品类 ──
     2026-09-21 调整：聚焦「家居大类」（美客多官方一级大类 MLM1574），
     原「日用百货/四大场景」是早期编的结构，无数据支撑，已废弃。 */
  root: {
    id: 'home',
    name: '家居大类',
    nameEs: 'Hogar, Muebles y Jardín',
    catId: 'MLM1574',
    desc: '美客多官方一级大类，下分 11 个二级分类（厨房第一，其余按大盘月销售额降序）'
  },

  /* ── 可分配店铺池 ──
     来源：美客多店铺日报台账（2026-09-20 数据底座）
     分配状态：待管理人确认「品类 → 店铺」对应关系
     说明：此处只列店铺名，不做分配推断 */
  storePool: {
    note: '待管理人确认「品类 → 店铺」分配关系',
    owners: [
      { name: '李源', shops: ['唐博宏', '姚振朋1', '杨晓丰', '殷磊', '程志恒1', '程志恒3', '莫雷', '袁鹏辉', '郭浩洋'] },
      { name: '石老师', shops: ['侯敏', '张玉博1', '张玉博2', '李彦辉', '杨云光', '耿亚雄', '金卫', '陆波波', '骆龙华'] }
    ]
  },

  /* ── 品类总览 · 补充区块（原「市场分析」页并入） ──
     2026-09-21：原「市场分析」页（market.html）与品类总览大量重复——
     「家居大类大盘」「二级分类结构底数」两页同源同数据，页面已下线删除。
     其独有的四块内容并入品类总览页：市场分析框架 / 在营店铺现状 /
     品类 × 店铺承接矩阵 / 布局待定项；数据由本对象与上面的 storePool 提供。
     说明：原页面此处为编造数字，已全部撤下，改为「分析维度 + 数据源」框架，
     口径确认后再回填，宁可标空不填假；分配关系一律不做推断。 */
  overviewExtra: {
    frameworkNote: '八项分析维度尚未采集（类目大盘除外），先定框架与数据源，口径确认后回填。',
    framework: [
      { dim: '市场规模与增速', item: '类目 GMV、增长率、在售商品数', src: '美客多类目报告' },
      { dim: '热卖趋势', item: '近 30 天搜索增长、热搜关键词', src: '美客多后台 / 第三方选品工具' },
      { dim: '价格带分布', item: '主力价格带、客单价分布、低价商品占比', src: '美客多类目价格分布' },
      { dim: '竞争格局', item: '卖家数、头部集中度、评分与销量门槛', src: '第三方选品工具' },
      { dim: '商品结构', item: 'TOP 商品销量与评分、上架时间分布', src: '第三方选品工具' },
      { dim: '季节与节点', item: '旺季月份、节日需求峰值', src: '第三方选品工具' },
      { dim: '合规与准入', item: '类目限制、强制认证、侵权高发词', src: '美客多类目规则' },
      { dim: '物流与包装', item: '体积重、破损率、配送时效要求', src: '物流商 / 自建' }
    ],
    analysisNote: '以上是「还缺哪些数据」的台账，不含任何推算结论。8 个分析维度尚未采集，'
                + '一律标「待采集」并写明数据源。已采集的是：墨西哥站类目大盘'
                + '（「4-家居大类市场分析表 v1」）、巴西站类目大盘'
                + '（「2-巴西家居二级分类市场分析表 v1」，2026-09-22 接入）、'
                + '以及墨西哥站官方类目树结构（三级/四级）。'
                + '尚未采集的：巴西站类目树（两站类目树独立）、两站的四级销量与价格数据。',
    layoutNote: '「品类 → 店铺」的承接关系需管理人确认。此处只列店铺现状与矩阵骨架，'
              + '不做分配推断——谁做哪个品类是经营决策，不能由页面替你定。',
    layoutOpen: [
      { name: '品类 → 店铺 承接关系', who: '李源 / 石老师' },
      { name: '单店可承接的品类数量上限', who: '管理人定' },
      { name: '同一品类由几家店并行铺货', who: '管理人定' },
      { name: '品牌保护与内部竞争规避规则', who: '管理人定' }
    ]
  },

  /* ── 家居大类 · 11 个二级分类 ──
     原「日用百货 · 四大场景」（厨房 / 卫生间 / 客厅 / 卧室用品）已于 2026-09-21 废弃：
     其三级方向全部是早期编造、无数据支撑，与真实采集的官方二级分类对不上。
     现按美客多官方二级分类重建，数据源 = data/home.js
     （由 scripts/16_build_homedata.py 从「家居大类市场分析表_v1.xlsx」生成）。
     此处不复写分类数据，避免两处维护。 */
  homeNote: '家居大类的 11 个二级分类数据在 data/home.js；本文件只保留导航与文案。'
};
