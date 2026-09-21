/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 店铺规划渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/plan.js（由 scripts/15_build_plandata.py 生成）
   页面：shops-plan.html → <body data-page="shops-plan">

   本页回答的问题：该开哪些店、每家店做什么定位、卖什么、卖给谁。
   与「品类总览」页的分工：品类总览答「卖什么」（含品类 × 店铺承接矩阵），
   本页答「用什么店卖」。

   铁律：规划格子一律标「待规划」，不替管理人做经营决策；
        真实数据只作决策底数，不作推断依据。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var D = window.SC_PLAN || {};
  var SITES = D.sites || [];
  var SITE_NAMES = D.siteNames || [];
  var MATRIX = D.matrix || [];
  var EXISTING = D.existing || [];
  var NEW_SHOPS = D.newShops || [];
  var FINDINGS = D.findings || [];
  var OPEN = D.openItems || [];
  var GAPS = D.gaps || [];
  var POSITIONS = D.positions || [];
  var S = D.summary || {};
  var ANO = D.anomalyShops || [];

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  function nf(v) {
    if (v === null || v === undefined) return '—';
    return Number(v).toLocaleString('zh-CN');
  }
  function dec(v, d) {
    if (v === null || v === undefined) return '—';
    return Number(v).toFixed(d === undefined ? 1 : d);
  }
  function pct(v) {
    if (v === null || v === undefined) return '—';
    return Number(v).toFixed(1) + '%';
  }
  var LV_CLS = { '红': 'lv-red', '橙': 'lv-orange', '黄': 'lv-yellow', '绿': 'lv-green' };
  function lvDot(lv) {
    return '<i class="lv-dot ' + (LV_CLS[lv] || 'lv-none') + '"></i>';
  }
  function todo(text) {
    return '<span class="money-todo">' + esc(text || '待规划') + '</span>';
  }

  /* ══════════════ 组件 ══════════════ */

  function posChip(key) {
    if (!key) return '<span class="pos-chip pos-todo">待规划</span>';
    var cls = { puhuo: 'pos-a', jingpin: 'pos-b', hunhe: 'pos-c' }[key] || 'pos-todo';
    var p = null;
    POSITIONS.forEach(function (x) { if (x.key === key) p = x; });
    return '<span class="pos-chip ' + cls + '">' + esc(p ? p.name : key) + '</span>';
  }

  function siteDots(cur) {
    return '<span class="site-dots">' + SITE_NAMES.map(function (n) {
      var on = (cur || []).indexOf(n) >= 0;
      return '<i class="sd ' + (on ? 'sd-on' : 'sd-off') + '" title="' + esc(n) + '">' +
             esc(n.charAt(0)) + '</i>';
    }).join('') + '</span>';
  }

  function siteLegend() {
    return '<div class="site-legend">' +
      '<span style="color:var(--ink)">站点覆盖顺序：</span>' +
      SITE_NAMES.map(function (n) {
        return '<span><i class="sd sd-on">' + esc(n.charAt(0)) + '</i>' + esc(n) + '</span>';
      }).join('') +
      '<span><i class="sd sd-off">—</i>未铺货</span>' +
      '</div>';
  }

  function posLegend() {
    return '<div class="pos-legend">' +
      POSITIONS.map(function (p) {
        return '<span>' + posChip(p.key) + esc(p.desc) + '</span>';
      }).join('') +
      '</div>';
  }

  function pageHeader(title, crumb, right) {
    return '' +
      '<div class="page-header-card">' +
        '<div class="page-header-top">' +
          '<div class="page-title">' + esc(title) + '</div>' +
        '</div>' +
        '<div class="page-header-bottom">' +
          '<div class="breadcrumb">' + esc(crumb) + '</div>' +
          (right ? '<div class="breadcrumb">' + esc(right) + '</div>' : '') +
        '</div>' +
      '</div>';
  }

  function pageFoot() {
    var m = D.meta || {};
    return '<div class="page-foot">' +
      '<span>数据源：' + esc(m.source || '数据底座') + ' · 区间 ' + esc(m.span || '') + '</span>' +
      '<span>数据层：data/plan.js（自动生成）</span>' +
      '</div>';
  }

  function ruleNote() {
    var rules = (D.meta || {}).rules || [];
    return '<div class="rule-note"><b>口径说明</b><ul>' +
      rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') +
      '</ul></div>';
  }

  /* ══════════════ 一 · 开店决策底数 ══════════════ */

  function findingBlock() {
    if (!FINDINGS.length) return '';
    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">数据事实</div>' +
      '<div class="card-hint">以下为数据事实，不是规划建议</div></div>' +
      FINDINGS.map(function (f, i) {
        return '<div class="finding">' +
          '<div class="fd-no">' + (i + 1) + '</div>' +
          '<div class="fd-body">' +
            '<div class="fd-title">' + esc(f.title) + '</div>' +
            '<div class="fd-fact">' + esc(f.fact) + '</div>' +
            '<div class="fd-imply">' + esc(f.imply) + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div>';
  }

  function siteCapacity() {
    var max = Math.max.apply(null, SITES.map(function (s) { return s.per1000 || 0; })) || 1;
    var rows = SITES.map(function (s) {
      var w = Math.max(4, (s.per1000 || 0) / max * 100);
      return '<div class="heat-row">' +
        '<span class="heat-site">' + esc(s.name) + '</span>' +
        '<div class="heat-track"><div class="heat-fill bar-green" style="width:' + w.toFixed(1) + '%"></div></div>' +
        '<span class="heat-val">' + dec(s.per1000, 1) + ' 单</span>' +
        '</div>';
    }).join('');

    var tbl = '<div class="table-scroll"><table class="shop-table">' +
      '<thead><tr>' +
        '<th>站点</th><th class="num">店铺数</th><th class="num">在架链接</th>' +
        '<th class="num">链接占比</th><th class="num">累计出单</th><th class="num">出单占比</th>' +
        '<th class="num">千链接出单</th><th class="num">转化率</th>' +
        '<th class="num">封停</th><th class="num">风险率</th><th class="num">未标注率</th>' +
      '</tr></thead><tbody>' +
      SITES.map(function (s) {
        var gapCls = (s.gap || 0) > 0 ? 'num-strong' : 'num-mute';
        return '<tr>' +
          '<td class="td-shop">' + esc(s.name) + '</td>' +
          '<td class="num num-mute">' + s.shops + '</td>' +
          '<td class="num">' + nf(s.links) + '</td>' +
          '<td class="num num-mute">' + pct(s.linkShare) + '</td>' +
          '<td class="num num-strong">' + nf(s.orders) + '</td>' +
          '<td class="num num-mute">' + pct(s.orderShare) + '</td>' +
          '<td class="num num-strong">' + dec(s.per1000, 1) + '</td>' +
          '<td class="num">' + pct(s.conv) + '</td>' +
          '<td class="num ' + (s.stops > 0 ? 'num-warn' : 'num-mute') + '">' + s.stops + '</td>' +
          '<td class="num num-mute">' + pct(s.riskRate) + '</td>' +
          '<td class="num num-warn">' + pct(s.unlabeledRate) + '</td>' +
        '</tr>';
      }).join('') +
      '</tbody></table></div>' +
      '<div class="table-note">' +
        '「千链接出单」= 累计出单 ÷ 在架链接 × 1000，用于横向比较各站点的产出效率。' +
        '「出单占比 − 链接占比」为正说明该站点产出高于投入（详见上方条形对比）。' +
        '风险率分母不含未标注记录；未标注率单独成列，<b>未标注 ≠ 健康</b>。' +
      '</div>';

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">站点产能对照</div>' +
      '<div class="card-hint">5 个站点 · 最高与最低相差 ' + dec(S.siteRatio, 1) + ' 倍</div></div>' +
      '<div class="heat-list">' + rows + '</div>' +
      '<div style="margin-top:14px">' + tbl + '</div>' +
      '</div>';
  }

  function siteGap() {
    var items = SITES.slice().sort(function (a, b) { return (b.gap || 0) - (a.gap || 0); });
    var pos = items.filter(function (s) { return (s.gap || 0) > 0; });
    var neg = items.filter(function (s) { return (s.gap || 0) <= 0; });
    function line(s) {
      var up = (s.gap || 0) > 0;
      return '<div class="ph-row">' +
        '<span class="ph-name">' + esc(s.name) + '　链接 ' + pct(s.linkShare) +
          ' → 出单 ' + pct(s.orderShare) + '</span>' +
        '<span class="ph-tag">' + (up ? '产出高于投入 +' : '产出低于投入 ') + dec(s.gap, 1) + ' pt</span>' +
      '</div>';
    }
    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">链接投入与出单贡献错配</div>' +
      '<div class="card-hint">该把链接投到哪，先看这张表</div></div>' +
      '<div class="placeholder-block">' +
        '<div class="ph-title">' + (pos.length || 0) + ' 个站点产出高于投入 · ' +
          (neg.length || 0) + ' 个站点产出低于投入</div>' +
        '<div class="ph-list">' + pos.map(line).join('') + neg.map(line).join('') + '</div>' +
        '<div class="table-note">' +
          '口径：「出单占比 − 链接占比」。正值 = 这个站点用更少的链接换来了更多的单，' +
          '说明铺货效率高；负值相反。<b>这只说明现状效率，不代表该站点就值得加投</b>——' +
          '还要看市场规模与竞争（见「品类总览」页）。' +
        '</div>' +
      '</div>' +
      '</div>';
  }

  function shopSiteMatrix() {
    var head = '<tr><th class="mx-shop">店铺</th><th class="mx-owner">管理人</th>' +
      SITE_NAMES.map(function (n) { return '<th>' + esc(n) + '</th>'; }).join('') +
      '<th class="num">合计出单</th></tr>';

    var body = MATRIX.map(function (m) {
      var cells = SITE_NAMES.map(function (n) {
        var c = null;
        (m.cells || []).forEach(function (x) { if (x.site === n) c = x; });
        if (!c || !c.records) {
          return '<td><div class="mx-cell"><span class="mx-val num-mute">无记录</span></div></td>';
        }
        var s = '';
        if (c.stops > 0) s += ' <span class="num-warn" style="font-size:10.5px">停' + c.stops + '</span>';
        return '<td><div class="mx-cell">' +
          '<span class="mx-val">' + lvDot(c.level) + ' <b>' + dec(c.per1000, 1) + '</b>' + s + '</span>' +
          '<span class="mx-line">' + c.orders + ' 单 · ' + c.records + ' 天</span>' +
          '</div></td>';
      }).join('');
      return '<tr>' +
        '<td class="mx-shop">' + esc(m.shop) +
          (m.anomaly ? '<div class="anomaly-flag" style="margin-top:4px">出单口径待核</div>' : '') + '</td>' +
        '<td class="td-owner">' + esc(m.owner) + '</td>' +
        cells +
        '<td class="num num-strong">' + nf(m.orders) + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">现有店 × 站点 铺货矩阵</div>' +
      '<div class="card-hint">18 家店 × 5 个站点，' + (S.cells || 0) + ' / ' + (S.cellsFull || 0) + ' 格有记录</div></div>' +
      '<div class="table-scroll"><table class="matrix-table">' +
        '<thead>' + head + '</thead><tbody>' + body + '</tbody>' +
      '</table></div>' +
      '<div class="table-note">' +
        '每格上方：色级点 + <b>千链接出单</b>（该店在该站点的产出效率，越高越好）；' +
        '下方：累计出单 · 有记录天数。「停 N」= 该格记录的封停次数。' +
        '横向对比同一家店在不同站点的效率，比纵向比不同店更有意义。' +
      '</div>' +
      '</div>';
  }

  /* ══════════════ 二 · 店铺规划表 ══════════════ */

  function existPlanTable() {
    var rows = EXISTING.map(function (e) {
      return '<tr>' +
        '<td class="td-shop">' + esc(e.shop) +
          (e.anomaly ? '<div class="anomaly-flag" style="margin-top:4px">出单口径待核</div>' : '') + '</td>' +
        '<td class="td-owner">' + esc(e.owner) + '</td>' +
        '<td class="mx-site">' + siteDots(e.curSites) + '</td>' +
        '<td class="num">' + nf(e.links) + '</td>' +
        '<td class="num num-strong">' + nf(e.orders) + '</td>' +
        '<td class="num">' + dec(e.per1000, 1) + '</td>' +
        '<td class="num ' + ((e.riskCount || 0) > 0 ? 'num-warn' : 'num-mute') + '">' + (e.riskCount || 0) + '</td>' +
        '<td>' + posChip(e.plan && e.plan.position) + '</td>' +
        '<td>' + todo() + '</td>' +
        '<td>' + todo() + '</td>' +
        '<td>' + todo() + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">存量店铺定位表</div>' +
      '<div class="card-hint">18 家在营店 · 左侧为真实底数，右侧四列待管理人填</div></div>' +
      '<div class="table-scroll"><table class="shop-table plan-table">' +
        '<thead><tr>' +
          '<th>店铺</th><th>管理人</th><th class="mx-site">站点覆盖</th>' +
          '<th class="num">在架链接</th><th class="num">累计出单</th><th class="num">千链接出单</th>' +
          '<th class="num">风险记录</th>' +
          '<th>定位</th><th>规划品类</th><th>目标人群</th><th>阶段</th>' +
        '</tr></thead><tbody>' + rows + '</tbody>' +
      '</table></div>' +
      siteLegend() +
      posLegend() +
      '<div class="table-note">' +
        '左侧 7 列是<b>真实运营底数</b>（与店铺矩阵 / 独立核算同口径），用来判断这家店适合铺货还是做精；' +
        '右侧 4 列是<b>规划决策，全部留空</b>——定位、品类、人群、阶段由管理人定，页面不替你推断。' +
        '站点覆盖现状：18 家店<b>全部 5 个站点全铺</b>，没有一家做过站点取舍。' +
      '</div>' +
      '</div>';
  }

  function newShopTable() {
    if (!NEW_SHOPS.length) return '';
    var cols = D.newFields || [];
    var head = '<tr><th class="nh-no">#</th>' +
      cols.map(function (c) { return '<th>' + esc(c.label) + '</th>'; }).join('') +
      '</tr>';
    var body = NEW_SHOPS.map(function (n) {
      return '<tr>' +
        '<td class="nh-no">' + n.no + '</td>' +
        cols.map(function () { return '<td>' + todo() + '</td>'; }).join('') +
      '</tr>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">拟新开店铺规划表</div>' +
      '<div class="card-hint">行数按实际需要增减，字段可加</div></div>' +
      '<div class="table-scroll"><table class="shop-table new-table">' +
        '<thead>' + head + '</thead><tbody>' + body + '</tbody>' +
      '</table></div>' +
      '<div class="table-note"><b>字段口径</b>：' +
        cols.map(function (c) {
          return '<b>' + esc(c.label) + '</b> ' + esc(c.hint);
        }).join('；') + '。' +
      '</div>' +
      '<div class="rule-note" style="margin-top:14px"><b>开新店前必须先想清楚的三件事</b><ul>' +
        '<li>新店的定位不能和现有 18 家重复，否则是同室操戈</li>' +
        '<li>目标站点的产能是否已验证——站点之间效率差 ' +
          dec(S.siteRatio, 1) + ' 倍，开错站点等于从零开始踩坑</li>' +
        '<li>新店首月目标与验收口径要先定，否则开完无法判断成败，也接不上分红机制</li>' +
      '</ul></div>' +
      '</div>';
  }

  /* ══════════════ 三 · 待定项与缺口 ══════════════ */

  function openList() {
    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">规划待定项</div>' +
      '<div class="card-hint">' + OPEN.length + ' 条 · 需老周 / 管理人拍板后才能落表</div></div>' +
      '<div class="gate-list">' +
        OPEN.map(function (o, i) {
          return '<div class="gate-item">' +
            '<div class="gate-no">' + (i + 1) + '</div>' +
            '<div class="gate-body">' +
              '<div class="gate-name">' + esc(o.name) + '</div>' +
              '<div class="gate-rule">决策人：' + esc(o.who) + '</div>' +
              '<div class="gate-why">' + esc(o.why) + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '</div>';
  }

  function gapList() {
    return '<div class="card">' +
      '<div class="card-head"><div class="card-title ct-orange">数据缺口清单</div>' +
      '<div class="card-hint">' + GAPS.length + ' 项 · 补齐后才能把规划做实</div></div>' +
      '<div class="gap-list">' +
        GAPS.map(function (g) {
          return '<div class="gap-item">' +
            '<span class="gap-lv ' + (g.level === '高' ? 'gap-high' : 'gap-mid') + '">' + esc(g.level) + '</span>' +
            '<div class="gap-body">' +
              '<div class="gap-name">' + esc(g.item) + '</div>' +
              '<div class="gap-problem">' + esc(g.problem) + '</div>' +
              '<div class="gap-impact">影响：' + esc(g.impact) + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '</div>';
  }

  /* ══════════════ 入口 ══════════════ */

  function render(root) {
    var plannedExisting = EXISTING.filter(function (e) {
      return e.plan && e.plan.position;
    }).length;

    var html = pageHeader('店铺规划', '顺诚AI工作平台 / 店铺矩阵 / 店铺规划',
      '规划要开哪些店 · 每店定位 · 卖什么 · 卖给谁');

    /* 概览条 */
    html += '<div class="overview-bar">' +
      overviewItem('在营店铺', (S.shops || 0) + ' 家',
        '李源 9 · 石老师 9') +
      overviewItem('覆盖站点', (S.sites || 0) + ' 个',
        SITE_NAMES.join(' / ')) +
      overviewItem('店 × 站点', (S.cells || 0) + ' / ' + (S.cellsFull || 0) + ' 格',
        '全部店铺 5 站点全铺') +
      overviewItem('已定定位', plannedExisting + ' / ' + (S.shops || 0),
        plannedExisting ? '' : '全部待规划') +
      '</div>';

    /* 异常警示：直接复用 findings 里已经算好的事实，避免两处口径与文案不一致 */
    if (ANO.length) {
      var anoF = null;
      FINDINGS.forEach(function (f) { if (f.id === 'anomaly') anoF = f; });
      html += '<div class="card" style="border-left:3px solid #d98b8b">' +
        '<div class="card-title ct-orange">先看这条：有 ' + ANO.length +
          ' 家店的数据不能用来做规划对标</div>' +
        '<div class="table-note" style="margin-top:6px;font-size:12.5px;line-height:1.75">' +
          esc(anoF ? anoF.fact : ANO.join('、') + ' 出单口径待核。') + ' ' +
          esc(anoF ? anoF.imply : '不要拿它当基准。') +
        '</div>' +
      '</div>';
    }

    /* 一 · 开店决策底数 */
    html += partBand('一', '开店决策底数', '先看清现在铺成什么样，再谈要开什么店');
    html += findingBlock();
    html += siteCapacity();
    html += siteGap();
    html += shopSiteMatrix();

    /* 二 · 店铺规划 */
    html += partBand('二', '店铺规划', '存量定定位 · 增量定名单', true);
    html += existPlanTable();
    html += newShopTable();

    /* 三 · 待定项与缺口 */
    html += partBand('三', '待定项与数据缺口', '这两块清了，规划才能落地', true);
    html += '<div class="cmp-grid">' + openList() + gapList() + '</div>';

    html += ruleNote();
    html += pageFoot();

    root.innerHTML = html;
  }

  function overviewItem(label, value, sub) {
    return '<div class="overview-item">' +
      '<div class="ov-label">' + esc(label) + '</div>' +
      '<div class="ov-value">' + esc(value) + '</div>' +
      (sub ? '<div class="ov-sub">' + esc(sub) + '</div>' : '') +
      '</div>';
  }

  function partBand(no, name, desc, next) {
    return '<div class="part-band' + (next ? ' is-next' : '') + '">' +
      '<div class="part-no">' + esc(no) + '</div>' +
      '<div class="part-name">' + esc(name) + '</div>' +
      '<div class="part-desc">' + esc(desc) + '</div>' +
      '</div>';
  }

  var root = document.getElementById('sc-content');
  if (root) {
    try {
      render(root);
    } catch (e) {
      root.innerHTML = '<div class="card"><div class="card-title">渲染出错</div>' +
        '<div class="table-note">' + esc(e && e.message) + '</div></div>';
      throw e;
    }
  }
})();
