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
    subtitle: '美客多跨境电商 · 选品中心',
    version: 'v2.0',
    updated: '2026-09-20'
  },

  /* ── 左导航结构（全站唯一副本） ──
     page  : 有独立页面的，直接跳转
     todo  : 尚无页面的，点击给出提示（不再是无反应的死链接） */
  nav: [
    {
      id: 'selection', name: '选品中心', icon: '🎯', expanded: true,
      children: [
        { name: '品类总览', icon: '📋', page: 'index.html' },
        { name: '厨房用品', icon: '🍳', page: 'kitchen.html' },
        { name: '卫生间用品', icon: '🚿', page: 'bathroom.html' },
        { name: '客厅用品', icon: '🛋️', page: 'livingroom.html' },
        { name: '卧室用品', icon: '🛏️', page: 'bedroom.html' }
      ]
    },
    {
      id: 'shops', name: '店铺矩阵', icon: '🏬',
      children: [
        { name: '店铺总览', todo: true },
        { name: '独立核算', todo: true },
        { name: '店群分析', todo: true }
      ]
    },
    {
      id: 'ops', name: '经营数据', icon: '📊',
      children: [
        { name: '销售分析', todo: true },
        { name: '利润分析', todo: true },
        { name: '广告分析', todo: true }
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

  /* ── 一级品类 ── */
  root: {
    id: 'daily',
    name: '日用百货',
    desc: '顺诚选品中心一级品类，下分居家四大场景，按 P0→P2 顺序推进'
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

  /* ── 市场分析待采集指标 ──
     说明：原页面此处为编造数字，已全部撤下。
     指标口径与数据源确认后再回填，宁可标空不填假。 */
  marketPlan: {
    note: '指标口径与数据源确认后回填',
    metrics: [
      { name: '热卖趋势（近 30 天搜索增长）', src: '美客多后台类目报告' },
      { name: '主力价格带', src: '美客多类目价格分布' },
      { name: '竞争度 / 头部卖家集中度', src: '第三方选品工具' },
      { name: '类目 TOP 商品销量与评分', src: '第三方选品工具' }
    ]
  },

  /* ── 四大场景品类 ──
     subs[].status : pending 待启动 / progress 进行中 / done 已完成 */
  categories: [
    {
      id: 'kitchen',
      name: '厨房用品',
      icon: '🍳',
      page: 'kitchen.html',
      priority: { level: 'P0', label: '优先', cls: 'priority-high', cardCls: 'priority-1' },
      desc: '涵盖厨房收纳、烹饪工具、保鲜密封、清洁用品等，是日用百货中需求最稳定、复购率最高的品类方向。',
      cardMeta: '5 个三级品类',
      progress: 15,
      progressNote: '待选品',
      subs: [
        { no: 1, name: '厨房收纳', detail: '置物架、收纳盒、调料架、橱柜收纳 — 高频刚需，SKU丰富度最高', plan: 20, status: 'pending' },
        { no: 2, name: '厨房工具', detail: '铲勺套装、开瓶器、削皮器、压蒜器 — 标品化程度高，适合批量上架', plan: 15, status: 'pending' },
        { no: 3, name: '保鲜/密封容器', detail: '保鲜盒、密封罐、真空袋 — 复购率高，适合做品牌化', plan: 12, status: 'pending' },
        { no: 4, name: '厨房清洁', detail: '洗碗刷、清洁布、去污剂 — 消耗品，复购频次高', plan: 10, status: 'pending' },
        { no: 5, name: '厨房装饰', detail: '沥水架、调味瓶、厨房挂钟 — 颜值经济，适合差异化', plan: 8, status: 'pending' }
      ]
    },
    {
      id: 'bathroom',
      name: '卫生间用品',
      icon: '🚿',
      page: 'bathroom.html',
      priority: { level: 'P0', label: '优先', cls: 'priority-high', cardCls: 'priority-1' },
      desc: '涵盖卫浴收纳、清洁工具、防滑用品、卫浴配件等，客单价适中，适合差异化竞争。',
      cardMeta: '5 个三级品类',
      progress: 10,
      progressNote: '待选品',
      subs: [
        { no: 1, name: '浴室收纳', detail: '置物架、挂钩、肥皂盒、牙刷架 — 刚需高频，SKU空间大', plan: 18, status: 'pending' },
        { no: 2, name: '卫浴纺织品', detail: '毛巾、浴巾、地垫、浴帘 — 复购率高，适合组合销售', plan: 15, status: 'pending' },
        { no: 3, name: '浴室配件', detail: '花洒、水龙头、排水口滤网 — 标品化程度高，适合批量', plan: 12, status: 'pending' },
        { no: 4, name: '浴室清洁', detail: '马桶刷、清洁刷、除垢剂 — 消耗品，复购频次高', plan: 10, status: 'pending' },
        { no: 5, name: '浴室装饰', detail: '浴室镜、香薰、装饰品 — 颜值经济，差异化空间大', plan: 8, status: 'pending' }
      ]
    },
    {
      id: 'livingroom',
      name: '客厅用品',
      icon: '🛋️',
      page: 'livingroom.html',
      priority: { level: 'P1', label: '中等', cls: 'priority-mid', cardCls: 'priority-3' },
      desc: '涵盖客厅收纳、装饰、纺织、灯饰等，颜值经济潜力大，适合做差异化爆款。',
      cardMeta: '5 个三级品类',
      progress: 0,
      progressNote: '待启动',
      subs: [
        { no: 1, name: '客厅收纳', detail: '收纳箱、置物架、杂志架、遥控器收纳 — 需求稳定，组合销售空间大', plan: 15, status: 'pending' },
        { no: 2, name: '家居装饰', detail: '壁画、花瓶、摆件、相框 — 颜值经济，差异化空间大，利润高', plan: 12, status: 'pending' },
        { no: 3, name: '沙发纺织品', detail: '沙发垫、抱枕套、盖毯、桌旗 — 复购率高，季节性需求', plan: 10, status: 'pending' },
        { no: 4, name: '客厅灯饰', detail: '台灯、落地灯、氛围灯、LED灯带 — 氛围感经济，溢价空间大', plan: 8, status: 'pending' },
        { no: 5, name: '客厅配件', detail: '遥控器、电视支架、线缆收纳 — 标品化程度高，适合批量', plan: 10, status: 'pending' }
      ]
    },
    {
      id: 'bedroom',
      name: '卧室用品',
      icon: '🛏️',
      page: 'bedroom.html',
      priority: { level: 'P2', label: '待启动', cls: 'priority-low', cardCls: 'priority-4' },
      desc: '涵盖卧室收纳、床品配件、灯具、装饰等，睡眠经济增长快，复购率高。',
      cardMeta: '5 个三级品类',
      progress: 0,
      progressNote: '待启动',
      subs: [
        { no: 1, name: '卧室收纳', detail: '衣柜收纳、床头置物架、首饰盒 — 刚需高频，组合销售空间大', plan: 15, status: 'pending' },
        { no: 2, name: '床品纺织', detail: '床单、被套、枕套、蚊帐 — 复购率高，季节性需求强', plan: 12, status: 'pending' },
        { no: 3, name: '卧室灯具', detail: '床头灯、夜灯、睡眠灯 — 氛围感经济，溢价空间大', plan: 10, status: 'pending' },
        { no: 4, name: '卧室装饰', detail: '墙贴、挂画、香薰蜡烛 — 颜值经济，差异化空间大', plan: 10, status: 'pending' },
        { no: 5, name: '卧室配件', detail: '眼罩、耳塞、闹钟 — 标品化程度高，适合批量上架', plan: 8, status: 'pending' }
      ]
    }
  ]
};
