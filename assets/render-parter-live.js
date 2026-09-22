/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 店铺合伙 · 个人页「今日实时汇总」
   ───────────────────────────────────────────────────────────────
   适用页面：parter-liyuan.html / parter-shi.html（也供 parter.html 总览用）

   做什么：
     把经营报表里填报的数据，按「人」自动汇总 —— 这个人名下 9 家店
     今天一共赚了多少、他自己今天预估能分到多少。

   数据来源：
     经营报表填的数据（localStorage: sc_report_v1），按店铺名匹配。
     店铺归属来自 data/categories.js 的 storePool（与 data/parter.js 一致）。
     ⚠️ 本模块不产生任何数据、不估算、不补数。填报页没填的店，这里就显示「未填」。

   算法：
     全部转调 assets/report-core.js —— 与经营报表页是同一份算法，
     所以两页算出来的经营利润必然一致，不会出现两个数。

   口径（老周 2026-09-22 定）：
     · 店群经营利润 = 名下各店经营利润之和（只累计已填数据的天）
     · 个人预估     = 店群经营利润 × 提成比例（比例可填，默认 70%）
     · 日度是预估，月底按增量分红规则正式结算
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CORE = window.SC_REPORT_CORE;
  if (!CORE) return;

  var esc = CORE.esc, num = CORE.num, money = CORE.money, money0 = CORE.money0;

  /* 提成比例存本机（独立于经营报表的存储） */
  var CFG_KEY = 'sc_parter_live_v1';
  var DEFAULT_PCT = 0.70;   /* 沿用经营报表页「店铺负责人 70%」的默认值 */

  function loadCfg() {
    try {
      var d = JSON.parse(localStorage.getItem(CFG_KEY) || '{}');
      d.pct = d.pct || {};
      return d;
    } catch (e) { return { pct: {} }; }
  }
  function saveCfg(d) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(d)); return true; }
    catch (e) { return false; }
  }
  function pctOf(id) {
    var v = loadCfg().pct[id];
    return (v == null || !isFinite(v)) ? DEFAULT_PCT : v;
  }
  /* 是不是还在用默认值（页面上要标出来，免得把默认值当成已确认的约定） */
  function usingDefault(id) {
    var v = loadCfg().pct[id];
    return v == null || !isFinite(v);
  }

  /* ── 个人预估：店群经营利润 × 提成比例 ──
     利润 ≤ 0 时不提取，个人预估为 0（这是结论，不是占位） */
  function personalOf(poolProfit, pct) {
    return poolProfit > 0 ? poolProfit * pct : 0;
  }

  /* ══════════════ 取数 ══════════════ */

  /* 有店铺归属信息的人（李源 / 石老师） */
  function owners() {
    var DATA = window.SC_DATA || {};
    var pool = (DATA.storePool || {}).owners || [];
    if (pool.length) return pool;
    /* 兜底：categories 没读到就用 parter.js 里的 */
    return (window.SC_PARTER || {}).partners || [];
  }

  function shopsOf(name) {
    var list = owners().filter(function (o) { return o.name === name; })[0];
    return (list && list.shops) || [];
  }

  /* ══════════════ 汇总计算 ══════════════ */

  /* 一个人、一个区间的合计 */
  function rollup(db, shops, from, to) {
    return CORE.aggShops(db, shops, from, to);
  }

  /* 一个人「今天这一行」的明细（9 家店逐店） */
  function todayDetail(db, shops, date) {
    return CORE.dayShops(db, shops, date);
  }

  /* ══════════════ 渲染 ══════════════ */

  function dash(v, filled) {
    /* 该店铺当天没填 → 显示破折号，不显示 0（0 会被读成「这天没赚钱」） */
    return filled ? '¥' + money0(v) : '—';
  }

  function slotCard(p, date) {
    var db = CORE.load();
    var shops = p.shops && p.shops.length ? p.shops : shopsOf(p.name);
    var pct = pctOf(p.id);

    /* 三个口径：今日 / 本周 / 本月 */
    var t = todayDetail(db, shops, date);
    var w = CORE.weekRange(date);
    var m = CORE.monthRange(date);
    var wk = rollup(db, shops, w.from, w.to);
    var mo = rollup(db, shops, m.from, m.to);

    var cols = [
      { key: 'today', label: '今日', sub: date.slice(5), agg: t.sum, filledShops: t.sum.filledShops },
      { key: 'week', label: '本周', sub: CORE.iso(w.from).slice(5) + ' ~ ' + CORE.iso(w.to).slice(5),
        agg: wk, filledShops: wk.filledShops },
      { key: 'month', label: '本月', sub: date.slice(0, 7), agg: mo, filledShops: mo.filledShops }
    ];

    var body = cols.map(function (c) {
      var a = c.agg;
      var personal = personalOf(a.profit, pct);
      return '' +
        '<div class="plive-col' + (c.key === 'today' ? ' is-today' : '') + '">' +
          '<div class="plive-col-head">' + c.label +
            '<em>' + c.sub + ' · 已填 ' + c.filledShops + '/' + shops.length + ' 家</em></div>' +
          '<div class="plive-row"><span>店群净销售额</span><b>' +
            (a.hasAny ? '¥' + money0(a.net) : '—') + '</b></div>' +
          '<div class="plive-row"><span>店群经营利润</span><b class="' +
            (a.hasAny && a.profit < 0 ? 'is-neg' : '') + '">' +
            (a.hasAny ? '¥' + money0(a.profit) : '—') + '</b></div>' +
          /* 一条数据都没有时显示「—」而不是 ¥0：没有数据 ≠ 今天没赚钱 */
          '<div class="plive-row is-key"><span>个人预估</span><b>' +
            (a.hasAny ? '¥' + money0(personal) : '—') + '</b></div>' +
          '<div class="plive-sub">' +
            (a.hasAny
              ? (a.profit > 0 ? '按 ' + (pct * 100).toFixed(0) + '% 分成'
                              : '本期未盈利，不提取分红')
              : '尚未填报') +
          '</div>' +
        '</div>';
    }).join('');

    /* 提成比例（可填） */
    var rateHtml = '' +
      '<div class="plive-rate">' +
        '<label for="pliveRate">个人提成比例</label>' +
        '<span class="plive-inp-wrap"><input type="number" id="pliveRate" class="plive-inp" ' +
          'step="1" min="0" max="100" value="' + (pct * 100).toFixed(0) + '" />' +
          '<span class="plive-unit">%</span></span>' +
        (usingDefault(p.id)
          ? '<span class="plive-warn">当前是默认值 ' + (DEFAULT_PCT * 100).toFixed(0) +
            '%，请按实际约定核对后填写</span>'
          : '<span class="plive-ok">已按约定设定</span>') +
        '<span class="plive-rate-note">= 个人从店群经营利润里分成的比例</span>' +
      '</div>';

    /* 今天一家都没填时的引导，替代一片「—」 */
    var emptyHtml = '';
    if (!t.sum.hasAny) {
      var never = !CORE.hasAnyData(db);
      emptyHtml = '' +
        '<div class="plive-empty">' +
          '<b>' + (never ? '还没有任何填报数据' : '今天（' + date + '）还没有店铺填报') + '</b>' +
          '<span>' + (never
            ? '这个页面的数字全部来自「经营报表」每天的填报。先让人去填，这里就会自动出结果 —— 不需要手工汇总，也不用手工传。'
            : '名下 ' + shops.length + ' 家店今天都还没填。谁填了，这里立刻就会有数。') +
          '</span>' +
          '<a class="btn btn-primary btn-sm" href="report.html">去填写经营报表 →</a>' +
        '</div>';
    }

    return '' +
      '<div class="card plive">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-green">💰</div>' +
            esc(p.name) + ' · 店群自动汇总</div>' +
          '<span class="card-hint">名下 ' + shops.length + ' 家店 · 数据来自经营报表填报' +
            ' · 与「经营报表」同一套算法</span>' +
        '</div>' +
        '<div class="plive-bar">' + body + '</div>' +
        rateHtml +
        emptyHtml +
        '<div class="table-note">' +
          '<b>日度是预估，月底才算数。</b>这里的「个人预估」按利润比例快速折算，' +
          '用于每天看清进度；月末正式结算走增量分红规则（基准线 = 基期 × 1.15、' +
          '阶梯比例、质量闸门、当期 70% + 年终 30% 递延）—— 两者口径不同，可对不上。' +
          '<br>只累计<b>已填数据的天</b>：没人填的日子不摊固定费，也不会被算成亏损。' +
        '</div>' +
      '</div>';
  }

  function detailCard(p, date) {
    var db = CORE.load();
    var shops = p.shops && p.shops.length ? p.shops : shopsOf(p.name);
    var t = todayDetail(db, shops, date);

    var rows = t.rows.map(function (r) {
      var f = r.hasData;
      return '' +
        '<tr' + (f ? '' : ' class="plive-tr-empty"') + '>' +
          '<td class="plive-td-shop">' + esc(r.shop) + '</td>' +
          '<td class="plive-num">' + dash(r.sales, f) + '</td>' +
          '<td class="plive-num">' + dash(r.net, f) + '</td>' +
          '<td class="plive-num">' + dash(r.varCost, f) + '</td>' +
          '<td class="plive-num">' + dash(r.margin, f) + '</td>' +
          '<td class="plive-num">' + dash(r.fixed, f) + '</td>' +
          '<td class="plive-num is-strong' + (f && r.profit < 0 ? ' is-neg' : '') + '">' +
            dash(r.profit, f) + '</td>' +
          '<td class="plive-td-state">' + (f
            ? '<span class="plive-chip is-ok">已填</span>'
            : '<span class="plive-chip">未填</span>') + '</td>' +
        '</tr>';
    }).join('');

    var s = t.sum;
    var foot = '' +
      '<tr class="plive-tr-sum">' +
        '<td class="plive-td-shop">合计（已填 ' + s.filledShops + ' 家）</td>' +
        '<td class="plive-num">' + (s.hasAny ? '¥' + money0(s.sales) : '—') + '</td>' +
        '<td class="plive-num">' + (s.hasAny ? '¥' + money0(s.net) : '—') + '</td>' +
        '<td class="plive-num">' + (s.hasAny ? '¥' + money0(s.varCost) : '—') + '</td>' +
        '<td class="plive-num">' + (s.hasAny ? '¥' + money0(s.margin) : '—') + '</td>' +
        '<td class="plive-num">' + (s.hasAny ? '¥' + money0(s.fixed) : '—') + '</td>' +
        '<td class="plive-num is-strong">' + (s.hasAny ? '¥' + money0(s.profit) : '—') + '</td>' +
        '<td class="plive-td-state">' + s.filledShops + '/' + shops.length + '</td>' +
      '</tr>';

    return '' +
      '<div class="card plive">' +
        '<div class="card-head">' +
          '<div class="card-title"><div class="ct-icon ct-blue">🏬</div>' +
            '名下 ' + shops.length + ' 家店 · ' + date + ' 逐店明细</div>' +
          '<span class="card-hint">单位：元 · 「—」= 当天未填报，不是 0</span>' +
        '</div>' +
        '<div class="table-scroll">' +
          '<table class="shop-table plive-table">' +
            '<colgroup>' +
              '<col style="width:92px"><col style="width:96px"><col style="width:96px">' +
              '<col style="width:96px"><col style="width:96px"><col style="width:82px">' +
              '<col style="width:104px"><col style="width:66px">' +
            '</colgroup>' +
            '<thead><tr>' +
              '<th>店铺</th><th>销售额</th><th>净销售额</th><th>变动费</th>' +
              '<th>边界利润</th><th>固定费<br><span class="plive-th-sub">当日分摊</span></th>' +
              '<th>经营利润</th><th>状态</th>' +
            '</tr></thead>' +
            '<tbody>' + rows + foot + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="table-note">' +
          '算法与「经营报表」完全一致：净销售额 = 销售额 − 退货额；' +
          '变动费 = 佣金 + 支付手续费 + 低价附加费 + 其他 + 广告 + 运费 + 采购成本 + 罚金；' +
          '经营利润 = 净销售额 − 变动费 − 固定费当日分摊。固定费按「店铺 × 月份」填一次，摊到当月每一天。' +
        '</div>' +
      '</div>';
  }

  /* ══════════════ 挂载 ══════════════ */

  var LIVE_TARGET = null;   /* { root, p, date } —— 供跨标签页同步时重画 */

  function paint() {
    if (!LIVE_TARGET) return;
    var t = LIVE_TARGET;
    var slot = t.root.querySelector('#plive-slot');
    if (!slot) return;

    slot.innerHTML = slotCard(t.p, t.date) + detailCard(t.p, t.date);

    var rate = slot.querySelector('#pliveRate');
    if (!rate) return;
    var apply = function () {
      var v = Math.min(100, Math.max(0, num(rate.value)));
      var d = loadCfg();
      d.pct[t.p.id] = v / 100;
      saveCfg(d);
      paint();          /* 只重画这一块，不动整页 */
    };
    rate.addEventListener('change', apply);
    rate.addEventListener('blur', apply);
  }

  function mount(root, p) {
    LIVE_TARGET = { root: root, p: p, date: CORE.todayISO() };
    paint();

    /* 别的标签页在经营报表里填了数 → 本页自动跟上
       （storage 事件只在「其它文档」改动时触发，本页自己写不会触发） */
    if (!mount._bound) {
      mount._bound = true;
      window.addEventListener('storage', function (e) {
        if (!e.key || e.key === CORE.KEY || e.key === CFG_KEY) paint();
      });
    }
  }

  window.SC_PARTER_LIVE = { mount: mount, owners: owners, shopsOf: shopsOf, pctOf: pctOf };
})();
