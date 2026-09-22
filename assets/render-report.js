/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 经营报表（每日填报 → 周汇总 → 月汇总 → 分红测算）
   ───────────────────────────────────────────────────────────────
   适用页面：report.html

   计算链（老周 2026-09-22 定）：
     销售额 − 退货额 = 净销售额
     净销售额 − 变动费 = 边界利润
     边界利润 − 固定费 = 经营利润

   变动费分两类：
     · 手工填（每天金额都在变）：销售额 / 退货额 / 广告费 / 运费 / 采购成本 / 平台罚金
     · 按费率自动算（不用填）：销售佣金 / 支付手续费 / 低价附加费 / 其他平台费

   固定费：按「店铺 × 月份」填一次总额，系统按当月天数自动摊到每一天。

   数据存放：浏览器本地 localStorage（key: sc_report_v1）。
     ⚠️ 本地存储会随浏览器清缓存而丢失，请定期用页面底部「导出备份」。
     页脚底部提供 JSON 备份与 CSV 导出，方便交给财务或换电脑。
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CFG = window.SC_REPORT_CONFIG || {};
  var DATA = window.SC_DATA || {};
  var STORE_KEY = 'sc_report_v1';

  /* ── 店铺池（18 店，来自 categories.js）── */
  var SHOPS = [];
  ((DATA.storePool || {}).owners || []).forEach(function (o) {
    (o.shops || []).forEach(function (s) { SHOPS.push({ name: s, owner: o.name }); });
  });
  if (!SHOPS.length) SHOPS = [{ name: '未配置店铺', owner: '' }];

  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var num = function (v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  };
  /* 金额统一两位小数 + 千分位 */
  var money = function (v) {
    var n = num(v);
    var s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-' : '') + s;
  };
  var money0 = function (v) {
    var n = Math.round(num(v));
    return (n < 0 ? '-' : '') + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  var pctS = function (v, d) {
    if (!isFinite(v)) return '—';
    return (v * 100).toFixed(d == null ? 1 : d) + '%';
  };

  /* ══════════════ 存储 ══════════════ */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function blank() {
    return {
      version: 1,
      rateBase: CFG.rateBase || 'net',
      rates: clone(CFG.rates || {}),
      dividend: clone(CFG.dividend || { poolPct: 0.3, partners: [] }),
      fixed: {},   /* fixed[店铺][YYYY-MM] = 金额 */
      daily: {}    /* daily[店铺][YYYY-MM-DD] = { sales, returns, ... } */
    };
  }

  var DB = (function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blank();
      var d = JSON.parse(raw);
      var b = blank();
      /* 逐键兜底：老数据缺新配置项时补齐，不整块丢弃 */
      d.rateBase = d.rateBase || b.rateBase;
      d.rates = Object.assign({}, b.rates, d.rates || {});
      d.dividend = Object.assign({}, b.dividend, d.dividend || {});
      d.fixed = d.fixed || {};
      d.daily = d.daily || {};
      return d;
    } catch (e) {
      return blank();
    }
  })();

  var LS_OK = true;
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }
    catch (e) { LS_OK = false; }
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
  /* 逐日推进 */
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

  var FIELDS = CFG.inputFields || [];
  function fieldLabel(k) {
    for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i].key === k) return FIELDS[i].label;
    return k;
  }

  function fixedOfMonth(shop, ym) {
    return num(((DB.fixed[shop] || {})[ym]));
  }
  function fixedPerDay(shop, date) {
    var whole = fixedOfMonth(shop, ymOf(date));
    return whole / daysInMonth(date);
  }

  /* 单日成本拆解 */
  function costsOf(rec, base) {
    var r = DB.rates || {};
    return {
      commission: base * num(r.commission),
      payment: base * num(r.payment),
      lowPrice: base * num(r.lowPrice),
      other: base * num(r.other)
    };
  }

  /* 单日一行（含派生指标） */
  function dayRow(shop, date) {
    var rec = ((DB.daily[shop] || {})[date]) || {};
    var sales = num(rec.sales);
    var returns = num(rec.returns);
    var net = sales - returns;
    var base = (DB.rateBase === 'gross') ? sales : net;
    var c = costsOf(rec, base);
    var ads = num(rec.ads), freight = num(rec.freight), cost = num(rec.cost), penalty = num(rec.penalty);

    var autoSum = c.commission + c.payment + c.lowPrice + c.other;
    var manualSum = ads + freight + cost + penalty;
    var varCost = autoSum + manualSum;

    var margin = net - varCost;                 /* 边界利润 */
    var fixed = fixedPerDay(shop, date);
    var profit = margin - fixed;                /* 经营利润 */

    return {
      date: date, shop: shop,
      sales: sales, returns: returns, net: net,
      commission: c.commission, payment: c.payment, lowPrice: c.lowPrice, other: c.other,
      ads: ads, freight: freight, cost: cost, penalty: penalty,
      autoSum: autoSum, manualSum: manualSum, base: base,
      varCost: varCost, margin: margin, fixed: fixed, profit: profit,
      hasData: sales !== 0 || returns !== 0 || varCost !== 0,
      marginRate: net > 0 ? margin / net : 0,
      profitRate: net > 0 ? profit / net : 0
    };
  }

  /* 区间汇总（逐日累加，跨月时固定费自动按月切换）
     ⚠️ 只累计「已填数据的天」：没填的天不进汇总。
        否则固定费会白摊到空白日 —— 例如整月只填了 1 天，月累计会被倒扣 30 天固定费，
        显示成「巨亏」，数字失去参考意义。满月填满后，月度数字才是完整月度经营利润。 */
  function aggRange(shop, from, to) {
    var a = {
      days: 0, filled: 0,
      sales: 0, returns: 0, net: 0,
      commission: 0, payment: 0, lowPrice: 0, other: 0, autoSum: 0,
      ads: 0, freight: 0, cost: 0, penalty: 0, manualSum: 0,
      varCost: 0, margin: 0, fixed: 0, profit: 0
    };
    eachDay(from, to, function (d) {
      var r = dayRow(shop, d);
      a.days++;
      if (!r.hasData) return;          /* 空白天不计入 */
      a.filled++;
      ['sales','returns','net','commission','payment','lowPrice','other','autoSum',
       'ads','freight','cost','penalty','manualSum','varCost','margin','fixed','profit']
        .forEach(function (k) { a[k] += r[k]; });
    });
    a.marginRate = a.net > 0 ? a.margin / a.net : 0;
    a.profitRate = a.net > 0 ? a.profit / a.net : 0;
    return a;
  }

  /* ══════════════ 页面状态 ══════════════ */

  var state = {
    shop: SHOPS[0].name,
    date: todayISO()
  };

  /* ══════════════ 渲染 ══════════════ */

  function optShops(sel) {
    var out = '', lastOwner = null;
    SHOPS.forEach(function (s) {
      if (s.owner !== lastOwner) {
        if (lastOwner !== null) out += '</optgroup>';
        out += '<optgroup label="' + esc(s.owner) + '">';
        lastOwner = s.owner;
      }
      out += '<option value="' + esc(s.name) + '"' + (s.name === sel ? ' selected' : '') + '>' +
             esc(s.name) + '</option>';
    });
    if (lastOwner !== null) out += '</optgroup>';
    return out;
  }

  function barHTML() {
    return '<div class="rp-bar">' +
      '<div class="rp-bar-item"><label>店铺</label>' +
        '<select id="rpShop" class="rp-select">' + optShops(state.shop) + '</select></div>' +
      '<div class="rp-bar-item"><label>日期</label>' +
        '<input type="date" id="rpDate" class="rp-date" value="' + state.date + '" /></div>' +
      '<div class="rp-bar-btns">' +
        '<button class="btn btn-secondary btn-sm" data-nav="-1">◀ 前一天</button>' +
        '<button class="btn btn-secondary btn-sm" data-nav="0">今天</button>' +
        '<button class="btn btn-secondary btn-sm" data-nav="1">后一天 ▶</button>' +
      '</div>' +
    '</div>';
  }

  function formHTML() {
    var rec = ((DB.daily[state.shop] || {})[state.date]) || {};
    var inp = FIELDS.map(function (f) {
      var v = rec[f.key];
      var val = (v === undefined || v === null || v === '') ? '' : v;
      return '<div class="rp-field">' +
        '<label for="rp-in-' + f.key + '">' + esc(f.label) +
          (f.req ? '<i class="rp-req">必填</i>' : '') + '</label>' +
        '<div class="rp-inp-wrap">' +
          '<input type="number" step="0.01" min="0" inputmode="decimal" class="rp-inp" ' +
            'id="rp-in-' + f.key + '" data-k="' + f.key + '" value="' + esc(val) + '" placeholder="0.00" />' +
          '<span class="rp-unit">元</span>' +
        '</div>' +
        '<div class="rp-hint">' + esc(f.hint || '') + '</div>' +
      '</div>';
    }).join('');

    var r = DB.rates || {};
    var auto = [
      { k: 'commission', label: '销售佣金', rate: r.commission },
      { k: 'payment', label: '支付手续费', rate: r.payment },
      { k: 'lowPrice', label: '低价附加费', rate: r.lowPrice },
      { k: 'other', label: '其他平台费', rate: r.other }
    ].map(function (x) {
      return '<div class="rp-auto-item">' +
        '<div class="rp-auto-label">' + esc(x.label) + '</div>' +
        '<div class="rp-auto-val" id="rp-auto-' + x.k + '">0.00</div>' +
        '<div class="rp-auto-rate">费率 ' + pctS(num(x.rate), 2) + '</div>' +
      '</div>';
    }).join('');

    return '' +
    '<div class="rp-cols">' +
      '<div class="card rp-card-input">' +
        '<div class="card-head"><div class="card-title">✍️ 每天手工填这几项</div>' +
          '<div class="card-hint">填完自动存，不用点保存</div></div>' +
        '<div class="rp-form">' + inp + '</div>' +
        '<div class="rp-autobox">' +
          '<div class="rp-autobox-head">⚙️ 这几项按费率自动算，不用填</div>' +
          '<div class="rp-auto-grid">' + auto + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="card rp-card-result">' +
        '<div class="card-head"><div class="card-title">📊 ' + esc(state.date) + ' 算出来是这样</div>' +
          '<div class="card-hint">跟着左边的数字实时变</div></div>' +
        '<div class="rp-chain" id="rpChain"></div>' +
        '<div class="rp-profit" id="rpProfit"></div>' +
      '</div>' +
    '</div>';
  }

  function summaryHTML() {
    var w = weekRange(state.date), m = monthRange(state.date);
    var A = aggRange(state.shop, w.from, w.to);
    var B = aggRange(state.shop, m.from, m.to);

    var rowDefs = [
      { k: 'sales',   label: '销售额',     cls: '' },
      { k: 'returns', label: '退货额',     cls: 'is-minus' },
      { k: 'net',     label: '净销售额',   cls: 'is-sub' },
      { k: 'varCost', label: '变动费',     cls: 'is-minus' },
      { k: 'margin',  label: '边界利润',   cls: 'is-sub' },
      { k: 'fixed',   label: '固定费',     cls: 'is-minus' },
      { k: 'profit',  label: '经营利润',   cls: 'is-key' }
    ];
    var body = rowDefs.map(function (r) {
      return '<tr class="' + r.cls + '"><td class="rp-td-name">' + esc(r.label) + '</td>' +
        '<td class="rp-td-num" id="rpSum-' + r.k + '-w">' + money(A[r.k]) + '</td>' +
        '<td class="rp-td-num" id="rpSum-' + r.k + '-m">' + money(B[r.k]) + '</td></tr>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title">📅 自动汇总 · 本周 / 本月</div>' +
        '<div class="card-hint">' + esc(state.shop) + ' · 单位：元 · 每天填完自动累加，不用手动合</div></div>' +
      '<div class="table-scroll"><table class="shop-table rp-table">' +
        '<colgroup><col style="width:180px"><col><col></colgroup>' +
        '<thead><tr><th>项目</th>' +
          '<th style="text-align:right" id="rpSum-head-w">本周（' + iso(w.from).slice(5) + ' ~ ' + iso(w.to).slice(5) +
            '，已填 ' + A.filled + '/' + A.days + ' 天）</th>' +
          '<th style="text-align:right" id="rpSum-head-m">本月（' + ymOf(state.date) +
            '，已填 ' + B.filled + '/' + B.days + ' 天）</th></tr></thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table></div>' +
      '<div class="table-note">口径：只累计「已填数据的天」。固定费按整月总额 ÷ 当月天数，摊到每一个已填日；' +
        '整月填满后，月度数字就是完整的月度经营利润。</div>' +
      '<div class="rp-kpi">' +
        '<div class="rp-kpi-item"><span>本周边界利润率</span><b id="rpKpi-marginW">' + pctS(A.marginRate) + '</b></div>' +
        '<div class="rp-kpi-item"><span>本周经营利润率</span><b id="rpKpi-profitW">' + pctS(A.profitRate) + '</b></div>' +
        '<div class="rp-kpi-item"><span>本月边界利润率</span><b id="rpKpi-marginM">' + pctS(B.marginRate) + '</b></div>' +
        '<div class="rp-kpi-item is-key"><span>本月经营利润</span><b id="rpKpi-profitM">¥' + money0(B.profit) + '</b></div>' +
      '</div>' +
    '</div>';
  }

  function fixedHTML() {
    var ym = ymOf(state.date);
    var v = fixedOfMonth(state.shop, ym);
    var per = v / daysInMonth(state.date);
    return '<div class="card">' +
      '<div class="card-head"><div class="card-title">🏠 固定费（每月填一次就够）</div>' +
        '<div class="card-hint">按「店铺 × 月份」填，系统自动摊到每一天</div></div>' +
      '<div class="rp-fixed">' +
        '<div class="rp-fixed-item"><label>' + esc(state.shop) + ' · ' + ym + ' 固定费</label>' +
          '<div class="rp-inp-wrap"><input type="number" step="0.01" min="0" class="rp-inp" ' +
            'id="rpFixed" value="' + (v ? v : '') + '" placeholder="0.00" />' +
            '<span class="rp-unit">元</span></div></div>' +
        '<div class="rp-fixed-arrow">÷ ' + daysInMonth(state.date) + ' 天</div>' +
        '<div class="rp-fixed-item"><label>摊到每天</label>' +
          '<div class="rp-fixed-out">¥<span id="rpFixedDay">' + money(per) + '</span></div></div>' +
      '</div>' +
      '<div class="table-note">固定费含固定工资、分摊房租、社保、水电物业、工具订阅等（详见《费用科目字典》固定费 8 项）。' +
      '当月改一次，全月每天的数跟着重算。</div>' +
    '</div>';
  }

  function dividendHTML() {
    var m = monthRange(state.date);
    var B = aggRange(state.shop, m.from, m.to);
    var d = DB.dividend || {};
    var pool = B.profit > 0 ? B.profit * num(d.poolPct) : 0;

    var partners = (d.partners || []).map(function (p, i) {
      var amt = pool * num(p.pct);
      return '<tr><td class="rp-td-name">' + esc(p.name || ('合伙人 ' + (i + 1))) + '</td>' +
        '<td class="rp-td-num">' + pctS(num(p.pct), 0) + '</td>' +
        '<td class="rp-td-num rp-td-strong" id="rpPv-' + i + '">¥' + money(amt) + '</td></tr>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title">🤝 分红测算（位置先留着，规则随时可调）</div>' +
        '<div class="card-hint">' + esc(state.shop) + ' · ' + ymOf(state.date) + ' 至今</div></div>' +
      '<div class="rp-dv-top">' +
        '<div class="rp-dv-box"><span>本月经营利润</span><b id="rpDv-profit">¥' + money(B.profit) + '</b>' +
          '<em id="rpDv-days">已填 ' + B.filled + ' 天</em></div>' +
        '<div class="rp-dv-box"><span>分红池比例</span>' +
          '<div class="rp-inp-wrap is-tiny"><input type="number" step="1" min="0" max="100" class="rp-inp" ' +
            'id="rpPool" value="' + (num(d.poolPct) * 100).toFixed(0) + '" /><span class="rp-unit">%</span></div>' +
          '<em>按经营利润提取</em></div>' +
        '<div class="rp-dv-box is-key"><span>可分配分红池</span><b id="rpDv-pool">¥' + money(pool) + '</b>' +
          '<em id="rpDv-note">' + (B.profit > 0 ? '经营利润为负时不提取' : '本月尚未盈利') + '</em></div>' +
      '</div>' +
      '<div class="table-scroll"><table class="shop-table rp-table">' +
        '<colgroup><col style="width:180px"><col><col></colgroup>' +
        '<thead><tr><th>合伙人</th><th style="text-align:right">分成比例</th>' +
          '<th style="text-align:right">本期可分（元）</th></tr></thead>' +
        '<tbody id="rpPartners">' + (partners || '<tr><td colspan="3" class="rp-empty">未设置合伙人</td></tr>') + '</tbody>' +
      '</table></div>' +
      '<div class="table-note">这里只做「经营利润 × 分红池 × 分成比例」的测算，不涉及递延、基准利润等细则。' +
      '等利润数据跑稳了再接完整的增量分红规则。</div>' +
    '</div>';
  }

  function detailHTML() {
    var rows = DB.daily[state.shop] || {};
    var keys = Object.keys(rows).sort().reverse().slice(0, 31);
    if (!keys.length) {
      return '<div class="card"><div class="card-head"><div class="card-title">📋 已填明细</div></div>' +
        '<div class="table-note">这家店还没有填写记录。填第一天的数据后，这里会按天列出来。</div></div>';
    }
    var body = keys.map(function (d) {
      var r = dayRow(state.shop, d);
      return '<tr><td class="rp-td-name">' +
          '<span class="rp-daylink" data-goto="' + esc(d) + '" title="跳回这一天继续改">' + esc(d) + '</span></td>' +
        '<td class="rp-td-num">' + money(r.sales) + '</td>' +
        '<td class="rp-td-num">' + money(r.net) + '</td>' +
        '<td class="rp-td-num">' + money(r.varCost) + '</td>' +
        '<td class="rp-td-num">' + money(r.margin) + '</td>' +
        '<td class="rp-td-num ' + (r.profit < 0 ? 'is-neg' : '') + '">' + money(r.profit) + '</td>' +
        '<td class="rp-td-op"><button class="rp-del" data-del="' + esc(d) + '" title="删除这天的记录">✕</button></td>' +
      '</tr>';
    }).join('');

    return '<div class="card">' +
      '<div class="card-head"><div class="card-title">📋 已填明细 · 最近 31 天</div>' +
        '<div class="card-hint">' + esc(state.shop) + ' · 点日期可跳回去改</div></div>' +
      '<div class="table-scroll"><table class="shop-table rp-table">' +
        '<colgroup><col style="width:110px"><col><col><col><col><col><col style="width:46px"></colgroup>' +
        '<thead><tr><th>日期</th><th style="text-align:right">销售额</th>' +
          '<th style="text-align:right">净销售额</th><th style="text-align:right">变动费</th>' +
          '<th style="text-align:right">边界利润</th><th style="text-align:right">经营利润</th><th></th></tr></thead>' +
        '<tbody>' + body + '</tbody></table></div>' +
    '</div>';
  }

  function settingsHTML() {
    var r = DB.rates || {};
    return '<div class="card">' +
      '<div class="card-head"><div class="card-title">⚙️ 费率与数据</div>' +
        '<div class="card-hint">费率改完点「保存费率」，全店重算</div></div>' +
      '<div class="rp-rates">' +
        [['commission','销售佣金率'],['payment','支付手续费率'],['lowPrice','低价附加费率'],['other','其他平台费率']]
        .map(function (p) {
          return '<div class="rp-rate-item"><label>' + esc(p[1]) + '</label>' +
            '<div class="rp-inp-wrap is-tiny"><input type="number" step="0.01" min="0" max="100" ' +
              'class="rp-inp" id="rpRate-' + p[0] + '" value="' + (num(r[p[0]]) * 100).toFixed(2) + '" />' +
              '<span class="rp-unit">%</span></div></div>';
        }).join('') +
      '</div>' +
      '<div class="rp-actions">' +
        '<button class="btn btn-primary btn-sm" id="rpSaveRates">保存费率</button>' +
        '<button class="btn btn-secondary btn-sm" id="rpExportJson">📤 导出备份（JSON）</button>' +
        '<button class="btn btn-secondary btn-sm" id="rpExportCsv">📊 导出明细（CSV）</button>' +
        '<button class="btn btn-secondary btn-sm" id="rpImport">📥 导入备份</button>' +
        '<input type="file" id="rpFile" accept=".json" style="display:none" />' +
      '</div>' +
      '<div class="table-note">' +
        '数据存在这台电脑的浏览器里（不上传、不外发）。<strong>换电脑或清理浏览器缓存会丢</strong>，' +
        '请定期点「导出备份」存一份到网盘或群文件。' +
        '费率参考《费用科目字典 v1》：墨西哥家居类佣金约 19.5%，巴西 Clássico 13% / Premium 18%，' +
        '支付手续费约 2%~3.5%。<strong>以后台实际账单校准后再定稿。</strong>' +
      '</div>' +
    '</div>';
  }

  /* ══════════════ 局部刷新（输入时只动数字，不重建 DOM，避免光标丢失）══════════════ */

  function refreshNumbers() {
    var r = dayRow(state.shop, state.date);
    var base = r.base;

    var setTxt = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    setTxt('rp-auto-commission', money(r.commission));
    setTxt('rp-auto-payment', money(r.payment));
    setTxt('rp-auto-lowPrice', money(r.lowPrice));
    setTxt('rp-auto-other', money(r.other));

    var chain = document.getElementById('rpChain');
    if (chain) {
      var signMoney = function (v) {
        var n = num(v);
        return (n < 0 ? '−' : '') + '¥' + money(Math.abs(n));
      };
      var line = function (label, expr, val, cls) {
        return '<div class="rp-chain-row ' + (cls || '') + '">' +
          '<span class="rp-chain-label">' + label + '</span>' +
          '<span class="rp-chain-expr">' + expr + '</span>' +
          '<span class="rp-chain-val">' + signMoney(val) + '</span></div>';
      };
      chain.innerHTML =
        line('销售额', '手工填', r.sales, 'is-in') +
        line('退货额', '手工填', -r.returns, 'is-in') +
        line('净销售额', '销售额 − 退货额', r.net, 'is-sub') +
        '<div class="rp-chain-break">变动费明细</div>' +
        line('自动算合计', '佣金 ' + money(r.commission) + ' + 支付 ' + money(r.payment) +
             ' + 附加 ' + money(r.lowPrice) + ' + 其他 ' + money(r.other), -r.autoSum, 'is-auto') +
        line('手工填合计', '广告 ' + money(r.ads) + ' + 运费 ' + money(r.freight) +
             ' + 采购 ' + money(r.cost) + ' + 罚金 ' + money(r.penalty), -r.manualSum, 'is-in') +
        line('变动费合计', '自动算 + 手工填', -r.varCost, 'is-minus') +
        line('边界利润', '净销售额 − 变动费', r.margin, 'is-sub') +
        line('固定费', '月固定费 ÷ ' + daysInMonth(state.date) + ' 天', -r.fixed, 'is-auto') +
        line('经营利润', '边界利润 − 固定费', r.profit, 'is-key');
    }

    var pf = document.getElementById('rpProfit');
    if (pf) {
      var cls = r.profit > 0 ? 'is-pos' : (r.profit < 0 ? 'is-neg' : '');
      pf.className = 'rp-profit ' + cls;
      pf.innerHTML =
        '<div class="rp-profit-label">这一天，这家店赚了</div>' +
        '<div class="rp-profit-val">' + (r.profit < 0 ? '−' : '') + '¥' + money(Math.abs(r.profit)) + '</div>' +
        '<div class="rp-profit-meta">净销售额 ¥' + money(r.net) +
          '　边界利润率 ' + pctS(r.marginRate) +
          '　经营利润率 ' + pctS(r.profitRate) + '</div>';
    }

    updateRollups();
  }

  /* 汇总与分红：填数时同步刷新数字，但不重建 DOM —— 保住正在输入的焦点 */
  function updateRollups() {
    var w = weekRange(state.date), m = monthRange(state.date);
    var A = aggRange(state.shop, w.from, w.to);
    var B = aggRange(state.shop, m.from, m.to);
    var setTxt = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };

    ['sales', 'returns', 'net', 'varCost', 'margin', 'fixed', 'profit'].forEach(function (k) {
      setTxt('rpSum-' + k + '-w', money(A[k]));
      setTxt('rpSum-' + k + '-m', money(B[k]));
    });
    setTxt('rpSum-head-w', '本周（' + iso(w.from).slice(5) + ' ~ ' + iso(w.to).slice(5) +
      '，已填 ' + A.filled + '/' + A.days + ' 天）');
    setTxt('rpSum-head-m', '本月（' + ymOf(state.date) +
      '，已填 ' + B.filled + '/' + B.days + ' 天）');

    setTxt('rpKpi-marginW', pctS(A.marginRate));
    setTxt('rpKpi-profitW', pctS(A.profitRate));
    setTxt('rpKpi-marginM', pctS(B.marginRate));
    setTxt('rpKpi-profitM', '¥' + money0(B.profit));

    var dv = DB.dividend || {};
    var pool = B.profit > 0 ? B.profit * num(dv.poolPct) : 0;
    setTxt('rpDv-profit', '¥' + money(B.profit));
    setTxt('rpDv-days', '已填 ' + B.filled + ' 天');
    setTxt('rpDv-pool', '¥' + money(pool));
    setTxt('rpDv-note', B.profit > 0 ? '经营利润为负时不提取' : '本月尚未盈利');
    (dv.partners || []).forEach(function (p, i) {
      setTxt('rpPv-' + i, '¥' + money(pool * num(p.pct)));
    });
  }

  /* ══════════════ 主渲染 ══════════════ */

  function render(root) {
    root.innerHTML =
      '<div class="rp-head">' +
        '<h1 class="rp-title">经营报表 · 每日填报</h1>' +
        '<div class="rp-desc">每天填 6 个数，平台自动算佣金、支付费，自动汇总到周和月，实时看到这家店赚了多少。' +
        '<br><span class="rp-formula">销售额 − 退货额 = 净销售额　−　变动费 = 边界利润　−　固定费 = 经营利润</span></div>' +
      '</div>' +
      barHTML() +
      formHTML() +
      summaryHTML() +
      fixedHTML() +
      dividendHTML() +
      detailHTML() +
      settingsHTML() +
      (LS_OK ? '' : '<div class="card"><div class="rp-warnbar">⚠️ 浏览器本地存储不可用（可能是隐私模式），' +
        '填写的数据刷新后会丢失。请改用普通窗口打开。</div></div>');

    bind(root);
    refreshNumbers();
  }

  /* ══════════════ 交互绑定 ══════════════ */

  function bind(root) {
    var toast = window.scToast || function () {};

    /* 店铺切换 */
    var sel = document.getElementById('rpShop');
    if (sel) sel.addEventListener('change', function () {
      state.shop = sel.value;
      render(root);
    });

    /* 日期切换 */
    var dt = document.getElementById('rpDate');
    if (dt) dt.addEventListener('change', function () {
      if (!dt.value) return;
      state.date = dt.value;
      render(root);
    });

    Array.prototype.forEach.call(root.querySelectorAll('[data-nav]'), function (b) {
      b.addEventListener('click', function () {
        var off = parseInt(b.getAttribute('data-nav'), 10);
        if (off === 0) { state.date = todayISO(); }
        else {
          var d = parseD(state.date);
          d.setDate(d.getDate() + off);
          state.date = iso(d);
        }
        render(root);
      });
    });

    /* 每日填报：输入即时算 + 自动存 */
    Array.prototype.forEach.call(root.querySelectorAll('.rp-inp[data-k]'), function (inp) {
      inp.addEventListener('input', function () {
        var k = inp.getAttribute('data-k');
        if (!DB.daily[state.shop]) DB.daily[state.shop] = {};
        var rec = DB.daily[state.shop][state.date] || {};
        var val = inp.value === '' ? '' : Math.max(0, num(inp.value));
        if (val === '') delete rec[k]; else rec[k] = val;
        /* 全空则整条删掉，不留空壳 */
        var hasAny = Object.keys(rec).some(function (x) { return rec[x] !== '' && rec[x] !== undefined && rec[x] !== null; });
        if (hasAny) DB.daily[state.shop][state.date] = rec;
        else delete DB.daily[state.shop][state.date];
        save();
        refreshNumbers();
      });
      /* 数字框用滚轮误改很烦，关掉 */
      inp.addEventListener('wheel', function (e) { inp.blur(); }, { passive: true });
    });

    /* 固定费 */
    var fx = document.getElementById('rpFixed');
    if (fx) {
      var applyFixed = function () {
        var ym = ymOf(state.date);
        if (!DB.fixed[state.shop]) DB.fixed[state.shop] = {};
        var v = fx.value === '' ? '' : Math.max(0, num(fx.value));
        if (v === '') delete DB.fixed[state.shop][ym];
        else DB.fixed[state.shop][ym] = v;
        save();
        render(root);
        toast('固定费已更新，全月每天的数已重算');
      };
      fx.addEventListener('input', function () {
        var el = document.getElementById('rpFixedDay');
        if (el) el.textContent = money(num(fx.value) / daysInMonth(state.date));
      });
      fx.addEventListener('change', applyFixed);
      fx.addEventListener('blur', applyFixed);
    }

    /* 分红池比例 */
    var pool = document.getElementById('rpPool');
    if (pool) {
      var applyPool = function () {
        DB.dividend = DB.dividend || {};
        DB.dividend.poolPct = Math.min(1, Math.max(0, num(pool.value) / 100));
        save();
        render(root);
      };
      pool.addEventListener('change', applyPool);
      pool.addEventListener('blur', applyPool);
    }

    /* 明细：点日期跳回那一天继续改 */
    Array.prototype.forEach.call(root.querySelectorAll('[data-goto]'), function (el) {
      el.addEventListener('click', function () {
        state.date = el.getAttribute('data-goto');
        render(root);
        var bar = document.querySelector('.rp-bar');
        if (bar && bar.scrollIntoView) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast('已跳回 ' + state.date);
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll('[data-del]'), function (b) {
      b.addEventListener('click', function () {
        var d = b.getAttribute('data-del');
        if (!window.confirm('删除 ' + state.shop + ' ' + d + ' 这一天的记录？')) return;
        if (DB.daily[state.shop]) delete DB.daily[state.shop][d];
        save();
        render(root);
        toast('已删除 ' + d + ' 的记录');
      });
    });

    /* 费率保存 */
    var sr = document.getElementById('rpSaveRates');
    if (sr) sr.addEventListener('click', function () {
      var keys = ['commission', 'payment', 'lowPrice', 'other'];
      var bad = null;
      keys.forEach(function (k) {
        var el = document.getElementById('rpRate-' + k);
        if (el) DB.rates[k] = Math.max(0, num(el.value) / 100);
      });
      if (bad) { toast('费率填写有误，请检查'); return; }
      save();
      render(root);
      toast('费率已保存，全店数据已重算');
    });

    /* 导出 JSON */
    var ej = document.getElementById('rpExportJson');
    if (ej) ej.addEventListener('click', function () {
      download('顺诚经营报表备份_' + todayISO() + '.json',
        JSON.stringify(DB, null, 2), 'application/json');
      toast('备份已导出，建议存到网盘');
    });

    /* 导出 CSV */
    var ec = document.getElementById('rpExportCsv');
    if (ec) ec.addEventListener('click', function () {
      var lines = ['店铺,日期,销售额,退货额,净销售额,销售佣金,支付手续费,低价附加费,其他平台费,广告费,运费,采购成本,平台罚金,变动费合计,边界利润,固定费,经营利润'];
      SHOPS.forEach(function (s) {
        var rows = DB.daily[s.name] || {};
        Object.keys(rows).sort().forEach(function (d) {
          var r = dayRow(s.name, d);
          lines.push([s.name, d, r.sales, r.returns, r.net, r.commission, r.payment, r.lowPrice,
            r.other, r.ads, r.freight, r.cost, r.penalty, r.varCost, r.margin, r.fixed, r.profit].join(','));
        });
      });
      download('顺诚经营报表明细_' + todayISO() + '.csv', '\uFEFF' + lines.join('\r\n'), 'text/csv');
      toast('CSV 已导出（' + (lines.length - 1) + ' 条记录）');
    });

    /* 导入 JSON */
    var im = document.getElementById('rpImport');
    var fi = document.getElementById('rpFile');
    if (im && fi) {
      im.addEventListener('click', function () { fi.click(); });
      fi.addEventListener('change', function () {
        var f = fi.files && fi.files[0];
        if (!f) return;
        var rd = new FileReader();
        rd.onload = function () {
          try {
            var d = JSON.parse(String(rd.result));
            if (!d || typeof d !== 'object') throw new Error('格式不对');
            if (!window.confirm('导入会覆盖当前在这台电脑上的全部数据，继续？')) return;
            DB = d;
            DB.rates = Object.assign({}, (CFG.rates || {}), DB.rates || {});
            DB.daily = DB.daily || {};
            DB.fixed = DB.fixed || {};
            DB.dividend = DB.dividend || (CFG.dividend || {});
            save();
            render(root);
            toast('导入成功');
          } catch (e) {
            toast('导入失败：文件格式不对');
          }
        };
        rd.readAsText(f);
        fi.value = '';
      });
    }
  }

  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 300);
  }

  /* ══════════════ 启动 ══════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('sc-content');
    if (!root) return;
    render(root);
  });
})();
