/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 渲染层（选品中心）
   ───────────────────────────────────────────────────────────────
   页面内容由本文件按 data/categories.js + data/home.js 渲染。

   三种模式（由 <body data-page="..."> 决定）：
     index   → 品类总览（家居大类 + 11 个二级分类）
     market  → 市场分析（品类分析 + 店铺布局）
     cat-*   → 二级分类页，见 assets/render-home.js

   2026-09-21 结构变更：原「日用百货 · 四大场景」废弃，改为
   美客多官方「家居大类 · 11 个二级分类」。分类数据全部来自 data/home.js。
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

  function renderIndex(root) {
    var totalLv3 = META.totalLv3 || sum(CATS, function (c) { return (c.lv3 || []).length; });
    var totalProd = META.totalProducts || sum(CATS, function (c) { return (c.products || []).length; });
    var RM = HOME.rootMarket || {};
    var ms = RM.metrics || [];

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

    /* 家居大类大盘 */
    if (ms.length) {
      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-orange">🏠</div>家居大类大盘（' +
              esc(META.window || '近30天') + '）</div>' +
            '<span class="card-hint">站点 ' + esc(META.site || '') +
              ' · 采集 ' + esc(META.collected || '') + '</span>' +
          '</div>' +
          '<div class="stats-grid stats-grid-7">' +
            ms.map(function (m) {
              var mom = String(m.mom || '');
              var cls = mom.indexOf('↑') >= 0 ? 'ct-up' : (mom.indexOf('↓') >= 0 ? 'ct-down' : '');
              return '<div class="stat-card">' +
                '<div class="stat-label">' + esc(m.label) + '</div>' +
                '<div class="stat-value">' + esc(m.value || '—') + '</div>' +
                '<div class="stat-sub">月环比 <span class="' + cls + '">' + esc(mom || '—') + '</span></div>' +
                '</div>';
            }).join('') +
          '</div>' +
          '<div class="table-note">数据源：' + esc(META.source || '') +
            '。巴西站数据尚未采集，本页所有大盘数字均为墨西哥站。</div>' +
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
            return '' +
              '<a href="' + esc(c.page) + '" class="cat-card-link">' +
                '<div class="cat-card">' +
                  '<div class="cat-no-badge">' + esc(c.no) + '</div>' +
                  '<div class="cat-name">' + esc(c.icon) + ' ' + esc(c.name) + '</div>' +
                  '<div class="cat-es">' + esc(c.nameEs || '') + '</div>' +
                  '<div class="cat-meta">' +
                    '<span>💰 ' + (c.salesMxn ? c.salesMxn + '亿 MXN' : '—') + '</span>' +
                    '<span>📊 ' + (c.sharePct || 0) + '%</span>' +
                  '</div>' +
                  '<div class="cat-meta">' +
                    '<span>📂 三级 ' + (c.lv3 || []).length + '</span>' +
                    '<span>🎯 选品 ' + (c.products || []).length + '</span>' +
                  '</div>' +
                  (c.br && c.br.status !== 'done'
                    ? '<div class="cat-todo">🇧🇷 巴西站待采集</div>' : '') +
                '</div>' +
              '</a>';
          }).join('') +
        '</div>' +
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
            '<colgroup><col style="width:52px"><col style="width:150px">' +
              '<col style="width:190px"><col style="width:110px">' +
              '<col style="width:86px"><col style="width:84px">' +
              '<col style="width:84px"><col style="width:90px">' +
              '<col style="width:auto"></colgroup>' +
            '<thead><tr><th>序号</th><th>二级分类</th><th>西语名</th>' +
              '<th>月销售额</th><th>占比</th><th>三级</th><th>四级</th>' +
              '<th>选品数</th><th>状态</th></tr></thead>' +
            '<tbody>' +
              CATS.map(function (c) {
                return '<tr>' +
                  '<td class="num num-mute">' + esc(c.no) + '</td>' +
                  '<td class="td-shop"><a href="' + esc(c.page) + '" class="tbl-link">' +
                    esc(c.icon) + ' ' + esc(c.name) + '</a></td>' +
                  '<td class="td-owner">' + esc(c.nameEs || '') + '</td>' +
                  '<td class="num num-strong">' + (c.salesMxn ? c.salesMxn + '亿' : '—') + '</td>' +
                  '<td class="num">' + (c.sharePct || 0) + '%</td>' +
                  '<td class="num">' + (c.lv3 || []).length + '</td>' +
                  '<td class="num num-mute">' + (c.lv4Count ? c.lv4Count : '—') + '</td>' +
                  '<td class="num">' + (c.products || []).length + '</td>' +
                  '<td><span class="tag tag-soft">🇧🇷 待采集</span></td>' +
                  '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">月销售额为墨西哥站官方数据（MXN）。' +
          '「三级 / 四级 / 选品数」来自官方类目树与顺诚选品清单，非市场推算；' +
          '「—」表示该二级分类的四级未采集（厨房大类的四级见「存储和组织」专页）。</div>' +
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

  /* ══════════════ 市场分析页 ══════════════
     一 · 品类分析  二 · 店铺布局。
     品类分析里的「结构底数」来自官方 11 个二级分类（data/home.js）。 */

  function renderMarket(root) {
    var MP = DATA.marketPage || {};
    var POOL = DATA.storePool || {};
    var OWNERS = POOL.owners || [];
    var PARTS = MP.parts || [];
    var FW = MP.framework || [];
    var OPEN = MP.layoutOpen || [];
    var part1 = PARTS[0] || { no: '一', name: '品类分析', desc: '' };
    var part2 = PARTS[1] || { no: '二', name: '店铺布局', desc: '' };

    var totalLv3 = META.totalLv3 || sum(CATS, function (c) { return (c.lv3 || []).length; });
    var totalProd = META.totalProducts || sum(CATS, function (c) { return (c.products || []).length; });
    var shopCount = sum(OWNERS, function (o) { return (o.shops || []).length; });
    var RM = HOME.rootMarket || {};
    var ms = RM.metrics || [];

    function partBand(p, isNext) {
      return '' +
        '<div class="part-band' + (isNext ? ' is-next' : '') + '">' +
          '<div class="part-no">' + esc(p.no) + '</div>' +
          '<div class="part-name">' + esc(p.name) + '</div>' +
          '<div class="part-desc">' + esc(p.desc || '') + '</div>' +
        '</div>';
    }

    var html = '';

    html += pageHeaderCard({
      title: '📈 市场分析',
      breadcrumb: '选品中心 / <span>市场分析</span>',
      actions:
        '<a class="btn btn-secondary" href="index.html">📋 品类总览</a>' +
        '<button class="btn btn-primary" data-todo="导出市场分析报告">📤 导出报告</button>'
    });

    html += categoryPath(null);

    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">一级大类</div>' +
          '<div class="ov-value">' + esc(META.root || '家居大类') + '</div>' +
          '<div class="ov-sub">' + esc(META.catId || '') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">二级分类</div>' +
          '<div class="ov-value">' + CATS.length + '</div>' +
          '<div class="ov-sub">官方类目树</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">三级分类</div>' +
          '<div class="ov-value">' + totalLv3 + '</div>' +
          '<div class="ov-sub">选品清单 ' + totalProd + ' 款</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">在营店铺</div>' +
          '<div class="ov-value">' + shopCount + '</div>' +
          '<div class="ov-sub">' + OWNERS.map(function (o) {
            return esc(o.name) + ' ' + (o.shops || []).length;
          }).join(' · ') + '</div>' +
        '</div>' +
      '</div>';

    /* ═══════════ 第一部分 · 品类分析 ═══════════ */
    html += partBand(part1, false);

    /* 1-1 市场分析框架 */
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

    /* 1-2 家居大类大盘（已采集，来自 home.js） */
    if (ms.length) {
      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-blue">🏠</div>家居大类大盘（已采集）</div>' +
            '<span class="card-hint">' + esc(META.site || '') + ' · ' +
              esc(META.window || '近30天') + ' · ' + esc(META.collected || '') + '</span>' +
          '</div>' +
          '<div class="stats-grid stats-grid-7">' +
            ms.map(function (m) {
              var mom = String(m.mom || '');
              var cls = mom.indexOf('↑') >= 0 ? 'ct-up' : (mom.indexOf('↓') >= 0 ? 'ct-down' : '');
              return '<div class="stat-card">' +
                '<div class="stat-label">' + esc(m.label) + '</div>' +
                '<div class="stat-value">' + esc(m.value || '—') + '</div>' +
                '<div class="stat-sub">月环比 <span class="' + cls + '">' + esc(mom || '—') + '</span></div>' +
                '</div>';
            }).join('') +
          '</div>' +
          '<div class="rule-note">这一块是<b>已采集的真实数据</b>（墨西哥站官方大盘），' +
            '与上面「待采集」的 8 个分析维度要分开看：框架是待办清单，这里是现有底数。</div>' +
        '</div>';
    }

    /* 1-3 11 个二级分类结构底数 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📂</div>二级分类结构底数</div>' +
          '<span class="card-hint">' + CATS.length + ' 个 · 按大盘月销售额降序</span>' +
        '</div>' +
        '<div class="scn-grid scn-grid-4">' +
          CATS.map(function (c) {
            return '' +
              '<a class="scn-card scn-link" href="' + esc(c.page) + '">' +
                '<div class="scn-name">' + esc(c.icon) + ' ' + esc(c.name) + '</div>' +
                '<div class="scn-meta">' +
                  '月销售额 <b>' + (c.salesMxn ? c.salesMxn + '亿' : '—') + '</b> MXN<br>' +
                  '占大盘 <b>' + (c.sharePct || 0) + '%</b><br>' +
                  '三级 <b>' + (c.lv3 || []).length + '</b> 个 · 选品 <b>' +
                    (c.products || []).length + '</b> 款' +
                '</div>' +
              '</a>';
          }).join('') +
        '</div>' +
        '<div class="table-note">月销售额为墨西哥站官方数据。巴西站（MLB）尚未采集，' +
          '所有分类的巴西数据都是空的 —— 页面按双国家结构预留。</div>' +
      '</div>';

    /* ═══════════ 第二部分 · 店铺布局 ═══════════ */
    html += partBand(part2, true);

    /* 2-1 在营店铺现状 */
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

    /* 2-2 品类 × 店铺 承接矩阵 */
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

    /* 2-3 布局待定项 */
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
    if (PAGE === 'market') { renderMarket(root); return; }

    /* 二级分类页由 render-home.js 负责；若它没加载，给出提示 */
    if (PAGE.indexOf('cat-') === 0) return;

    root.innerHTML = '<div class="card"><div class="card-title">未找到该页面</div>' +
      '<div class="table-note">请检查 data/categories.js 中的 page 配置。</div></div>';
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
