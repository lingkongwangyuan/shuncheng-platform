/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 渲染层（选品中心）
   ───────────────────────────────────────────────────────────────
   页面内容由本文件按 data/categories.js + data/home.js 渲染。

   两种模式（由 <body data-page="..."> 决定）：
     index   → 品类总览（家居大类 + 11 个二级分类 + 品类 × 店铺承接布局）
     cat-*   → 二级分类页，见 assets/render-home.js

   2026-09-21 结构变更：原「日用百货 · 四大场景」废弃，改为
   美客多官方「家居大类 · 11 个二级分类」。分类数据全部来自 data/home.js。

   2026-09-21 二次变更：原「市场分析」页（market.html）与本品类总览大量重复
   ——「家居大类大盘」「二级分类结构底数」两页同源同数据，页面已下线。
   其独有的四块内容并入本页：
     · 市场分析框架（8 个分析维度 · 待采集台账）
     · 在营店铺现状（18 家）
     · 品类 × 店铺 承接矩阵
     · 布局待定项
   对应数据仍留在 data/categories.js 的 overviewExtra / storePool，不另建数据源。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var DATA = window.SC_DATA || {};
  var HOME = window.SC_HOME || {};
  var PAGE = (document.body.getAttribute('data-page') || 'index').replace(/\.html$/, '');
  var META = HOME.meta || {};
  var CATS = HOME.categories || [];
  var COUNTRIES = HOME.countries || [];

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var sum = function (arr, f) { return arr.reduce(function (a, b) { return a + f(b); }, 0); };

  /* ── 卡片取值辅助 ──
     数据源：站点数据盒（cat.mx / cat.br）里的官方指标，按 label 取；
     口径与来源以 title 提示回显，页面上不展开，避免卡片过载。
     2026-09-22 改签名：原 metricOf(cat, label) → metricOf(box, label)，以支持巴西站。 */
  function metricOf(box, label) {
    var ms = (box && box.metrics) || [];
    for (var i = 0; i < ms.length; i++) {
      if (ms[i] && ms[i].label === label) return ms[i];
    }
    return null;
  }

  /* 大数压缩，两站用同一套写法才可比：
     "9,206,777" → "920.7万"；"1,471,193（约147万）" → "147.1万" */
  function cnNum(v) {
    if (v == null || v === '') return '—';
    var n = parseFloat(String(v).split('（')[0].replace(/[^\d.]/g, ''));
    if (isNaN(n)) return String(v);
    if (n >= 1e8) return (n / 1e8).toFixed(2) + '亿';
    if (n >= 1e4) return (n / 1e4).toFixed(1) + '万';
    return String(n);
  }

  /* 单元格提示：来源可回溯（项目铁律 —— 每个数字都要能退回源表行） */
  function srcTip(m, fallback) {
    return m ? (m.label + '：' + m.value + '（' + m.src + '）') : (fallback || '');
  }

  /* 涨跌标记：中国习惯 —— 涨=红，跌=绿 */
  function yoyTag(v) {
    if (v == null) return '<span>—</span>';
    var cls = v >= 0 ? 'yoy-up' : 'yoy-down';
    var sign = v >= 0 ? '+' : '';
    return '<b class="' + cls + '">' + sign + v.toFixed(1) + '%</b>';
  }

  /* ══════════════ 通用片段 ══════════════ */

  function pageHeaderCard(opts) {
    return '' +
      '<div class="page-header-card">' +
        '<div class="page-header-top">' +
          '<div class="page-title">' + opts.title + '</div>' +
          '<div class="page-actions">' + (opts.actions || '') + '</div>' +
        '</div>' +
        '<div class="page-header-bottom">' +
          '<div class="breadcrumb">' + opts.breadcrumb + '</div>' +
        '</div>' +
      '</div>';
  }

  function categoryPath(active) {
    return '' +
      '<div class="category-path">' +
        '<span class="path-item' + (active ? '' : ' active') + '">' +
          esc(META.root || '家居大类') + '</span>' +
        (active ? '<span class="path-arrow">›</span>' +
          '<span class="path-item active">' + esc(active) + '</span>' : '') +
      '</div>';
  }

  function num(v) {
    var m = String(v || '').match(/([\d.]+)\s*亿/);
    return m ? parseFloat(m[1]) : null;
  }

  /* 国家采集状态药丸 */
  function countryPills() {
    return '<span class="ct-pill-wrap">' + COUNTRIES.map(function (c) {
      var ok = c.status === 'done';
      return '<span class="ct-pill' + (ok ? ' is-ok' : '') + '">' +
        (c.code === 'MX' ? '🇲🇽' : c.code === 'BR' ? '🇧🇷' : '') + ' ' +
        esc(c.name) + ' · ' + (ok ? '已采集' : '待采集') + '</span>';
    }).join('') + '</span>';
  }

  /* ══════════════ 首页 · 品类总览 ══════════════ */

  /* ── 家居大类大盘 · 两站数据盒（墨西哥 / 巴西，2026-09-22） ──
     两站在源表里指标名不一致（墨西哥「近30天销售额」↔ 巴西「月销售额」等），
     数据层已统一成同一组 8 个标准键，这里按同一顺序逐格渲染，便于横向对照。
     「年销售规模」是两站唯一统一到人民币的指标，单独高亮（浅橙底 + 深棕字，见配色铁律）。 */
  function marketSitesCard() {
    var SITES = HOME.rootSites || [];
    if (!SITES.length) return '';
    var M0 = HOME.meta || {};
    var y = {};
    SITES.forEach(function (s) { y[s.code] = s.yearCny; });
    var ratio = (y.MX && y.BR) ? Math.round(y.BR / y.MX * 100) / 100 : null;

    var boxes = SITES.map(function (s) {
      var head = '' +
        '<div class="mkt-box-head">' +
          '<span class="mkt-flag">' + esc(s.flag) + '</span>' +
          '<span class="mkt-name">' + esc(s.name) + '</span>' +
          '<span class="mkt-tag">' + esc(s.site) + '</span>' +
          '<span class="mkt-tag">本币 ' + esc(s.currency) +
            (s.currencyName ? ' ' + esc(s.currencyName) : '') + '</span>' +
          (s.momNote ? '<span class="mkt-tag">' + esc(s.momNote) + '</span>' : '') +
          '<span class="mkt-src">采集 ' + esc(s.collected || '') + '</span>' +
        '</div>';

      var grid = '<div class="stats-grid stats-grid-8">' +
        (s.metrics || []).map(function (m) {
          var isYear = m.key === 'yearCny';
          var mom = String(m.mom || '');
          var cls = mom.indexOf('↑') >= 0 ? 'ct-up' : (mom.indexOf('↓') >= 0 ? 'ct-down' : '');
          var sub = isYear
            ? '<div class="stat-sub mkt-year-note" title="' +
                esc(m.noteFull || m.note || '') + '">' + esc(m.note || '人民币口径') + '</div>'
            : '<div class="stat-sub">月环比 <span class="' + cls + '">' +
                esc(mom || '—') + '</span></div>';
          return '<div class="stat-card' + (isYear ? ' is-year' : '') + '"' +
              (m.src ? ' title="' + esc(m.src) + '"' : '') + '>' +
            '<div class="stat-label">' + esc(m.label) + (isYear ? '（人民币）' : '') + '</div>' +
            '<div class="stat-value">' + esc(m.value || '—') + '</div>' +
            sub +
            '</div>';
        }).join('') + '</div>';

      return '<div class="mkt-box">' + head + grid + '</div>';
    }).join('');

    return '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🏠</div>家居大类大盘（' +
            esc(M0.window || '近30天') + '）</div>' +
          '<span class="card-hint">' + SITES.map(function (s) {
              return esc(s.flag + ' ' + s.site);
            }).join(' · ') + '</span>' +
        '</div>' +
        boxes +
        '<div class="table-note">' +
          '<b>按墨西哥 / 巴西分站展示，同一组指标逐格对照。</b>' +
          '前 7 项（总商品数 / 活跃商品数 / 活跃率 / 近30天总销量 / 近30天销售额 / 日均销量 / 平均成交价）' +
          '均为各国源表原样数值，本币各自照录（墨西哥 MXN、巴西 BRL），<b>不可直接比</b>；' +
          '其中「近30天销售额」两国源表都另给了美元段（墨西哥 ≈$2.22 亿、巴西 ≈USD 5.95 亿），美元段可直接比。' +
          '「<b>年销售规模</b>」是两站唯一统一到人民币的指标：' +
          '巴西为源表已给值（约 368.3 亿 BRL ≈ 513.4 亿人民币，照录未折算）；' +
          '墨西哥源表未给人民币年销，按源表声明汇率 1 USD ≈ 7.2 CNY 以「近30天销售额」美元数 × 12 折算——' +
          '<b>折算值，非官方年度口径</b>。' +
          (ratio ? '人民币口径下巴西 <b>' + y.BR + ' 亿¥</b> 是墨西哥 <b>' + y.MX +
                   ' 亿¥</b> 的 <b>' + ratio + ' 倍</b>。' : '') +
          '巴西源表只给了「月环比」总额一项，无逐项环比，故巴西各格的月环比显示 —。' +
        '</div>' +
      '</div>';
  }

  function renderIndex(root) {
    var totalLv3 = META.totalLv3 || sum(CATS, function (c) { return (c.lv3 || []).length; });
    var totalProd = META.totalProducts || sum(CATS, function (c) { return (c.products || []).length; });

    /* 原「市场分析」页并入的两块数据（2026-09-21） */
    var MP = DATA.overviewExtra || {};
    var POOL = DATA.storePool || {};
    var OWNERS = POOL.owners || [];
    var FW = MP.framework || [];
    var OPEN = MP.layoutOpen || [];
    var shopCount = sum(OWNERS, function (o) { return (o.shops || []).length; });

    var html = '';

    html += pageHeaderCard({
      title: '选品中心 · 品类总览',
      breadcrumb: '选品中心 / <span>品类总览</span>',
      actions: countryPills() +
        '<button class="btn btn-primary" data-todo="新增品类">＋ 新增品类</button>'
    });

    html += categoryPath(null);

    /* 概览条 */
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">一级大类</div>' +
          '<div class="ov-value">' + esc(META.root || '家居大类') + '</div>' +
          '<div class="ov-sub">' + esc(META.rootEs || '') +
            (META.catId ? ' · ' + esc(META.catId) : '') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">二级分类</div>' +
          '<div class="ov-value">' + CATS.length + '</div>' +
          '<div class="ov-sub">厨房 → 收纳整理（按销售额）</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">三级分类</div>' +
          '<div class="ov-value">' + totalLv3 + '</div>' +
          '<div class="ov-sub">官方类目树 · 含四级明细</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">选品清单</div>' +
          '<div class="ov-value">' + totalProd + '</div>' +
          '<div class="ov-sub">款 · 含西语/葡语搜索词</div>' +
        '</div>' +
      '</div>';

    /* 家居大类大盘 —— 墨西哥 / 巴西两站数据盒（含年销售规模·人民币） */
    html += marketSitesCard();

    /* 两站大盘对照 —— 2026-09-22 巴西站接入后新增 */
    var RC = HOME.rootCompare;
    if (RC && RC.br) {
      var RB = HOME.rootMarketBr || {};
      var pick = function (s) { return (String(s || '').match(/USD\s*([\d.,]+)/) || [null, '—'])[1]; };
      var pct = function (s) { return parseFloat(String(s || '').replace(/[^\d.-]/g, '')); };
      var mxActive = pct(RC.mx.activeRate);
      var brActive = pct(RC.br.activeRate);
      var rSales = RC.ratioCny;
      var rActive = (mxActive && brActive) ? Math.round(brActive / mxActive * 10) / 10 : null;

      var row = function (flag, name, o, usd, cny, yearCny, aov, active) {
        return '<tr>' +
          '<td class="td-shop">' + flag + ' ' + esc(name) + '</td>' +
          '<td class="num num-strong">' + (usd != null ? '$' + usd + '亿' : '—') + '</td>' +
          '<td class="num num-strong">' + (cny != null ? cny + '亿¥' : '—') + '</td>' +
          '<td class="num num-strong">' + (yearCny != null ? yearCny + '亿¥' : '—') + '</td>' +
          '<td class="num">$' + esc(aov) + '</td>' +
          '<td class="num">' + esc(active || '—') + '</td>' +
          '<td class="num num-mute">' + esc(o.currency) + '</td>' +
          '</tr>';
      };

      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-blue">🌎</div>两站大盘对照</div>' +
            '<span class="card-hint">' + esc(RC.fx) + '</span>' +
          '</div>' +
          '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
          '<div class="table-scroll">' +
            '<table class="shop-table">' +
              '<colgroup><col style="width:168px"><col style="width:116px">' +
                '<col style="width:120px"><col style="width:124px">' +
                '<col style="width:108px"><col style="width:96px">' +
                '<col style="width:auto"></colgroup>' +
              '<thead><tr><th>站点</th><th>月销（美元）</th><th>月销（人民币）</th>' +
                '<th>年销（人民币）</th><th>客单价（美元）</th><th>活跃率</th><th>本币</th></tr></thead>' +
              '<tbody>' +
                row('🇲🇽', RC.mx.site, RC.mx, RC.mx.salesUsd, RC.mx.salesCny, RC.mx.yearCny,
                    (String(RC.mx.aov).match(/\$([\d.,]+)/) || [null, '—'])[1], RC.mx.activeRate) +
                row('🇧🇷', RC.br.site, RC.br, RC.br.salesUsd, RC.br.salesCny, RC.br.yearCny,
                    pick(RC.br.aov), RC.br.activeRate) +
                '<tr class="row-ratio">' +
                  '<td class="td-shop">巴西 ÷ 墨西哥</td>' +
                  '<td class="num num-strong">' + (RC.br.salesUsd && RC.mx.salesUsd
                    ? (RC.br.salesUsd / RC.mx.salesUsd).toFixed(2) + '×' : '—') + '</td>' +
                  '<td class="num num-strong">' + (rSales != null ? rSales + '×' : '—') + '</td>' +
                  '<td class="num num-strong">' + (RC.ratioYearCny != null ? RC.ratioYearCny + '×' : '—') + '</td>' +
                  '<td class="num">' + (pick(RC.br.aov) && (String(RC.mx.aov).match(/\$([\d.,]+)/) || [0, null])[1]
                    ? (parseFloat(pick(RC.br.aov).replace(',', '')) /
                       parseFloat(String(RC.mx.aov).match(/\$([\d.,]+)/)[1].replace(',', ''))).toFixed(2) + '×'
                    : '—') + '</td>' +
                  '<td class="num">' + (rActive != null ? rActive + '×' : '—') + '</td>' +
                  '<td class="num num-mute">—</td>' +
                '</tr>' +
              '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="table-note">' +
            '<b>结论：巴西是规模市场，墨西哥是利润市场。</b>' +
            '人民币口径下巴西大盘月销 42.8 亿¥ 是墨西哥 15.98 亿¥ 的 ' + rSales + ' 倍，' +
            '年销 ' + RC.br.yearCny + ' 亿¥ 是墨西哥 ' + RC.mx.yearCny + ' 亿¥ 的 ' +
            (RC.ratioYearCny != null ? RC.ratioYearCny + ' 倍' : '—') + '；' +
            '但墨西哥客单价 $' + (String(RC.mx.aov).match(/\$([\d.,]+)/) || [null, '—'])[1] +
            ' 高于巴西 $' + pick(RC.br.aov) + '，' +
            '而巴西活跃率 ' + RC.br.activeRate + ' 是墨西哥 ' + RC.mx.activeRate + ' 的 ' + rActive + ' 倍——' +
            '同一品类在巴西要面对约 4 倍的对手密度。' +
            '「月销（人民币）」「年销（人民币）」两列：墨西哥为折算值（源表只给了 MXN 与美元，' +
            '按源表声明汇率 1 USD≈7.2 CNY 折算，年销 = 月销美元 × 7.2 × 12），巴西为源表已给值（照录）；' +
            '两国本币不可直接比。</div>' +
        '</div>';
    }

    /* 品类导航 —— 11 个二级分类 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📂</div>二级分类导航</div>' +
          '<span class="card-hint">' + CATS.length + ' 个 · 点卡片进入分类页</span>' +
        '</div>' +
        '<div class="cat-grid cat-grid-3">' +
          CATS.map(function (c) {
            var mx = c.mx || {};
            var br = c.br || {};
            var hasBr = br.status === 'done';

            var mxKv = metricOf(mx, '平均成交价');
            var mxGm = metricOf(mx, '总商品数');
            var mxAr = metricOf(mx, '活跃率');
            var mxYoy = mx.yoy || null;
            var brYoy = br.yoy || null;

            /* 客单价统一取美元段，两国才可比 */
            var mxAov = mxKv ? (String(mxKv.value).match(/\$([\d.,]+)/) || [null, '—'])[1] : '—';
            var brAov = hasBr ? (String(br.aov || '').match(/USD\s*([\d.,]+)/) || [null, '—'])[1] : '—';

            return '' +
              '<a href="' + esc(c.page) + '" class="cat-card-link">' +
                '<div class="cat-card">' +
                  '<div class="cat-no-badge">' + esc(c.no) + '</div>' +
                  '<div class="cat-name">' + esc(c.icon) + ' ' + esc(c.name) + '</div>' +
                  '<div class="cat-es">' + esc(c.nameEs || '') + '</div>' +

                  /* 官方月销（各国本币照录，不折算） */
                  '<div class="cat-meta">' +
                    '<span title="墨西哥站官方 · 近30天销售额">💰 月销 ' +
                      (c.salesMxn ? c.salesMxn + '亿 MXN' : '—') + '</span>' +
                    '<span>📊 ' + (c.sharePct || 0) + '%</span>' +
                  '</div>' +
                  '<div class="cat-meta">' +
                    '<span title="' + (hasBr ? '巴西站官方 · 近30天销售额' : '巴西站数据待采集') + '">' +
                      '🇧🇷 月销 ' + (hasBr && br.salesBrl != null ? br.salesBrl + '亿 BRL' : '—') +
                    '</span>' +
                  '</div>' +

                  /* 两站对照表：年销(亿¥) / 客单价 / 活跃率 / 同期比 */
                  '<div class="h2h">' +
                    '<div class="h2h-row h2h-head">' +
                      '<span class="h2h-c h2h-site">站点</span>' +
                      '<span class="h2h-c">年销(亿¥)</span>' +
                      '<span class="h2h-c">客单价</span>' +
                      '<span class="h2h-c">活跃率</span>' +
                      '<span class="h2h-c">同期比</span>' +
                    '</div>' +
                    '<div class="h2h-row">' +
                      '<span class="h2h-c h2h-site">🇲🇽 墨西哥</span>' +
                      '<span class="h2h-c" title="折算值：源表「近30天销售额」的美元数 × 7.2 × 12">' +
                        (mx.yearCny != null ? mx.yearCny : '—') + '</span>' +
                      '<span class="h2h-c" title="' + esc(srcTip(mxKv)) + '">$' + esc(mxAov) + '</span>' +
                      '<span class="h2h-c" title="' + esc(srcTip(mxAr)) + '">' +
                        esc(mxAr ? mxAr.value : '—') + '</span>' +
                      '<span class="h2h-c" title="' + esc(mxYoy ? mxYoy.window + ' ÷ ' + mxYoy.base : '未采集') + '">' +
                        yoyTag(mxYoy ? mxYoy.value : null) + '</span>' +
                    '</div>' +
                    '<div class="h2h-row">' +
                      '<span class="h2h-c h2h-site">🇧🇷 巴西</span>' +
                      '<span class="h2h-c" title="' + esc(hasBr ? '源表已给：' + (br.src || '') : '巴西站待采集') + '">' +
                        (hasBr && br.yearCny != null ? br.yearCny : '—') + '</span>' +
                      '<span class="h2h-c" title="' + esc(hasBr ? '平均成交价：' + br.aov + '（' + br.src + '）' : '巴西站待采集') + '">' +
                        (hasBr ? '$' + esc(brAov) : '—') + '</span>' +
                      '<span class="h2h-c" title="' + esc(hasBr ? '活跃率：' + br.activeRate + '（' + br.src + '）' : '巴西站待采集') + '">' +
                        esc(hasBr ? (br.activeRate || '—') : '—') + '</span>' +
                      '<span class="h2h-c" title="' + esc(brYoy ? brYoy.window + ' ÷ ' + brYoy.base : '未采集') + '">' +
                        yoyTag(brYoy ? brYoy.value : null) + '</span>' +
                    '</div>' +
                  '</div>' +

                  '<div class="cat-meta">' +
                    '<span title="' + esc(srcTip(mxGm)) + (hasBr ? '；巴西站总商品数：' + br.goods : '') + '">' +
                      '📦 商品 ' + esc(cnNum(mxGm ? mxGm.value : '')) +
                      (hasBr && br.goods ? ' / ' + esc(cnNum(br.goods)) : '') + '</span>' +
                  '</div>' +
                  '<div class="cat-meta">' +
                    '<span>📂 三级 ' + (c.lv3 || []).length + '</span>' +
                    '<span>🎯 选品 ' + (c.products || []).length + '</span>' +
                  '</div>' +
                  (hasBr ? '' : '<div class="cat-todo">🇧🇷 巴西站待采集</div>') +
                '</div>' +
              '</a>';
          }).join('') +
        '</div>' +
        '<div class="table-note">卡片口径：' +
          '「月销」为两国官方近 30 天销售额原值（墨西哥 MXN、巴西 BRL，本币照录不折算）；' +
          '「年销(亿¥)」= 月销 × 12 并按源表汇率（1 USD ≈ 7.2 CNY）折算成人民币，' +
          '墨西哥为折算值、巴西为源表已给值，折算只为让两国可比，非官方年度口径；' +
          '「客单价」统一取美元段（源表两站都给了 ≈USD），可直接比；' +
          '「活跃率」为官方值，口径一致，是两国竞争强度的直接对比；' +
          '「商品」为两国官方在售商品总数（墨西哥 / 巴西，同一套「万·亿」写法）；' +
          '「同期比」为累计同比，口径两国一致（2026年1-8月 ÷ 2025年1-8月），' +
          '由各国「大盘月度趋势图」逐月还原，涨为红、跌为绿。' +
          '巴西表的「其他」「家具安装」两个桶不属于本表 11 个二级分类，未接入。</div>' +
      '</div>';

    /* 二级分类对比总表 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">📋</div>二级分类对比总表</div>' +
          '<span class="card-hint">按大盘月销售额降序（厨房置顶）</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:42px"><col style="width:148px">' +
              '<col style="width:150px">' +
              '<col style="width:102px"><col style="width:92px">' +
              '<col style="width:102px"><col style="width:92px">' +
              '<col style="width:66px"><col style="width:58px">' +
              '<col style="width:58px"><col style="width:64px">' +
              '<col style="width:128px"></colgroup>' +
            '<thead>' +
              '<tr>' +
                '<th rowspan="2">序号</th><th rowspan="2">二级分类</th><th rowspan="2">西语名</th>' +
                '<th colspan="2" class="th-grp th-grp-mx">🇲🇽 墨西哥站</th>' +
                '<th colspan="2" class="th-grp th-grp-br">🇧🇷 巴西站</th>' +
                '<th rowspan="2">占比<br><span class="th-sub">MX</span></th>' +
                '<th rowspan="2">三级</th><th rowspan="2">四级</th>' +
                '<th rowspan="2">选品数</th><th rowspan="2">采集状态</th>' +
              '</tr>' +
              '<tr>' +
                '<th class="th-grp-mx">月销(MXN)</th><th class="th-grp-mx">累计同比</th>' +
                '<th class="th-grp-br">月销(BRL)</th><th class="th-grp-br">累计同比</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              CATS.map(function (c) {
                var mxYoy = (c.mx || {}).yoy || null;
                var br = c.br || {};
                var brYoy = br.yoy || null;
                var brOk = br.status === 'done';
                var tt = function (y) {
                  return y ? esc(y.window + ' 对比 ' + y.base + (y.note ? '（' + y.note + '）' : '')) : '';
                };
                return '<tr>' +
                  '<td class="num num-mute">' + esc(c.no) + '</td>' +
                  '<td class="td-shop"><a href="' + esc(c.page) + '" class="tbl-link">' +
                    esc(c.icon) + ' ' + esc(c.name) + '</a></td>' +
                  '<td class="td-owner">' + esc(c.nameEs || '') + '</td>' +
                  '<td class="num num-strong">' + (c.salesMxn ? c.salesMxn + '亿' : '—') + '</td>' +
                  '<td class="num"' + (mxYoy ? ' title="' + tt(mxYoy) + '"' : '') + '>' +
                    yoyTag(mxYoy ? mxYoy.value : null) + '</td>' +
                  '<td class="num num-strong">' +
                    (brOk && br.salesBrl != null ? br.salesBrl + '亿' : '—') + '</td>' +
                  '<td class="num"' + (brYoy ? ' title="' + tt(brYoy) + '"' : '') + '>' +
                    yoyTag(brYoy ? brYoy.value : null) + '</td>' +
                  '<td class="num">' + (c.sharePct || 0) + '%</td>' +
                  '<td class="num">' + (c.lv3 || []).length + '</td>' +
                  '<td class="num num-mute">' + (c.lv4Count ? c.lv4Count : '—') + '</td>' +
                  '<td class="num">' + (c.products || []).length + '</td>' +
                  '<td><span class="tag tag-soft">' + (brOk ? '两站已采集' : '🇧🇷 待采集') + '</span></td>' +
                  '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '「月销」为各站官方近 30 天销售额原值，本币照录：墨西哥 MXN、巴西 BRL。' +
          '<b>两国本币不可直接比</b>（1 MXN ≠ 1 BRL）；人民币口径下巴西大盘 42.80 亿¥ vs 墨西哥 15.98 亿¥ = 2.68 倍（见上方大盘卡）。' +
          '「累计同比」两国口径一致：2026年1-8月 ÷ 2025年1-8月，由各国「大盘月度趋势图」逐月还原；' +
          '厨房大类的墨西哥站因原图该时段被浮层遮挡，改用 2026年5-8月 ÷ 2025年5-8月 的同月可比口径（悬停可看）。' +
          '涨为红、跌为绿。' +
          '「占比 / 三级 / 四级 / 选品数」来自官方类目树与顺诚选品清单，非市场推算：' +
          '占比为墨西哥站口径，类目树两站独立，本表三级/四级取自墨西哥站；' +
          '「—」表示该二级分类的四级未采集。' +
          '排序仍按墨西哥站大盘月销售额降序（厨房置顶）。</div>' +
      '</div>';

    /* ══════════ 市场分析框架（原「市场分析」页 · 品类分析 并入） ══════════
       原页的「家居大类大盘」「二级分类结构底数」两块与本页同源重复，已舍弃；
       只搬这块「待采集台账」——它回答的是「还缺哪些数据」。 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🧭</div>市场分析框架</div>' +
          '<span class="card-hint">' + FW.length + ' 个维度 · 待补采集</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:132px"><col style="width:auto">' +
              '<col style="width:250px"><col style="width:74px"></colgroup>' +
            '<thead><tr><th>分析维度</th><th>要看什么</th><th>数据源</th><th>状态</th></tr></thead>' +
            '<tbody>' +
              FW.map(function (f) {
                return '<tr>' +
                  '<td class="td-shop">' + esc(f.dim) + '</td>' +
                  '<td>' + esc(f.item) + '</td>' +
                  '<td class="td-owner">' + esc(f.src) + '</td>' +
                  '<td><span class="ph-tag">待采集</span></td>' +
                  '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' + esc(MP.frameworkNote || '') + '</div>' +
        '<div class="rule-note">' + esc(MP.analysisNote || '') + '</div>' +
      '</div>';

    /* ══════════ 品类 × 店铺 承接布局（原「市场分析」页 · 店铺布局 并入） ══════════
       三块：在营店铺现状 / 承接矩阵 / 布局待定项。原页整块上提，未作删改。 */
    html += '' +
      '<div class="part-band is-next">' +
        '<div class="part-no">🏬</div>' +
        '<div class="part-name">品类 × 店铺 承接布局</div>' +
        '<div class="part-desc">' + shopCount + ' 家在营店铺 · 承接关系待管理人确认</div>' +
      '</div>';

    /* 在营店铺现状 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">🏬</div>在营店铺现状</div>' +
          '<span class="card-hint">' + shopCount + ' 家 · 店铺名即负责人</span>' +
        '</div>' +
        '<div class="cmp-grid">' +
          OWNERS.map(function (o) {
            return '' +
              '<div class="cmp-card">' +
                '<div class="cmp-title">' + esc(o.name) + ' · ' + (o.shops || []).length + ' 家店</div>' +
                '<div class="cmp-sub">名单来自美客多店铺日报台账（2026-09-20 数据底座）</div>' +
                '<div class="tag-wrap">' +
                  (o.shops || []).map(function (s) {
                    return '<span class="tag tag-soft">' + esc(s) + '</span>';
                  }).join('') +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">' + esc(POOL.note || '') + '。此处只列现状，不做分配推断。</div>' +
      '</div>';

    /* 品类 × 店铺 承接矩阵 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🧮</div>品类 × 店铺 承接矩阵</div>' +
          '<span class="card-hint">骨架已立 · 格子待管理人回填</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup><col style="width:112px"><col style="width:82px">' +
              CATS.map(function () { return '<col style="width:118px">'; }).join('') +
            '</colgroup>' +
            '<thead><tr><th>店铺</th><th>管理人</th>' +
              CATS.map(function (c) {
                return '<th>' + esc(c.icon) + ' ' + esc(c.short || c.name) + '</th>';
              }).join('') +
            '</tr></thead>' +
            '<tbody>' +
              OWNERS.map(function (o) {
                return '<tr class="mx-group"><td colspan="' + (2 + CATS.length) + '">' +
                    esc(o.name) + ' · ' + (o.shops || []).length + ' 家店</td></tr>' +
                  (o.shops || []).map(function (s) {
                    return '<tr>' +
                      '<td class="mx-shop">' + esc(s) + '</td>' +
                      '<td class="td-owner">' + esc(o.name) + '</td>' +
                      CATS.map(function () {
                        return '<td><span class="mx-pending">待定</span></td>';
                      }).join('') +
                    '</tr>';
                  }).join('');
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">行 = 店铺，列 = 官方二级分类（' + CATS.length +
          ' 个）。定稿后填入「✓」表示该店承接该分类，空白表示不承接；' +
          '矩阵定稿即可作为选品上架的分配依据。</div>' +
        '<div class="rule-note">' + esc(MP.layoutNote || '') + '</div>' +
      '</div>';

    /* 布局待定项 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📌</div>布局待定项</div>' +
          '<span class="card-hint">' + OPEN.length + ' 项 · 需管理人拍板</span>' +
        '</div>' +
        '<div class="ph-list">' +
          OPEN.map(function (o) {
            return '<div class="ph-row">' +
              '<span class="ph-name">' + esc(o.name) + '</span>' +
              '<span class="ph-src">' + esc(o.who || '') + '</span>' +
              '<span class="ph-tag">待确认</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    /* AI 智能体 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🤖</div>AI 智能体工作台</div>' +
          '<span class="card-hint">选品全流程 AI 辅助</span>' +
        '</div>' +
        '<div class="agent-grid">' +
          (DATA.agents || []).map(function (a) {
            return '' +
              '<div class="agent-card" data-todo="' + esc(a.name) + '">' +
                '<div class="agent-icon ' + esc(a.cls) + '">' + esc(a.icon) + '</div>' +
                '<div class="agent-name">' + esc(a.name) + '</div>' +
                '<div class="agent-desc">' + esc(a.desc) + '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    html += '' +
      '<div class="page-foot">' +
        '<span>顺诚AI工作平台 ' + esc((DATA.meta || {}).version || '') +
          ' · 数据更新 ' + esc((DATA.meta || {}).updated || '') + '</span>' +
        '<span>内容源：data/categories.js + data/home.js</span>' +
      '</div>';

    root.innerHTML = html;
  }

  /* ══════════════ 入口 ══════════════ */

  function boot() {
    var root = document.getElementById('sc-content');
    if (!root) return;

    if (PAGE === 'index' || PAGE === '') { renderIndex(root); return; }

    /* 二级分类页由 render-home.js 负责；若它没加载，给出提示 */
    if (PAGE.indexOf('cat-') === 0) return;

    root.innerHTML = '<div class="card"><div class="card-title">未找到该页面</div>' +
      '<div class="table-note">请检查 data/categories.js 中的 page 配置。</div></div>';
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
