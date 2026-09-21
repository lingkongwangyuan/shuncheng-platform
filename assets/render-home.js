/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 家居大类二级分类页渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/home.js（由 scripts/16_build_homedata.py 生成）
   适用页面：cat-kitchen / cat-furniture / ... （<body data-page="cat-xxx">）

   页面结构：
     页头 + 面包屑
     国家切换（墨西哥 / 巴西）  ← 巴西数据未采集，标「待采集」
     └ 墨西哥：大盘指标 / 3年趋势 / 第三节 / 
     分类清单（三级 + 四级）        ← 与所选国家无关，属类目层
     选品清单（含西语 & 葡语搜索词）← 与所选国家无关，属类目层
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var HOME = window.SC_HOME || {};
  var DATA = window.SC_DATA || {};
  var PAGE = (document.body.getAttribute('data-page') || '').replace(/\.html$/, '');
  var CATS = HOME.categories || [];
  var META = HOME.meta || {};
  var COUNTRIES = HOME.countries || [];

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  var FLAG = { MX: '🇲🇽', BR: '🇧🇷' };

  /* ── 通用片段 ── */

  function pageHeaderCard(o) {
    return '' +
      '<div class="page-header-card">' +
        '<div class="page-header-top">' +
          '<div class="page-title">' + o.title + '</div>' +
          '<div class="page-actions">' + (o.actions || '') + '</div>' +
        '</div>' +
        '<div class="page-header-bottom">' +
          '<div class="breadcrumb">' + o.breadcrumb + '</div>' +
        '</div>' +
      '</div>';
  }

  function categoryPath(cat) {
    return '' +
      '<div class="category-path">' +
        '<a href="index.html" class="path-item">' + esc(META.root || '家居大类') + '</a>' +
        '<span class="path-arrow">›</span>' +
        '<span class="path-item active">' + esc(cat.icon) + ' ' + esc(cat.name) + '</span>' +
      '</div>';
  }

  /* 从「约2.5亿MXN」「6.34亿MXN」里取出数值，用于画条形（解析失败返回 null） */
  function num(v) {
    var m = String(v || '').match(/([\d.]+)\s*亿/);
    return m ? parseFloat(m[1]) : null;
  }

  /* ══════════════ 国家切换 ══════════════ */

  function countryTabs() {
    return '' +
      '<div class="ct-tabs" role="tablist">' +
        COUNTRIES.map(function (c, i) {
          var isTodo = c.status !== 'done';
          return '<button type="button" class="ct-tab' + (i === 0 ? ' active' : '') +
            (isTodo ? ' is-todo' : '') + '" data-country="' + esc(c.code) + '">' +
            '<span class="ct-flag">' + esc(FLAG[c.code] || '') + '</span>' +
            esc(c.site || c.name) +
            (isTodo ? '<span class="ct-badge">待采集</span>' : '<span class="ct-badge is-ok">已采集</span>') +
            '</button>';
        }).join('') +
      '</div>';
  }

  /* ══════════════ 一、大盘指标 ══════════════
     o = {site, currency, source, mom, window}
     两站源表列不同：墨西哥表每项都带月环比/日环比/昨日；巴西表只有「指标 | 值」两列，
     环比单独一行。故按实际有无自适应 —— 缺列就不渲染该列，不用「—」占位灌水。 */

  function metricsSection(box, cat, o) {
    o = o || {};
    var ms = box.metrics || [];
    if (!ms.length) {
      return todoBlock('大盘指标', '该站点的类目大盘指标尚未采集');
    }
    var hasMom = ms.some(function (m) { return m.mom && m.mom !== '—'; });
    var hasDod = ms.some(function (m) { return m.dod && m.dod !== '—'; });
    var hasPrev = ms.some(function (m) { return m.prev && m.prev !== '—'; });

    var cards = ms.map(function (m) {
      var mom = String(m.mom || '');
      var cls = mom.indexOf('↑') >= 0 ? 'ct-up' : (mom.indexOf('↓') >= 0 ? 'ct-down' : '');
      var sub = '';
      if (hasMom) {
        sub = '月环比 <span class="' + cls + '">' + esc(mom || '—') + '</span>' +
          (hasPrev && m.prev ? ' · 昨日 ' + esc(m.prev) : '');
      }
      return '' +
        '<div class="stat-card">' +
          '<div class="stat-label">' + esc(m.label) + '</div>' +
          '<div class="stat-value">' + esc(m.value || '—') + '</div>' +
          (sub ? '<div class="stat-sub">' + sub + '</div>' : '') +
        '</div>';
    }).join('');

    var rows = ms.map(function (m) {
      return '<tr>' +
        '<td class="td-shop">' + esc(m.label) + '</td>' +
        '<td class="num num-strong">' + esc(m.value || '—') + '</td>' +
        (hasMom ? '<td class="num">' + esc(m.mom || '—') + '</td>' : '') +
        (hasDod ? '<td class="num num-mute">' + esc(m.dod || '—') + '</td>' : '') +
        (hasPrev ? '<td class="num num-mute">' + esc(m.prev || '—') + '</td>' : '') +
        '<td class="td-owner">' + esc(m.note || '') + '</td>' +
        '</tr>';
    }).join('');

    var ths = '<th>指标</th><th>数值</th>' +
      (hasMom ? '<th>月环比</th>' : '') +
      (hasDod ? '<th>日环比</th>' : '') +
      (hasPrev ? '<th>昨日</th>' : '') +
      '<th>说明</th>';
    var cols = '<col style="width:148px"><col style="width:200px">' +
      (hasMom ? '<col style="width:110px">' : '') +
      (hasDod ? '<col style="width:110px">' : '') +
      (hasPrev ? '<col style="width:120px">' : '') +
      '<col style="width:auto">';

    return '' +
      '<div class="stats-grid stats-grid-7">' + cards + '</div>' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">📊</div>一、大盘指标（' +
            esc(o.window || META.window || '近30天') + '）</div>' +
          '<span class="card-hint">站点 ' + esc(o.site || META.site || '') +
            ' · 币种 ' + esc(o.currency || META.currency || '') +
            (o.mom ? ' · 站点月环比 ' + esc(o.mom) : '') + '</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' + cols + '</colgroup>' +
            '<thead><tr>' + ths + '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">数值照录源表原文，未做换算。来源：' + esc(o.source || META.source || '') + '</div>' +
      '</div>';
  }

  /* ══════════════ 二、3年按月趋势 ══════════════ */

  function trendSection(box, o) {
    o = o || {};
    var ts = box.trend || [];
    if (!ts.length) {
      return todoBlock('3年按月趋势', '该站点的趋势数据尚未采集');
    }
    var nums = ts.map(function (t) { return num(t.value); });
    var max = Math.max.apply(null, nums.filter(function (n) { return n !== null; }).concat([1]));

    var bars = ts.map(function (t, i) {
      var v = nums[i];
      var pct = v === null ? 0 : Math.max(3, Math.round(v / max * 100));
      var isCur = String(t.time).indexOf('当前') >= 0;
      /* stage 为空时不能渲染空元素 —— .tr-stage 带浅橙底和 padding，
         空内容会画出一个假的橙色小药丸（巴西站趋势没有阶段标签，会整列假药丸） */
      return '' +
        '<div class="tr-row">' +
          '<div class="tr-time">' + esc(t.time) + '</div>' +
          '<div class="tr-track"><div class="tr-fill' + (isCur ? ' is-cur' : '') +
            '" style="width:' + pct + '%"></div></div>' +
          '<div class="tr-val">' + esc(t.value || '—') + '</div>' +
          (t.stage ? '<div class="tr-stage">' + esc(t.stage) + '</div>' : '<div></div>') +
          '<div class="tr-note">' + esc(t.note || '') + '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📈</div>' +
            esc(o.title || '二、3年按月趋势') + '</div>' +
          '<span class="card-hint">' + esc(o.hint || '2023.9 – 2026.9 · 商品销售额') + '</span>' +
        '</div>' +
        '<div class="tr-chart">' + bars + '</div>' +
        '<div class="table-note">' + esc(o.note ||
          '条形长度按源表「月销售额」原文等比绘制，仅用于看形状，不是精确刻度。') + '</div>' +
      '</div>';
  }

  /* ══════════════ 三、选品判断 / 年度周期规律 ══════════════ */

  function section3(mx) {
    var s3 = mx.s3;
    if (!s3 || !(s3.rows || []).length) {
      return todoBlock('选品判断', '该站点的结论尚未采集');
    }
    var kind = s3.kind === 'season' ? 'season' : 'verdict';
    var cls = kind === 'season' ? 'ct-green' : 'ct-orange';
    var rows = s3.rows.map(function (r) {
      return '<tr>' + r.map(function (c, i) {
        if (i === 0) return '<td class="td-shop">' + esc(c) + '</td>';
        if (i === 1 && kind === 'verdict') return '<td>' + esc(c) + '</td>';
        return '<td>' + esc(c) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    var cols = (s3.head || []).map(function (h, i) {
      return '<col' + (i === 0 ? ' style="width:150px"' : '') + '>';
    }).join('');

    return '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ' + cls + '">🧭</div>' +
            esc(s3.title || '三、选品判断') + '</div>' +
          '<span class="card-hint">' +
            (kind === 'season' ? '季节周期与备货节奏' : '来源：原表结论，未加工') + '</span>' +
        '</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table">' +
            '<colgroup>' + cols + '</colgroup>' +
            '<thead><tr>' + (s3.head || []).map(function (h) {
              return '<th>' + esc(h) + '</th>';
            }).join('') + '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  /* ══════════════ 待采集占位 ══════════════ */

  function todoBlock(title, note) {
    return '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-amber">⏳</div>' + esc(title) + '</div>' +
          '<span class="card-hint">待采集</span>' +
        '</div>' +
        '<div class="placeholder-block">' +
          '<div class="ph-title">⏳ 尚未采集</div>' +
          '<div class="table-note">' + esc(note) + '。采集后可直接回填，本页结构无需改动。' +
            '在数据补齐前，页面不展示任何推算数字。</div>' +
        '</div>' +
      '</div>';
  }

  /* ══════════════ 国家面板 ══════════════ */

  function panel(cat, code, isFirst) {
    var c = COUNTRIES.filter(function (x) { return x.code === code; })[0] || {};
    var box = cat[code.toLowerCase()] || {};
    var inner;

    if (box.status === 'done' && box.metrics && box.metrics.length) {
      var isBr = code === 'BR';
      var bm = (META.brMeta || {});
      var opt = {
        site: box.site || c.site || '',
        currency: box.currency || c.currency || '',
        window: isBr ? (bm.window || META.window) : META.window,
        mom: box.mom || '',
        source: isBr ? (bm.source || c.note || '') : (META.source || ''),
      };
      inner = metricsSection(box, cat, opt) + trendSection(box, isBr ? {
        title: '二、月度销售趋势（截图还原）',
        hint: (box.trend || []).length
          ? box.trend[0].time + ' – ' + box.trend[box.trend.length - 1].time +
            ' · ' + box.trend.length + ' 个完整月'
          : '',
        note: '数值由巴西站「大盘月度趋势图」逐月像素还原（37 个月序列中的最近 12 个完整月），' +
          '非源表数字；2026-09 因截图时点只到 9/21（不完整月）已剔除，避免误导同比判断。',
      } : {}) + section3(box);
    } else {
      inner =
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-amber">⏳</div>' +
              esc(c.site || c.name) + ' · 数据待采集</div>' +
            '<span class="card-hint">结构已预留</span>' +
          '</div>' +
          '<div class="placeholder-block">' +
            '<div class="ph-title">⏳ ' + esc(c.site || c.name) + ' 尚未采集</div>' +
            '<div class="table-note">' + esc(box.note || (c.note || '')) + '</div>' +
            '<div class="ph-list">' +
              ['类目大盘指标（7 项）', '3 年按月趋势', '选品判断 / 年度周期规律'].map(function (t) {
                return '<div class="ph-row"><span class="ph-name">' + esc(t) + '</span>' +
                  '<span class="ph-src">' + esc(c.site || '') + '</span>' +
                  '<span class="ph-tag">待采集</span></div>';
              }).join('') +
            '</div>' +
          '</div>' +
          '<div class="rule-note">口径：<b>不做推断式填充</b>。' +
            '巴西站数据到手前，本标签页只显示结构与缺口，不出现任何估算数字。</div>' +
        '</div>';
    }

    return '<div class="ct-panel" data-panel="' + esc(code) + '"' +
      (isFirst ? '' : ' hidden') + '>' + inner + '</div>';
  }

  /* ══════════════ 分类清单（三级 / 四级） ══════════════ */

  function catsSection(cat) {
    var lv3 = cat.lv3 || [];
    var lv4 = cat.lv4 || {};
    var lv4Count = cat.lv4Count || 0;

    var chips = lv3.map(function (n) {
      var sub = (lv4[n] || []);
      return '<span class="lv3-chip" title="' + esc(n + ' · 四级 ' + sub.length + ' 项') + '">' +
        '<span class="lv3-name">' + esc(n) + '</span>' +
        (sub.length ? '<span class="lv3-cnt">' + sub.length + '</span>' : '') +
        '</span>';
    }).join('');

    var lv4Rows = lv3.filter(function (n) { return (lv4[n] || []).length; }).map(function (n) {
      return '<tr>' +
        '<td class="td-shop">' + esc(n) + '</td>' +
        '<td><div class="tag-wrap">' + (lv4[n] || []).map(function (x) {
          return '<span class="tag tag-soft">' + esc(x) + '</span>';
        }).join('') + '</div></td>' +
        '</tr>';
    }).join('');

    var html = '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">📂</div>官方三级分类（' +
            lv3.length + ' 个）</div>' +
          '<span class="card-hint">来源：' + esc(META.site || '墨西哥站(MLM)') +
            ' 官方类目树 · 已剔除「其他」这类残差桶</span>' +
        '</div>' +
        '<div class="lv3-grid">' + chips + '</div>' +
        '<div class="table-note">角标数字 = 该三级分类下的四级分类个数。' +
          '类目树按站点独立，本清单取自' + esc(META.site || '墨西哥站(MLM)') +
          '；巴西站类目树待采集。</div>' +
      '</div>';

    if (lv4Count) {
      html += '' +
        '<div class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><div class="ct-icon ct-green">🧩</div>四级分类明细（' +
              lv4Count + ' 项）</div>' +
            '<span class="card-hint">源表标记为「待录入」，此处只列名称</span>' +
          '</div>' +
          '<div class="table-scroll">' +
            '<table class="shop-table">' +
              '<colgroup><col style="width:150px"><col style="width:auto"></colgroup>' +
              '<thead><tr><th>三级分类</th><th>四级分类</th></tr></thead>' +
              '<tbody>' + lv4Rows + '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="table-note">四级数据（销量/价格/竞争度）尚未采集，需逐个类目补录。</div>' +
        '</div>';
    } else {
      html += todoBlock('四级分类明细', '该二级分类下的四级分类尚未整理');
    }
    return html;
  }

  /* ══════════════ 选品清单 ══════════════ */

  function productsSection(cat) {
    var ps = cat.products || [];
    if (!ps.length) {
      return todoBlock('选品清单', '该二级分类下暂无选品清单');
    }

    var byScene = {};
    ps.forEach(function (p) {
      (byScene[p.scene] = byScene[p.scene] || []).push(p);
    });

    var rows = '';
    Object.keys(byScene).forEach(function (scene) {
      var list = byScene[scene];
      rows += '<tr class="mx-group"><td colspan="8">' + esc(scene) +
        ' · ' + list.length + ' 款</td></tr>';
      list.forEach(function (p) {
        var pc = p.priority === 'A' ? 'pri-a' : (p.priority === 'B' ? 'pri-b' : 'pri-c');
        rows += '<tr>' +
          '<td class="td-owner">' + esc(p.sub) + '</td>' +
          '<td class="td-shop">' + esc(p.name) + '</td>' +
          '<td class="td-owner">' + esc(p.es) + '</td>' +
          '<td class="td-owner">' + esc(p.pt) + '</td>' +
          '<td class="td-nowrap"><span class="ct-site">' + esc(p.site) + '</span></td>' +
          '<td><span class="pri-chip ' + pc + '">' + esc(p.priority) + '</span></td>' +
          '<td class="td-owner">' + esc(p.logistics) + '</td>' +
          '<td class="td-owner">' + esc(p.note) + '</td>' +
          '</tr>';
      });
    });

    return '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-orange">🎯</div>选品清单（' +
            ps.length + ' 款）</div>' +
          '<span class="card-hint">西语 = 墨西哥站搜索词 · 葡语 = 巴西站搜索词</span>' +
        '</div>' +
        '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table prod-table">' +
            '<colgroup><col style="width:90px"><col style="width:170px">' +
              '<col style="width:195px"><col style="width:190px">' +
              '<col style="width:118px"><col style="width:64px">' +
              '<col style="width:80px"><col style="width:330px"></colgroup>' +
            '<thead><tr><th>细分场景</th><th>产品名称</th><th>西语搜索词</th>' +
              '<th>葡语搜索词</th><th>站点侧重</th><th>优先级</th>' +
              '<th>物流友好度</th><th>注意事项</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">来源：美客多家居选品分类清单（400 条，本页筛出归属于「' +
          esc(cat.name) + '」的 ' + ps.length + ' 款）。优先级 / 物流友好度均为源表原值，未加工。</div>' +
      '</div>';
  }

  /* ══════════════ 组装 ══════════════ */

  function render(root) {
    var cat = CATS.filter(function (c) { return c.id === PAGE; })[0];
    if (!cat) {
      root.innerHTML = '<div class="card"><div class="card-title">未找到该分类页面</div>' +
        '<div class="table-note">请检查 data/home.js 中的 id 配置（当前 data-page="' +
        esc(PAGE) + '"）。</div></div>';
      return;
    }

    var html = '';

    html += pageHeaderCard({
      title: esc(cat.icon) + ' ' + esc(cat.name) +
        ' <span class="cat-es">' + esc(cat.nameEs || '') + '</span>',
      breadcrumb: '<a href="index.html">选品中心</a> / ' +
        '<a href="index.html">' + esc(META.root || '家居大类') + '</a> / ' +
        '<span>' + esc(cat.name) + '</span>',
      actions:
        '<a class="btn btn-secondary" href="index.html">📋 品类总览</a>' +
        '<button class="btn btn-primary" data-todo="导出分类报告">📤 导出报告</button>'
    });

    html += categoryPath(cat);

    /* 概览条 */
    var ovBr = cat.br || {};
    var ovHasBr = ovBr.status === 'done';
    html += '' +
      '<div class="overview-bar">' +
        '<div class="overview-item">' +
          '<div class="ov-label">月销售额（官方）</div>' +
          '<div class="ov-value">' + (cat.salesMxn ? cat.salesMxn + '亿' : '—') + '</div>' +
          '<div class="ov-sub">🇲🇽 MXN · 🇧🇷 ' +
            (ovHasBr && ovBr.salesBrl != null ? ovBr.salesBrl + '亿 BRL' : '待采集') + '</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">年销售规模</div>' +
          '<div class="ov-value">' +
            ((cat.mx || {}).yearCny != null ? (cat.mx || {}).yearCny + '亿¥' : '—') + '</div>' +
          '<div class="ov-sub">🇧🇷 ' +
            (ovHasBr && ovBr.yearCny != null ? ovBr.yearCny + '亿¥' : '待采集') +
            ' · 按源表汇率折算</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">占家居大类</div>' +
          '<div class="ov-value">' + (cat.sharePct || 0) + '%</div>' +
          '<div class="ov-sub">🇲🇽 按官方月销售额</div>' +
        '</div>' +
        '<div class="overview-item">' +
          '<div class="ov-label">选品清单</div>' +
          '<div class="ov-value">' + (cat.products || []).length + '</div>' +
          '<div class="ov-sub">款 · 三级 ' + (cat.lv3 || []).length +
            ' 个 · 四级 ' + (cat.lv4Count || 0) + ' 项</div>' +
        '</div>' +
      '</div>';

    /* 国家切换 */
    html += countryTabs();
    COUNTRIES.forEach(function (c, i) {
      html += panel(cat, c.code, i === 0);
    });

    /* 类目层（与所选国家无关） */
    html += catsSection(cat);
    html += productsSection(cat);

    html += '' +
      '<div class="page-foot">' +
        '<span>顺诚AI工作平台 ' + esc((DATA.meta || {}).version || '') +
          ' · 数据更新 ' + esc((DATA.meta || {}).updated || '') + '</span>' +
        '<span>内容源：data/home.js（脚本生成）</span>' +
      '</div>';

    root.innerHTML = html;

    /* 国家切换交互 */
    var tabs = root.querySelectorAll('.ct-tab');
    Array.prototype.forEach.call(tabs, function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-country');
        Array.prototype.forEach.call(tabs, function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        Array.prototype.forEach.call(root.querySelectorAll('.ct-panel'), function (p) {
          if (p.getAttribute('data-panel') === code) p.removeAttribute('hidden');
          else p.setAttribute('hidden', '');
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('sc-content');
    if (root) render(root);
  });
})();
