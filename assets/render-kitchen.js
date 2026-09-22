/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 厨房大类渲染层
   ───────────────────────────────────────────────────────────────
   数据源：data/kitchen.js（由 scripts/17_build_kitchendata.py 生成）
   适用页面：
     cat-kitchen.html          厨房大类总览（国家 → 13 个三级分类）
     cat-kitchen-storage.html  存储和组织专页（国家 → 四级分类）

   口径说明（与源表一致，未做换算）：
     · 墨西哥站 MLM，币种 MXN；巴西站 MLB，币种 BRL
     · 「年销(亿人民币)」取自源表，为月销 × 12 的年化值，非自然年实际
     · 源表未采集的一律显示「待采集」，不推算
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var K = window.KITCHEN || {};
  var DATA = window.SC_DATA || {};
  var PAGE = (document.body.getAttribute('data-page') || '').replace(/\.html$/, '');
  var META = K.meta || {};
  var TIERS = K.tiers || [];
  var ST = K.storage || {};
  var L3 = window.KITCHEN_L3 || {};

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var v = function (s, fallback) {
    var t = String(s == null ? '' : s).trim();
    return t ? t : (fallback || '—');
  };

  var FLAG = { mx: '🇲🇽', br: '🇧🇷' };
  var SITE = { mx: '墨西哥站 MLM', br: '巴西站 MLB' };
  var CUR = { mx: '亿MXN', br: '亿BRL' };

  /* 赛道类型 → 配色类（浅底 + 跨色系深字，见配色铁律） */
  var TRACK_CLS = {
    '🔥 头部蓝海': 'tk-t1', '🏆 头部红海': 'tk-t2', '💎 腰部蓝海': 'tk-t3',
    '⚔️ 腰部红海': 'tk-t4', '🌱 尾部蓝海': 'tk-t5', '❌ 尾部红海': 'tk-t6'
  };
  var TRACK_ORDER = ['🔥 头部蓝海', '🏆 头部红海', '💎 腰部蓝海',
                     '⚔️ 腰部红海', '🌱 尾部蓝海', '❌ 尾部红海'];

  /* ── 通用片段 ── */
  function foot() {
    return '' +
      '<div class="page-foot">' +
        '<span>顺诚AI工作平台 ' + esc((DATA.meta || {}).version || '') +
          ' · 数据更新 ' + esc(META.updated || (DATA.meta || {}).updated || '') + '</span>' +
        '<span>内容源：data/kitchen.js（脚本生成，勿手改）</span>' +
      '</div>';
  }

  function headCard(o) {
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

  function stats(items) {
    return '<div class="stats-grid">' + items.map(function (it) {
      return '<div class="stat-card">' +
        '<div class="stat-label">' + esc(it.label) + '</div>' +
        '<div class="stat-value">' + it.value + '</div>' +
        '<div class="stat-sub">' + esc(it.sub || '') + '</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function card(o) {
    return '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ' + (o.iconCls || 'ct-orange') + '">' +
            (o.icon || '📋') + '</div>' + o.title + '</div>' +
          (o.hint ? '<span class="card-hint">' + esc(o.hint) + '</span>' : '') +
        '</div>' +
        (o.noteTop ? '<div class="table-note">' + o.noteTop + '</div>' : '') +
        o.body +
        (o.note ? '<div class="table-note">' + o.note + '</div>' : '') +
      '</div>';
  }

  function tabs(defs) {
    return '<div class="ct-tabs">' + defs.map(function (d, i) {
      var badge = d.badge
        ? '<span class="ct-badge' + (d.badgeOk ? ' is-ok' : '') + '">' + esc(d.badge) + '</span>'
        : '';
      return '<button class="ct-tab' + (i === 0 ? ' active' : '') + '" type="button"' +
        ' data-country="' + esc(d.code) + '">' +
        '<span class="ct-flag">' + FLAG[d.code] + '</span>' + esc(d.name) + badge + '</button>';
    }).join('') + '</div>';
  }

  function bindTabs(root) {
    var list = root.querySelectorAll('.ct-tab');
    Array.prototype.forEach.call(list, function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-country');
        Array.prototype.forEach.call(list, function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        Array.prototype.forEach.call(root.querySelectorAll('.ct-panel'), function (p) {
          if (p.getAttribute('data-panel') === code) p.removeAttribute('hidden');
          else p.setAttribute('hidden', '');
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     一、厨房大类总览
     ══════════════════════════════════════════════════════════ */
  function renderKitchen(root) {
    var totalBoth = TIERS.reduce(function (a, t) { return a + (parseFloat(t.total) || 0); }, 0);
    var stMx = (ST.mx || {}).rows || [];
    var stBr = (ST.br || {}).rows || [];

    var html = '';

    html += headCard({
      title: '🍳 厨房大类 <span class="cat-es">' + esc('Cocina · Cozinha') + '</span>',
      actions: '<a class="btn btn-primary btn-sm" href="cat-kitchen-storage.html">📦 进入「存储和组织」四级分析</a>',
      breadcrumb: '<a href="index.html" class="path-item">选品中心</a>' +
        '<span class="path-arrow">›</span>' +
        '<span class="path-item active">🍳 厨房大类</span>'
    });

    html += stats([
      { label: '三级分类', value: TIERS.length + ' <span class="stat-unit">个</span>',
        sub: '美客多官方结构，两国一致' },
      { label: '两国合计年销', value: totalBoth.toFixed(2) + ' <span class="stat-unit">亿</span>',
        sub: '13 个三级分类加总 · 人民币' },
      { label: '站点', value: '2 <span class="stat-unit">个</span>',
        sub: '🇲🇽 墨西哥 MLM · 🇧🇷 巴西 MLB' },
      { label: '四级分类已采', value: (stMx.length + stBr.length) + ' <span class="stat-unit">条</span>',
        sub: '仅「存储和组织」下钻完成' }
    ]);

    /* ── 一、跨国格局 ── */
    var crossRows = TIERS.map(function (t) {
      var lvl = t.level || '';
      var cls = lvl.indexOf('强烈推荐') >= 0 ? 'pri-a'
              : (lvl.indexOf('推荐') >= 0 ? 'pri-b' : 'pri-c');
      return '<tr>' +
        '<td class="td-owner">' + esc(t.rank) + '</td>' +
        '<td class="td-shop"><strong>' + esc(t.name) + '</strong>' +
          '<div class="tk-es">' + esc(t.nameEs || '—') + '</div></td>' +
        '<td class="td-num">' + esc(t.total) + '</td>' +
        '<td class="td-num"><strong>' + esc(t.score) + '</strong></td>' +
        '<td class="td-owner">BR #' + esc(t.rankBr) + '</td>' +
        '<td class="td-owner">MX #' + esc(t.rankMx) + '</td>' +
        '<td><span class="pri-chip ' + cls + '">' + esc(lvl.replace(/⭐+\s*/, '')) + '</span></td>' +
        '<td class="td-note">' + esc(t.note) + '</td>' +
        '</tr>';
    }).join('');

    var traitRows = (K.traits || []).map(function (x) {
      return '<tr>' +
        '<td class="td-shop">' + esc(x.k) + '</td>' +
        '<td class="td-owner">' + esc(x.a) + '</td>' +
        '<td class="td-owner">' + esc(x.b) + '</td>' +
        '<td class="td-note">' + esc(x.note) + '</td>' +
        '</tr>';
    }).join('');

    html += card({
      icon: '🌎', iconCls: 'ct-blue', title: '一、跨国格局 · 13 个三级分类',
      hint: '排序 = 跨国综合得分降序（两国得分的均值）',
      body: '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
        '<div class="table-scroll"><table class="shop-table kt-cross">' +
        '<thead><tr><th>排名</th><th>三级分类</th><th>两国合计年销(亿)</th>' +
        '<th>综合得分</th><th>巴西排名</th><th>墨西哥排名</th><th>推荐等级</th>' +
        '<th>核心结论</th></tr></thead><tbody>' + crossRows + '</tbody></table></div>' +
        '<div class="table-note">两国合计 = 源表「跨国统一排名」的「总市场规模」，' +
        '为巴西 + 墨西哥年销（年化值）相加。等级取自源表原文。</div>' +
        '<div class="sub-title">两国市场特点对比</div>' +
        '<div class="table-scroll"><table class="shop-table">' +
        '<thead><tr><th>对比维度</th><th>🇧🇷 巴西站</th><th>🇲🇽 墨西哥站</th><th>对比结论</th></tr></thead>' +
        '<tbody>' + traitRows + '</tbody></table></div>'
    });

    /* ── 二、三级分类明细（按国家） ── */
    html += tabs([
      { code: 'mx', name: '墨西哥站', badge: '13 个三级分类' },
      { code: 'br', name: '巴西站', badge: '13 个三级分类' }
    ]);

    ['mx', 'br'].forEach(function (code, idx) {
      var rowsHtml = TIERS.map(function (t, i) {
        var d = (t[code] || {});
        var sm = d.sum || {};
        var mom = sm.mom || '';
        var yoy = sm.yoy || '';
        return '' +
          '<tr class="tk-row" data-acc="' + code + '-' + i + '">' +
            '<td class="td-owner">' + esc(t.rank) + '</td>' +
            '<td class="td-shop"><strong>' + esc(t.name) + '</strong>' +
              '<div class="tk-es">' + esc(code === 'mx' ? t.nameEs : t.namePt) + '</div></td>' +
            '<td class="td-num">' + esc(v(sm.total)) + '</td>' +
            '<td class="td-num">' + esc(v(sm.active)) + '</td>' +
            '<td class="td-num">' + esc(v(sm.activeRate)) + '</td>' +
            '<td class="td-num">' + esc(v(sm.salesWan)) + '</td>' +
            '<td class="td-num">' + esc(v(sm.salesM)) + '</td>' +
            '<td class="td-num">' + esc(v(sm.salesCnyWan)) + '</td>' +
            '<td class="td-num"><strong>' + esc(v(sm.yearCny)) + '</strong></td>' +
            '<td class="td-num">' + esc(v(sm.price)) + '</td>' +
            '<td class="td-num">' + fmtDelta(mom) + '</td>' +
            '<td class="td-num">' + fmtDelta(yoy) + '</td>' +
            '<td><button class="tk-acc-btn" type="button" data-target="acc-' + code + '-' + i + '">' +
              '详情 ▾</button></td>' +
          '</tr>' +
          '<tr class="tk-acc-row" id="acc-' + code + '-' + i + '" hidden>' +
            '<td colspan="13">' + detailBlock(t, code) + '</td></tr>';
      }).join('');

      html += '<div class="ct-panel" data-panel="' + code + '"' + (idx === 0 ? '' : ' hidden') + '>' +
        card({
          icon: code === 'mx' ? '🇲🇽' : '🇧🇷', iconCls: code === 'mx' ? 'ct-green' : 'ct-amber',
          title: '二、' + SITE[code] + ' · 13 个三级分类大盘',
          hint: '币种 ' + CUR[code] + ' · 数据时间：近 30 天',
          body: '<div class="scroll-hint">← 左右滑动可查看完整字段；点「详情」看该分类的周期规律与年销估算</div>' +
            '<div class="table-scroll"><table class="shop-table kt-detail">' +
            '<thead><tr><th>跨国<br>排名</th><th>三级分类</th><th>总商品数</th><th>活跃商品</th>' +
            '<th>活跃率</th><th>月销量<br>(万件)</th><th>月销额<br>(' + CUR[code] + ')</th>' +
            '<th>月销额<br>(万人民币)</th><th>年销<br>(亿人民币)</th><th>客单价</th>' +
            '<th>月环比</th><th>累计同比</th><th>展开</th></tr></thead>' +
            '<tbody>' + rowsHtml + '</tbody></table></div>' +
            '<div class="table-note">数值全部取自源表「' + SITE[code] + ' 厨房大类深度分析表」原值，' +
            '未做换算。「年销(亿人民币)」为源表口径（当月 × 12 的年化）。</div>'
        }) + '</div>';
    });

    /* ── 三、三级品类选品优先级（深度分析表 v1 口径）── */
    html += lv3Section();

    /* ── 四、四级下钻引导 ── */
    html += card({
      icon: '📦', iconCls: 'ct-orange', title: '四、四级分类下钻 · 仅「存储和组织」已采集',
      hint: '其余 12 个三级分类的四级数据待采集',
      body: '<div class="tk-cta">' +
        '<div class="tk-cta-main">' +
          '<div class="tk-cta-title">📦 存储和组织 <span class="cat-es">Armazenamento e Organização</span></div>' +
          '<div class="tk-cta-desc">厨房大类里唯一完成四级下钻的分类，' +
            '也是两国共同的第 1 名：🇧🇷 22.58 亿 / 🇲🇽 10.208 亿人民币，' +
            '共 ' + (stMx.length + stBr.length) + ' 条四级分类记录（墨西哥 ' + stMx.length +
            ' / 巴西 ' + stBr.length + '），含大盘指标、机会评分、赛道类型与选品建议。</div>' +
          '<div class="tk-track-list tk-legend">' + TRACK_ORDER.map(function (t) {
            return '<span class="pos-chip ' + (TRACK_CLS[t] || 'tk-t4') + '">' + esc(t) + '</span>';
          }).join('') + '</div>' +
        '</div>' +
        '<a class="btn btn-primary" href="cat-kitchen-storage.html">进入四级分析 →</a>' +
      '</div>'
    });

    /* ── 五、说明与缺口 ── */
    html += card({
      icon: '⚠️', iconCls: 'ct-amber', title: '五、数据说明与缺口',
      body: '<ul class="tk-ul">' +
        '<li><strong>页面存在两套口径，已分别标注。</strong>' +
          '一、二节为源表大盘口径（官方后台采集，13 个三级分类）；' +
          '第三节为《三级品类深度分析表 v1》口径（墨西哥 12 个 / 巴西 11 个三级品类，' +
          '烹饪与烘焙分开计数、无「其他」项）。两套口径的月销数值不一致，本节不做合并或折算。</li>' +
        '<li><strong>只有「存储和组织」有四級数据。</strong>其余三级分类' +
          '目前只有大盘指标 + 年度周期规律，四级分类未采集（第三节的四级子品类为深度分析表口径）。</li>' +
        '<li><strong>两国四级分类名称是两套译名。</strong>例：墨西哥「厨房整理架」↔ 巴西「厨房整理器」；' +
          '墨西哥「容器」↔ 巴西「食品罐」。跨国比较时需按品类对齐，不能按名称直接配。</li>' +
        '<li><strong>源表之间存在口径不一致</strong>（未擅自修改，原样保留）：' +
          '① 三级机会排名表的「年销售规模」列全为 0，正确值在汇总表；' +
          '② 两国年销合计说法不一 —— 跨国表写「巴西约 70 亿 / 墨西哥约 32 亿」，' +
          '而 13 个三级分类年化值加总为巴西 88.13 亿 / 墨西哥 31.71 亿；' +
          '③ 墨西哥四级大盘「序号」列大面积缺失，不影响名称与数值。</li>' +
        '<li><strong>巴西站数据本次已到位。</strong>巴西站厨房大类的 13 个三级分类、' +
          '存储和组织的 24 个四级分类均有实测数据。</li>' +
        '</ul>'
    });

    html += foot();
    root.innerHTML = html;
    bindTabs(root);
    bindAcc(root);
    bindL3Tabs(document.getElementById('lv3-scope'));
  }

  function fmtDelta(s) {
    var t = String(s || '').trim();
    if (!t || t === '—') return '<span class="tk-dash">—</span>';
    if (/^-|↓/.test(t)) return '<span class="ct-down">' + esc(t) + '</span>';
    if (/^\+|↑/.test(t)) return '<span class="ct-up">' + esc(t) + '</span>';
    return esc(t);
  }

  /* 三级分类展开区：大盘核心指标 / 年度周期规律 / 年销估算 */
  function detailBlock(t, code) {
    var d = (t[code] || {}).detail;
    if (!d) return '<div class="tk-empty">该分类暂无明细数据</div>';

    var out = '<div class="tk-acc-body">';

    out += '<div class="tk-sec"><div class="tk-sec-title">大盘核心指标</div>';
    if (d.metrics && d.metrics.length) {
      out += '<div class="tk-metrics">' + d.metrics.map(function (m) {
        return '<div class="tk-metric">' +
          '<div class="tk-metric-label">' + esc(m.label) + '</div>' +
          '<div class="tk-metric-value">' + esc(m.value) + '</div>' +
          (m.mom ? '<div class="tk-metric-sub">月环比 ' + fmtDelta(m.mom) + '</div>' : '') +
          (m.note ? '<div class="tk-metric-note">' + esc(m.note) + '</div>' : '') +
          '</div>';
      }).join('') + '</div>';
    } else {
      out += '<div class="tk-empty">待采集</div>';
    }
    out += '</div>';

    out += '<div class="tk-sec"><div class="tk-sec-title">年度周期规律</div>';
    if (d.season && d.season.length) {
      out += '<ul class="tk-ul">' + d.season.map(function (x) {
        var txt = (x.cells || []).join(' · ');
        return '<li>' + (x.label ? '<strong>' + esc(x.label) + '</strong>：' : '') + esc(txt) + '</li>';
      }).join('') + '</ul>';
    } else {
      out += '<div class="tk-empty">待采集</div>';
    }
    out += '</div>';

    /* 源表里巴西版没有「年销估算」这一节，按需输出，不留空栏 */
    if (d.estimate && d.estimate.length) {
      out += '<div class="tk-sec"><div class="tk-sec-title">年度销售规模估算</div>' +
        '<div class="table-scroll"><table class="shop-table">' +
        '<thead><tr><th>方法</th><th>公式</th><th>估算值</th><th>说明</th></tr></thead><tbody>' +
        d.estimate.map(function (e) {
          return '<tr><td class="td-owner">' + esc(e.method) + '</td>' +
            '<td class="td-owner">' + esc(e.formula) + '</td>' +
            '<td class="td-num">' + esc(e.value) + (e.usd ? ' （' + esc(e.usd) + '）' : '') + '</td>' +
            '<td class="td-note">' + esc(e.note) + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }

    out += '</div>';
    return out;
  }

  /* ══════════════════════════════════════════════════════════
     三、三级品类选品优先级（深度分析表 v1 口径）
     数据源：data/kitchen-l3.js（由 scripts/31_build_kitchen_l3.py 生成）
     与上面两节是两套口径：本节以三张深度分析表为准，不覆盖源表大盘。
     ══════════════════════════════════════════════════════════ */

  function lv3Cls(tier) {
    var t = String(tier || '').toUpperCase();
    if (t.indexOf('S+') === 0) return 'lv3-sx';
    if (t.indexOf('S') === 0) return 'lv3-s';
    if (t.indexOf('A') === 0) return 'lv3-a';
    if (t.indexOf('B') === 0) return 'lv3-b';
    if (t.indexOf('C') === 0) return 'lv3-c';
    return 'lv3-b';
  }

  function lv3Chip(tier) {
    if (!tier) return '<span class="tk-dash">—</span>';
    var label = String(tier).replace(/[（(].*$/, '');
    return '<span class="lv3-chip ' + lv3Cls(tier) + '">' + esc(label) + '</span>';
  }

  var lv3Star = function (s) {
    if (!s) return '<span class="tk-dash">—</span>';
    return '<span class="lv3-star">' + esc(s) + '</span>';
  };

  function lv3Detail(c, site) {
    var out = '<div class="tk-acc-body">';

    /* 源表章节标题形如「一、核心市场数据（近30天，汇率1CNY=2.57MXN）」，
       去掉「一、」与已有标题词，只留括号内的口径，避免标题重复。 */
    var rateNote = String(site.rate || '')
      .replace(/^[一二三四五六七八]、/, '')
      .replace(/核心市场数据/, '');

    out += '<div class="tk-sec"><div class="tk-sec-title">核心市场数据' +
      esc(rateNote) + '</div>' +
      ((c.metrics || []).length
        ? '<div class="lv3-metrics">' + c.metrics.map(function (m) {
            return '<div class="tk-metric">' +
              '<div class="tk-metric-label">' + esc(m[0]) + '</div>' +
              '<div class="tk-metric-value">' + esc(m[1]) + '</div>' +
              '</div>';
          }).join('') + '</div>'
        : '<div class="tk-empty">源表未提供</div>') +
      '</div>';

    out += '<div class="tk-sec lv3-span2"><div class="tk-sec-title">四级子品类 · 销量占比与自发货适配度</div>' +
      ((c.lv4 || []).length
        ? '<div class="table-scroll"><table class="shop-table">' +
            '<thead><tr><th>四级子品类</th><th>销量占比</th><th>适配度</th><th>说明</th></tr></thead>' +
            '<tbody>' + c.lv4.map(function (x) {
              return '<tr><td class="td-shop">' + esc(x.name) + '</td>' +
                '<td class="td-num">' + esc(x.share) + '</td>' +
                '<td class="td-num">' + lv3Star(x.fit) + '</td>' +
                '<td class="td-note">' + esc(x.note) + '</td></tr>';
            }).join('') + '</tbody></table></div>'
        : '<div class="tk-empty">源表未提供</div>') +
      '</div>';

    out += '<div class="tk-sec"><div class="tk-sec-title">竞争格局判断</div>' +
      ((c.bullets || []).length
        ? '<ul class="tk-ul">' + c.bullets.map(function (b) {
            return '<li>' + esc(b) + '</li>';
          }).join('') + '</ul>'
        : '<div class="tk-empty">源表未提供</div>') +
      '</div>';

    var R = c.rating || {};
    out += '<div class="tk-sec"><div class="tk-sec-title">自发货适配度评级</div>' +
      '<div class="lv3-metrics">' +
        '<div class="tk-metric"><div class="tk-metric-label">自发货友好度</div>' +
          '<div class="tk-metric-value">' + esc(R.star || c.star || '—') + '</div></div>' +
        '<div class="tk-metric"><div class="tk-metric-label">推荐优先级</div>' +
          '<div class="tk-metric-value">' + esc(R.tier || '—') + '</div></div>' +
      '</div></div>';

    if (R.advice) {
      out += '<div class="tk-sec"><div class="tk-sec-title">核心切入建议</div>' +
        '<div class="lv3-basis">' + esc(R.advice) + '</div></div>';
    }

    out += '</div>';
    return out;
  }

  function lv3SitePanel(code, siteName, site, cats) {
    var rows = cats.map(function (c, i) {
      var id = 'lv3-' + code + '-' + i;
      return '<tr>' +
          '<td class="td-owner">' + esc(c.no) + '</td>' +
          '<td class="td-shop"><strong>' + esc(c.name) + '</strong>' +
            '<div class="tk-es">' + esc(c.nameForeign || '—') + '</div></td>' +
          '<td class="td-num"><strong>' + esc(c.salesWan) + '</strong></td>' +
          '<td class="td-num">' + esc(c.aov) + '</td>' +
          '<td class="td-num">' + fmtDelta(c.yoy) + '</td>' +
          '<td class="td-num">' + esc(c.cr10Brand) + '</td>' +
          '<td class="td-num">' + esc(c.cr10Shop) + '</td>' +
          '<td class="td-num">' + esc(c.cr10Item) + '</td>' +
          '<td class="td-num">' + esc(c.selfShip) + '</td>' +
          '<td class="td-num">' + lv3Star(c.star) + '</td>' +
          '<td>' + lv3Chip(c.tier) + '</td>' +
          '<td><button class="tk-acc-btn" type="button" data-target="' + id + '">详情 ▾</button></td>' +
        '</tr>' +
        '<tr class="tk-acc-row" id="' + id + '" hidden><td colspan="12">' +
          lv3Detail(c, site) + '</td></tr>';
    }).join('');

    return card({
      icon: code === 'mx' ? '🇲🇽' : '🇧🇷',
      iconCls: code === 'mx' ? 'ct-green' : 'ct-amber',
      title: '三·B ' + siteName + ' · ' + cats.length + ' 个三级品类选品优先级',
      hint: '口径：深度分析表 v1',
      body: '<div class="scroll-hint">← 左右滑动可查看完整字段；点「详情」看四级子品类结构、竞争格局与切入建议</div>' +
        '<div class="table-scroll"><table class="shop-table kt-detail">' +
        '<colgroup><col style="width:52px"><col style="width:158px">' +
          '<col style="width:98px"><col style="width:86px"><col style="width:78px">' +
          '<col style="width:74px"><col style="width:74px"><col style="width:74px">' +
          '<col style="width:88px"><col style="width:104px"><col style="width:76px">' +
          '<col style="width:84px"></colgroup>' +
        '<thead><tr><th>序号</th><th>三级品类</th><th>月销售额<br>(万人民币)</th>' +
        '<th>客单价<br>(人民币)</th><th>累计<br>同比</th><th>品牌<br>CR10</th><th>店铺<br>CR10</th>' +
        '<th>商品<br>CR10</th><th>跨境自<br>发货占比</th><th>自发货<br>友好度</th>' +
        '<th>推荐<br>优先级</th><th>展开</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>' +
        '<div class="table-note">数值照录源表《' + siteName + '厨房_三级品类深度分析表_v1》原文，' +
        '未换算、未推断。月销售额单位为「万人民币」，与上方源表大盘口径不同。</div>'
    });
  }

  function lv3RuleTable(rows, cols) {
    if (!rows || !rows.length) return '<div class="tk-empty">源表未提供该节</div>';
    return '<div class="table-scroll"><table class="shop-table"><thead><tr>' +
      cols.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (cell, i) {
          var cls = i === 0 ? 'td-shop' : (i === r.length - 1 ? 'td-note' : 'td-owner');
          return '<td class="' + cls + '">' + esc(cell) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  function lv3RulesCard(code, siteName, site) {
    var R = site.rules || {};
    return card({
      icon: code === 'mx' ? '🇲🇽' : '🇧🇷',
      iconCls: code === 'mx' ? 'ct-green' : 'ct-amber',
      title: '三·C 选品标准与优先级规则 · ' + siteName,
      hint: '源表原文 · 未改一字',
      body: '<div class="sub-title">一、自发货硬门槛（不满足直接淘汰）</div>' +
        lv3RuleTable(R.hard, ['门槛项', '标准', '淘汰逻辑']) +
        '<div class="sub-title">二、自发货友好度星级规则</div>' +
        lv3RuleTable(R.star, ['星级', '判断标准', '适配度']) +
        '<div class="sub-title">三、优先级梯队规则</div>' +
        lv3RuleTable(R.tier, ['梯队', '标准', '行动节奏'])
    });
  }

  function lv3Section() {
    var L = L3;
    var MX = L.mx || {}, BR = L.br || {}, MG = L.merge || {};
    var mxCats = MX.cats || [], brCats = BR.cats || [], mgRows = MG.rows || [];
    if (!mxCats.length && !brCats.length) return '';

    var head = function (t) { return String(t || '').replace(/[（(].*$/, '').toUpperCase(); };
    var byTier = function (t) {
      return mgRows.filter(function (r) { return head(r.tier) === t; });
    };
    var names = function (arr) {
      return arr.map(function (r) { return r.name; }).join(' · ');
    };
    var sp = byTier('S+'), s1 = byTier('S'), cn = byTier('C');

    var html = '';

    /* ── A · 双站整合优先级总表 ── */
    /* 数字进表、建议出表 —— 建议列文字长，塞在表里会被推到屏幕外要横向拖。
       拆开后全表可在桌面宽度内完整显示，建议也不再被截断。 */
    var mergeTable = '<div class="table-scroll"><table class="shop-table">' +
      '<colgroup><col style="width:104px"><col style="width:140px">' +
        '<col style="width:94px"><col style="width:94px"><col style="width:98px">' +
        '<col style="width:90px"><col style="width:90px">' +
        '<col style="width:96px"><col style="width:96px"></colgroup>' +
      '<thead><tr><th>统一<br>优先级</th><th>品类</th>' +
      '<th>BR 月销<br>(万¥)</th><th>MX 月销<br>(万¥)</th><th>双站合计<br>(万¥)</th>' +
      '<th>BR 累计<br>增速</th><th>MX 累计<br>增速</th>' +
      '<th>BR 跨境<br>自发货</th><th>MX 跨境<br>自发货</th></tr></thead><tbody>' +
      mgRows.map(function (r) {
        return '<tr>' +
          '<td>' + lv3Chip(r.tier) + '</td>' +
          '<td class="td-shop">' + esc(r.name) + '</td>' +
          '<td class="td-num">' + esc(r.brSalesWan) + '</td>' +
          '<td class="td-num">' + esc(r.mxSalesWan) + '</td>' +
          '<td class="td-num"><strong>' + esc(r.bothWan) + '</strong></td>' +
          '<td class="td-num">' + fmtDelta(r.brYoy) + '</td>' +
          '<td class="td-num">' + fmtDelta(r.mxYoy) + '</td>' +
          '<td class="td-num">' + esc(r.brSelfShip) + '</td>' +
          '<td class="td-num">' + esc(r.mxSelfShip) + '</td>' +
          '</tr>';
      }).join('') + '</tbody></table></div>';

    var adviceList = mgRows.length
      ? '<div class="sub-title">核心切入建议（源表原文）</div>' +
        '<ul class="tk-ul lv3-advice">' + mgRows.map(function (r) {
          return '<li>' + lv3Chip(r.tier) + ' <strong>' + esc(r.name) + '</strong>：' +
            esc(r.advice) + '</li>';
        }).join('') + '</ul>'
      : '';

    var concl = (MG.conclusions || []).length
      ? '<div class="sub-title">核心整合结论（源表原文）</div>' +
        '<ul class="tk-ul">' + MG.conclusions.map(function (c) {
          return '<li>' + esc(c) + '</li>';
        }).join('') + '</ul>'
      : '';

    html += card({
      icon: '🧭', iconCls: 'ct-orange',
      title: '三、三级品类选品优先级 · 双站对照（深度分析表 v1 口径）',
      hint: '口径：' + ((L.meta || {}).basis || ''),
      body: '<div class="lv3-basis"><strong>本节与上面两节是两套口径。</strong>' +
          '上面「一、跨国格局」「二、三级分类大盘」取自源表《墨西哥厨房大类深度分析表》' +
          '《巴西厨房大类深度分析表》（官方后台采集）；' +
          '本节全部数值与结论取自三张《三级品类深度分析表 v1》，<strong>以本节为准</strong>。' +
          '两者数值不一致时不互相覆盖，各自标注来源。</div>' +
        stats([
          { label: 'S+ 最高优先级', value: sp.length + ' <span class="stat-unit">个</span>',
            sub: names(sp) || '—' },
          { label: 'S 高优先级', value: s1.length + ' <span class="stat-unit">个</span>',
            sub: names(s1) || '—' },
          { label: 'C 不进入', value: cn.length + ' <span class="stat-unit">个</span>',
            sub: names(cn) || '—' },
          { label: '三级品类', value: mxCats.length + ' / ' + brCats.length,
            sub: '🇲🇽 墨西哥 / 🇧🇷 巴西' }
        ]) +
        mergeTable + adviceList + concl +
        '<div class="table-note">来源：' +
          esc('顺诚美客多_墨巴整合_厨房大类选品优先级总表_v1.xlsx') +
          '。月销单位为万人民币，源表已折算，本页照录。' +
          '「核心切入建议」为本表原文，未做删改。</div>'
    });

    /* ── B · 两站分级明细（独立 tab，不与第一节联锁）── */
    var defs = [
      { code: 'mx', name: '墨西哥站', badge: mxCats.length + ' 个三级品类' },
      { code: 'br', name: '巴西站', badge: brCats.length + ' 个三级品类' }
    ];
    var tabsHtml = '<div class="l3-tabs">' + defs.map(function (d, i) {
      return '<button class="l3-tab' + (i === 0 ? ' active' : '') + '" type="button"' +
        ' data-l3country="' + esc(d.code) + '">' +
        '<span class="ct-flag">' + FLAG[d.code] + '</span>' + esc(d.name) +
        '<span class="l3-badge">' + esc(d.badge) + '</span></button>';
    }).join('') + '</div>';

    var panelsHtml = defs.map(function (d, i) {
      var site = d.code === 'mx' ? MX : BR;
      var cats = d.code === 'mx' ? mxCats : brCats;
      return '<div class="l3-panel" data-l3panel="' + d.code + '"' + (i === 0 ? '' : ' hidden') + '>' +
        lv3SitePanel(d.code, d.name, site, cats) + '</div>';
    }).join('');

    html += '<div id="lv3-scope">' + tabsHtml + panelsHtml + '</div>';

    /* ── C · 选品标准与优先级规则 ── */
    html += lv3RulesCard('mx', '墨西哥站', MX);
    html += lv3RulesCard('br', '巴西站', BR);

    return html;
  }

  function bindL3Tabs(scope) {
    if (!scope) return;
    var list = scope.querySelectorAll('.l3-tab');
    Array.prototype.forEach.call(list, function (btn) {
      btn.addEventListener('click', function () {
        var code = btn.getAttribute('data-l3country');
        Array.prototype.forEach.call(list, function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        Array.prototype.forEach.call(scope.querySelectorAll('.l3-panel'), function (p) {
          if (p.getAttribute('data-l3panel') === code) p.removeAttribute('hidden');
          else p.setAttribute('hidden', '');
        });
      });
    });
  }

  function bindAcc(root) {
    Array.prototype.forEach.call(root.querySelectorAll('.tk-acc-btn'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-target');
        var row = document.getElementById(id);
        if (!row) return;
        var open = !row.hasAttribute('hidden');
        if (open) { row.setAttribute('hidden', ''); btn.textContent = '详情 ▾'; }
        else { row.removeAttribute('hidden'); btn.textContent = '收起 ▴'; }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     二、存储和组织专页（四级下钻）
     ══════════════════════════════════════════════════════════ */
  function renderStorage(root) {
    var html = '';

    html += headCard({
      title: '📦 存储和组织 <span class="cat-es">Armazenamento e Organização · Cozinha</span>',
      actions: '<a class="btn btn-secondary btn-sm" href="cat-kitchen.html">← 返回厨房大类</a>',
      breadcrumb: '<a href="index.html" class="path-item">选品中心</a>' +
        '<span class="path-arrow">›</span>' +
        '<a href="cat-kitchen.html" class="path-item">🍳 厨房大类</a>' +
        '<span class="path-arrow">›</span>' +
        '<span class="path-item active">📦 存储和组织</span>'
    });

    var mxRows = (ST.mx || {}).rows || [];
    var brRows = (ST.br || {}).rows || [];
    var mxSum = mxRows.reduce(function (a, x) { return a + (parseFloat(x.yearCny) || 0); }, 0);
    var brSum = brRows.reduce(function (a, x) { return a + (parseFloat(x.yearCny) || 0); }, 0);

    html += stats([
      { label: '四级分类', value: (mxRows.length + brRows.length) + ' <span class="stat-unit">条</span>',
        sub: '墨西哥 ' + mxRows.length + ' · 巴西 ' + brRows.length },
      { label: '墨西哥规模', value: mxSum.toFixed(2) + ' <span class="stat-unit">亿</span>',
        sub: '人民币 · 年化值加总' },
      { label: '巴西规模', value: brSum.toFixed(2) + ' <span class="stat-unit">亿</span>',
        sub: '人民币 · 年化值加总' },
      { label: '厨房大类排名', value: '#1 <span class="stat-unit">/ 13</span>',
        sub: '两国均为第 1 名' }
    ]);

    /* ── 一、跨国总览对比 ── */
    var ovRows = ((ST.cross || {}).overview || []).map(function (x) {
      return '<tr><td class="td-shop">' + esc(x.k) + '</td>' +
        '<td class="td-owner">' + esc(x.a) + '</td>' +
        '<td class="td-owner">' + esc(x.b) + '</td>' +
        '<td class="td-note">' + esc(x.note) + '</td></tr>';
    }).join('');

    html += card({
      icon: '🌎', iconCls: 'ct-blue', title: '一、跨国总览对比',
      hint: '来源：存储和组织-巴西vs墨西哥整合分析表',
      body: '<div class="table-scroll"><table class="shop-table kt-cross">' +
        '<thead><tr><th>对比维度</th><th>🇧🇷 巴西站</th><th>🇲🇽 墨西哥站</th><th>对比结论</th></tr></thead>' +
        '<tbody>' + ovRows + '</tbody></table></div>'
    });

    /* ── 国家 Tab ── */
    html += tabs([
      { code: 'mx', name: '墨西哥站', badge: mxRows.length + ' 个四级' },
      { code: 'br', name: '巴西站', badge: brRows.length + ' 个四级' }
    ]);

    [['mx', mxRows, 0], ['br', brRows, 1]].forEach(function (pair) {
      var code = pair[0], rows = pair[1], idx = pair[2];

      /* 二、四级大盘 */
      var bulkRows = rows.map(function (x) {
        return '<tr' + (x.rank ? '' : ' class="tk-weak"') + '>' +
          '<td class="td-owner">' + esc(x.rank || '—') + '</td>' +
          '<td class="td-shop"><strong>' + esc(x.name) + '</strong></td>' +
          '<td class="td-num">' + esc(v(x.total)) + '</td>' +
          '<td class="td-num">' + esc(v(x.active)) + '</td>' +
          '<td class="td-num">' + esc(v(x.activeRate)) + '</td>' +
          '<td class="td-num">' + esc(v(x.salesWan)) + '</td>' +
          '<td class="td-num">' + esc(v(x.salesM)) + '</td>' +
          '<td class="td-num"><strong>' + esc(v(x.yearCny)) + '</strong></td>' +
          '<td class="td-num">' + esc(v(x.price)) + '</td>' +
          '<td><span class="pos-chip ' + (TRACK_CLS[x.track] || 'tk-t4') + '">' +
            esc(x.track || '未归类') + '</span></td>' +
          '</tr>';
      }).join('');

      /* 三、机会排名 */
      var rankRows = rows.filter(function (x) { return x.rank; }).map(function (x) {
        return '<tr>' +
          '<td class="td-owner"><strong>' + esc(x.rank) + '</strong></td>' +
          '<td class="td-shop">' + esc(x.name) + '</td>' +
          '<td class="td-num">' + esc(v(x.yearCny)) + '</td>' +
          '<td class="td-num">' + esc(v(x.share)) + '</td>' +
          '<td class="td-num">' + esc(v(x.activeRate)) + '</td>' +
          '<td class="td-num">' + esc(v(x.price)) + '</td>' +
          '<td class="td-num">' + esc(v(x.sizeScore)) + '</td>' +
          '<td class="td-num">' + esc(v(x.compScore)) + '</td>' +
          '<td class="td-num">' + esc(v(x.profitScore)) + '</td>' +
          '<td class="td-num"><strong>' + esc(v(x.score)) + '</strong></td>' +
          '<td><span class="pos-chip ' + (TRACK_CLS[x.track] || 'tk-t4') + '">' +
            esc(x.track || '未归类') + '</span></td>' +
          '<td class="td-note">' + esc(x.advice || '') + '</td>' +
          '</tr>';
      }).join('');

      var content = '';
      content += card({
        icon: '📊', iconCls: 'ct-orange', title: '二、' + SITE[code] + ' · 四级分类大盘',
        hint: '币种 ' + CUR[code] + ' · 近 30 天',
        body: '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
          '<div class="table-scroll"><table class="shop-table kt-lv4">' +
          '<thead><tr><th>排名</th><th>四级分类</th><th>总商品数</th><th>活跃商品</th>' +
          '<th>活跃率</th><th>月销量<br>(万件)</th><th>月销额<br>(' + CUR[code] + ')</th>' +
          '<th>年销<br>(亿人民币)</th><th>客单价</th><th>赛道</th></tr></thead>' +
          '<tbody>' + bulkRows + '</tbody></table></div>' +
          '<div class="table-note">「排名」列为空 = 该分类未出现在源表的机会排名中（源表遗漏，未自行推算）。' +
          '墨西哥「其他」为源表标注的「待录入」。</div>'
      });

      content += card({
        icon: '🎯', iconCls: 'ct-green', title: '三、四级分类机会排名',
        hint: '评分模型：市场规模 50% + 竞争程度 25% + 客单价 15% + 规模门槛过滤',
        body: '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
          '<div class="table-scroll"><table class="shop-table kt-rank">' +
          '<thead><tr><th>排名</th><th>四级分类</th><th>年销(亿)</th><th>市场份额%</th>' +
          '<th>活跃率%</th><th>客单价($)</th><th>规模分</th><th>竞争分</th><th>利润分</th>' +
          '<th>综合评分</th><th>赛道类型</th><th>选品建议</th></tr></thead>' +
          '<tbody>' + rankRows + '</tbody></table></div>'
      });

      /* 四、赛道地图 */
      var byTrack = {};
      rows.forEach(function (x) {
        var k = x.track || '未归类';
        (byTrack[k] = byTrack[k] || []).push(x);
      });
      var trackBody = TRACK_ORDER.concat(['未归类']).map(function (k) {
        var list = byTrack[k];
        if (!list || !list.length) return '';
        return '<div class="tk-track-row">' +
          '<span class="pos-chip ' + (TRACK_CLS[k] || 'tk-t4') + ' tk-track-name">' + esc(k) + '</span>' +
          '<span class="tk-track-list">' + list.map(function (x) {
            return '<span class="lv3-chip"><span class="lv3-name">' + esc(x.name) + '</span>' +
              (x.yearCny ? '<span class="lv3-cnt">' + esc(x.yearCny) + '亿</span>' : '') + '</span>';
          }).join('') + '</span></div>';
      }).join('');

      content += card({
        icon: '🗺️', iconCls: 'ct-blue', title: '四、赛道地图',
        hint: '按源表「赛道类型」分组 · 角标 = 年销(亿人民币)',
        body: '<div class="tk-tracks">' + trackBody + '</div>'
      });

      /* 五、核心洞察 */
      var insight = ((ST[code] || {}).insight) || [];
      content += card({
        icon: '💡', iconCls: 'ct-amber', title: '五、核心洞察与落地建议',
        hint: '源表原文，未改写',
        body: insight.length
          ? '<ul class="tk-ul">' + insight.map(function (x) {
              return '<li>' + esc(x) + '</li>';
            }).join('') + '</ul>'
          : '<div class="tk-empty">源表未给出</div>'
      });

      html += '<div class="ct-panel" data-panel="' + code + '"' + (idx === 0 ? '' : ' hidden') + '>' +
        content + '</div>';
    });

    /* ── 六、跨国选品策略 ── */
    var strategRows = ((ST.cross || {}).strategy || []).map(function (x) {
      return '<tr><td class="td-owner">' + esc(x.k) + '</td>' +
        '<td class="td-shop">' + esc(x.a) + '</td>' +
        '<td class="td-note">' + esc(x.b) + '</td></tr>';
    }).join('');

    html += card({
      icon: '🧭', iconCls: 'ct-orange', title: '六、跨国选品策略',
      hint: '来源：存储和组织-巴西vs墨西哥整合分析表',
      body: '<div class="table-scroll"><table class="shop-table kt-cross">' +
        '<thead><tr><th>策略类型</th><th>品类 / 方向</th><th>具体说明</th></tr></thead>' +
        '<tbody>' + strategRows + '</tbody></table></div>'
    });

    /* ── 七、口径与缺口 ── */
    html += card({
      icon: '⚠️', iconCls: 'ct-amber', title: '七、口径与缺口',
      body: '<ul class="tk-ul">' +
        '<li><strong>两国四级分类不是同名对照。</strong>' +
          '墨西哥与巴西的四级分类各有各的中文译名，' +
          '例如墨西哥第 1 名「厨房整理架」（$43.07）与巴西第 3 名「厨房整理器」（$10.35）' +
          '指向同类货架/整理类目；跨国比较需按品类语义对齐。</li>' +
        '<li><strong>分类数量两国不等：</strong>墨西哥 ' + mxRows.length + ' 条、巴西 ' + brRows.length +
          ' 条。源表整合文件写「巴西 23 个 / 墨西哥 21 个」，与两份大盘分表逐行核对后略有出入，' +
          '本页以分表实际行数为准。</li>' +
        '<li><strong>墨西哥 2 条待录入：</strong>「糖果容器」「其他」在源表标注待录入，' +
          '本页按原文留空、不推算。</li>' +
        '<li><strong>巴西「袋封口机」未入排名表</strong>（源表遗漏），' +
          '故排名列显示「—」，但大盘数值齐全。</li>' +
        '<li><strong>「年销(亿人民币)」是年化值</strong>（源表口径：当月销售额 × 12），' +
          '不是自然年实际成交额。</li>' +
        '</ul>'
    });

    html += foot();
    root.innerHTML = html;
    bindTabs(root);
  }

  /* ── 分发 ── */
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('sc-content');
    if (!root) return;
    if (PAGE === 'cat-kitchen-storage') renderStorage(root);
    else if (PAGE === 'cat-kitchen') renderKitchen(root);
  });
})();
