/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 独立核算渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/acct.js（由 scripts/12_build_acctdata.py 生成）
   两个页面（由 <body data-page="..."> 决定）：
     acct           → 店铺经营核算（第一层 · 经营效率口径）
     acct-products  → 产品核算（第二层 · 待接入，出导出对照单）
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var D = window.SC_ACCT || {};
  var PAGE = (document.body.getAttribute('data-page') || '');
  var UNITS = D.units || [];
  var OWNERS = D.owners || [];
  var SITES = D.sites || [];
  var QUADS = D.quads || [];

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

  function clamp(w) { return Math.max(0, Math.min(100, w)); }

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
        '<span>数据层：data/acct.js（自动生成）' + (layer ? ' · ' + layer : '') + '</span>' +
      '</div>';
  }

  function ruleNote() {
    var rules = (D.meta || {}).rules || [];
    return '<div class="rule-note"><b>口径说明</b><ul>' +
      rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') +
      '</ul></div>';
  }

  function crumbOf(name) {
    return '<a href="ops.html">经营数据</a> / <span>' + name + '</span>';
  }

  function gradeChip(g) {
    var cls = g === 'A' ? 'grade-a' : g === 'B' ? 'grade-b' : g === 'C' ? 'grade-c' : 'grade-none';
    return '<span class="grade-chip ' + cls + '">' + esc(g) + '</span>';
  }

  function barOf(v, max, cls) {
    var w = max ? clamp(v / max * 100) : 0;
    return '<span class="heat-track"><div class="heat-fill ' + (cls || 'bar-blue') +
      '" style="width:' + w.toFixed(1) + '%"></div></span>';
  }

  /* ══════════════ 页面 1：店铺经营核算 ══════════════ */
  function renderUnits(root) {
    var S = D.summary || {};
    var F = D.funnel || {};
    var html = '';

    html += pageHeader(
      '独立核算 · 店铺经营核算',
      crumbOf('独立核算'),
      '<a class="btn btn-secondary" href="acct-products.html">🏷 产品核算</a>' +
      '<a class="btn btn-secondary" href="ops.html">📈 经营概览</a>',
      '第一层 · 经营效率口径'
    );

    /* 概览条 */
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">经营单元</div>' +
          '<div class="ov-value">' + (S.units || 0) + '</div>' +
          '<div class="ov-sub">1 家店 = 1 个核算单元</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">在架链接</div>' +
          '<div class="ov-value">' + nf(S.links) + '</div>' +
          '<div class="ov-sub">期末快照 · 18 店 × 5 站点</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">累计出单</div>' +
          '<div class="ov-value">' + nf(S.orders) + '</div>' +
          '<div class="ov-sub">期内 ' + (S.activeDays || 0) + ' 天累加</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">中位千链接出单</div>' +
          '<div class="ov-value">' + dec(S.medianOut) + '</div>' +
          '<div class="ov-sub">效率基准线（= 指数 100）</div>' +
        '</div>' +
      '</div>';

    /* 口径澄清 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">⚠</div>这不是利润表，是效率表</div>' +
          '<span class="card-hint">先把性质说清楚，再谈数字</span>' +
        '</div>' +
        '<div class="finding">' +
          '经营核算的公式是 <b>收入 − 成本 − 佣金 − 运费 − 广告费 − 退款 = 利润</b>。' +
          '这六项金额，当前数据底座<b>一项都没有</b>——现有 26 个字段全是运营行为（链接 / 访问 / 出单 / 状态）。' +
          '<br><br>' +
          '所以本页给出的是<b>第一层：经营效率核算</b>，回答"谁在高效运转、谁在空转"，' +
          '不回答"谁赚了钱"。它的价值是：<b>先把经营单元的账框立起来</b>，' +
          '等订单明细到位，同一套单元结构直接灌入金额，不用返工重做。' +
        '</div>' +
      '</div>';

    /* 先看这一条：假标杆 */
    var fake = UNITS.filter(function (u) { return u.anomaly; });
    if (fake.length) {
      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-orange">🔍</div>先看这一条：榜首的"标杆"是假的</div>' +
            '<span class="card-hint">别照着一个数据错误去复制</span>' +
          '</div>' +
          '<div class="finding">' +
            fake.map(function (u) {
              return '<b>' + esc(u.name) + '</b> 的千链接出单是 <b>' + dec(u.outPer1000) +
                '</b>，是中位数 ' + dec(S.medianOut) + ' 的 <b>' + dec(u.index / 100, 1) +
                ' 倍</b>，算法自动把它排到了第一。但——' + esc(u.anomaly) + '。' +
                '<br>大概率是把「总出单」填进了「当日出单」列。' +
                '<b>该单元数据保留展示，但不作为对标基准</b>。' +
                '核算要对标，请先剔除这一行。';
            }).join('') +
          '</div>' +
        '</div>';
    }

    /* 单位链接产出 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">🔁</div>每千条在架链接的产出</div>' +
          '<span class="card-hint">把 22 万条链接换算成"能卖多少"</span>' +
        '</div>' +
        '<div class="market-grid">' +
          '<div class="market-card">' +
            '<h4>每 1,000 条在架链接</h4>' +
            '<div class="value">' + dec(F.visitsPer1000, 0) + ' 次访问</div>' +
            '<div class="value-sub">链接被看到的效率</div>' +
          '</div>' +
          '<div class="market-card">' +
            '<h4>每 1,000 条在架链接</h4>' +
            '<div class="value">' + dec(F.ordersPer1000) + ' 单</div>' +
            '<div class="value-sub">链接变成订单的效率</div>' +
          '</div>' +
          '<div class="market-card">' +
            '<h4>出 1 单需要</h4>' +
            '<div class="value">' + dec(F.perOrderVisits, 0) + ' 次访问</div>' +
            '<div class="value-sub">≈ ' + dec(F.perOrderLinks, 0) + ' 条在架链接</div>' +
          '</div>' +
        '</div>' +
        '<div class="table-note">换算基数：在架链接 ' + nf(F.links) + ' · 累计访问 ' + nf(F.visits) +
          ' · 累计出单 ' + nf(F.orders) + ' · 期内 ' + (F.spanDays || 0) + ' 天。' +
          '链接是期末快照、访问与出单是期内累加，两者期量不同，此换算表示"以当前在架规模承接期内产出"的量级关系。</div>' +
      '</div>';

    /* 18 单元核算表 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">📋</div>18 个经营单元核算表</div>' +
          '<span class="card-hint">按千链接出单降序 · 覆盖天数决定可比性</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:104px"><col style="width:58px"><col style="width:56px">' +
              '<col style="width:56px"><col style="width:62px"><col style="width:82px">' +
              '<col style="width:64px"><col style="width:74px"><col style="width:64px">' +
              '<col style="width:82px"><col style="width:74px"><col style="width:44px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>经营单元</th><th>管理人</th><th>覆盖</th><th>风险</th><th>未标注</th>' +
              '<th>在架链接</th><th>链接占比</th>' +
              '<th>累计出单</th><th>出单占比</th>' +
              '<th>千链接出单</th><th>效率指数</th><th>级</th>' +
            '</tr></thead>' +
            '<tbody>' +
              UNITS.map(function (u) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(u.name) +
                    (u.anomaly ? '<div class="anomaly-flag">出单口径待核</div>' : '') + '</td>' +
                  '<td class="td-owner">' + esc(u.owner) + '</td>' +
                  '<td class="num num-mute">' + u.coverDays + ' 天</td>' +
                  '<td class="num num-mute">' + u.riskDays + ' 天</td>' +
                  '<td class="num num-mute">' + u.unlabeledDays + ' 天</td>' +
                  '<td class="num">' + nf(u.links) + '</td>' +
                  '<td class="num num-mute">' + pct(u.linkShare) + '</td>' +
                  '<td class="num num-strong">' + nf(u.orders) + '</td>' +
                  '<td class="num num-mute">' + pct(u.orderShare) + '</td>' +
                  '<td class="num num-strong">' + dec(u.outPer1000) + '</td>' +
                  '<td class="num' + (u.anomaly ? ' num-warn' : '') + '">' + dec(u.index, 0) + '</td>' +
                  '<td>' + gradeChip(u.grade) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '「覆盖」= 该店有记录的天数（13~60 天不等，<b>横比时务必参照这一列</b>）；' +
          '「风险」= 当天出现过红橙黄记录的天数；' +
          '「未标注」= 当天存在未标注记录的天数（与「风险」同口径、可重叠），<b>未标注 ≠ 健康</b>，风险天数为 0 但有大量未标注时，那个 0 不可信。' +
          '<br>「效率指数」以中位数 ' + dec(S.medianOut) + ' 为 100 基准：≥120 记 A、80~120 记 B、&lt;80 记 C（阈值为本次设定，可调）。' +
        '</div>' +
      '</div>';

    /* 产出投入比 */
    var ratioUnits = UNITS.filter(function (u) { return u.ioRatio !== null; });
    var maxRatio = Math.max.apply(null, ratioUnits.map(function (u) { return u.ioRatio; }).concat([1]));
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">⚖</div>产出投入比</div>' +
          '<span class="card-hint">出单占比 ÷ 链接占比 · 1.00 = 投入产出持平</span>' +
        '</div>' +
        '<div class="heat-list">' +
          ratioUnits.map(function (u) {
            var cls = u.ioRatio >= 1.2 ? 'bar-green' : u.ioRatio >= 0.8 ? 'bar-blue' : 'bar-amber';
            return '' +
              '<div class="heat-row">' +
                '<span class="heat-site">' + esc(u.name) +
                  '<i class="heat-owner">' + esc(u.owner) + '</i></span>' +
                barOf(u.ioRatio, maxRatio, cls) +
                '<span class="heat-val"><b>' + dec(u.ioRatio, 2) + '</b><br>' +
                  pct(u.linkShare) + ' → ' + pct(u.orderShare) + '</span>' +
              '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">' +
          '算法：该店出单占比 ÷ 该店链接占比。&gt;1.2 说明<b>用较少的链接占了较多的出单</b>（高效）；' +
          '&lt;0.8 说明<b>铺了大量链接却没换来对应出单</b>（低效）。这条比绝对值更能看出结构问题。' +
        '</div>' +
      '</div>';

    /* 四象限 */
    var quadMeta = {
      '标杆单元': '效率高于中位数、封停风险低于中位数 —— 可作为内部对标基准',
      '高效高险': '跑得快，但封停风险高于中位数 —— 增长正在透支店铺安全',
      '低效低险': '没跑起来，但风险可控 —— 优化重点在选品与 listing 质量',
      '重灾区': '效率低于中位数、风险高于中位数 —— 应优先处置'
    };
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🎯</div>效率 × 风险 四象限</div>' +
          '<span class="card-hint">横轴 = 效率指数（100 为中位）· 纵轴 = 封停 / 30 天</span>' +
        '</div>' +
        '<div class="quad-grid">' +
          QUADS.map(function (q) {
            return '' +
              '<div class="quad-card">' +
                '<div class="quad-head">' +
                  '<span class="quad-name">' + esc(q.name) + '</span>' +
                  '<span class="quad-count">' + q.count + ' 家 · ' + nf(q.orders) + ' 单</span>' +
                '</div>' +
                '<div class="quad-shops">' + (q.shops.length ? esc(q.shops.join('、')) : '—') + '</div>' +
                '<div class="quad-meta">' + esc(quadMeta[q.name] || '') + '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">' +
          '分界：效率指数 100 = 全体中位数；封停风险取「封停 / 30 天」中位数。' +
          '注意「高效高险」这一档——它们的效率是靠违规铺货换来的，' +
          '封停一旦发生，前面赚的效率会被一次性抹掉。' +
        '</div>' +
      '</div>';

    /* 管理人对照 */
    var metricDefs = [
      { key: 'links', label: '在架链接', fmt: function (v) { return nf(v); } },
      { key: 'orders', label: '累计出单', fmt: function (v) { return nf(v); } },
      { key: 'outPer1000', label: '千链接出单', fmt: function (v) { return dec(v); } },
      { key: 'index', label: '效率指数', fmt: function (v) { return dec(v, 0); } },
      { key: 'conv', label: '转化率', fmt: function (v) { return pct(v, 2); } },
      { key: 'stops', label: '封停次数', fmt: function (v) { return nf(v); } }
    ];
    if (OWNERS.length) {
      var cmpHtml = '<div class="cmp-grid">' + OWNERS.map(function (o) {
        var rows = metricDefs.map(function (m) {
          var vals = OWNERS.map(function (x) { return x[m.key] || 0; });
          var mx = Math.max.apply(null, vals.concat([1]));
          var cls = m.key === 'stops' ? 'bar-amber' : 'bar-blue';
          return '' +
            '<div class="cmp-row">' +
              '<div class="cmp-label"><span>' + m.label + '</span><b>' + m.fmt(o[m.key]) + '</b></div>' +
              '<div class="cmp-track"><div class="cmp-fill ' + cls +
                '" style="width:' + clamp((o[m.key] || 0) / mx * 100).toFixed(1) + '%"></div></div>' +
            '</div>';
        }).join('');
        return '' +
          '<div class="cmp-card">' +
            '<div class="cmp-title">' + esc(o.name) + '</div>' +
            '<div class="cmp-sub">' + o.shops + ' 家店 · 占链接 ' + pct(o.linkShare) +
              ' · 占出单 ' + pct(o.orderShare) + ' · 产出投入比 ' + dec(o.ioRatio, 2) + '</div>' +
            rows +
          '</div>';
      }).join('') + '</div>';

      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-blue">👥</div>管理人核算对照</div>' +
            '<span class="card-hint">两个并列经营层，不是上下级</span>' +
          '</div>' + cmpHtml +
          '<div class="table-note">' +
            '两者表现<b>方向相反</b>：一人效率指数更高但封停 82 次，另一人效率偏低但封停 0 次。' +
            '这不是"谁更好"的问题，是<b>两种跑法</b>——一种靠规模与节奏，一种靠合规与稳定。' +
            '核算表的意义是让这两种跑法各自可被计量。' +
          '</div>' +
        '</div>';
    }

    /* 站点核算 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🌎</div>站点核算</div>' +
          '<span class="card-hint">5 个站点作为 5 个经营单元</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:90px"><col style="width:72px"><col style="width:88px">' +
              '<col style="width:70px"><col style="width:74px"><col style="width:70px">' +
              '<col style="width:88px"><col style="width:84px"><col style="width:74px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>站点</th><th>覆盖店数</th><th>在架链接</th><th>链接占比</th>' +
              '<th>累计出单</th><th>出单占比</th><th>千链接出单</th>' +
              '<th>产出投入比</th><th>转化率</th>' +
            '</tr></thead>' +
            '<tbody>' +
              SITES.map(function (s) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(s.name) + '</td>' +
                  '<td class="num num-mute">' + s.shops + ' 家</td>' +
                  '<td class="num">' + nf(s.links) + '</td>' +
                  '<td class="num num-mute">' + pct(s.linkShare) + '</td>' +
                  '<td class="num num-strong">' + nf(s.orders) + '</td>' +
                  '<td class="num num-mute">' + pct(s.orderShare) + '</td>' +
                  '<td class="num num-strong">' + dec(s.outPer1000) + '</td>' +
                  '<td class="num">' + dec(s.ioRatio, 2) + '</td>' +
                  '<td class="num">' + pct(s.conv, 2) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '注意站点间「访问量口径」尚未统一（详见数据体检页），' +
          '因此<b>转化率的横向可比性弱于千链接出单</b>，做站点决策以千链接出单与产出投入比为主。' +
        '</div>' +
      '</div>';

    /* 第二层要补的数据 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🔧</div>第二层：财务核算要补的 6 项</div>' +
          '<span class="card-hint">补齐后本页升级为真正的利润表</span>' +
        '</div>' +
        '<div class="gap-list">' +
          (D.gaps || []).map(function (gp) {
            return '<div class="gap-item">' +
              '<span class="gap-lv gap-' + (gp.status === '待建' ? 'high' : 'mid') + '">' +
                esc(gp.status) + '</span>' +
              '<span class="gap-body">' +
                '<span class="gap-name">' + esc(gp.item) + '</span>' +
                '<span class="gap-problem">来源：' + esc(gp.from) + '</span>' +
                '<span class="gap-impact">责任方：' + esc(gp.owner) + '</span>' +
              '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">' +
          '6 项中 5 项在美客多后台本来就有，只是从未导出；' +
          '只有「采购成本」必须由顺诚自建——<b>这也正是内部定价的入口</b>。' +
          '导出对照单见「产品核算」页。' +
        '</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot('第一层 · 经营效率口径');
    root.innerHTML = html;
  }

  /* ══════════════ 页面 2：产品核算 ══════════════ */
  function renderProducts(root) {
    var P = D.productPlan || {};
    var html = '';

    html += pageHeader(
      '独立核算 · 产品核算',
      crumbOf('产品核算'),
      '<a class="btn btn-secondary" href="acct.html">💰 店铺核算</a>' +
      '<a class="btn btn-secondary" href="ops-quality.html">🩺 数据体检</a>',
      '第二层 · SKU 级口径'
    );

    /* 状态 */
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">当前状态</div>' +
          '<div class="ov-value" style="font-size:19px">待接入</div>' +
          '<div class="ov-sub">订单明细未导出</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">现有粒度</div>' +
          '<div class="ov-value" style="font-size:19px">店铺×站点×日</div>' +
          '<div class="ov-sub">不含任何商品 / SKU</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">核算粒度</div>' +
          '<div class="ov-value" style="font-size:19px">SKU 级</div>' +
          '<div class="ov-sub">已定，等数据</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">需导出</div>' +
          '<div class="ov-value">3</div>' +
          '<div class="ov-sub">2 张后台报表 + 1 张成本表</div>' +
        '</div>' +
      '</div>';

    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📌</div>这一页为什么是空的</div>' +
          '<span class="card-hint">不填假数，是刻意的</span>' +
        '</div>' +
        '<div class="finding">' +
          '产品独立核算需要<b>订单级明细</b>——哪一单、哪个 SKU、卖了多少、扣了多少佣金。' +
          '现在的数据底座记录的是「某店某站点某天：铺了多少链接、出了多少单」，' +
          '<b>商品维度在采集阶段就丢失了</b>，无法反推。' +
          '<br><br>' +
          '所以这一页先给<b>导出对照单</b>：把该导的表、该要的字段列清楚。' +
          '数据一到，核算表立刻可出——表结构在下面已经定好，不用二次设计。' +
        '</div>' +
      '</div>';

    /* 三张表 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📤</div>需要导出的 3 张表</div>' +
          '<span class="card-hint">照单导出即可，字段名以实际后台为准</span>' +
        '</div>' +
        (P.tables || []).map(function (t) {
          return '' +
            '<div class="plan-card">' +
              '<div class="plan-head">' +
                '<span class="plan-no">' + t.no + '</span>' +
                '<span class="plan-name">' + esc(t.name) + '</span>' +
                '<span class="tag tag-soft">' + esc(t.owner) + '</span>' +
              '</div>' +
              '<div class="plan-src">来源：' + esc(t.source) + '</div>' +
              '<div class="field-chips">' +
                t.fields.map(function (f) {
                  return '<span class="field-chip">' + esc(f) + '</span>';
                }).join('') +
              '</div>' +
              '<div class="plan-gives">对应核算项：' +
                t.gives.map(function (gv) { return '<b>' + esc(gv) + '</b>'; }).join(' · ') +
              '</div>' +
            '</div>';
        }).join('') +
        '<div class="table-note">' + esc(P.note || '') + '</div>' +
      '</div>';

    /* 数据到位后能出什么 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🧮</div>数据到位后，这三个表立刻可出</div>' +
          '<span class="card-hint">表结构已定稿，只等灌数</span>' +
        '</div>' +
        '<div class="ph-list">' +
          (P.will_build || []).map(function (w) {
            return '<div class="ph-row">' +
              '<span class="ph-name">' + esc(w) + '</span>' +
              '<span class="ph-tag">待接入</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    /* SKU 核算表结构 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📐</div>SKU 核算表的列结构</div>' +
          '<span class="card-hint">口径先定死，避免导完数再吵口径</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:118px"><col style="width:250px"><col style="width:96px"><col style="width:86px"></colgroup>' +
            '<thead><tr><th>列名</th><th>口径</th><th>数据来源</th><th>状态</th></tr></thead>' +
            '<tbody>' +
            [
              ['SKU / 商品 ID', '美客多 item_id 或卖家自定义 SKU，作为唯一键', '表 1', '待接入'],
              ['站点', '成交所在站点（墨西哥 / 巴西 / 哥伦比亚 / 智利 / 阿根廷）', '表 1', '待接入'],
              ['销量', '期内该 SKU 成交件数（不含取消）', '表 1', '待接入'],
              ['销售收入', '成交总额，扣除平台佣金前的金额', '表 1', '待接入'],
              ['平台佣金', '美客多收取的销售佣金 + 固定费', '表 1', '待接入'],
              ['物流运费', '该 SKU 实际承担的运费', '表 1 + 后台账单', '待接入'],
              ['采购成本', '采购单价 × 销量；无成本记录时留空不填 0', '表 3', '待建'],
              ['广告花费', '该 SKU 分摊的广告花费（按广告出单归因）', '表 2', '待接入'],
              ['退款损失', '期内该 SKU 的退款 / 取消金额', '表 1', '待接入'],
              ['经营利润', '销售收入 − 平台佣金 − 物流运费 − 采购成本 − 广告花费 − 退款损失', '计算列', '待接入'],
              ['毛利率', '经营利润 ÷ 销售收入', '计算列', '待接入'],
              ['单件利润', '经营利润 ÷ 销量', '计算列', '待接入']
            ].map(function (r) {
              return '<tr>' +
                '<td class="td-shop">' + esc(r[0]) + '</td>' +
                '<td class="num-mute" style="font-size:12px">' + esc(r[1]) + '</td>' +
                '<td class="td-owner">' + esc(r[2]) + '</td>' +
                '<td>' + (r[3] === '待建'
                  ? '<span class="grade-chip grade-c">待建</span>'
                  : '<span class="grade-chip grade-none">待接入</span>') + '</td>' +
              '</tr>';
            }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '成本缺失时该 SKU <b>标空不标 0</b>——填 0 会把毛利算虚高，这是核算表最常见的坑。' +
        '</div>' +
      '</div>';

    /* 阻塞点 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">⛔</div>卡在哪里</div>' +
          '<span class="card-hint">一句话说明当前阻塞</span>' +
        '</div>' +
        '<div class="finding">' + esc(P.blocked_by || '') + '。' +
          '表 2、表 3 可以并行准备，但缺少表 1 就无法把收入落到 SKU 上。' +
        '</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot('第二层 · 待接入');
    root.innerHTML = html;
  }

  /* ══════════════ 入口 ══════════════ */
  function boot() {
    var root = document.getElementById('sc-content');
    if (!root) return;
    if (!UNITS.length) {
      root.innerHTML = '<div class="card"><div class="card-title">数据未加载</div>' +
        '<div class="table-note">请确认 data/acct.js 存在，或重新运行 ' +
        'scripts/12_build_acctdata.py 生成。</div></div>';
      return;
    }
    if (PAGE === 'acct') { renderUnits(root); return; }
    if (PAGE === 'acct-products') { renderProducts(root); return; }
    root.innerHTML = '<div class="card"><div class="card-title">未识别的页面</div>' +
      '<div class="table-note">请在 body 上标注 data-page="acct" 或 data-page="acct-products"。</div></div>';
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
