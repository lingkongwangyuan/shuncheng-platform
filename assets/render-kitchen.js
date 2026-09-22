/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 厨房大类渲染层
   ───────────────────────────────────────────────────────────────
   适用页面：
     cat-kitchen.html          厨房大类总览（三级品类 → 双站明细 → 四级下钻）
     cat-kitchen-storage.html  存储和组织专页（国家 → 四级分类）

   两套数据源，主次分明（2026-09-22 老周定：厨房大类以三表为准）：
     · data/kitchen-l3.js   【唯一结论口径】三张《三级品类深度分析表 v1》
                            → 一、双站整合优先级总表 / 二、两站分级明细 / 三、选品规则
     · data/kitchen.js      【基础数据层参考】《墨/巴厨房大类深度分析表》等源表
                            → 第四节四级下钻（存储和组织）；月环比 / 年销年化 / 季节规律
                              经 baseRefBlock() 挂在第二节详情内，逐条标注口径。
   源表旧「跨国格局 · 13 个三级分类」（综合得分排序）已下架：其排序不含自发货可行性，
   与选品口径方向相反（详见第五节说明）。

   口径铁律：两套数值不一致时各自标注来源，不合并、不折算、不互相覆盖。
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
    var stMx = (ST.mx || {}).rows || [];
    var stBr = (ST.br || {}).rows || [];
    var LMX = (L3.mx || {}).cats || [];
    var LBR = (L3.br || {}).cats || [];

    var tierHead = function (t) { return String(t || '').replace(/[（(].*$/, '').toUpperCase(); };
    var mgRowsAll = ((L3.merge || {}).rows) || [];
    var countTier = function (k) {
      return mgRowsAll.filter(function (r) { return tierHead(r.tier) === k; });
    };
    var tierNames = function (arr) {
      return arr.map(function (r) { return r.name; }).join(' · ') || '—';
    };
    var spList = countTier('S+'), cList = countTier('C');

    var html = '';

    html += headCard({
      title: '🍳 厨房大类 <span class="cat-es">' + esc('Cocina · Cozinha') + '</span>',
      actions: '<a class="btn btn-primary btn-sm" href="cat-kitchen-storage.html">📦 进入「存储和组织」四级分析</a>',
      breadcrumb: '<a href="index.html" class="path-item">选品中心</a>' +
        '<span class="path-arrow">›</span>' +
        '<span class="path-item active">🍳 厨房大类</span>'
    });

    /* 统计条改为深度分析表 v1 口径（与本节数据一致） */
    html += stats([
      { label: '三级品类', value: LMX.length + ' / ' + LBR.length + ' <span class="stat-unit">个</span>',
        sub: '🇲🇽 墨西哥 / 🇧🇷 巴西 · 深度分析表 v1 口径' },
      { label: 'S+ 最高优先级', value: spList.length + ' <span class="stat-unit">个</span>',
        sub: tierNames(spList) },
      { label: 'C 不进入', value: cList.length + ' <span class="stat-unit">个</span>',
        sub: tierNames(cList) },
      { label: '四级分类已采', value: (stMx.length + stBr.length) + ' <span class="stat-unit">条</span>',
        sub: '仅「存储和组织」下钻完成' }
    ]);

    /* ── 一、双站整合优先级总表（深度分析表 v1 口径）──
       旧「一、跨国格局」（源表综合得分排序）已下架：其排序逻辑为
       「规模 + 增长 + 竞争」，不含自发货可行性，与本页选品口径方向相反
       （旧表第 1 名「存储和组织」在 v1 口径里仅 B 级观望、第 2 名「烹饪」为 C 不进入）。
       相关源表数据转为基础数据层参考，见第二节详情与第五节。 */
    html += lv3MergeCard();

    /* ── 二、两站分级明细（深度分析表 v1 口径）── */
    html += lv3SiteTabs();

    /* ── 三、选品标准与优先级规则（深度分析表 v1 口径）── */
    html += lv3RulesCards();

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

    /* ── 五、口径说明、基础数据层参考与缺口 ── */
    var traitRows = (K.traits || []).map(function (x) {
      return '<tr>' +
        '<td class="td-shop">' + esc(x.k) + '</td>' +
        '<td class="td-owner">' + esc(x.a) + '</td>' +
        '<td class="td-owner">' + esc(x.b) + '</td>' +
        '<td class="td-note">' + esc(x.note) + '</td>' +
        '</tr>';
    }).join('');

    html += card({
      icon: '⚠️', iconCls: 'ct-amber', title: '五、口径说明、基础数据层参考与缺口',
      body: '<ul class="tk-ul">' +
        '<li><strong>本页一、二、三节的数据与结论，全部以三张《三级品类深度分析表 v1》为准</strong>：' +
          '墨西哥站厨房_三级品类深度分析表_v1、巴西站厨房_三级品类深度分析表_v1、' +
          '墨巴整合_厨房大类选品优先级总表_v1。</li>' +
        '<li><strong>基础数据层（源表大盘）已从正文下架，转为参考。</strong>' +
          '旧「跨国格局」「三级分类大盘」两节取自《墨/巴厨房大类深度分析表》，' +
          '其排序逻辑为「规模 + 增长 + 竞争」，不含自发货可行性，与本页选品口径方向相反' +
          '（旧表第 1 名「存储和组织」在 v1 口径里为 B 级观望、第 2 名「烹饪」为 C 不进入），' +
          '故不再作为主表。其中三表未提供的字段（月环比、年销年化值、季节规律）' +
          '已保留在第二节每个品类的详情内，并单独标注口径。</li>' +
        '<li><strong>两套口径的月销数值不一致（同品类可差数倍）。</strong>' +
          '本页不做合并、不做折算，各自标注来源。选品判断以第二节（深度分析表 v1 口径）为准。</li>' +
        '<li><strong>品类数差异：</strong>深度分析表 v1 为墨西哥 12 个 / 巴西 11 个三级品类，' +
          '烹饪与烘焙分开计数、无「其他」项；源表为两国各 13 个（烹饪与烘焙合并、含「其他」）。' +
          '「餐具和服务用品」在源表两站均有数据（巴西年销 24.59 亿¥），' +
          '但巴西深度分析表 v1 与整合表均未收录，故本页第二节巴西站无该品类。</li>' +
        '<li><strong>原表自身的三处待修（未擅自修改，原样保留）：</strong>' +
          '① 墨西哥表第 9 项名为「餐具和餐具」（词重复），正式名应为「餐具和服务用品」；' +
          '② 整合表未收录「餐具和服务用品」（墨西哥表内为 5603 万¥/月）；' +
          '③ 三渠道占比（跨境自发货 + 本土海外仓 + 本土自发货）在所有品类上恰好加总 100.00%。</li>' +
        '<li><strong>基础数据层源表内部亦不一致（未擅自修改）：</strong>' +
          '跨国对比表写「巴西约 70 亿 / 墨西哥约 32 亿」，' +
          '而按 13 个三级分类年化值加总为巴西 88.13 亿 / 墨西哥 31.71 亿。' +
          '这也是基础数据层不再作为主表的原因之一。</li>' +
        '<li><strong>四级下钻仍只覆盖「存储和组织」。</strong>' +
          '其余品类目前只有三级指标与四级子品类占比（见第二节详情）。</li>' +
        '</ul>' +
        '<div class="sub-title">基础数据层参考 · 两国市场特点对比（源表口径，非本页结论）</div>' +
        '<div class="table-scroll"><table class="shop-table">' +
        '<thead><tr><th>对比维度</th><th>🇧🇷 巴西站</th><th>🇲🇽 墨西哥站</th><th>对比结论</th></tr></thead>' +
        '<tbody>' + traitRows + '</tbody></table></div>' +
        '<div class="table-note">上表取自源表《厨房大类跨国整合分析_巴西vs墨西哥》，' +
        '口径与本页一、二、三节不同，仅作背景参考。</div>'
    });

    html += foot();
    root.innerHTML = html;
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

  /* ══════════════════════════════════════════════════════════
     一 ~ 三、三级品类层（深度分析表 v1 口径 · 本页唯一结论口径）
     数据源：data/kitchen-l3.js（由 scripts/31_build_kitchen_l3.py 生成）
       · 一、双站整合优先级总表        lv3MergeCard()
       · 二、两站分级明细（tab）        lv3SiteTabs() → lv3SitePanel() → lv3Detail()
       · 三、选品标准与优先级规则        lv3RulesCards() → lv3RulesCard()
     三张深度分析表未提供的字段（月环比 / 年销年化 / 季节规律）走 baseRefBlock()，
     取自基础数据层源表并单独标注口径，不作为选品依据。
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

  /* ── 深度分析表 v1 品类名 → 基础数据层（源表）品类名映射 ──
     两套表的三级分类名不完全一致：源表把「烹饪 + 烘焙」合并为一个，
     且多一个「其他」；其余为同物异名。 */
  var L3_TO_SRC = {
    '酒类和酒吧用品': '酒类和调酒工具',
    '冰块模具和桶': '冰块模具和冰箱',
    '餐具和餐具': '餐具和服务用品',
    '围裙': '厨房围裙',
    '储存与组织': '存储和组织',
    '瓶装泵（桶泵）': '桶泵',
    '咖啡茶和马黛茶': '咖啡、茶和马黛茶'
  };

  function baseTier(name) {
    var target = L3_TO_SRC[name] || name;
    for (var i = 0; i < TIERS.length; i++) {
      if (TIERS[i].name === target) return TIERS[i];
    }
    return null;
  }

  /* 基础数据层参考块：源表口径的月环比 / 年销 / 季节规律。
     三张深度分析表 v1 未提供这三项，按「保留但标注口径」处理。 */
  function baseRefBlock(c, code) {
    var title = '<div class="tk-sec-title">基础数据层参考 · 源表大盘（口径不同，仅供趋势参考）</div>';
    var t = baseTier(c.name);

    if (!t) {
      return '<div class="tk-sec lv3-base">' + title +
        '<div class="tk-empty">源表把「烹饪 + 烘焙」合并为一个三级分类，无法拆分对应本表的单一品类</div>' +
        '</div>';
    }

    var d = t[code] || {};
    var sm = d.sum || {};
    var det = d.detail || {};
    var out = '<div class="tk-sec lv3-base">' + title;

    out += '<div class="lv3-metrics">' +
      '<div class="tk-metric"><div class="tk-metric-label">源表月销额</div>' +
        '<div class="tk-metric-value">' + esc(v(sm.salesCnyWan)) + ' <span class="stat-unit">万¥</span></div></div>' +
      '<div class="tk-metric"><div class="tk-metric-label">源表月环比</div>' +
        '<div class="tk-metric-value">' + fmtDelta(sm.mom) + '</div></div>' +
      '<div class="tk-metric"><div class="tk-metric-label">源表年销（×12 年化）</div>' +
        '<div class="tk-metric-value">' + esc(v(sm.yearCny)) + ' <span class="stat-unit">亿¥</span></div></div>' +
      '<div class="tk-metric"><div class="tk-metric-label">源表活跃率</div>' +
        '<div class="tk-metric-value">' + esc(v(sm.activeRate)) + '</div></div>' +
      '</div>';

    if (det.season && det.season.length) {
      out += '<ul class="tk-ul">' + det.season.map(function (x) {
        return '<li>' + (x.label ? '<strong>' + esc(x.label) + '</strong>：' : '') +
          esc((x.cells || []).join(' · ')) + '</li>';
      }).join('') + '</ul>';
    }

    out += '<div class="tk-metric-note">以上取自源表《' + SITE[code] + ' 厨房大类深度分析表》。' +
      '该表与本页《三级品类深度分析表 v1》的月销口径不一致（同品类可差数倍），' +
      '此处仅作环比与季节性参考，<strong>不作为选品依据</strong>。</div>';

    out += '</div>';
    return out;
  }

  function lv3Detail(c, site, code) {
    var out = '<div class="tk-acc-body">';

    /* 源表章节标题形如「一、核心市场数据（近30天，汇率1CNY=2.57MXN）」，
       去掉「一、」与已有标题词，只留括号内的口径，避免标题重复。 */
    var rateNote = String(site.rate || '')
      .replace(/^[一二三四五六七八]、/, '')
      .replace(/核心市场数据/, '');

    out += '<div class="tk-sec lv3-span2"><div class="tk-sec-title">核心市场数据' +
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
        ? '<div class="table-scroll"><table class="shop-table lv3-lv4">' +
            '<colgroup><col style="width:150px"><col style="width:84px">' +
              '<col style="width:96px"><col></colgroup>' +
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

    /* 三张深度分析表未提供的字段（月环比 / 年销 / 季节规律）→ 基础数据层参考 */
    out += baseRefBlock(c, code);

    out += '</div>';
    return out;
  }

  /* 百分比字段去掉 % 号（表头已标注单位），CR10 三项并成一格，避免窄屏横滑 */
  var barePct = function (s) { return String(s == null ? '' : s).replace(/%/g, '').trim() || '—'; };

  function lv3SitePanel(code, siteName, site, cats) {
    var rows = cats.map(function (c, i) {
      var id = 'lv3-' + code + '-' + i;
      return '<tr class="lv3-row" data-acc-row="' + id + '" title="点击展开该品类的四级子品类与切入建议">' +
          '<td class="td-shop"><div class="lv3-cat">' + lv3Chip(c.tier) +
            '<strong>' + esc(c.name) + '</strong></div>' +
            '<div class="tk-es">' + esc(c.nameForeign || '—') + '</div></td>' +
          '<td class="td-num"><strong>' + esc(c.salesWan) + '</strong></td>' +
          '<td class="td-num">' + esc(c.aov) + '</td>' +
          '<td class="td-num">' + fmtDelta(c.yoy) + '</td>' +
          '<td class="td-num"><span class="lv3-cr10">' + barePct(c.cr10Brand) +
            ' <i>/</i> ' + barePct(c.cr10Shop) + ' <i>/</i> ' + barePct(c.cr10Item) + '</span></td>' +
          '<td class="td-num">' + esc(c.selfShip) + '</td>' +
          '<td class="td-num">' + lv3Star(c.star) + '</td>' +
          '<td class="lv3-chev-td"><span class="lv3-chev" aria-hidden="true"></span></td>' +
        '</tr>' +
        '<tr class="tk-acc-row" id="' + id + '" hidden><td colspan="8">' +
          lv3Detail(c, site, code) + '</td></tr>';
    }).join('');

    return card({
      icon: code === 'mx' ? '🇲🇽' : '🇧🇷',
      iconCls: code === 'mx' ? 'ct-green' : 'ct-amber',
      title: '二、' + siteName + ' · ' + cats.length + ' 个三级品类明细',
      hint: '口径：深度分析表 v1',
      body: '<div class="scroll-hint">点任意一行，就地展开该品类的四级子品类、竞争格局与切入建议</div>' +
        '<div class="table-scroll"><table class="shop-table kt-detail">' +
        '<colgroup><col style="width:176px"><col style="width:92px">' +
          '<col style="width:74px"><col style="width:76px"><col style="width:118px">' +
          '<col style="width:86px"><col style="width:92px"><col style="width:30px"></colgroup>' +
        '<thead><tr><th>三级品类 / 优先级</th><th>月销售额<br>(万人民币)</th>' +
        '<th>客单价<br>(人民币)</th><th>累计<br>同比</th>' +
        '<th>CR10(%)<br><span class="th-sub">品牌 / 店铺 / 商品</span></th>' +
        '<th>跨境自<br>发货占比</th><th>自发货<br>友好度</th><th></th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div>' +
        '<div class="table-note">数值照录源表《' + siteName + '厨房_三级品类深度分析表_v1》原文，' +
        '未换算、未推断。月销售额单位为「万人民币」，CR10 单位为百分比。</div>'
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
      title: '三、选品标准与优先级规则 · ' + siteName,
      hint: '源表原文 · 未改一字',
      body: '<div class="sub-title">一、自发货硬门槛（不满足直接淘汰）</div>' +
        lv3RuleTable(R.hard, ['门槛项', '标准', '淘汰逻辑']) +
        '<div class="sub-title">二、自发货友好度星级规则</div>' +
        lv3RuleTable(R.star, ['星级', '判断标准', '适配度']) +
        '<div class="sub-title">三、优先级梯队规则</div>' +
        lv3RuleTable(R.tier, ['梯队', '标准', '行动节奏'])
    });
  }

  /* ── 一、双站整合优先级总表（深度分析表 v1 口径）── */
  function lv3MergeCard() {
    var L = L3, MG = L.merge || {};
    var mgRows = MG.rows || [];
    if (!mgRows.length) return '';

    var head = function (t) { return String(t || '').replace(/[（(].*$/, '').toUpperCase(); };
    var byTier = function (t) {
      return mgRows.filter(function (r) { return head(r.tier) === t; });
    };
    var names = function (arr) {
      return arr.map(function (r) { return r.name; }).join(' · ');
    };
    var sp = byTier('S+'), s1 = byTier('S'), cn = byTier('C');
    var LMX = (L.mx || {}).cats || [], LBR = (L.br || {}).cats || [];

    /* ── A · 双站整合优先级总表 ── */
    /* 数字进表、建议出表 —— 建议列文字长，塞在表里会被推到屏幕外要横向拖。
       拆开后全表可在桌面宽度内完整显示，建议也不再被截断。 */
    var mergeTable = '<div class="table-scroll"><table class="shop-table">' +
      '<colgroup><col style="width:92px"><col style="width:136px">' +
        '<col style="width:84px"><col style="width:84px"><col style="width:92px">' +
        '<col style="width:128px"><col style="width:112px"></colgroup>' +
      '<thead><tr><th>统一<br>优先级</th><th>品类</th>' +
      '<th>BR 月销<br>(万¥)</th><th>MX 月销<br>(万¥)</th><th>双站合计<br>(万¥)</th>' +
      '<th>累计增速<br><span class="th-sub">BR / MX</span></th>' +
      '<th>跨境自发货<br><span class="th-sub">BR / MX</span></th></tr></thead><tbody>' +
      mgRows.map(function (r) {
        return '<tr>' +
          '<td>' + lv3Chip(r.tier) + '</td>' +
          '<td class="td-shop">' + esc(r.name) + '</td>' +
          '<td class="td-num">' + esc(r.brSalesWan) + '</td>' +
          '<td class="td-num">' + esc(r.mxSalesWan) + '</td>' +
          '<td class="td-num"><strong>' + esc(r.bothWan) + '</strong></td>' +
          '<td class="td-num"><span class="lv3-cr10">' + fmtDelta(r.brYoy) +
            ' <i>/</i> ' + fmtDelta(r.mxYoy) + '</span></td>' +
          '<td class="td-num"><span class="lv3-cr10">' + esc(r.brSelfShip) +
            ' <i>/</i> ' + esc(r.mxSelfShip) + '</span></td>' +
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

    return card({
      icon: '🧭', iconCls: 'ct-orange',
      title: '一、双站整合优先级总表 · 深度分析表 v1 口径',
      hint: '行序照录源表，未重排',
      body: '<div class="lv3-basis"><strong>本页三级品类层面的数据与结论，全部以三张《三级品类深度分析表 v1》为准。</strong>' +
          '另有源表《墨/巴厨房大类深度分析表》的大盘数据作为基础数据层参考，' +
          '已在第二节详情内单独标注，两套口径不混用、不互相覆盖。</div>' +
        stats([
          { label: 'S+ 最高优先级', value: sp.length + ' <span class="stat-unit">个</span>',
            sub: names(sp) || '—' },
          { label: 'S 高优先级', value: s1.length + ' <span class="stat-unit">个</span>',
            sub: names(s1) || '—' },
          { label: 'C 不进入', value: cn.length + ' <span class="stat-unit">个</span>',
            sub: names(cn) || '—' },
          { label: '三级品类', value: LMX.length + ' / ' + LBR.length,
            sub: '🇲🇽 墨西哥 / 🇧🇷 巴西' }
        ]) +
        mergeTable + adviceList + concl +
        '<div class="table-note">来源：' +
          esc('顺诚美客多_墨巴整合_厨房大类选品优先级总表_v1.xlsx') +
          '。月销单位为万人民币，源表已折算，本页照录。' +
          '「核心切入建议」为本表原文，未做删改。</div>'
    });
  }

  /* ── 二、两站分级明细（独立 tab，避免与其它块联锁）── */
  function lv3SiteTabs() {
    var L = L3;
    var MX = L.mx || {}, BR = L.br || {};
    var mxCats = MX.cats || [], brCats = BR.cats || [];
    if (!mxCats.length && !brCats.length) return '';

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

    return '<div id="lv3-scope">' + tabsHtml + panelsHtml + '</div>';
  }

  /* ── 三、选品标准与优先级规则（两站分别照录）── */
  function lv3RulesCards() {
    var L = L3;
    return lv3RulesCard('mx', '墨西哥站', L.mx || {}) +
           lv3RulesCard('br', '巴西站', L.br || {});
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
    /* 按钮式展开（历史形态，保留以兼容） */
    Array.prototype.forEach.call(root.querySelectorAll('.tk-acc-btn'), function (btn) {
      btn.addEventListener('click', function () {
        var row = document.getElementById(btn.getAttribute('data-target'));
        if (!row) return;
        if (!row.hasAttribute('hidden')) { row.setAttribute('hidden', ''); btn.textContent = '详情 ▾'; }
        else { row.removeAttribute('hidden'); btn.textContent = '收起 ▴'; }
      });
    });

    /* 整行式展开（三级品类明细）：点行内任意位置就地展开，
       免去「先把宽表横滑到最右、再点按钮」的两步操作。
       同一 tbody 内互斥（手风琴），避免多行同时展开把页面拉得很长。 */
    Array.prototype.forEach.call(root.querySelectorAll('[data-acc-row]'), function (tr) {
      var collapse = function (t) {
        var r = document.getElementById(t.getAttribute('data-acc-row'));
        if (r) r.setAttribute('hidden', '');
        t.classList.remove('is-open');
      };
      var toggle = function () {
        var row = document.getElementById(tr.getAttribute('data-acc-row'));
        if (!row) return;
        var opening = row.hasAttribute('hidden');
        if (opening) {
          var sibs = tr.parentNode ? tr.parentNode.querySelectorAll('[data-acc-row].is-open') : [];
          Array.prototype.forEach.call(sibs, function (o) { if (o !== tr) collapse(o); });
          row.removeAttribute('hidden');
          tr.classList.add('is-open');
        } else {
          collapse(tr);
        }
      };
      tr.addEventListener('click', toggle);
      tr.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
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
