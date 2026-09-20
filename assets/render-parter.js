/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 店铺合伙 渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/parter.js（由 scripts/13_build_parterdata.py 生成）
   三个页面（由 <body data-page="..."> 决定）：
     parter          → 合伙总览（两位合伙人 + 损益结构 + 分红机制）
     parter-liyuan   → 李源
     parter-shi      → 石老师

   铁律：金额位没有数据就显示「待接入」，绝不填估算值。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var D = window.SC_PARTER || {};
  var PAGE = (document.body.getAttribute('data-page') || '');
  var MONTHS = D.months || [];
  var PARTNERS = D.partners || [];
  var PL = D.plRows || [];
  var RULE = D.rule || {};
  var GAPS = D.gaps || [];

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  function nf(v) {
    if (v === null || v === undefined) return '—';
    return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function dec(v, d) {
    if (v === null || v === undefined) return '—';
    return v.toFixed(d === undefined ? 1 : d);
  }

  function pct(v, d) {
    if (v === null || v === undefined) return '—';
    return v.toFixed(d === undefined ? 1 : d) + '%';
  }

  /* 金额位：有值给 ¥，无值给「待接入」——这是本模块的核心显示规则 */
  function money(v) {
    if (v === null || v === undefined) return '<span class="money-todo">待接入</span>';
    return '¥' + nf(v);
  }

  function pageHeader(title, crumb, actions, right) {
    return '' +
      '<div class="page-header-card">' +
        '<div class="page-header-top">' +
          '<div class="page-title">' + title + '</div>' +
          '<div class="page-actions">' + (actions || '') + '</div>' +
        '</div>' +
        '<div class="page-header-bottom">' +
          '<div class="breadcrumb">' + crumb + '</div>' +
          (right ? '<div class="breadcrumb">' + right + '</div>' : '') +
        '</div>' +
      '</div>';
  }

  function pageFoot(layer) {
    var m = D.meta || {};
    return '' +
      '<div class="page-foot">' +
        '<span>数据源：' + esc(m.source || '数据底座') + ' · 区间 ' + esc(m.span || '') + '</span>' +
        '<span>数据层：data/parter.js（自动生成）' + (layer ? ' · ' + layer : '') + '</span>' +
      '</div>';
  }

  function ruleNote() {
    var rules = (D.meta || {}).rules || [];
    return '<div class="rule-note"><b>口径说明</b><ul>' +
      rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') +
      '</ul></div>';
  }

  function crumbTop(name) {
    return '<a href="parter.html">店铺合伙</a> / <span>' + esc(name) + '</span>';
  }

  /* ══════════════ 共用块 ══════════════ */

  function plTable(withMonths) {
    var head = '<thead><tr><th style="width:132px">项目</th><th>口径 / 数据来源</th>' +
      (withMonths ? MONTHS.map(function (m) {
        return '<th style="width:96px;text-align:right">' + esc(m.label) + '</th>';
      }).join('') : '<th style="width:190px">状态</th>') +
      '</tr></thead>';

    var body = PL.map(function (row) {
      var cls = row.kind === 'subtotal' ? 'pl-sub' : row.kind === 'total' ? 'pl-total' : '';
      var sign = row.kind === 'plus' ? '＋' : row.kind === 'minus' ? '−' :
                 row.kind === 'subtotal' ? '＝' : '＝';
      var right = withMonths
        ? MONTHS.map(function () {
            return '<td class="num" style="text-align:right">' + money(null) + '</td>';
          }).join('')
        : '<td>' + (row.status === 'derived'
            ? '<span class="grade-chip grade-none">自动计算</span>'
            : '<span class="grade-chip grade-c">待接入</span>') + '</td>';
      return '<tr class="' + cls + '">' +
        '<td class="pl-name"><span class="pl-sign">' + sign + '</span>' + esc(row.name) + '</td>' +
        '<td class="pl-src">' + esc(row.src) +
          (row.owner && row.owner !== '—' ? '　·　' + esc(row.owner) : '') + '</td>' +
        right +
      '</tr>';
    }).join('');

    return '<div class="pl-wrap"><table class="pl-table">' + head +
      '<tbody>' + body + '</tbody></table></div>';
  }

  function parterCard(p, current) {
    var t = p.totals || {};
    return '' +
      '<a class="parter-card' + (current === p.id ? ' is-current' : '') + '" href="' + esc(p.page) + '">' +
        '<div class="parter-top">' +
          '<div class="parter-avatar">' + esc(p.name.charAt(0)) + '</div>' +
          '<div>' +
            '<div class="parter-name">' + esc(p.name) + '</div>' +
            '<div class="parter-role">' + esc(p.role) + ' · ' + (t.shops || 0) + ' 家店</div>' +
          '</div>' +
        '</div>' +
        '<div class="parter-metrics">' +
          '<div class="parter-metric"><div class="pm-label">在架链接</div>' +
            '<div class="pm-value">' + nf(t.links) + '</div></div>' +
          '<div class="parter-metric"><div class="pm-label">累计出单</div>' +
            '<div class="pm-value">' + nf(t.orders) + '</div></div>' +
          '<div class="parter-metric"><div class="pm-label">转化率</div>' +
            '<div class="pm-value">' + pct(t.conv, 2) + '</div></div>' +
        '</div>' +
        '<div class="parter-shops">负责店铺：' + esc((p.shops || []).join('、')) + '</div>' +
      '</a>';
  }

  function gatesHtml() {
    return '<div class="gate-list">' + (RULE.gates || []).map(function (g) {
      return '' +
        '<div class="gate-item">' +
          '<div class="gate-no">' + g.no + '</div>' +
          '<div class="gate-body">' +
            '<div class="gate-name">' + esc(g.name) +
              ' <span class="grade-chip grade-none">' + esc(g.status) + '</span></div>' +
            '<div class="gate-rule">' + esc(g.rule) + '</div>' +
            '<div class="gate-why">为什么要有它：' + esc(g.why) + '</div>' +
          '</div>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* ══════════════ 页面 1：合伙总览 ══════════════ */
  function renderOverview(root) {
    var S = D.summary || {};
    var html = '';

    html += pageHeader(
      '店铺合伙 · 总览',
      crumbTop('总览'),
      PARTNERS.map(function (p) {
        return '<a class="btn btn-secondary" href="' + esc(p.page) + '">' + esc(p.name) + '</a>';
      }).join(''),
      '人维度核算 · 钱的部分待接入'
    );

    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item"><div class="ov-label">合伙人</div>' +
          '<div class="ov-value">' + (S.partners || 0) + '</div>' +
          '<div class="ov-sub">李源 · 石老师</div></div>' +
        '<div class="overview-item"><div class="ov-label">覆盖店铺</div>' +
          '<div class="ov-value">' + (S.shops || 0) + '</div>' +
          '<div class="ov-sub">每人各 9 家</div></div>' +
        '<div class="overview-item"><div class="ov-label">可分配金额</div>' +
          '<div class="ov-value" style="font-size:19px">待接入</div>' +
          '<div class="ov-sub">经营利润未接入</div></div>' +
        '<div class="overview-item"><div class="ov-label">待补数据</div>' +
          '<div class="ov-value">' + (S.moneyTotal || 8) + '</div>' +
          '<div class="ov-sub">' + (S.moneyReady || 0) + ' 项已就位</div></div>' +
      '</div>';

    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">⚠</div>先说清楚：这一页现在能算什么</div>' +
          '<span class="card-hint">不填假数，是刻意的</span>' +
        '</div>' +
        '<div class="finding">' +
          '核算公式是你定的：<b>销售额 − 变动费 = 边界利润；边界利润 − 个人工资 − 固定费分摊 = 经营利润</b>。' +
          '这条链上一共 8 项输入，<b>现在一项都没有</b>——数据底座 16 个原始字段全是运营行为（链接 / 访问 / 出单 / 状态），不含一分钱。' +
          '<br><br>' +
          '所以本模块分两半：<b>结构先立住</b>（损益表、分红链、参数、保险丝全部到位），' +
          '<b>数字等数据</b>（订单一到，同一张表直接灌数，不用返工）。' +
        '</div>' +
      '</div>';

    /* 两位合伙人 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">👥</div>两位合伙人</div>' +
          '<span class="card-hint">点卡片进入各自的核算页</span>' +
        '</div>' +
        '<div class="parter-bar">' + PARTNERS.map(function (p) { return parterCard(p); }).join('') + '</div>' +
        '<div class="table-note">' +
          '卡片上的数字是<b>真实运营底数</b>（与「独立核算」同口径，可直接对照）。' +
          '两人的跑法方向相反：石老师铺货量更大、出单更高，但封停 82 次；李源规模小、封停 0 次。' +
        '</div>' +
      '</div>';

    /* 损益结构 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🧮</div>损益结构（10 行）</div>' +
          '<span class="card-hint">两张绿色行是要看的两个数</span>' +
        '</div>' +
        plTable(false) +
        '<div class="table-note">' +
          '注意第 8 行「个人工资」<b>单列</b>，没有并进固定费——这是你特意拆出来的，' +
          '为的是让"这个人本身值多少"和"这门生意本身赚多少"两笔账分开看。' +
        '</div>' +
      '</div>';

    /* 分红机制 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">💰</div>增量分红机制</div>' +
          '<span class="card-hint">基准已定，其余参数待你确认</span>' +
        '</div>' +
        '<div class="ph-list">' +
          (RULE.chain || []).map(function (c, i) {
            return '<div class="ph-row"><span class="ph-name">第 ' + (i + 1) + ' 步　' + esc(c) +
              '</span><span class="ph-tag">规则</span></div>';
          }).join('') +
        '</div>' +
        '<div class="param-grid" style="margin-top:16px">' +
          '<div class="param-item">' +
            '<div class="param-label">分红基准线</div>' +
            '<div class="param-value">实际利润 × ' + dec(RULE.base && RULE.base.multiplier, 2) + '</div>' +
            '<div class="param-note">' + esc((RULE.base || {}).formula || '') + '</div>' +
          '</div>' +
          '<div class="param-item">' +
            '<div class="param-label">发放节奏</div>' +
            '<div class="param-value">' +
              pct((RULE.deferral || {}).current * 100, 0) + ' 当期 + ' +
              pct((RULE.deferral || {}).yearEnd * 100, 0) + ' 年终</div>' +
            '<div class="param-note">' + esc((RULE.deferral || {}).note || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="table-note">分配比例阶梯：' +
          (RULE.tiers || []).map(function (t) {
            return esc(t.label) + ' → <b>' + pct(t.rate * 100, 0) + '</b>';
          }).join('　|　') +
          '（' + esc(RULE.tiersStatus || '待确认') + '）</div>' +
      '</div>';

    /* 四道保险丝 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🛡</div>四道保险丝</div>' +
          '<span class="card-hint">缺一道，机制都会走歪</span>' +
        '</div>' +
        gatesHtml() +
        '<div class="table-note">' + esc(RULE.gateNote || '') + '</div>' +
      '</div>';

    /* 数据缺口 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🔧</div>要补的 8 项数据</div>' +
          '<span class="card-hint">5 项后台就有，3 项要自建</span>' +
        '</div>' +
        '<div class="gap-list">' +
          GAPS.map(function (gp) {
            return '<div class="gap-item">' +
              '<span class="gap-lv gap-' + (gp.status === '待建' ? 'high' : 'mid') + '">' +
                esc(gp.status) + '</span>' +
              '<span class="gap-body">' +
                '<span class="gap-name">' + esc(gp.item) +
                  ' <span class="grade-chip grade-none">' + esc(gp.tier) + '</span></span>' +
                '<span class="gap-problem">来源：' + esc(gp.from) + '　·　' + esc(gp.owner) + '</span>' +
                '<span class="gap-impact">影响：' + esc(gp.impact) + '</span>' +
              '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">' +
          '「待导」= 美客多后台现成，导出来即可；「待建」= 只有顺诚自己知道，必须自建。' +
          '其中<b>采购成本表</b>是变动费里最大一项，也是内部定价的入口。' +
        '</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot('人维度核算 · 待接入');
    root.innerHTML = html;
  }

  /* ══════════════ 页面 2/3：单个合伙人 ══════════════ */
  function renderPartner(root, p) {
    var t = p.totals || {};
    var html = '';

    var others = PARTNERS.filter(function (x) { return x.id !== p.id; });
    html += pageHeader(
      '店铺合伙 · ' + esc(p.name),
      crumbTop(p.name),
      '<a class="btn btn-secondary" href="parter.html">← 合伙总览</a>' +
      others.map(function (o) {
        return '<a class="btn btn-secondary" href="' + esc(o.page) + '">' + esc(o.name) + '</a>';
      }).join(''),
      esc(p.role)
    );

    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item"><div class="ov-label">负责店铺</div>' +
          '<div class="ov-value">' + (t.shops || 0) + '</div>' +
          '<div class="ov-sub">家</div></div>' +
        '<div class="overview-item"><div class="ov-label">在架链接</div>' +
          '<div class="ov-value">' + nf(t.links) + '</div>' +
          '<div class="ov-sub">期末快照</div></div>' +
        '<div class="overview-item"><div class="ov-label">累计出单</div>' +
          '<div class="ov-value">' + nf(t.orders) + '</div>' +
          '<div class="ov-sub">期内累加</div></div>' +
        '<div class="overview-item"><div class="ov-label">本期分红</div>' +
          '<div class="ov-value" style="font-size:19px">待接入</div>' +
          '<div class="ov-sub">经营利润未接入</div></div>' +
      '</div>';

    /* 损益表（核心） */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🧮</div>月度损益表</div>' +
          '<span class="card-hint">10 行结构 × 3 个月 · 金额待接入</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll" style="min-width:0">' + plTable(true) + '</div>' +
        '<div class="table-note">' +
          '灰色「待接入」= 该项数据尚未采集，<b>不是 0</b>。' +
          '把某一项填 0 会把利润算虚，这是核算表最常见的坑，所以一律留空标注。' +
        '</div>' +
      '</div>';

    /* 店 × 月 经营利润矩阵 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📐</div>各店 × 各月 经营利润</div>' +
          '<span class="card-hint">这是分红的最小结算单元</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="matrix-table">' +
            '<thead><tr><th class="mx-shop" style="min-width:100px">店铺</th>' +
              MONTHS.map(function (m) {
                return '<th>' + esc(m.label) + '</th>';
              }).join('') +
              '<th>全期出单</th></tr></thead>' +
            '<tbody>' +
              (p.shopMonthly || []).map(function (sh) {
                return '<tr>' +
                  '<td class="mx-shop">' + esc(sh.shop) + '</td>' +
                  sh.cells.map(function (c) {
                    var ops = c.ops;
                    return '<td><div class="mx-cell">' +
                      '<span class="mx-line">' + money(null) + '</span>' +
                      '<span class="mx-line" style="font-size:11px">出单 ' +
                        (ops ? nf(ops.orders) : '—') + ' · 覆盖 ' +
                        (ops ? ops.coverDays + '天' : '—') + '</span>' +
                    '</div></td>';
                  }).join('') +
                  '<td class="num"><b>' + nf(sh.cells.reduce(function (a, c) {
                    return a + ((c.ops || {}).orders || 0);
                  }, 0)) + '</b></td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '每格 = 该店该月的经营利润（待接入），下方小字是该月<b>真实运营底数</b>。' +
          '分红按月结算，格子里有数才有得算。' +
        '</div>' +
      '</div>';

    /* 分红台账 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📒</div>分红台账</div>' +
          '<span class="card-hint">基准 = 实际利润 × ' + dec((RULE.base || {}).multiplier, 2) + '</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:84px"><col style="width:90px"><col style="width:90px">' +
              '<col style="width:90px"><col style="width:90px"><col style="width:90px">' +
              '<col style="width:86px"><col style="width:70px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>月份</th><th>经营利润</th><th>基准线</th><th>增量利润</th>' +
              '<th>分红池</th><th>个人分红</th><th>当期发放</th><th>状态</th>' +
            '</tr></thead>' +
            '<tbody>' +
              ((p.bonus || {}).ledger || []).map(function (l) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(l.month) + '</td>' +
                  '<td class="num">' + money(l.operatingProfit) + '</td>' +
                  '<td class="num">' + money(l.baseLine) + '</td>' +
                  '<td class="num">' + money(l.increment) + '</td>' +
                  '<td class="num">' + money(l.pool) + '</td>' +
                  '<td class="num num-strong">' + money(l.personal) + '</td>' +
                  '<td class="num">' + money(l.paid) + '</td>' +
                  '<td><span class="grade-chip grade-none">待接入</span></td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          esc((p.bonus || {}).reason || '') +
          '　递延部分（' + pct((RULE.deferral || {}).yearEnd * 100, 0) + '）不列在当期货款里，年终统一结算。' +
        '</div>' +
      '</div>';

    /* 数据完整度警示 */
    var badMonths = MONTHS.filter(function (m) { return !m.complete; });
    if (badMonths.length) {
      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-orange">⚠</div>分红结算前必须先解决这一条</div>' +
            '<span class="card-hint">三个月，没有一个完整月</span>' +
          '</div>' +
          '<div class="finding">' +
            '分红是<b>按月结算</b>的，一个月算不干净，分红就没有可信的分母。当前三个月全部不完整：' +
            '<br><br>' +
            MONTHS.map(function (m) {
              return '<b>' + esc(m.label) + '</b>：' + esc(m.note || '');
            }).join('<br>') +
            '<br><br>' +
            '原因不是运营偷懒，是<b>填报口径不统一</b>——不同店铺的记录起止时间不一样，' +
            '7 月尤其严重（李源只有 2 家店有记录）。<b>在建立固定月报机制前，增量分红无法准确结算</b>。' +
          '</div>' +
        '</div>';
    }

    /* 各店运营底数（真实） */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">🏬</div>' + esc(p.name) + ' 负责的 ' +
            (t.shops || 0) + ' 家店（真实运营底数）</div>' +
          '<span class="card-hint">与「独立核算」同口径，可直接对照</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:100px"><col style="width:60px"><col style="width:60px">' +
              '<col style="width:88px"><col style="width:66px"><col style="width:80px">' +
              '<col style="width:82px"><col style="width:70px"><col style="width:60px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>店铺</th><th>站点</th><th>覆盖</th><th>在架链接</th><th>全期出单</th>' +
              '<th>千链接出单</th><th>转化率</th><th>风险天数</th><th>封停</th>' +
            '</tr></thead>' +
            '<tbody>' +
              (p.shopMonthly || []).map(function (sh) {
                var orders = sh.cells.reduce(function (a, c) {
                  return a + ((c.ops || {}).orders || 0);
                }, 0);
                var visits = sh.cells.reduce(function (a, c) {
                  return a + ((c.ops || {}).visits || 0);
                }, 0);
                var risk = sh.cells.reduce(function (a, c) {
                  return a + ((c.ops || {}).riskDays || 0);
                }, 0);
                return '<tr>' +
                  '<td class="td-shop">' + esc(sh.shop) + '</td>' +
                  '<td class="td-owner">' + (sh.sites || []).length + ' 个</td>' +
                  '<td class="num num-mute">' + sh.coverDays + ' 天</td>' +
                  '<td class="num">' + nf(sh.links) + '</td>' +
                  '<td class="num num-strong">' + nf(orders) + '</td>' +
                  '<td class="num">' + dec(sh.links ? orders / sh.links * 1000 : null) + '</td>' +
                  '<td class="num num-mute">' + (visits ? pct(orders / visits * 100, 2) : '—') + '</td>' +
                  '<td class="num num-mute">' + risk + ' 天</td>' +
                  '<td class="num' + (sh.stops ? ' num-warn' : ' num-mute') + '">' + sh.stops + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '「覆盖」= 该店有记录的天数（各家不等，<b>横比时务必参照这一列</b>）。' +
          '「千链接出单」= 全期出单 ÷ 在架链接 × 1000，与独立核算页同一算法。' +
        '</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot('人维度核算 · 待接入');
    root.innerHTML = html;
  }

  /* ══════════════ 入口 ══════════════ */
  function boot() {
    var root = document.getElementById('sc-content');
    if (!root) return;
    if (!PARTNERS.length) {
      root.innerHTML = '<div class="card"><div class="card-title">数据未加载</div>' +
        '<div class="table-note">请确认 data/parter.js 存在，或重新运行 ' +
        'scripts/13_build_parterdata.py 生成。</div></div>';
      return;
    }
    if (PAGE === 'parter') { renderOverview(root); return; }
    if (PAGE === 'parter-liyuan' || PAGE === 'parter-shi') {
      var want = PAGE === 'parter-liyuan' ? 'liyuan' : 'shi';
      var p = PARTNERS.filter(function (x) { return x.id === want; })[0];
      if (p) { renderPartner(root, p); return; }
    }
    root.innerHTML = '<div class="card"><div class="card-title">未识别的页面</div>' +
      '<div class="table-note">请在 body 上标注 data-page="parter" / "parter-liyuan" / "parter-shi"。</div></div>';
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
