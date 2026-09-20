/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 经营数据渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/ops.js（由 scripts/11_build_opsdata.py 生成）
   三个页面（由 <body data-page="..."> 决定）：
     ops          → 经营概览（在架规模 / 流量 / 转化）
     ops-quality  → 数据体检（字段完整度 / 批次 / 断层 / 覆盖）
     ops-rhythm   → 作业节奏（覆盖度 / 档位 / 覆盖日历）
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var D = window.SC_OPS || {};
  var PAGE = (document.body.getAttribute('data-page') || '');
  var SHOPS = D.shops || [];
  var SITES = D.sites || [];
  var DAILY = D.daily || [];
  var GEARS = D.gears || [];

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  function nf(v) {
    if (v === null || v === undefined) return '—';
    return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function pct(v, dash) {
    if (v === null || v === undefined) return dash || '—';
    return v.toFixed(1) + '%';
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

  function pageFoot() {
    var m = D.meta || {};
    return '' +
      '<div class="page-foot">' +
        '<span>数据源：' + esc(m.source || '数据底座') + ' · 区间 ' + esc(m.span || '') + '</span>' +
        '<span>数据层：data/ops.js（自动生成）</span>' +
      '</div>';
  }

  function ruleNote() {
    var rules = (D.meta || {}).rules || [];
    return '<div class="rule-note"><b>口径说明</b><ul>' +
      rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') +
      '</ul></div>';
  }

  function crumbOf(name) {
    return '经营数据 / <span>' + name + '</span>';
  }

  /* ── 覆盖日历（7 列，周一对齐）── */
  function calGrid(list) {
    var cells = [];
    if (list.length) {
      var p = list[0].date.split('-');
      var wd = new Date(+p[0], +p[1] - 1, +p[2]).getDay();
      var pad = (wd + 6) % 7;
      for (var i = 0; i < pad; i++) cells.push('<i class="cal-cell is-empty"></i>');
    }
    list.forEach(function (d) {
      var g = d.rate >= 90 ? 'g4' : d.rate >= 60 ? 'g3' : d.rate >= 30 ? 'g2' : d.rate > 0 ? 'g1' : 'g0';
      cells.push('<i class="cal-cell ' + g + '" title="' + esc(d.date) + '：' + d.records +
        ' 条 / 满额 ' + d.full + ' 条（' + d.rate + '%）"></i>');
    });
    return '' +
      '<div class="cal-grid">' + cells.join('') + '</div>' +
      '<div class="cal-legend">' +
        '<span><i class="cal-cell g0"></i>无记录</span>' +
        '<span><i class="cal-cell g1"></i>&lt;30%</span>' +
        '<span><i class="cal-cell g2"></i>30~60%</span>' +
        '<span><i class="cal-cell g3"></i>60~90%</span>' +
        '<span><i class="cal-cell g4"></i>≥90%</span>' +
        '<span class="cal-note">越绿越完整 · 每格一天</span>' +
      '</div>';
  }

  function heatRow(label, widthPct, valText, colorCls, owner) {
    return '' +
      '<div class="heat-row">' +
        '<span class="heat-site">' + esc(label) +
          (owner ? '<i class="heat-owner">' + esc(owner) + '</i>' : '') + '</span>' +
        '<span class="heat-track"><div class="heat-fill ' + (colorCls || 'bar-blue') +
          '" style="width:' + Math.max(0, Math.min(100, widthPct)).toFixed(1) + '%"></div></span>' +
        '<span class="heat-val">' + valText + '</span>' +
      '</div>';
  }

  /* ══════════════ 页面 1：经营概览 ══════════════ */
  function renderOverview(root) {
    var S = D.summary || {};
    var totalConv = S.visits ? S.orders / S.visits * 100 : 0;

    var html = '';

    html += pageHeader(
      '经营数据 · 经营概览',
      crumbOf('经营概览'),
      '<a class="btn btn-secondary" href="ops-quality.html">🩺 数据体检</a>' +
      '<a class="btn btn-secondary" href="ops-rhythm.html">📅 作业节奏</a>',
      '区间 ' + esc(S.dateFrom || '') + ' ~ ' + esc(S.dateTo || '')
    );

    /* 概览条 */
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">在架链接（快照）</div>' +
          '<div class="ov-value">' + nf(S.links) + '</div>' +
          '<div class="ov-sub">18 家店 × 5 站点最新有效值</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">累计访问</div>' +
          '<div class="ov-value">' + nf(S.visits) + '</div>' +
          '<div class="ov-sub">按「当日访问」逐日累加</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">累计出单</div>' +
          '<div class="ov-value">' + nf(S.orders) + '</div>' +
          '<div class="ov-sub">出单填写率 ' + pct(S.orderFillRate) + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">转化率</div>' +
          '<div class="ov-value">' + totalConv.toFixed(2) + '%</div>' +
          '<div class="ov-sub">出单 ÷ 访问（按已填记录）</div>' +
        '</div>' +
      '</div>';

    /* 先看这一条 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">⚠</div>先看这一条</div>' +
          '<span class="card-hint">这个数怎么来的，比数本身重要</span>' +
        '</div>' +
        '<div class="finding">' +
          '本页所有数字只能按<b>「已填记录」</b>理解。三个已知限制：' +
          '<br>① <b>「今日上架」不是上架量</b>——填的是作业档位（50 / 100 / 150 / 200），全表仅 19 种取值，不能当上架条数统计；' +
          '<br>② <b>「当日出单」缺失 35%</b>（7 月缺 44%、9 月缺 62%），转化率只覆盖填了数的那部分记录；' +
          '<br>③ <b>站点访问量差 12 倍</b>（墨西哥均值 100.6 / 哥伦比亚 7.9），站点横向比绝对值意义有限。' +
          '<br>要做精确经营分析，需先补齐这三项口径。' +
        '</div>' +
      '</div>';

    /* 站点结构 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">🌎</div>站点结构</div>' +
          '<span class="card-hint">在架规模 / 访问 / 出单 三组占比</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:88px"><col style="width:88px"><col style="width:62px">' +
            '<col style="width:92px"><col style="width:62px"><col style="width:84px">' +
            '<col style="width:62px"><col style="width:72px"></colgroup>' +
            '<thead><tr>' +
              '<th>站点</th><th>在架链接</th><th>占比</th>' +
              '<th>累计访问</th><th>占比</th>' +
              '<th>累计出单</th><th>占比</th><th>转化率</th>' +
            '</tr></thead>' +
            '<tbody>' +
              SITES.map(function (s, i) {
                return '<tr' + (i === 0 ? ' class="row-top"' : '') + '>' +
                  '<td class="td-shop">' + esc(s.name) + '</td>' +
                  '<td class="num">' + nf(s.links) + '</td>' +
                  '<td class="num num-mute">' + pct(s.linkShare) + '</td>' +
                  '<td class="num">' + nf(s.visits) + '</td>' +
                  '<td class="num num-mute">' + pct(s.visitShare) + '</td>' +
                  '<td class="num num-strong">' + nf(s.orders) + '</td>' +
                  '<td class="num num-mute">' + pct(s.orderShare) + '</td>' +
                  '<td class="num">' + pct(s.conv) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">占比为各站点在全局中的份额。访问量站点间差异极大，横向比较请结合「数据体检」页的口径结论。</div>' +
      '</div>';

    /* 各店产出 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🏬</div>18 家店经营产出</div>' +
          '<span class="card-hint">按转化率降序 · 转化率含口径提示</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:104px"><col style="width:62px"><col style="width:84px">' +
            '<col style="width:88px"><col style="width:80px"><col style="width:70px">' +
            '<col style="width:76px"></colgroup>' +
            '<thead><tr>' +
              '<th>店铺</th><th>管理人</th><th>在架链接</th>' +
              '<th>累计访问</th><th>累计出单</th><th>转化率</th><th>出单填写</th>' +
            '</tr></thead>' +
            '<tbody>' +
              SHOPS.slice().sort(function (a, b) { return (b.conv || 0) - (a.conv || 0); })
                .map(function (s) {
                  var warn = s.conv && s.conv > 3;
                  return '<tr>' +
                    '<td class="td-shop">' + esc(s.name) +
                      (s.anomaly ? '<div class="anomaly-flag">出单口径待核</div>' : '') + '</td>' +
                    '<td class="td-owner">' + esc(s.owner) + '</td>' +
                    '<td class="num">' + nf(s.links) + '</td>' +
                    '<td class="num">' + nf(s.visits) + '</td>' +
                    '<td class="num num-strong">' + nf(s.orders) + '</td>' +
                    '<td class="num' + (warn ? ' num-warn' : '') + '">' + pct(s.conv) + '</td>' +
                    '<td class="num num-mute">' + pct(s.orderFill) + '</td>' +
                  '</tr>';
                }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">「出单填写」= 该店当日出单有值的记录占比。低于 60% 的店，转化率参考价值有限。</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot();
    root.innerHTML = html;
  }

  /* ══════════════ 页面 2：数据体检 ══════════════ */
  function renderQuality(root) {
    var S = D.summary || {};
    var FIELDS = D.fields || [];
    var FC = D.fieldCounts || {};
    var BATCHES = D.batches || [];
    var BREAKS = D.breaks || [];

    var html = '';

    html += pageHeader(
      '经营数据 · 数据体检',
      crumbOf('数据体检'),
      '<a class="btn btn-secondary" href="ops.html">📈 经营概览</a>' +
      '<a class="btn btn-secondary" href="ops-rhythm.html">📅 作业节奏</a>',
      '共 ' + FIELDS.length + ' 个字段'
    );

    html += '' +
      '<div class="stats-grid">' +
        '<div class="stat-card">' +
          '<div class="stat-label">可放心用</div>' +
          '<div class="stat-value">' + (FC.good || 0) + '</div>' +
          '<div class="stat-sub">字段完整、口径一致</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">需注意口径</div>' +
          '<div class="stat-value">' + (FC.caution || 0) + '</div>' +
          '<div class="stat-sub">能看趋势，别当绝对值</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">事件型字段</div>' +
          '<div class="stat-value">' + (FC.event || 0) + '</div>' +
          '<div class="stat-sub">出问题才填，低填充正常</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">录入批次</div>' +
          '<div class="stat-value">' + (S.batches || 0) + '</div>' +
          '<div class="stat-sub">批次间断层 ' + (S.breaks || 0) + ' 处</div>' +
        '</div>' +
      '</div>';

    /* 结论 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🩺</div>这次体检的结论</div>' +
          '<span class="card-hint">直接决定指标能不能用</span>' +
        '</div>' +
        '<div class="finding">' +
          '数据可分成三类：<br>' +
          '<b>① 结构类字段完全可信</b>——日期、店铺、站点、管理人、健康等级，填充率 100%，覆盖度与结构分析都站得住。<br>' +
          '<b>② 事件型字段低填充是设计如此</b>——投诉率、取消率、不合规率只在店铺出问题时才填，填充率低不代表数据缺失。<br>' +
          '<b>③ 经营量字段需注意口径</b>——「今日上架」是档位值、「当日出单」缺 35%、「总链接数」跨批次断层，这三项直接限制经营分析精度。' +
        '</div>' +
      '</div>';

    /* 字段完整度 */
    var groups = [
      { key: 'good', title: '可放心用', cls: 'bar-green', ct: 'ct-green', hint: '字段完整、口径一致' },
      { key: 'caution', title: '需注意口径', cls: 'bar-amber', ct: 'ct-orange', hint: '能看趋势，别当绝对值' },
      { key: 'event', title: '事件型字段', cls: 'bar-gray', ct: 'ct-blue', hint: '随状态触发，低填充属正常' }
    ];
    var fldHtml = '';
    groups.forEach(function (grp) {
      var items = FIELDS.filter(function (f) { return f.grade === grp.key; });
      if (!items.length) return;
      fldHtml += '<div class="fld-group"><div class="fld-group-title">' + grp.title +
        '<span>' + grp.hint + ' · ' + items.length + ' 个</span></div>';
      items.forEach(function (f) {
        fldHtml += '' +
          '<div class="fld-row">' +
            '<span class="fld-name">' + esc(f.name) + '</span>' +
            '<span class="fld-track"><i class="fld-fill ' + grp.cls +
              '" style="width:' + Math.max(1, f.rate).toFixed(1) + '%"></i></span>' +
            '<span class="fld-rate">' + pct(f.rate) + '</span>' +
          '</div>' +
          (f.issue ? '<div class="fld-issue">' + esc(f.issue) + '</div>' : '');
      });
      fldHtml += '</div>';
    });
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📋</div>字段完整度</div>' +
          '<span class="card-hint">填充率 = 有值记录 ÷ 全部 ' + nf(S.records) + ' 条</span>' +
        '</div>' + fldHtml +
      '</div>';

    /* 录入批次 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🗂</div>录入批次</div>' +
          '<span class="card-hint">6 个 sheet，每批次内部重新累计</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:150px"><col style="width:74px"><col style="width:80px">' +
            '<col style="width:64px"><col style="width:64px"><col style="width:190px"></colgroup>' +
            '<thead><tr><th>批次（来源 sheet）</th><th>管理人</th><th>记录数</th>' +
            '<th>天数</th><th>店铺</th><th>覆盖区间</th></tr></thead>' +
            '<tbody>' +
              BATCHES.map(function (b) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(b.name) + '</td>' +
                  '<td class="td-owner">' + esc(b.owner) + '</td>' +
                  '<td class="num">' + nf(b.records) + '</td>' +
                  '<td class="num num-mute">' + b.days + '</td>' +
                  '<td class="num num-mute">' + b.shops + '</td>' +
                  '<td class="num num-mute">' + esc(b.from) + ' ~ ' + esc(b.to) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">批次是「每本账单独记」的结构——新批次开始时累计数字从低位重新起算，所以跨批次的累计值不可直接相连。</div>' +
      '</div>';

    /* 断层点 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📉</div>批次断层点</div>' +
          '<span class="card-hint">共 ' + (D.breakTotal || 0) + ' / ' + nf(D.breakDenom || 0) +
            ' 处骤降（降幅 &gt;30%）</span>' +
        '</div>' +
        '<div class="table-note" style="margin-bottom:10px">' +
          '「总链接数」在批次交界处出现下跌，这不是真实经营波动，是换批次导致的口径重置。下表列前 ' +
          BREAKS.length + ' 处。' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:96px"><col style="width:80px"><col style="width:96px">' +
            '<col style="width:80px"><col style="width:80px"><col style="width:72px"></colgroup>' +
            '<thead><tr><th>店铺</th><th>站点</th><th>日期</th>' +
            '<th>前值</th><th>现值</th><th>降幅</th></tr></thead>' +
            '<tbody>' +
              BREAKS.map(function (b) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(b.shop) + '</td>' +
                  '<td class="td-owner">' + esc(b.site) + '</td>' +
                  '<td class="num num-mute">' + esc(b.date) + '</td>' +
                  '<td class="num">' + nf(b.prev) + '</td>' +
                  '<td class="num">' + nf(b.curr) + '</td>' +
                  '<td class="num num-warn">-' + pct(b.drop) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';

    /* 覆盖度日历 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">📅</div>录入覆盖日历</div>' +
          '<span class="card-hint">满额 ' + (S.fullPerDay || 0) + ' 条/天 · 仅 ' +
            (S.activeDays || 0) + '/' + (S.spanDays || 0) + ' 天有记录</span>' +
        '</div>' +
        calGrid(DAILY) +
      '</div>';

    /* 缺口清单 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🔧</div>需要补的数据</div>' +
          '<span class="card-hint">按影响程度排序</span>' +
        '</div>' +
        '<div class="gap-list">' +
          (D.gaps || []).map(function (gp) {
            return '<div class="gap-item">' +
              '<span class="gap-lv gap-' + (gp.level === '高' ? 'high' : 'mid') + '">' + esc(gp.level) + '</span>' +
              '<span class="gap-body">' +
                '<span class="gap-name">' + esc(gp.item) + '</span>' +
                '<span class="gap-problem">' + esc(gp.problem) + '</span>' +
                '<span class="gap-impact">影响：' + esc(gp.impact) + '</span>' +
              '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot();
    root.innerHTML = html;
  }

  /* ══════════════ 页面 3：作业节奏 ══════════════ */
  function renderRhythm(root) {
    var S = D.summary || {};
    var COV = D.coverage || [];
    var maxGear = GEARS.length ? GEARS[0].records : 1;

    var html = '';

    html += pageHeader(
      '经营数据 · 作业节奏',
      crumbOf('作业节奏'),
      '<a class="btn btn-secondary" href="ops.html">📈 经营概览</a>' +
      '<a class="btn btn-secondary" href="ops-quality.html">🩺 数据体检</a>',
      '满额 ' + (S.fullPerDay || 0) + ' 条/天'
    );

    html += '' +
      '<div class="stats-grid">' +
        '<div class="stat-card">' +
          '<div class="stat-label">有记录天数</div>' +
          '<div class="stat-value">' + (S.activeDays || 0) + '</div>' +
          '<div class="stat-sub">区间共 ' + (S.spanDays || 0) + ' 天</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">覆盖不足 50% 的天数</div>' +
          '<div class="stat-value">' + (S.lowCoverDays || 0) + '</div>' +
          '<div class="stat-sub">低于半数的日子</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">出单填写率</div>' +
          '<div class="stat-value">' + pct(S.orderFillRate) + '</div>' +
          '<div class="stat-sub">9 月最低（缺 62%）</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">作业档位</div>' +
          '<div class="stat-value">' + GEARS.length + '</div>' +
          '<div class="stat-sub">档位取值种类数</div>' +
        '</div>' +
      '</div>';

    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">⚠</div>这一页看什么</div>' +
          '<span class="card-hint">不是看经营好坏，是看记录习惯</span>' +
        '</div>' +
        '<div class="finding">' +
          '这一页回答的是<b>「谁在记、记全了没有」</b>，不是「谁卖得好」。<br>' +
          '覆盖率低不代表生意差，只代表这段时间没有可用的记录——' +
          '但<b>没有记录就无法管理</b>，所以这项工作本身就是管理动作。' +
        '</div>' +
      '</div>';

    /* 各店覆盖度 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">📊</div>各店录入覆盖度</div>' +
          '<span class="card-hint">按覆盖率升序 · 最需要补的排最前</span>' +
        '</div>' +
        '<div class="heat-list">' +
          COV.map(function (c) {
            var rate = c.coverRate === null ? 0 : c.coverRate;
            var cls = rate >= 90 ? 'bar-green' : rate >= 60 ? 'bar-blue' : rate >= 30 ? 'bar-amber' : 'bar-red';
            return heatRow(c.name, rate,
              c.coverDays + '/' + c.spanDays + ' 天 · ' + pct(c.coverRate), cls, c.owner);
          }).join('') +
        '</div>' +
        '<div class="table-note">覆盖率 = 有记录的天数 ÷ 该店首末记录之间的天数。分母用各店自身跨度，避免新店吃亏。</div>' +
      '</div>';

    /* 作业档位 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">🎚</div>作业档位分布</div>' +
          '<span class="card-hint">「今日上架」的取值分布 · 非真实上架量</span>' +
        '</div>' +
        '<div class="heat-list">' +
          GEARS.slice(0, 10).map(function (gr) {
            return heatRow('档位 ' + gr.value, gr.records / maxGear * 100,
              gr.records + ' 次 · ' + pct(gr.share), 'bar-blue');
          }).join('') +
        '</div>' +
        '<div class="table-note">取值高度集中在 50 / 100 / 150 / 200 这几个档位，印证「今日上架」填的是作业档位而非实测上架条数。</div>' +
      '</div>';

    /* 覆盖日历 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">📅</div>每日录入覆盖</div>' +
          '<span class="card-hint">' + esc(S.dateFrom || '') + ' ~ ' + esc(S.dateTo || '') + '</span>' +
        '</div>' +
        calGrid(DAILY) +
        '<div class="table-note">7 月整片偏浅——当月多天只有 10~15 条记录，数据不足以支撑月度对比。</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot();
    root.innerHTML = html;
  }

  /* ══════════════ 入口 ══════════════ */
  function boot() {
    var root = document.getElementById('sc-content');
    if (!root) return;
    if (!SHOPS.length) {
      root.innerHTML = '<div class="card"><div class="card-title">数据未加载</div>' +
        '<div class="table-note">请确认 data/ops.js 存在，或重新运行 ' +
        'scripts/11_build_opsdata.py 生成。</div></div>';
      return;
    }
    if (PAGE === 'ops') { renderOverview(root); return; }
    if (PAGE === 'ops-quality') { renderQuality(root); return; }
    if (PAGE === 'ops-rhythm') { renderRhythm(root); return; }
    root.innerHTML = '<div class="card"><div class="card-title">未识别的页面</div>' +
      '<div class="table-note">请在 body 上标注 data-page="ops" / "ops-quality" / "ops-rhythm"。</div></div>';
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
