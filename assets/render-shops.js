/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 店铺矩阵渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/shops.js（由 scripts/10_build_shopmatrix.py 生成）
   两个页面（由 <body data-page="..."> 决定）：
     shops        → 店铺总览（18 家店对照表）
     shops-group  → 店群分析（管理人 / 站点 / 趋势 / 风险聚集）
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var D = window.SC_SHOPS || {};
  var PAGE = (document.body.getAttribute('data-page') || '').replace(/\.html$/, '');
  var SHOPS = D.shops || [];
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  var LV_CLS = { '红': 'lv-red', '橙': 'lv-orange', '黄': 'lv-yellow', '绿': 'lv-green' };

  function lvDot(lv, size) {
    var cls = LV_CLS[lv] || 'lv-none';
    var style = size ? 'width:' + size + 'px;height:' + size + 'px;' : '';
    return '<i class="lv-dot ' + cls + '" style="' + style + '"></i>';
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
        '<span>数据层：data/shops.js（自动生成）</span>' +
      '</div>';
  }

  function ruleNote() {
    var rules = (D.meta || {}).rules || [];
    return '<div class="rule-note"><b>口径说明</b><ul>' +
      rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') +
      '</ul></div>';
  }

  function lvLegend() {
    return '<div class="lv-legend">' +
      '<span>' + lvDot('红') + '红 · 严重</span>' +
      '<span>' + lvDot('橙') + '橙</span>' +
      '<span>' + lvDot('黄') + '黄</span>' +
      '<span>' + lvDot('绿') + '绿 · 正常</span>' +
      '<span>' + lvDot(null) + '无最新色级记录</span>' +
      '</div>';
  }

  /* ══════════════ 排序：封停/30天 ↓，其次色级风险 ↓ ══════════════ */
  function sortedShops(owner) {
    return SHOPS.filter(function (s) {
      return !owner || owner === 'all' || s.owner === owner;
    }).sort(function (a, b) {
      if (b.stopsPer30 !== a.stopsPer30) return b.stopsPer30 - a.stopsPer30;
      return (b.riskRate || 0) - (a.riskRate || 0);
    });
  }

  function riskTags(list) {
    if (!list || !list.length) return '<span class="num-mute">—</span>';
    return '<div class="risk-tags">' + list.map(function (r) {
      return '<span class="tag-risk">' + esc(r.name) + ' ' + r.count + '</span>';
    }).join('') + '</div>';
  }

  function shopRows(owner) {
    var list = sortedShops(owner);
    if (!list.length) {
      return '<tr><td colspan="8" style="text-align:center;color:#5f6b7a">该筛选下没有店铺</td></tr>';
    }
    return list.map(function (s, i) {
      var snapCell = s.snapshot
        ? lvDot(s.snapshot) + ' <span style="margin-left:3px">' + esc(s.snapshot) + '</span>'
        : lvDot(null) + ' <span class="num-mute" style="margin-left:3px">—</span>';
      var shortAnomaly = s.anomaly ? String(s.anomaly).split('（')[0] : '';
      return '' +
        '<tr' + (i < 1 && s.stopsPer30 > 0 ? ' class="row-top"' : '') + '>' +
          '<td>' +
            '<div class="td-shop">' + esc(s.name) + '</div>' +
            (shortAnomaly ? '<div class="anomaly-flag" style="margin-top:4px">' + esc(shortAnomaly) + '</div>' : '') +
          '</td>' +
          '<td class="td-owner">' + esc(s.owner) + '</td>' +
          '<td>' + snapCell + '</td>' +
          '<td class="num num-strong">' + pct(s.riskRate) + '</td>' +
          '<td class="num num-warn">' + pct(s.unlabeledRate) + '</td>' +
          '<td class="num ' + (s.stopsPer30 > 0 ? 'num-strong' : 'num-mute') + '">' +
            (s.stopsPer30 > 0 ? s.stopsPer30.toFixed(1) : '0') +
            (s.stops > 0 ? ' <span class="num-mute" style="font-size:11px">(' + s.stops + '次)</span>' : '') +
          '</td>' +
          '<td>' + riskTags(s.risks) + '</td>' +
          '<td class="num num-mute" style="font-size:12px">' + esc(String(s.lastDate).slice(5)) + '</td>' +
        '</tr>';
    }).join('');
  }

  /* ══════════════ 页面一：店铺总览 ══════════════ */
  function renderOverview(root) {
    var S = D.summary || {};
    var red = 0, orange = 0, yellow = 0;
    SHOPS.forEach(function (s) { red += s.red; orange += s.orange; yellow += s.yellow; });

    var ownerA = (D.owners || [])[0] || {};
    var ownerB = (D.owners || [])[1] || {};

    var html = '';

    html += pageHeader(
      '店铺矩阵 · 店铺总览',
      '店铺矩阵 / <span>店铺总览</span>',
      '<button class="btn" data-todo="导出店铺台账">📤 导出</button>' +
      '<a class="btn btn-secondary" href="shops-group.html">📊 店群分析</a>',
      '区间 ' + esc(S.dateFrom || '') + ' ~ ' + esc(S.dateTo || '')
    );

    /* 统计条 */
    html += '' +
      '<div class="stats-grid">' +
        '<div class="stat-card">' +
          '<div class="stat-label">在营店铺</div>' +
          '<div class="stat-value">' + (S.shops || 0) + '</div>' +
          '<div class="stat-sub">' + esc(ownerA.name || '') + ' 9 · ' + esc(ownerB.name || '') + ' 9</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">色级风险记录</div>' +
          '<div class="stat-value">' + (S.riskRecords || 0) + '</div>' +
          '<div class="stat-sub">红 ' + red + ' · 橙 ' + orange + ' · 黄 ' + yellow + '</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">累计封停</div>' +
          '<div class="stat-value">' + (S.stops || 0) + '</div>' +
          '<div class="stat-sub">全部集中在石老师名下</div>' +
        '</div>' +
        '<div class="stat-card">' +
          '<div class="stat-label">未标注记录</div>' +
          '<div class="stat-value">' + (S.unlabeled || 0) + '</div>' +
          '<div class="stat-sub">占全部记录 ' +
            pct(S.records ? S.unlabeled / S.records * 100 : 0) + '</div>' +
        '</div>' +
      '</div>';

    /* 核心发现 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">⚠️</div>先看这一条</div>' +
          '<span class="card-hint">两个指标方向相反</span>' +
        '</div>' +
        '<div class="finding">' +
          '色级风险与实际封停<b>方向相反</b>：' +
          esc(ownerA.name || '') + ' 色级风险 <b>' + pct(ownerA.riskRate) + '</b>、封停 <b>' +
          (ownerA.stops || 0) + ' 次</b>；' +
          esc(ownerB.name || '') + ' 色级风险 <b>' + pct(ownerB.riskRate) + '</b>、封停 <b>' +
          (ownerB.stops || 0) + ' 次</b>。<br>' +
          '原因是 ' + esc(ownerB.name || '') + ' 有 <b>' + (ownerB.unlabeled || 0) + ' 条记录未标注色级</b>（占 ' +
          pct(ownerB.unlabeledRate) + '）——<b>未标注不等于健康</b>，只说明这一格没写。' +
        '</div>' +
      '</div>';

    /* 对照表 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🏬</div>18 家店对照表</div>' +
          '<span class="card-hint">按「封停/30天」降序 · 最需要注意的排最前</span>' +
        '</div>' +
        '<div class="filter-bar" id="scFilter">' +
          '<button class="filter-btn active" data-owner="all">全部 ' + SHOPS.length + '</button>' +
          '<button class="filter-btn" data-owner="李源">李源 ' + (ownerA.shops || 0) + '</button>' +
          '<button class="filter-btn" data-owner="石老师">石老师 ' + (ownerB.shops || 0) + '</button>' +
          '<span style="margin-left:auto">' + lvLegend() + '</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:104px"><col style="width:62px"><col style="width:56px">' +
              '<col style="width:80px"><col style="width:76px"><col style="width:96px">' +
              '<col style="width:190px"><col style="width:70px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>店铺</th><th>管理人</th><th>快照</th>' +
              '<th>色级风险</th><th>未标注率</th><th>封停/30天</th>' +
              '<th>主要风险</th><th>截至</th>' +
            '</tr></thead>' +
            '<tbody id="scShopBody">' + shopRows('all') + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">『快照』= 该店最新一天各站点中的最差色级；' +
          '『封停/30天』= 封停次数 ÷ 覆盖天数 × 30，用于消除各店记录天数差异（13 ~ 60 天）。</div>' +
      '</div>';

    /* 异常标注 */
    var anomalies = SHOPS.filter(function (s) { return s.anomaly; });
    if (anomalies.length) {
      html += '<div class="card"><div class="card-head">' +
        '<div class="card-title"><div class="ct-icon ct-orange">🔍</div>异常标注</div>' +
        '<span class="card-hint">数据存疑，未做修改，仅标注</span></div>' +
        '<div class="rule-note" style="margin-top:0"><ul>' +
        anomalies.map(function (s) {
          return '<li>' + esc(s.name) + '：' + esc(s.anomaly) + '</li>';
        }).join('') +
        '</ul></div></div>';
    }

    /* 覆盖天数 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📅</div>记录覆盖天数</div>' +
          '<span class="card-hint">各店开始记录时间不同，绝对数不可直接横比</span>' +
        '</div>' +
        '<div class="heat-list">' +
          SHOPS.slice().sort(function (a, b) { return b.coverDays - a.coverDays; }).map(function (s) {
            var w = Math.round(s.coverDays / 66 * 100);
            return '<div class="heat-row">' +
              '<span class="heat-site">' + esc(s.name) + '</span>' +
              '<div class="heat-track"><div class="heat-fill bar-blue" style="width:' + w + '%"></div></div>' +
              '<span class="heat-val">' + s.coverDays + ' 天 · ' + s.records + ' 条</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    html += ruleNote();
    html += pageFoot();

    root.innerHTML = html;

    /* 筛选交互 */
    var bar = document.getElementById('scFilter');
    var body = document.getElementById('scShopBody');
    if (bar && body) {
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        var own = btn.getAttribute('data-owner');
        Array.prototype.forEach.call(bar.querySelectorAll('.filter-btn'), function (b) {
          b.classList.toggle('active', b === btn);
        });
        body.innerHTML = shopRows(own);
      });
    }
  }

  /* ══════════════ 页面二：店群分析 ══════════════ */

  function cmpCard(title, sub, rows) {
    return '' +
      '<div class="cmp-card">' +
        '<div class="cmp-title">' + esc(title) + '</div>' +
        '<div class="cmp-sub">' + esc(sub) + '</div>' +
        rows.map(function (r) {
          return '' +
            '<div class="cmp-row">' +
              '<div class="cmp-label">' +
                '<span>' + esc(r.label) + '</span>' +
                '<b>' + esc(r.value) + '</b>' +
              '</div>' +
              '<div class="cmp-track">' +
                '<div class="cmp-fill ' + r.cls + '" style="width:' + r.w + '%"></div>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>';
  }

  function renderGroup(root) {
    var S = D.summary || {};
    var owners = D.owners || [];
    var A = owners[0] || {};
    var B = owners[1] || {};

    var maxRisk = Math.max(A.riskRate || 0, B.riskRate || 0) || 1;
    var maxStop = Math.max(A.stops || 0, B.stops || 0) || 1;

    var html = '';

    html += pageHeader(
      '店铺矩阵 · 店群分析',
      '<a href="shops.html">店铺总览</a> / <span>店群分析</span>',
      '<a class="btn btn-secondary" href="shops.html">🏬 店铺总览</a>',
      '区间 ' + esc(S.dateFrom || '') + ' ~ ' + esc(S.dateTo || '')
    );

    /* 管理人对比 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">👥</div>两名管理人对比</div>' +
          '<span class="card-hint">请两轴同时看，单看一轴会误判</span>' +
        '</div>' +
        '<div class="cmp-grid">' +
          cmpCard('色级风险率', '红橙黄 ÷ 有色级记录数（不含未标注）', [
            {
              label: esc(A.name) + ' · ' + (A.shops || 0) + ' 店',
              value: pct(A.riskRate), cls: 'bar-red',
              w: Math.round((A.riskRate || 0) / maxRisk * 100)
            },
            {
              label: esc(B.name) + ' · ' + (B.shops || 0) + ' 店',
              value: pct(B.riskRate), cls: 'bar-orange',
              w: Math.round((B.riskRate || 0) / maxRisk * 100)
            }
          ]) +
          cmpCard('实际封停次数', '台账累计的封店 / 暂停销售记录', [
            {
              label: esc(A.name) + ' · ' + (A.shops || 0) + ' 店',
              value: (A.stops || 0) + ' 次', cls: 'bar-gray',
              w: Math.max(2, Math.round((A.stops || 0) / maxStop * 100))
            },
            {
              label: esc(B.name) + ' · ' + (B.shops || 0) + ' 店',
              value: (B.stops || 0) + ' 次', cls: 'bar-red',
              w: Math.round((B.stops || 0) / maxStop * 100)
            }
          ]) +
        '</div>' +
        '<div class="finding" style="margin-top:14px">' +
          '结论：' + esc(B.name) + ' 的色级风险看着低，是因为 <b>' + (B.unlabeled || 0) +
          ' 条记录未标注色级</b>（占 ' + pct(B.unlabeledRate) + '）；' +
          '而实际封停 <b>' + (B.stops || 0) + ' 次全部发生在他名下</b>。' +
        '</div>' +
      '</div>';

    /* 站点风险 */
    var sites = D.sites || [];
    var maxSite = Math.max.apply(null, sites.map(function (x) { return x.riskRate || 0; })) || 1;
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🌎</div>站点风险分布</div>' +
          '<span class="card-hint">按色级风险率降序（分母不含未标注）</span>' +
        '</div>' +
        '<div class="heat-list">' +
          sites.map(function (x) {
            var w = Math.round((x.riskRate || 0) / maxSite * 100);
            return '<div class="heat-row">' +
              '<span class="heat-site">' + esc(x.name) + '</span>' +
              '<div class="heat-track"><div class="heat-fill" style="width:' + w + '%"></div></div>' +
              '<span class="heat-val">' + pct(x.riskRate) +
                ' · 未标' + pct(x.unlabeledRate) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">站点风险率已排除未标注记录；' +
          '「未标」为该站点未标注比例，过高说明该站点的色级记录不完整。</div>' +
      '</div>';

    /* 月度趋势 */
    var months = D.months || [];
    var maxM = Math.max.apply(null, months.map(function (m) { return m.riskRate || 0; })) || 1;
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📈</div>月度风险趋势</div>' +
          '<span class="card-hint">风险率在持续抬升</span>' +
        '</div>' +
        '<div class="trend-list">' +
          months.map(function (m) {
            var w = Math.round((m.riskRate || 0) / maxM * 100);
            return '<div class="trend-row">' +
              '<span class="heat-site">' + m.month + ' 月</span>' +
              '<div class="trend-track"><div class="trend-fill" style="width:' + w + '%"></div></div>' +
              '<span class="trend-val">风险 ' + pct(m.riskRate) +
                ' · 未标 ' + pct(m.unlabeledRate) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">9 月未标注比例升至 ' +
          pct((months[months.length - 1] || {}).unlabeledRate) +
          '，风险率的样本基础在缩小，读数时需一并考虑。</div>' +
      '</div>';

    /* 风险类型聚集 */
    var rt = D.riskTypes || [];
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">🧩</div>风险类型聚集</div>' +
          '<span class="card-hint">共 ' + rt.length + ' 类 · 按出现记录数排序</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:120px"><col style="width:104px"><col style="width:96px"><col></colgroup>' +
            '<thead><tr><th>风险类型</th><th>涉及记录</th><th>涉及店铺</th><th>主要店铺</th></tr></thead>' +
            '<tbody>' +
              rt.map(function (t) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(t.name) + '</td>' +
                  '<td class="num num-strong">' + t.count + '</td>' +
                  '<td class="num">' + t.shops + ' 家</td>' +
                  '<td style="font-size:12px;color:#5f6b7a">' + esc((t.topShops || []).join('、')) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">一条记录可能同时含多个风险标签（如「取消｜不合规货件」），' +
          '故各类型计数之和大于色级风险记录总数（' + (S.riskRecords || 0) + ' 条）。</div>' +
      '</div>';

    /* 风险事件流 */
    var ev = D.events || [];
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🚨</div>最近风险事件</div>' +
          '<span class="card-hint">取自「风险事件」表 · 最新 ' + ev.length + ' 条</span>' +
        '</div>' +
        '<div class="ev-list">' +
          ev.map(function (e) {
            return '<div class="ev-item">' +
              '<span class="ev-date">' + esc(String(e.date).slice(5)) + '</span>' +
              '<span class="ev-shop">' + lvDot(e.level, 7) + ' ' + esc(e.shop) + '</span>' +
              '<span class="ev-text">' + esc(e.site ? e.site + ' · ' : '') + esc(e.text) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
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
        '<div class="table-note">请确认 data/shops.js 存在，或重新运行 ' +
        'scripts/10_build_shopmatrix.py 生成。</div></div>';
      return;
    }
    if (PAGE === 'shops') { renderOverview(root); return; }
    if (PAGE === 'shops-group') { renderGroup(root); return; }
    root.innerHTML = '<div class="card"><div class="card-title">未识别的页面</div>' +
      '<div class="table-note">请在 body 上标注 data-page="shops" 或 "shops-group"。</div></div>';
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
