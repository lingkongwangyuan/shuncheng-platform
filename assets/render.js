/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 渲染层
   ───────────────────────────────────────────────────────────────
   页面内容由本文件按 data/categories.js 渲染。
   加品类、改文案 = 只改数据文件；改版式 = 只改本文件。

   三种模式（由 <body data-page="..."> 决定）：
     index                  → 品类总览
     market                 → 市场分析（一级品类视角：品类分析 + 店铺布局）
     kitchen / bathroom /   → 场景品类页
     livingroom / bedroom
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var DATA = window.SC_DATA || {};
  var PAGE = (document.body.getAttribute('data-page') || 'index').replace(/\.html$/, '');
  var CATS = DATA.categories || [];
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var sum = function (arr, f) { return arr.reduce(function (a, b) { return a + f(b); }, 0); };

  var STATUS_TEXT = { pending: '待启动', progress: '进行中', done: '已完成' };
  var STATUS_CLS = { pending: 'status-pending', progress: 'status-progress', done: 'status-done' };

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

  function categoryPath(cat) {
    if (!cat) {
      return '<div class="category-path"><span class="path-item active">' +
             esc((DATA.root && DATA.root.name) || '日用百货') + '</span></div>';
    }
    return '' +
      '<div class="category-path">' +
        '<a href="index.html" class="path-item">' + esc((DATA.root && DATA.root.name) || '日用百货') + '</a>' +
        '<span class="path-arrow">›</span>' +
        '<span class="path-item active">' + esc(cat.icon) + ' ' + esc(cat.name) + '</span>' +
      '</div>';
  }

  function priorityBadge(cat, inline) {
    var p = cat.priority || {};
    return '<span class="priority-badge ' + esc(p.cls || 'priority-low') +
           (inline ? ' priority-inline' : '') + '">' +
           esc(p.level || '') + ' · ' + esc(p.label || '') + '</span>';
  }

  function progressBar(pct, cls) {
    return '<div class="progress-bar"><div class="progress-fill ' + (cls || 'fill-orange') +
           '" style="width:' + (pct || 0) + '%"></div></div>';
  }

  /* 产品表 —— 成本/售价口径未定，暂不设价格列 */
  function productSection(cat, sub) {
    var id = 'prod-' + cat.id + '-' + sub.no;
    return '' +
      '<div class="product-section" id="' + id + '">' +
        '<div class="product-section-header">' +
          '<h4>' + esc(sub.name) + ' · 产品清单</h4>' +
          '<button class="btn btn-primary btn-sm" data-todo="新增产品">＋ 新增</button>' +
        '</div>' +
        '<table class="product-table">' +
          '<thead><tr>' +
            '<th style="width:56px">序号</th>' +
            '<th>产品名称</th>' +
            '<th style="width:96px">状态</th>' +
            '<th style="width:180px">操作</th>' +
          '</tr></thead>' +
          '<tbody>' +
            '<tr class="empty-row"><td colspan="4">产品清单待接入</td></tr>' +
          '</tbody>' +
        '</table>' +
        '<div class="table-note">' +
          '计划上架 ' + esc(sub.plan) + ' 款；成本价 / 售价口径确认后再启用价格列。' +
        '</div>' +
      '</div>';
  }

  /* ══════════════ 首页 · 品类总览 ══════════════ */

  function renderIndex(root) {
    var totalSubs = sum(CATS, function (c) { return (c.subs || []).length; });
    var totalPlan = sum(CATS, function (c) { return sum(c.subs || [], function (s) { return s.plan || 0; }); });

    var html = '';

    html += pageHeaderCard({
      title: '选品中心 · 品类总览',
      breadcrumb: '选品中心 / <span>品类总览</span>',
      actions:
        '<button class="btn" data-todo="导入品类">📥 导入品类</button>' +
        '<button class="btn btn-primary" data-todo="新增品类">＋ 新增品类</button>'
    });

    html += categoryPath(null);

    /* 概览条 */
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">一级品类</div>' +
          '<div class="ov-value">1</div>' +
          '<div class="ov-sub">' + esc((DATA.root && DATA.root.name) || '日用百货') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">二级场景品类</div>' +
          '<div class="ov-value">' + CATS.length + '</div>' +
          '<div class="ov-sub">' + CATS.map(function (c) { return esc(c.name); }).join(' · ') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">三级细分品类</div>' +
          '<div class="ov-value">' + totalSubs + '</div>' +
          '<div class="ov-sub">已规划方向</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">计划上架产品</div>' +
          '<div class="ov-value">' + totalPlan + '</div>' +
          '<div class="ov-sub">已上架 0 · 待选品</div>' +
        '</div>' +
      '</div>';

    /* 品类导航 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📂</div>品类导航</div>' +
          '<span class="card-hint">' + esc((DATA.root && DATA.root.name) || '日用百货') +
            ' · ' + CATS.length + ' 大场景品类</span>' +
        '</div>' +
        '<div class="cat-grid">' +
          CATS.map(function (c) {
            return '' +
              '<a href="' + esc(c.page) + '" class="cat-card-link">' +
                '<div class="cat-card ' + esc(c.priority.cardCls) + '">' +
                  priorityBadge(c, false) +
                  '<div class="cat-name">' + esc(c.icon) + ' ' + esc(c.name) + '</div>' +
                  '<div class="cat-desc">' + esc(c.desc) + '</div>' +
                  '<div class="cat-meta">' +
                    '<span>📋 ' + esc(c.cardMeta || ((c.subs || []).length + ' 个三级品类')) + '</span>' +
                    '<span>📦 ' + esc(c.progressNote || '待启动') + '</span>' +
                  '</div>' +
                  progressBar(c.progress) +
                '</div>' +
              '</a>';
          }).join('') +
        '</div>' +
      '</div>';

    /* 三级品类推进总表 —— 按品类分组 */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">📋</div>三级细分品类推进顺序</div>' +
          '<span class="card-hint">共 ' + totalSubs + ' 个方向 · 按优先级排序</span>' +
        '</div>' +
        CATS.map(function (c) {
          return '' +
            '<div class="sub-group">' +
              '<div class="sub-group-title">' + esc(c.icon) + ' ' + esc(c.name) +
                ' <span class="tag tag-soft">' + esc(c.priority.level) + '</span></div>' +
              '<div class="sub-category-list">' +
                (c.subs || []).map(function (s) {
                  return '' +
                    '<a href="' + esc(c.page) + '" class="sub-cat-item sub-cat-link">' +
                      '<div class="sub-cat-no">' + esc(s.no) + '</div>' +
                      '<div class="sub-cat-info">' +
                        '<div class="sub-cat-name">' + esc(s.name) + '</div>' +
                        '<div class="sub-cat-detail">' + esc(s.detail) + '</div>' +
                      '</div>' +
                      '<span class="sub-cat-status ' + STATUS_CLS[s.status] + '">' +
                        esc(STATUS_TEXT[s.status]) + ' · 0/' + esc(s.plan) + '</span>' +
                    '</a>';
                }).join('') +
              '</div>' +
            '</div>';
        }).join('') +
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

    root.innerHTML = html;
  }

  /* ══════════════ 品类页 ══════════════ */

  function renderCategory(root, cat) {
    var subs = cat.subs || [];
    var planTotal = sum(subs, function (s) { return s.plan || 0; });
    var html = '';

    html += pageHeaderCard({
      title: esc(cat.icon) + ' ' + esc(cat.name) + ' ' + priorityBadge(cat, true),
      breadcrumb: '<a href="index.html">选品中心</a> / <span>' + esc(cat.name) + '</span>',
      actions:
        '<button class="btn" data-todo="批量导入">📥 批量导入</button>' +
        '<button class="btn btn-primary" data-todo="新增产品">＋ 新增产品</button>'
    });

    html += categoryPath(cat);

    /* 统计 */
    html += '' +
      '<div class="stats-grid">' +
        '<div class="stat-card"><div class="stat-label">三级品类数</div>' +
          '<div class="stat-value">' + subs.length + '</div><div class="stat-sub">已规划方向</div></div>' +
        '<div class="stat-card"><div class="stat-label">计划上架产品</div>' +
          '<div class="stat-value">' + planTotal + '</div><div class="stat-sub">待选品</div></div>' +
        '<div class="stat-card"><div class="stat-label">已上架</div>' +
          '<div class="stat-value">0</div><div class="stat-sub">完成度 0%</div></div>' +
        '<div class="stat-card"><div class="stat-label">推进进度</div>' +
          '<div class="stat-value">' + (cat.progress || 0) + '%</div>' +
          '<div class="stat-sub">' + esc(cat.progressNote || '') + '</div></div>' +
      '</div>';

    /* 工具栏 */
    html += '' +
      '<div class="action-bar">' +
        '<button class="btn btn-primary" data-todo="新增产品">＋ 新增产品</button>' +
        '<button class="btn btn-secondary" data-todo="批量导入">📥 批量导入</button>' +
        '<button class="btn btn-ai" data-todo="AI选品推荐">🤖 AI选品推荐</button>' +
        '<button class="btn btn-secondary" data-todo="批量生图">🖼️ 批量生图</button>' +
        '<button class="btn btn-secondary" data-todo="数据分析">📊 数据分析</button>' +
        '<button class="btn btn-secondary" data-todo="生成Listing">✍️ 生成Listing</button>' +
      '</div>';

    /* 三级品类推进 + 产品展开 */
    html += '' +
      '<div class="section-card">' +
        '<div class="section-title"><span class="icon">📋</span>三级细分品类推进顺序</div>' +
        '<div class="sub-category-list">' +
          subs.map(function (s) {
            return '' +
              '<div class="sub-cat-item" data-expand="prod-' + esc(cat.id) + '-' + esc(s.no) + '">' +
                '<div class="sub-cat-no">' + esc(s.no) + '</div>' +
                '<div class="sub-cat-info">' +
                  '<div class="sub-cat-name">' + esc(s.name) + '</div>' +
                  '<div class="sub-cat-detail">' + esc(s.detail) + '</div>' +
                '</div>' +
                '<span class="sub-cat-status ' + STATUS_CLS[s.status] + '">' +
                  esc(STATUS_TEXT[s.status]) + ' · 0/' + esc(s.plan) + '</span>' +
              '</div>' +
              productSection(cat, s);
          }).join('') +
        '</div>' +
      '</div>';

    /* 说明：原「店铺布局规划」「市场分析」两块已上提至 market.html（一级品类视角）。
       本页不再重复这两块；要改它们请去 data/categories.js 的 marketPage。 */

    /* AI 推荐 */
    html += '' +
      '<div class="section-card">' +
        '<div class="section-title"><span class="icon">🤖</span>选品智能体推荐</div>' +
        '<div class="placeholder-block">' +
          '<div class="ph-title">⏳ 选品智能体尚未接入</div>' +
          '<div class="table-note">接入后可基于类目数据输出候选产品、价格带与竞争度建议；' +
            '当前不展示推算结论。</div>' +
        '</div>' +
      '</div>';

    /* 页脚 */
    html += '' +
      '<div class="page-foot">' +
        '<span>顺诚AI工作平台 ' + esc((DATA.meta || {}).version || '') +
          ' · 数据更新 ' + esc((DATA.meta || {}).updated || '') + '</span>' +
        '<span>内容源：data/categories.js</span>' +
      '</div>';

    root.innerHTML = html;

    /* 展开产品清单 */
    root.addEventListener('click', function (e) {
      var item = e.target.closest('[data-expand]');
      if (!item) return;
      var sec = document.getElementById(item.getAttribute('data-expand'));
      if (sec) {
        sec.classList.toggle('visible');
        item.classList.toggle('expanded');
      }
    });
  }

  /* ══════════════ 市场分析页（一级品类视角） ══════════════
     两大部分：一 · 品类分析  二 · 店铺布局。
     与场景子页的分工：子页讲「这个场景有哪些三级方向」，
     本页讲「整个日用百货的市场盘子」与「这些盘子交给哪家店做」。 */

  function renderMarket(root) {
    var MP = DATA.marketPage || {};
    var POOL = DATA.storePool || {};
    var OWNERS = POOL.owners || [];
    var PARTS = MP.parts || [];
    var FW = MP.framework || [];
    var OPEN = MP.layoutOpen || [];
    var part1 = PARTS[0] || { no: '一', name: '品类分析', desc: '' };
    var part2 = PARTS[1] || { no: '二', name: '店铺布局', desc: '' };

    var totalSubs = sum(CATS, function (c) { return (c.subs || []).length; });
    var totalPlan = sum(CATS, function (c) {
      return sum(c.subs || [], function (s) { return s.plan || 0; });
    });
    var shopCount = sum(OWNERS, function (o) { return (o.shops || []).length; });

    function partBand(p, isNext) {
      return '' +
        '<div class="part-band' + (isNext ? ' is-next' : '') + '">' +
          '<div class="part-no">' + esc(p.no) + '</div>' +
          '<div class="part-name">' + esc(p.name) + '</div>' +
          '<div class="part-desc">' + esc(p.desc || '') + '</div>' +
        '</div>';
    }

    var html = '';

    /* ── 页头 ── */
    html += pageHeaderCard({
      title: '📈 市场分析',
      breadcrumb: '选品中心 / <span>市场分析</span>',
      actions:
        '<a class="btn btn-secondary" href="index.html">📋 品类总览</a>' +
        '<button class="btn btn-primary" data-todo="导出市场分析报告">📤 导出报告</button>'
    });

    html += categoryPath(null);

    /* ── 概览条 ── */
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">一级品类</div>' +
          '<div class="ov-value">1</div>' +
          '<div class="ov-sub">' + esc((DATA.root || {}).name || '日用百货') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">二级场景</div>' +
          '<div class="ov-value">' + CATS.length + '</div>' +
          '<div class="ov-sub">' + CATS.map(function (c) { return esc(c.name); }).join(' · ') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">三级细分品类</div>' +
          '<div class="ov-value">' + totalSubs + '</div>' +
          '<div class="ov-sub">计划上架 ' + totalPlan + ' 款</div>' +
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

    /* 1-1 市场分析框架（全部待采集，先定维度与数据源） */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🧭</div>市场分析框架</div>' +
          '<span class="card-hint">' + FW.length + ' 个维度 · 全部待采集</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:132px"><col style="width:auto">' +
              '<col style="width:250px"><col style="width:74px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>分析维度</th><th>要看什么</th><th>数据源</th><th>状态</th>' +
            '</tr></thead>' +
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

    /* 1-2 四大场景结构底数（真实数据：来自品类规划） */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📂</div>四大场景结构底数</div>' +
          '<span class="card-hint">来自选品中心品类规划 · 不是市场结论</span>' +
        '</div>' +
        '<div class="scn-grid">' +
          CATS.map(function (c) {
            var subs = c.subs || [];
            return '' +
              '<div class="scn-card">' +
                '<div class="scn-name">' + esc(c.icon) + ' ' + esc(c.name) +
                  ' <span class="tag tag-soft">' + esc((c.priority || {}).level || '') + '</span></div>' +
                '<div class="scn-meta">' +
                  '三级方向 <b>' + subs.length + '</b> 个<br>' +
                  '计划上架 <b>' + sum(subs, function (s) { return s.plan || 0; }) + '</b> 款<br>' +
                  '推进进度 <b>' + (c.progress || 0) + '%</b>' +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
        '<div class="table-note">这一层说的是「顺诚打算做什么」，还没回答「市场要不要」——'
          + '后者要等上面 ' + FW.length + ' 个维度的数据。'
          + '各场景的三级方向清单，去对应场景页看。</div>' +
      '</div>';

    /* ═══════════ 第二部分 · 店铺布局 ═══════════ */
    html += partBand(part2, true);

    /* 2-1 在营店铺现状（真实名单） */
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

    /* 2-2 品类 × 店铺 承接矩阵（骨架，格子待回填） */
    html += '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🧮</div>品类 × 店铺 承接矩阵</div>' +
          '<span class="card-hint">骨架已立 · 格子待管理人回填</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' +
              '<col style="width:112px"><col style="width:82px">' +
              CATS.map(function () { return '<col style="width:118px">'; }).join('') +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>店铺</th><th>管理人</th>' +
              CATS.map(function (c) { return '<th>' + esc(c.name) + '</th>'; }).join('') +
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
        '<div class="table-note">行 = 店铺，列 = 二级场景。定稿后填入「✓」表示该店承接该场景，'
          + '空白表示不承接；矩阵定稿即可作为选品上架的分配依据。</div>' +
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

    /* ── 页脚 ── */
    html += '' +
      '<div class="page-foot">' +
        '<span>顺诚AI工作平台 ' + esc((DATA.meta || {}).version || '') +
          ' · 数据更新 ' + esc((DATA.meta || {}).updated || '') + '</span>' +
        '<span>内容源：data/categories.js</span>' +
      '</div>';

    root.innerHTML = html;
  }

  /* ══════════════ 入口 ══════════════ */

  function boot() {
    var root = document.getElementById('sc-content');
    if (!root) return;

    if (PAGE === 'index' || PAGE === '') {
      renderIndex(root);
      return;
    }
    if (PAGE === 'market') {
      renderMarket(root);
      return;
    }
    var cat = null;
    for (var i = 0; i < CATS.length; i++) {
      if (CATS[i].id === PAGE) { cat = CATS[i]; break; }
    }
    if (cat) {
      renderCategory(root, cat);
    } else {
      root.innerHTML = '<div class="card"><div class="card-title">未找到该品类页面</div>' +
        '<div class="table-note">请检查 data/categories.js 中的 id 配置。</div></div>';
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
