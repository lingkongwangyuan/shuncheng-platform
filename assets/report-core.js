/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 经营报表 · 计算核心（公共模块）
   ───────────────────────────────────────────────────────────────
   本文件是「经营报表」唯一的算法来源，被两处共用：
     · report.html          经营报表页（填报 + 周/月汇总 + 分红测算）
     · parter-liyuan.html   店铺合伙 · 李源（名下 9 店自动汇总）
     · parter-shi.html      店铺合伙 · 石老师

   ⚠️ 为什么必须共用一份：
      两页各写一套算法，早晚会算出两个不同的利润数。数字对不上时，
      没人能判断哪个是对的 —— 所以算法只留这一份，两边都调它。

   计算链（老周 2026-09-22 定）：
     销售额 − 退货额 = 净销售额
     净销售额 − 变动费 = 边界利润
     边界利润 − 固定费（日摊） = 经营利润

   变动费两类：
     · 手工填：广告费 / 运费 / 采购成本 / 平台罚金
     · 按费率算：销售佣金 / 支付手续费 / 低价附加费 / 其他平台费

   固定费：按「店铺 × 月份」填一次总额，按当月天数摊到每一天。

   数据存放：浏览器本地 localStorage（key: sc_report_v1）。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var STORE_KEY = 'sc_report_v1';

  /* 费率配置：页面上改过的存本地（见 load），没改过用 report-config.js 的默认值 */
  function defaultConfig() { return window.SC_REPORT_CONFIG || {}; }

  /* ══════════════ 基础工具 ══════════════ */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function num(v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }

  /* 金额：两位小数 + 千分位，负号在最前 */
  function money(v) {
    var n = num(v);
    var s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-' : '') + s;
  }

  /* 金额取整：用于 KPI 大字 */
  function money0(v) {
    var n = Math.round(num(v));
    return (n < 0 ? '-' : '') + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function pctS(v, d) {
    if (!isFinite(v)) return '—';
    return (v * 100).toFixed(d == null ? 1 : d) + '%';
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ══════════════ 存储 ══════════════ */

  function blank() {
    var cfg = defaultConfig();
    return {
      version: 1,
      rateBase: cfg.rateBase || 'net',
      rates: clone(cfg.rates || {}),
      dividend: clone(cfg.dividend || { poolPct: 0.3, partners: [] }),
      fixed: {},   /* fixed[店铺][YYYY-MM] = 金额 */
      daily: {}    /* daily[店铺][YYYY-MM-DD] = { sales, returns, ... } */
    };
  }

  /* 读本地数据；老数据缺新配置项时逐键补齐，不整块丢弃 */
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blank();
      var d = JSON.parse(raw);
      var b = blank();
      d.rateBase = d.rateBase || b.rateBase;
      d.rates = Object.assign({}, b.rates, d.rates || {});
      d.dividend = Object.assign({}, b.dividend, d.dividend || {});
      d.fixed = d.fixed || {};
      d.daily = d.daily || {};
      return d;
    } catch (e) {
      return blank();
    }
  }

  /* 写本地数据；返回是否成功（隐私模式下写不进去） */
  function save(db) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); return true; }
    catch (e) { return false; }
  }

  function hasAnyData(db) {
    var d = db.daily || {};
    for (var k in d) { if (d[k] && Object.keys(d[k]).length) return true; }
    return false;
  }

  /* ══════════════ 日期工具 ══════════════ */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseD(s) {
    var p = String(s || '').split('-');
    if (p.length !== 3) return new Date();
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function todayISO() { return iso(new Date()); }
  function ymOf(s) { return String(s).slice(0, 7); }
  function daysInMonth(s) {
    var d = parseD(s);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  }
  /* 自然周：周一 ~ 周日 */
  function weekRange(s) {
    var d = parseD(s);
    var wd = d.getDay();
    var off = (wd === 0 ? 6 : wd - 1);
    var from = new Date(d.getFullYear(), d.getMonth(), d.getDate() - off);
    var to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6);
    return { from: from, to: to };
  }
  function monthRange(s) {
    var d = parseD(s);
    return {
      from: new Date(d.getFullYear(), d.getMonth(), 1),
      to: new Date(d.getFullYear(), d.getMonth() + 1, 0)
    };
  }
  /* 逐日推进（上限 800 天，防手滑传入跨年区间把页面卡死） */
  function eachDay(from, to, fn) {
    var cur = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    var end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    var guard = 0;
    while (cur <= end && guard++ < 800) {
      fn(iso(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }

  /* ══════════════ 计算 ══════════════ */

  function fixedOfMonth(db, shop, ym) {
    return num(((db.fixed[shop] || {})[ym]));
  }

  function fixedPerDay(db, shop, date) {
    return fixedOfMonth(db, shop, ymOf(date)) / daysInMonth(date);
  }

  /* 按费率自动计算的几项变动费 */
  function costsOf(db, rec, base) {
    var r = db.rates || {};
    return {
      commission: base * num(r.commission),
      payment: base * num(r.payment),
      lowPrice: base * num(r.lowPrice),
      other: base * num(r.other)
    };
  }

  /* 单日一行（含全部派生指标） */
  function dayRow(db, shop, date) {
    var rec = ((db.daily[shop] || {})[date]) || {};
    var sales = num(rec.sales);
    var returns = num(rec.returns);
    var net = sales - returns;
    var base = (db.rateBase === 'gross') ? sales : net;
    var c = costsOf(db, rec, base);
    var ads = num(rec.ads), freight = num(rec.freight),
        cost = num(rec.cost), penalty = num(rec.penalty);

    var autoSum = c.commission + c.payment + c.lowPrice + c.other;
    var manualSum = ads + freight + cost + penalty;
    var varCost = autoSum + manualSum;

    var margin = net - varCost;                 /* 边界利润 */
    var fixed = fixedPerDay(db, shop, date);
    var profit = margin - fixed;                /* 经营利润 */

    return {
      date: date, shop: shop,
      sales: sales, returns: returns, net: net,
      commission: c.commission, payment: c.payment,
      lowPrice: c.lowPrice, other: c.other,
      ads: ads, freight: freight, cost: cost, penalty: penalty,
      autoSum: autoSum, manualSum: manualSum, base: base,
      varCost: varCost, margin: margin, fixed: fixed, profit: profit,
      /* 「这一天有没有填」：销售额、退货额、任一手工费用有一项不为 0 即算已填 */
      hasData: sales !== 0 || returns !== 0 || varCost !== 0,
      marginRate: net > 0 ? margin / net : 0,
      profitRate: net > 0 ? profit / net : 0
    };
  }

  /* 空的区间汇总容器 */
  function blankAgg() {
    return {
      days: 0, filled: 0,
      sales: 0, returns: 0, net: 0,
      commission: 0, payment: 0, lowPrice: 0, other: 0, autoSum: 0,
      ads: 0, freight: 0, cost: 0, penalty: 0, manualSum: 0,
      varCost: 0, margin: 0, fixed: 0, profit: 0,
      marginRate: 0, profitRate: 0
    };
  }

  var AGG_KEYS = ['sales','returns','net','commission','payment','lowPrice','other','autoSum',
    'ads','freight','cost','penalty','manualSum','varCost','margin','fixed','profit'];

  /* 区间汇总（逐日累加，跨月时固定费自动按月切换）
     ⚠️ 只累计「已填数据的天」：没填的天不进汇总。
        否则固定费会白摊到空白日 —— 整月只填 1 天时，月累计会被倒扣 30 天固定费，
        显示成「巨亏」（实测 -28,335），数字失去参考意义。
         满月填满后，月度数字才是完整的月度经营利润。 */
  function aggRange(db, shop, from, to) {
    var a = blankAgg();
    eachDay(from, to, function (d) {
      var r = dayRow(db, shop, d);
      a.days++;
      if (!r.hasData) return;          /* 空白天不计入 */
      a.filled++;
      AGG_KEYS.forEach(function (k) { a[k] += r[k]; });
    });
    a.marginRate = a.net > 0 ? a.margin / a.net : 0;
    a.profitRate = a.net > 0 ? a.profit / a.net : 0;
    return a;
  }

  /* 多店合并汇总：把一批店的区间汇总加总成一个人/一个组的合计
     shops 传店名数组；返回结构与 aggRange 一致，另有 filledShops / totalShops */
  function aggShops(db, shops, from, to) {
    var a = blankAgg();
    a.shopRows = [];
    a.filledShops = 0;
    a.totalShops = shops.length;
    a.hasAny = false;

    shops.forEach(function (shop) {
      var one = aggRange(db, shop, from, to);
      AGG_KEYS.forEach(function (k) { a[k] += one[k]; });
      a.days = Math.max(a.days, one.days);
      a.filled += one.filled;
      if (one.filled > 0) { a.filledShops++; a.hasAny = true; }
      a.shopRows.push({ shop: shop, agg: one });
    });

    a.marginRate = a.net > 0 ? a.margin / a.net : 0;
    a.profitRate = a.net > 0 ? a.profit / a.net : 0;
    return a;
  }

  /* 单日多店合并（今日看板用，比 aggRange 少一次循环） */
  function dayShops(db, shops, date) {
    var rows = shops.map(function (shop) {
      return dayRow(db, shop, date);
    });
    var sum = blankAgg();
    sum.days = 1;
    sum.filledShops = 0;
    sum.totalShops = shops.length;
    sum.hasAny = false;
    rows.forEach(function (r) {
      if (!r.hasData) return;
      sum.filled++;
      sum.filledShops++;
      sum.hasAny = true;
      AGG_KEYS.forEach(function (k) { sum[k] += r[k]; });
    });
    sum.marginRate = sum.net > 0 ? sum.margin / sum.net : 0;
    sum.profitRate = sum.net > 0 ? sum.profit / sum.net : 0;
    return { date: date, rows: rows, sum: sum };
  }

  window.SC_REPORT_CORE = {
    KEY: STORE_KEY,

    /* 工具 */
    esc: esc, num: num, money: money, money0: money0, pctS: pctS, clone: clone,

    /* 存储 */
    blank: blank, load: load, save: save, hasAnyData: hasAnyData,

    /* 日期 */
    pad: pad, iso: iso, parseD: parseD, todayISO: todayISO, ymOf: ymOf,
    daysInMonth: daysInMonth, weekRange: weekRange, monthRange: monthRange, eachDay: eachDay,

    /* 计算 */
    fixedOfMonth: fixedOfMonth, fixedPerDay: fixedPerDay, costsOf: costsOf,
    dayRow: dayRow, aggRange: aggRange, aggShops: aggShops, dayShops: dayShops
  };
})();
