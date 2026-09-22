/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 个人工作平台 · 渲染层
   ───────────────────────────────────────────────────────────────
   适用页面：parter-liyuan.html / parter-shi.html
   数据来源：
     · data/workspace.js     智能体清单 + 预警规则 + 运营填报字段（内容源）
     · data/report-config.js 钱那 6 项的填报字段（与经营报表共用）
     · data/parter.js        人的店铺归属、月度损益表、分红台账
     · localStorage          填报数据（sc_report_v1）+ 阈值设置（sc_ws_v1）

   四段（老周 2026-09-22 定，按一天的工作顺序排）：
     ① 数据填写    一行一家店，今天填完
     ② 数据分析    6 条预警规则 → 每条一个动作 → 挂到对应智能体
     ③ 工作智能体  运营岗一天要用的 6 个
     ④ 预估收入    店群自动汇总 + 月底正式结算（折叠）

   铁律：
     · 钱那 6 项与「经营报表」共用一份存储，不做第二套数据
     · 没填就是「—」，不是 0；没有的智能体就是「待建」，不放死链接
     · 算法只调 assets/report-core.js，不在这里另写一套
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var CORE = window.SC_REPORT_CORE;
  if (!CORE) return;

  var W = window.SC_WORKSPACE || {};
  var CFG = window.SC_REPORT_CONFIG || {};
  var esc = CORE.esc, num = CORE.num, money = CORE.money, money0 = CORE.money0, yuan = CORE.yuan;

  var CFG_KEY = 'sc_ws_v1';      /* 工作平台自己的设置：预警阈值 */
  var DB = CORE.load();          /* 填报数据（与经营报表同一份） */

  var MONEY_K = ['sales', 'returns', 'ads', 'freight', 'cost', 'penalty'];
  var OPS_K = ['orders', 'newLinks', 'riskNotes', 'stops'];
  var ALL_K = MONEY_K.concat(OPS_K);

  /* ══════════════ 本地设置（阈值） ══════════════ */

  function loadCfg() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveCfg(d) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(d)); return true; }
    catch (e) { return false; }
  }
  function defaultTh() {
    var o = {}, src = W.alertThresholds || {};
    for (var k in src) o[k] = src[k];
    return o;
  }
  function th() {
    var d = loadCfg(), o = defaultTh();
    for (var k in (d.th || {})) if (isFinite(d.th[k])) o[k] = d.th[k];
    return o;
  }
  function isDefaultTh() {
    var d = loadCfg();
    return !d.th || !Object.keys(d.th).length;
  }
  function setTh(k, v) {
    var d = loadCfg();
    d.th = d.th || {};
    if (v === null) delete d.th[k]; else d.th[k] = v;
    saveCfg(d);
  }

  /* ══════════════ 取数工具 ══════════════ */

  function recOf(shop, date) {
    var s = DB.daily[shop];
    return (s && s[date]) || {};
  }

  /* 这条记录算不算「填过」—— 任一字段有值就算（填 0 也算，表示「确实没有」） */
  function hasFill(rec) {
    if (!rec) return false;
    for (var i = 0; i < ALL_K.length; i++) {
      var v = rec[ALL_K[i]];
      if (v !== undefined && v !== null && v !== '') return true;
    }
    return false;
  }
  function filled(shop, date) { return hasFill(recOf(shop, date)); }

  /* 这家店历史上填过没有（用于区分「新店还没开始」和「填着填着断了」） */
  function everFilled(shop) {
    var rows = DB.daily[shop] || {};
    for (var d in rows) if (hasFill(rows[d])) return true;
    return false;
  }

  /* 近 N 天某字段的日均 —— 只算已填的天，没填的不当 0 */
  function avgBack(shop, date, key, days) {
    var d = CORE.parseD(date), sum = 0, n = 0;
    for (var i = 1; i <= (days || 7); i++) {
      var dd = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
      var rec = recOf(shop, CORE.iso(dd));
      if (!hasFill(rec)) continue;
      sum += num(rec[key]);
      n++;
    }
    return n ? sum / n : null;
  }

  /* 从「今天」往前连续多少天没填 */
  function missingStreak(shop, date) {
    var d = CORE.parseD(date), n = 0;
    for (var i = 0; i < 60; i++) {
      if (filled(shop, CORE.iso(d))) break;
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  /* ══════════════ 预警判定 ══════════════ */

  function ruleById(id) {
    var list = W.alertRules || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function agentById(id) {
    var list = W.agents || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* 对一家店跑一遍全部规则，返回命中清单 */
  function alertsForShop(shop, date) {
    var out = [];
    var T = th();
    var rec = recOf(shop, date);
    var r = CORE.dayRow(DB, shop, date);
    var any = hasFill(rec);

    function push(id, evidence) {
      var rl = ruleById(id);
      if (!rl) return;
      out.push({ rule: rl, shop: shop, evidence: evidence });
    }

    /* 1 封停：当天封停次数 ≥ 阈值 */
    if (num(rec.stops) >= num(T.stops)) {
      push('stops', '当天封停 ' + num(rec.stops) + ' 次');
    }

    /* 2 风险记录：当天红/橙色级记录 ≥ 阈值 */
    if (num(rec.riskNotes) >= num(T.riskNotes)) {
      push('risk', '当天红 / 橙色级记录 ' + num(rec.riskNotes) + ' 条');
    }

    /* 3 出单断崖：当天出单 = 0，或低于近 7 日均值的阈值比例
       —— 只有这家店以前填过、且近 7 天有参照值时才判，新店不误报 */
    if (any && everFilled(shop)) {
      var base = avgBack(shop, date, 'orders', 7);
      if (base !== null && base > 0) {
        var o = num(rec.orders);
        if (o === 0) {
          push('drop', '当天出单 0，近 7 日均值 ' + base.toFixed(1) + ' 单');
        } else if (o < base * num(T.dropRatio)) {
          push('drop', '当天出单 ' + o + ' 单，只有近 7 日均值（' + base.toFixed(1) + ' 单）的 ' +
            Math.round(o / base * 100) + '%');
        }
      }
    }

    /* 4 退货超标：退货额 ÷ 销售额 > 阈值 */
    if (r.sales > 0) {
      var rr = r.returns / r.sales * 100;
      if (rr > num(T.returnsRate)) {
        push('returns', '退货率 ' + rr.toFixed(1) + '%（阈值 ' + num(T.returnsRate) + '%）');
      }
    }

    /* 5 广告超支：广告费 ÷ 销售额 > 阈值 */
    if (r.sales > 0) {
      var ar = r.ads / r.sales * 100;
      if (ar > num(T.adsRate)) {
        push('ads', '广告费占销售额 ' + ar.toFixed(1) + '%（阈值 ' + num(T.adsRate) + '%）');
      }
    }

    /* 6 连续没填：只对「以前填过、最近断了」的店报，避免新店天天报红 */
    if (everFilled(shop)) {
      var ms = missingStreak(shop, date);
      if (ms >= num(T.missingDays)) {
        push('missing', '已连续 ' + ms + ' 天没有填报（阈值 ' + num(T.missingDays) + ' 天）');
      }
    }

    return out;
  }

  function allAlerts(date) {
    var out = [];
    state.shops.forEach(function (s) {
      out = out.concat(alertsForShop(s, date));
    });
    out.sort(function (a, b) {
      if (a.rule.level !== b.rule.level) return a.rule.level - b.rule.level;
      return a.rule.order - b.rule.order;
    });
    return out;
  }

  /* ══════════════ 页面状态 ══════════════ */

  var state = { date: CORE.todayISO(), name: '', shops: [], agentOpen: {}, thOpen: false, calcOpen: false };

  /* ══════════════ 段一 · 数据填写 ══════════════ */

  function inpHtml(shop, k, v, isOps) {
    var val = (v === undefined || v === null || v === '') ? '' : v;
    return '<input class="ws-inp' + (isOps ? ' is-ops' : '') + (val !== '' ? ' has-val' : '') + '" type="number" ' +
      'step="' + (isOps ? '1' : '0.01') + '" min="0" inputmode="' + (isOps ? 'numeric' : 'decimal') + '" ' +
      'data-ws-shop="' + esc(shop) + '" data-ws-k="' + esc(k) + '" ' +
      'value="' + esc(val) + '" placeholder="·" />';
  }

  function profitCell(shop) {
    if (!filled(shop, state.date)) {
      return '<span class="ws-dash">—</span>';
    }
    var r = CORE.dayRow(DB, shop, state.date);
    return '<b class="' + (r.profit < 0 ? 'is-neg' : '') + '">' + yuan(r.profit) + '</b>';
  }

  function fillRow(shop) {
    var rec = recOf(shop, state.date);
    var cells = (CFG.inputFields || []).map(function (f) {
      return '<td>' + inpHtml(shop, f.key, rec[f.key], false) + '</td>';
    }).join('') + (W.opsFields || []).map(function (f) {
      return '<td>' + inpHtml(shop, f.key, rec[f.key], true) + '</td>';
    }).join('');

    return '<tr data-ws-row="' + esc(shop) + '">' +
      '<td class="ws-td-shop">' + esc(shop) + '</td>' +
      cells +
      '<td class="ws-td-profit" data-ws-profit="' + esc(shop) + '">' + profitCell(shop) + '</td>' +
    '</tr>';
  }

  function fillFoot() {
    var T = { money: {}, ops: {} };
    MONEY_K.forEach(function (k) { T.money[k] = 0; });
    OPS_K.forEach(function (k) { T.ops[k] = 0; });
    var profit = 0, n = 0;
    state.shops.forEach(function (s) {
      var rec = recOf(s, state.date);
      if (!hasFill(rec)) return;
      n++;
      MONEY_K.forEach(function (k) { T.money[k] += num(rec[k]); });
      OPS_K.forEach(function (k) { T.ops[k] += num(rec[k]); });
      profit += CORE.dayRow(DB, s, state.date).profit;
    });
    if (!n) {
      return '<tr class="ws-tr-sum"><td class="ws-td-shop">合计</td>' +
        '<td colspan="' + (ALL_K.length + 1) + '" class="ws-td-empty">今天还没有店铺填报 —— 从上面任意一行开始填</td></tr>';
    }
    var cells = MONEY_K.map(function (k) {
      return '<td class="ws-td-sum">' + money0(T.money[k]) + '</td>';
    }).join('') + OPS_K.map(function (k) {
      return '<td class="ws-td-sum">' + money0(T.ops[k]) + '</td>';
    }).join('');
    return '<tr class="ws-tr-sum">' +
      '<td class="ws-td-shop">合计 <em>' + n + '/' + state.shops.length + ' 家</em></td>' +
      cells +
      '<td class="ws-td-profit"><b class="' + (profit < 0 ? 'is-neg' : '') + '">' + yuan(profit) + '</b></td>' +
    '</tr>';
  }

  function fillColgroup() {
    var cols = '<col style="width:86px">';
    (CFG.inputFields || []).forEach(function () { cols += '<col style="width:70px">'; });
    (W.opsFields || []).forEach(function () { cols += '<col style="width:58px">'; });
    cols += '<col style="width:86px">';
    return '<colgroup>' + cols + '</colgroup>';
  }

  function fillHead() {
    var mf = CFG.inputFields || [], of = W.opsFields || [];
    return '<thead>' +
      '<tr>' +
        '<th class="ws-th-shop" rowspan="2">店铺</th>' +
        '<th class="ws-th-money" colspan="' + mf.length + '">经营结果（元）· 与经营报表共用一份数据</th>' +
        '<th class="ws-th-ops" colspan="' + of.length + '">运营动作</th>' +
        '<th class="ws-th-profit" rowspan="2">当日经营利润<br><span class="ws-th-sub">自动算</span></th>' +
      '</tr>' +
      '<tr>' +
        mf.map(function (f) {
          return '<th class="ws-th-money">' + esc(f.label) +
            (f.req ? '<i class="ws-req">必填</i>' : '') + '</th>';
        }).join('') +
        of.map(function (f) {
          return '<th class="ws-th-ops">' + esc(f.label) +
            (f.req ? '<i class="ws-req">必填</i>' : '') + '</th>';
        }).join('') +
      '</tr>' +
      '</thead>';
  }

  function fillCard() {
    return '' +
    '<div class="card ws-card">' +
      '<div class="card-head">' +
        '<div class="card-title"><div class="ct-icon ct-orange">✍️</div>' +
          '① 数据填写 · 每天一次，一行一家店</div>' +
        '<span class="card-hint">填完自动存，不用点保存</span>' +
      '</div>' +
      '<div class="ws-bar">' +
        '<div class="ws-bar-item"><label>填报日期</label>' +
          '<input type="date" id="wsDate" class="ws-date" value="' + state.date + '" /></div>' +
        '<div class="ws-bar-btns">' +
          '<button class="btn btn-secondary btn-sm" data-ws-nav="-1">◀ 前一天</button>' +
          '<button class="btn btn-secondary btn-sm" data-ws-nav="0">今天</button>' +
          '<button class="btn btn-secondary btn-sm" data-ws-nav="1">后一天 ▶</button>' +
        '</div>' +
        '<div class="ws-prog" id="wsProg">' + progHtml() + '</div>' +
      '</div>' +
      '<div class="scroll-hint">← 左右滑动可查看完整字段</div>' +
      '<div class="table-scroll">' +
        '<table class="ws-table">' + fillColgroup() + fillHead() +
          '<tbody id="wsRows">' + state.shops.map(fillRow).join('') + '</tbody>' +
          '<tfoot id="wsFoot">' + fillFoot() + '</tfoot>' +
        '</table>' +
      '</div>' +
      '<div class="table-note">' +
        '<b>钱那 6 项和「经营报表」是同一份数据</b> —— 这边填了那边就有，那边填了这边也有，不会出现两套数。' +
        '<br><b>运营动作 4 项</b>只有这个页面要填，是给下面的数据预警用的：出单断崖要靠「出单数」判，' +
        '封停和风险记录是全套预警里最要紧的两条。' +
        '<br>没填的格子留空，<b>填 0 表示「确实没有」</b> —— 两者不一样，别混。' +
      '</div>' +
      fixedBlock() +
    '</div>';
  }

  /* 固定费：每月填一次，摊到当月每一天（缺它算不出经营利润） */
  function fixedBlock() {
    var ym = CORE.ymOf(state.date);
    var days = CORE.daysInMonth(state.date);
    var rows = state.shops.map(function (s) {
      var v = CORE.fixedOfMonth(DB, s, ym);
      return '<tr>' +
        '<td class="ws-td-shop">' + esc(s) + '</td>' +
        '<td><input class="ws-inp is-fixed" type="number" step="0.01" min="0" inputmode="decimal" ' +
          'data-ws-fixed="' + esc(s) + '" value="' + (v ? v : '') + '" placeholder="·" /></td>' +
        '<td class="ws-td-fixed-day" data-ws-fixedday="' + esc(s) + '">' +
          (v ? yuan(v / days) : '—') + '</td>' +
      '</tr>';
    }).join('');
    return '' +
    '<details class="ws-fold">' +
      '<summary>固定费（每个月填一次就够 · 缺它算不出经营利润）</summary>' +
      '<div class="table-scroll" style="margin-top:12px">' +
        '<table class="ws-table ws-table-fixed">' +
          '<colgroup><col style="width:120px"><col style="width:150px"><col></colgroup>' +
          '<thead><tr><th>店铺</th><th>' + ym + ' 固定费（元）</th><th>摊到每天（÷ ' + days + ' 天）</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="table-note">固定费 = 固定工资、分摊房租、社保、水电物业、工具订阅等' +
        '（详见《顺诚·美客多店铺费用科目字典_v1》固定费 8 项）。' +
        '当月改一次，全月每天的经营利润跟着重算。</div>' +
    '</details>';
  }

  /* ══════════════ 段二 · 数据分析 ══════════════ */

  var LV = {
    1: { cls: 'is-l1', label: '立即处理' },
    2: { cls: 'is-l2', label: '今天处理' },
    3: { cls: 'is-l3', label: '关注' }
  };

  function alertCard(a) {
    var lv = LV[a.rule.level] || LV[3];
    var ag = a.rule.agent ? agentById(a.rule.agent) : null;
    return '' +
    '<div class="ws-alert ' + lv.cls + '">' +
      '<div class="ws-alert-lv">' + lv.label + '</div>' +
      '<div class="ws-alert-body">' +
        '<div class="ws-alert-head">' +
          '<span class="ws-alert-shop">' + esc(a.shop) + '</span>' +
          '<span class="ws-alert-name">' + esc(a.rule.name) + '</span>' +
          '<span class="ws-alert-dim">' + esc(a.rule.dim) + '</span>' +
        '</div>' +
        '<div class="ws-alert-ev">' + esc(a.evidence) + '</div>' +
        '<div class="ws-alert-act"><span class="ws-act-tag">做什么</span>' + esc(a.rule.action) + '</div>' +
        (ag
          ? '<div class="ws-alert-agent">可以用「' + esc(ag.name) + '」' +
            '<span class="ws-todo-chip">待建</span></div>'
          : '') +
      '</div>' +
    '</div>';
  }

  function analyzeBody() {
    var list = allAlerts(state.date);
    if (!list.length) {
      return '<div class="ws-ok">' +
        '<b>今天没有异常</b>' +
        '<span>6 条规则都跑过一遍，没有触发。' +
        '（提醒一句：规则只能发现「数里有问题」，发现不了「数没填」以外的事 —— 该看的人还是得看。）</span>' +
        '</div>';
    }
    var c = { 1: 0, 2: 0, 3: 0 };
    list.forEach(function (a) { c[a.rule.level]++; });
    var bar = '<div class="ws-lvbar">' +
      ['1', '2', '3'].map(function (k) {
        return '<div class="ws-lvbar-item ' + LV[k].cls + '">' +
          '<span>' + LV[k].label + '</span><b>' + c[k] + '</b></div>';
      }).join('') +
      '</div>';
    return bar + '<div class="ws-alerts">' + list.map(alertCard).join('') + '</div>';
  }

  function thBlock() {
    var T = th();
    var rows = (W.alertRules || []).map(function (r) {
      var unit = '', val = '', key = '';
      if (r.id === 'stops') { key = 'stops'; val = T.stops; unit = '次'; }
      else if (r.id === 'risk') { key = 'riskNotes'; val = T.riskNotes; unit = '条'; }
      else if (r.id === 'drop') { key = 'dropRatio'; val = Math.round(T.dropRatio * 100); unit = '%'; }
      else if (r.id === 'returns') { key = 'returnsRate'; val = T.returnsRate; unit = '%'; }
      else if (r.id === 'ads') { key = 'adsRate'; val = T.adsRate; unit = '%'; }
      else if (r.id === 'missing') { key = 'missingDays'; val = T.missingDays; unit = '天'; }
      return '<tr>' +
        '<td class="ws-td-shop">' + esc(r.name) + '<em class="ws-th-dim">' + esc(r.dim) + '</em></td>' +
        '<td class="ws-td-cond">' + esc(r.cond) + '</td>' +
        '<td class="ws-td-th">' +
          '<span class="ws-th-inpwrap"><input class="ws-th-inp" type="number" step="1" min="0" ' +
            'data-ws-th="' + key + '" value="' + esc(val) + '" /><span>' + unit + '</span></span>' +
        '</td>' +
        '<td class="ws-td-act">' + esc(r.action) + '</td>' +
      '</tr>';
    }).join('');
    return '' +
    '<details class="ws-fold"' + (state.thOpen ? ' open' : '') + ' id="wsThFold">' +
      '<summary>预警阈值（这套是默认值，按你们实际情况改）' +
        (isDefaultTh() ? '<span class="ws-warn-chip">全部为默认值</span>' : '') + '</summary>' +
      '<div class="table-scroll" style="margin-top:12px">' +
        '<table class="ws-table ws-table-th">' +
          '<colgroup><col style="width:130px"><col style="width:190px"><col style="width:110px"><col></colgroup>' +
          '<thead><tr><th>预警</th><th>什么时候报</th><th>阈值</th><th>报出来要做什么</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="table-note">改完立刻按新阈值重判，不用刷新页面。' +
        '<button class="btn btn-secondary btn-sm" id="wsThReset" style="margin-left:8px">恢复默认值</button>' +
        '<br>这套阈值是我按常见口径给的起点，<b>不是你们的实际标准</b> —— 定下来后我再写死到配置里。</div>' +
    '</details>';
  }

  /* 算法明细：把每家的利润是怎么算出来的摆出来 */
  function calcBlock() {
    var rows = state.shops.map(function (s) {
      var r = CORE.dayRow(DB, s, state.date);
      var f = filled(s, state.date);
      function v(x) { return f ? money0(x) : '—'; }
      return '<tr' + (f ? '' : ' class="ws-tr-empty"') + '>' +
        '<td class="ws-td-shop">' + esc(s) + '</td>' +
        '<td class="ws-td-num">' + v(r.sales) + '</td>' +
        '<td class="ws-td-num">' + v(r.net) + '</td>' +
        '<td class="ws-td-num">' + v(r.varCost) + '</td>' +
        '<td class="ws-td-num">' + v(r.margin) + '</td>' +
        '<td class="ws-td-num">' + v(r.fixed) + '</td>' +
        '<td class="ws-td-num is-strong' + (f && r.profit < 0 ? ' is-neg' : '') + '">' + v(r.profit) + '</td>' +
      '</tr>';
    }).join('');
    return '' +
    '<details class="ws-fold"' + (state.calcOpen ? ' open' : '') + ' id="wsCalcFold">' +
      '<summary>算法明细：每家店的利润是怎么算出来的</summary>' +
      '<div class="table-scroll" style="margin-top:12px">' +
        '<table class="ws-table ws-table-calc">' +
          '<colgroup><col style="width:110px">' +
            '<col style="width:92px"><col style="width:92px"><col style="width:92px">' +
            '<col style="width:92px"><col style="width:92px"><col style="width:100px"></colgroup>' +
          '<thead><tr><th>店铺</th><th>销售额</th><th>净销售额</th><th>变动费</th>' +
            '<th>边界利润</th><th>固定费<br><span class="ws-th-sub">当日分摊</span></th>' +
            '<th>经营利润</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="table-note">' +
        '算法和「经营报表」完全一致（同一份代码）：净销售额 = 销售额 − 退货额；' +
        '变动费 = 佣金 + 支付手续费 + 低价附加费 + 其他 + 广告 + 运费 + 采购成本 + 罚金；' +
        '经营利润 = 净销售额 − 变动费 − 固定费当日分摊。' +
      '</div>' +
    '</details>';
  }

  function analyzeCard() {
    return '' +
    '<div class="card ws-card" id="ws-analyze">' +
      '<div class="card-head">' +
        '<div class="card-title"><div class="ct-icon ct-orange">🔍</div>' +
          '② 数据分析 · ' + state.date + ' 的异常</div>' +
        '<span class="card-hint">按规则判，不是拍脑袋</span>' +
      '</div>' +
      '<div id="wsAlertBox">' + analyzeBody() + '</div>' +
      '<div class="table-note">' +
        '为什么不做「AI 自动分析」：规则能看见、能改、能对账，出错也知道错在哪；' +
        '一段写得漂亮的话，你没法验证它对不对。' +
        '<br>规则只能看「填进来的数」，所以<b>数的完整度决定预警的可信度</b> —— 这也是为什么「连续没填」单列一条。' +
      '</div>' +
      thBlock() +
      calcBlock() +
    '</div>';
  }

  /* ══════════════ 段三 · 工作智能体 ══════════════ */

  function agentCard(a) {
    var open = !!state.agentOpen[a.id];
    return '' +
    '<div class="ws-agent' + (open ? ' is-open' : '') + '" data-ws-agent="' + esc(a.id) + '">' +
      '<div class="ws-agent-top">' +
        '<span class="ws-agent-no">' + a.order + '</span>' +
        '<span class="ws-agent-icon ' + esc(a.cls || '') + '">' + a.icon + '</span>' +
        '<div class="ws-agent-namebox">' +
          '<div class="ws-agent-name">' + esc(a.name) +
            (a.origin === 'new' ? '<span class="ws-new-chip">本次新增</span>' : '') + '</div>' +
          '<div class="ws-agent-stage">' + esc(a.stage) + '</div>' +
        '</div>' +
        '<span class="ws-todo-chip">待建</span>' +
        '<span class="ws-agent-arrow">' + (open ? '▾' : '▸') + '</span>' +
      '</div>' +
      '<div class="ws-agent-desc">' + esc(a.desc) + '</div>' +
      (open
        ? '<div class="ws-agent-detail">' +
            '<div class="ws-ad-row"><span>怎么用</span>' + esc(a.input) + '</div>' +
            '<div class="ws-ad-row"><span>吐出什么</span>' + esc(a.output) + '</div>' +
            '<div class="ws-ad-row"><span>规矩</span>' + esc(a.rule) + '</div>' +
            '<div class="ws-ad-row is-why"><span>为什么要有它</span>' + esc(a.why) + '</div>' +
          '</div>'
        : '') +
    '</div>';
  }

  function agentsCard() {
    var list = (W.agents || []).slice().sort(function (x, y) { return x.order - y.order; });
    var todo = list.filter(function (a) { return a.status === 'todo'; }).length;
    return '' +
    '<div class="card ws-card" id="ws-agents">' +
      '<div class="card-head">' +
        '<div class="card-title"><div class="ct-icon ct-blue">🤖</div>' +
          '③ 工作智能体 · 运营岗一天要用的 ' + list.length + ' 个</div>' +
        '<span class="card-hint">' + todo + ' 个待建 · 点卡片看它能干什么</span>' +
      '</div>' +
      '<div class="ws-agents">' + list.map(agentCard).join('') + '</div>' +
      '<div class="table-note">' + esc(W.agentNote || '') + '</div>' +
    '</div>';
  }

  /* ══════════════ 段四 · 预估收入 ══════════════ */

  function incomeCard(p) {
    var blocks = (window.SC_PARTER_PARTS && window.SC_PARTER_PARTS.settlementBlocks)
      ? window.SC_PARTER_PARTS.settlementBlocks(p) : '';
    return '' +
    '<div class="card ws-card" id="ws-income">' +
      '<div class="card-head">' +
        '<div class="card-title"><div class="ct-icon ct-green">💰</div>' +
          '④ 预估收入 · 今天能赚多少</div>' +
        '<span class="card-hint">数据来自上面填的数，自动汇总名下 ' + state.shops.length + ' 家店</span>' +
      '</div>' +
      '<div id="plive-slot"></div>' +
      '<div class="table-note" style="margin-bottom:6px">' +
        '<b>日度是预估，月底才算数。</b>这里的「个人预估」按利润比例快速折算，' +
        '一天看一次进度用；月末正式结算走增量分红规则（基准线 = 基期 × 1.15、阶梯比例、' +
        '当期 70% + 年终 30% 递延）—— 两者口径不同，对不上是正常的。' +
      '</div>' +
      (blocks
        ? '<details class="ws-fold">' +
            '<summary>月底正式结算（月度损益表 / 各店×各月经营利润 / 分红台账）</summary>' +
            '<div class="ws-settle">' + blocks + '</div>' +
          '</details>'
        : '') +
    '</div>';
  }

  /* ══════════════ 顶部导航 ══════════════ */

  function navHtml() {
    var items = [
      { id: 'ws-fill', no: '①', name: '数据填写' },
      { id: 'ws-analyze', no: '②', name: '数据分析' },
      { id: 'ws-agents', no: '③', name: '工作智能体' },
      { id: 'ws-income', no: '④', name: '预估收入' }
    ];
    return '<div class="ws-nav">' + items.map(function (i) {
      return '<a class="ws-nav-item" href="#' + i.id + '">' +
        '<span class="ws-nav-no">' + i.no + '</span>' + i.name + '</a>';
    }).join('') + '</div>';
  }

  function progHtml() {
    var n = 0;
    state.shops.forEach(function (s) { if (filled(s, state.date)) n++; });
    var all = state.shops.length;
    return '<span class="ws-prog-num' + (n === all ? ' is-done' : '') + '">' + n + ' / ' + all + '</span>' +
      '<span class="ws-prog-txt">家已填' + (n === all ? ' · 全填完了' : '') + '</span>';
  }

  /* ══════════════ 渲染 + 局部刷新 ══════════════ */

  var TARGET = null;

  function render(root, p) {
    state.name = p.name;
    state.shops = (p.shops && p.shops.length)
      ? p.shops
      : ((window.SC_PARTER_LIVE && window.SC_PARTER_LIVE.shopsOf) ? window.SC_PARTER_LIVE.shopsOf(p.name) : []);
    TARGET = { root: root, p: p };

    var db = CORE.load();
    DB = db;

    /* 身份条 */
    var t = p.totals || {};
    var idBar = '' +
      '<div class="overview-bar">' +
        '<div class="overview-item"><div class="ov-label">负责店铺</div>' +
          '<div class="ov-value">' + state.shops.length + '</div>' +
          '<div class="ov-sub">家 · 每天各填一次</div></div>' +
        '<div class="overview-item"><div class="ov-label">在架链接</div>' +
          '<div class="ov-value">' + (t.links == null ? '—' : String(t.links)) + '</div>' +
          '<div class="ov-sub">期末快照</div></div>' +
        '<div class="overview-item"><div class="ov-label">累计出单</div>' +
          '<div class="ov-value">' + (t.orders == null ? '—' : String(t.orders)) + '</div>' +
          '<div class="ov-sub">期内累加</div></div>' +
        '<div class="overview-item"><div class="ov-label">分红结算</div>' +
          '<div class="ov-value" style="font-size:19px">按月结</div>' +
          '<div class="ov-sub">日度预估见第四段</div></div>' +
      '</div>';

    root.innerHTML =
      navHtml() +
      idBar +
      '<div id="ws-fill" class="ws-anchor">' + fillCard() + '</div>' +
      analyzeCard() +
      agentsCard() +
      incomeCard(p);

    bind(root, p);
  }

  /* 只更新会随填报变化的数字，不动输入框（保住光标和焦点） */
  function refreshNumbers() {
    if (!TARGET) return;
    var root = TARGET.root;

    state.shops.forEach(function (s) {
      var cell = root.querySelector('[data-ws-profit="' + cssq(s) + '"]');
      if (cell) cell.innerHTML = profitCell(s);
    });

    var foot = root.querySelector('#wsFoot');
    if (foot) foot.innerHTML = fillFoot();

    var prog = root.querySelector('#wsProg');
    if (prog) prog.innerHTML = progHtml();

    var box = root.querySelector('#wsAlertBox');
    if (box) box.innerHTML = analyzeBody();

    var calc = root.querySelector('.ws-table-calc tbody');
    if (calc) calc.innerHTML = calcRowsOnly();

    /* 第四段：店群汇总（营业额 / 利润 / 个人预估）跟着变 */
    if (window.SC_PARTER_LIVE && window.SC_PARTER_LIVE.repaint) window.SC_PARTER_LIVE.repaint();
  }

  function calcRowsOnly() {
    var tmp = document.createElement('div');
    tmp.innerHTML = calcBlock();
    var tb = tmp.querySelector('tbody');
    return tb ? tb.innerHTML : '';
  }

  /* 属性选择器里的特殊字符转义（店名都是中文，稳妥起见还是处理） */
  function cssq(s) { return String(s).replace(/["\\]/g, '\\$&'); }

  /* ══════════════ 交互绑定 ══════════════ */

  function writeField(shop, date, key, val) {
    if (!DB.daily[shop]) DB.daily[shop] = {};
    var rec = DB.daily[shop][date] || {};
    if (val === '') delete rec[key]; else rec[key] = val;
    if (Object.keys(rec).length) DB.daily[shop][date] = rec;
    else delete DB.daily[shop][date];
    CORE.save(DB);
  }

  function moveDate(step) {
    if (step === 0) { state.date = CORE.todayISO(); return; }
    var d = CORE.parseD(state.date);
    d.setDate(d.getDate() + step);
    state.date = CORE.iso(d);
  }

  /* 换日期 = 重画整段一和二（输入框的值要整体换掉） */
  function rerenderBody() {
    if (!TARGET) return;
    DB = CORE.load();
    var root = TARGET.root;
    var f = root.querySelector('#ws-fill');
    if (f) f.innerHTML = fillCard();
    var a = root.querySelector('#ws-analyze');
    if (a) a.outerHTML = analyzeCard();
    bindFill(root);
    bindAnalyze(root);
  }

  function bindFill(root) {
    /* 填报：输入即存，然后只刷新数字 */
    Array.prototype.forEach.call(root.querySelectorAll('.ws-inp[data-ws-k]'), function (inp) {
      inp.addEventListener('input', function () {
        var shop = inp.getAttribute('data-ws-shop');
        var k = inp.getAttribute('data-ws-k');
        var val = inp.value === '' ? '' : Math.max(0, num(inp.value));
        writeField(shop, state.date, k, val);
        inp.classList.toggle('has-val', val !== '');
        refreshNumbers();
      });
      /* 数字框用滚轮误改很烦，关掉 */
      inp.addEventListener('wheel', function () { inp.blur(); }, { passive: true });
    });

    /* 固定费 */
    Array.prototype.forEach.call(root.querySelectorAll('.ws-inp[data-ws-fixed]'), function (inp) {
      var apply = function () {
        var shop = inp.getAttribute('data-ws-fixed');
        var ym = CORE.ymOf(state.date);
        var days = CORE.daysInMonth(state.date);
        if (!DB.fixed[shop]) DB.fixed[shop] = {};
        var v = inp.value === '' ? '' : Math.max(0, num(inp.value));
        if (v === '') delete DB.fixed[shop][ym]; else DB.fixed[shop][ym] = v;
        CORE.save(DB);
        var out = root.querySelector('[data-ws-fixedday="' + cssq(shop) + '"]');
        if (out) out.innerHTML = v ? yuan(v / days) : '—';
        refreshNumbers();
      };
      inp.addEventListener('change', apply);
      inp.addEventListener('blur', apply);
      inp.addEventListener('wheel', function () { inp.blur(); }, { passive: true });
    });

    /* 日期切换 */
    var dt = root.querySelector('#wsDate');
    if (dt) dt.addEventListener('change', function () { state.date = dt.value || CORE.todayISO(); rerenderBody(); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-ws-nav]'), function (b) {
      b.addEventListener('click', function () { moveDate(num(b.getAttribute('data-ws-nav'))); rerenderBody(); });
    });
  }

  function bindAnalyze(root) {
    Array.prototype.forEach.call(root.querySelectorAll('.ws-th-inp[data-ws-th]'), function (inp) {
      var apply = function () {
        var k = inp.getAttribute('data-ws-th');
        var v = inp.value === '' ? null : Math.max(0, num(inp.value));
        setTh(k, v);
        var box = root.querySelector('#wsAlertBox');
        if (box) box.innerHTML = analyzeBody();
      };
      inp.addEventListener('change', apply);
      inp.addEventListener('blur', apply);
      inp.addEventListener('wheel', function () { inp.blur(); }, { passive: true });
    });

    var rs = root.querySelector('#wsThReset');
    if (rs) rs.addEventListener('click', function () {
      var d = loadCfg();
      delete d.th;
      saveCfg(d);
      var a = root.querySelector('#ws-analyze');
      if (a) { a.outerHTML = analyzeCard(); bindAnalyze(root); }
    });

    var tf = root.querySelector('#wsThFold');
    if (tf) tf.addEventListener('toggle', function () { state.thOpen = tf.open; });
    var cf = root.querySelector('#wsCalcFold');
    if (cf) cf.addEventListener('toggle', function () { state.calcOpen = cf.open; });
  }

  function bindAgents(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-ws-agent]'), function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-ws-agent');
        state.agentOpen[id] = !state.agentOpen[id];
        var box = root.querySelector('.ws-agents');
        if (box) box.innerHTML = (W.agents || []).slice()
          .sort(function (x, y) { return x.order - y.order; })
          .map(agentCard).join('');
        bindAgents(root);
      });
    });
  }

  function bind(root, p) {
    bindFill(root);
    bindAnalyze(root);
    bindAgents(root);

    /* 第四段：店群自动汇总（算法仍在 report-core，由 render-parter-live 渲染） */
    if (window.SC_PARTER_LIVE) window.SC_PARTER_LIVE.mount(root, p);

    /* 别的标签页改了数据 → 本页跟上 */
    if (!bind._storage) {
      bind._storage = true;
      window.addEventListener('storage', function (e) {
        if (!e.key || e.key === CORE.KEY || e.key === CFG_KEY) {
          if (!TARGET) return;
          DB = CORE.load();
          rerenderBody();
        }
      });
    }
  }

  window.SC_WORKSPACE_VIEW = { render: render, state: state, th: th };
})();
