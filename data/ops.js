/* 自动生成，请勿手改 —— 由 scripts/11_build_opsdata.py 生成
   数据源：数据底座/顺诚经营数据底座.xlsx
   生成时间：2026-09-20　口径见 meta.rules */
window.SC_OPS = {
 "meta": {
  "generated": "2026-09-20",
  "source": "数据底座/顺诚经营数据底座.xlsx",
  "span": "2026-07-01 ~ 2026-09-19",
  "rules": [
   "在架规模 = 每个（店铺,站点）最新一条有效「总链接数」之和（快照口径，各店快照日期可能不同）",
   "累计访问 / 累计出单 = 「当日访问」「当日出单」逐日累加（日增量，可跨批次）",
   "「今日上架」按作业档位呈现，不作为真实上架条数统计",
   "「总链接数」「总出单」为批次内累计，跨批次不可比 → 只做快照，不画趋势",
   "缺失与异常只标注、不填补、不篡改"
  ]
 },
 "summary": {
  "shops": 18,
  "sites": 5,
  "records": 3827,
  "dateFrom": "2026-07-01",
  "dateTo": "2026-09-19",
  "spanDays": 81,
  "activeDays": 66,
  "fullPerDay": 90,
  "links": 227671,
  "visits": 205868,
  "orders": 2803,
  "orderFillRate": 63.2,
  "breaks": 112,
  "batches": 6,
  "lowCoverDays": 46
 },
 "shops": [
  {
   "name": "唐博宏",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 35,
   "spanDays": 50,
   "coverRate": 70.0,
   "records": 190,
   "links": 12765,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 69,
   "visits": 5776,
   "conv": 1.2,
   "orderFill": 63.2,
   "visitFill": 100.0,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "姚振朋1",
   "owner": "李源",
   "firstDate": "2026-07-02",
   "lastDate": "2026-09-19",
   "coverDays": 56,
   "spanDays": 80,
   "coverRate": 70.0,
   "records": 300,
   "links": 8594,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 205,
   "visits": 17101,
   "conv": 1.2,
   "orderFill": 58.3,
   "visitFill": 98.3,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "杨晓丰",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 39,
   "spanDays": 50,
   "coverRate": 78.0,
   "records": 215,
   "links": 18056,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 112,
   "visits": 12666,
   "conv": 0.9,
   "orderFill": 66.5,
   "visitFill": 97.7,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "殷磊",
   "owner": "李源",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-19",
   "coverDays": 31,
   "spanDays": 49,
   "coverRate": 63.3,
   "records": 170,
   "links": 11783,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 52,
   "visits": 6565,
   "conv": 0.8,
   "orderFill": 65.9,
   "visitFill": 97.1,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "程志恒1",
   "owner": "李源",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-19",
   "coverDays": 31,
   "spanDays": 49,
   "coverRate": 63.3,
   "records": 170,
   "links": 4677,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 49,
   "visits": 5041,
   "conv": 1.0,
   "orderFill": 61.8,
   "visitFill": 97.1,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "程志恒3",
   "owner": "李源",
   "firstDate": "2026-07-01",
   "lastDate": "2026-09-19",
   "coverDays": 60,
   "spanDays": 81,
   "coverRate": 74.1,
   "records": 320,
   "links": 10262,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 234,
   "visits": 22372,
   "conv": 1.0,
   "orderFill": 56.9,
   "visitFill": 98.4,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "莫雷",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 34,
   "spanDays": 50,
   "coverRate": 68.0,
   "records": 185,
   "links": 11970,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 88,
   "visits": 11457,
   "conv": 0.8,
   "orderFill": 60.0,
   "visitFill": 97.3,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "袁鹏辉",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 34,
   "spanDays": 50,
   "coverRate": 68.0,
   "records": 185,
   "links": 14607,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 100,
   "visits": 11986,
   "conv": 0.8,
   "orderFill": 64.3,
   "visitFill": 97.3,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "郭浩洋",
   "owner": "李源",
   "firstDate": "2026-09-01",
   "lastDate": "2026-09-19",
   "coverDays": 13,
   "spanDays": 19,
   "coverRate": 68.4,
   "records": 75,
   "links": 8378,
   "linkSites": 5,
   "snapDate": "2026-09-19",
   "orders": 11,
   "visits": 1560,
   "conv": 0.7,
   "orderFill": 12.0,
   "visitFill": 93.3,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "侯敏",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "spanDays": 48,
   "coverRate": 54.2,
   "records": 160,
   "links": 15491,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 115,
   "visits": 10682,
   "conv": 1.1,
   "orderFill": 73.1,
   "visitFill": 96.9,
   "stops": 8,
   "anomaly": null
  },
  {
   "name": "张玉博1",
   "owner": "石老师",
   "firstDate": "2026-07-01",
   "lastDate": "2026-09-18",
   "coverDays": 53,
   "spanDays": 80,
   "coverRate": 66.2,
   "records": 340,
   "links": 9243,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 151,
   "visits": 15573,
   "conv": 1.0,
   "orderFill": 65.6,
   "visitFill": 96.8,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "张玉博2",
   "owner": "石老师",
   "firstDate": "2026-07-01",
   "lastDate": "2026-09-18",
   "coverDays": 53,
   "spanDays": 80,
   "coverRate": 66.2,
   "records": 340,
   "links": 11063,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 151,
   "visits": 16531,
   "conv": 0.9,
   "orderFill": 67.1,
   "visitFill": 95.3,
   "stops": 13,
   "anomaly": null
  },
  {
   "name": "李彦辉",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 24,
   "spanDays": 48,
   "coverRate": 50.0,
   "records": 166,
   "links": 13519,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 822,
   "visits": 11371,
   "conv": 7.2,
   "orderFill": 69.3,
   "visitFill": 84.3,
   "stops": 0,
   "anomaly": "出单口径待核（转化 7.20%，为中位数 1.00% 的 7.2 倍）"
  },
  {
   "name": "杨云光",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "spanDays": 48,
   "coverRate": 54.2,
   "records": 160,
   "links": 16714,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 167,
   "visits": 15416,
   "conv": 1.1,
   "orderFill": 71.9,
   "visitFill": 96.9,
   "stops": 0,
   "anomaly": null
  },
  {
   "name": "耿亚雄",
   "owner": "石老师",
   "firstDate": "2026-07-02",
   "lastDate": "2026-09-18",
   "coverDays": 43,
   "spanDays": 79,
   "coverRate": 54.4,
   "records": 265,
   "links": 19035,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 161,
   "visits": 12197,
   "conv": 1.3,
   "orderFill": 83.8,
   "visitFill": 95.8,
   "stops": 1,
   "anomaly": null
  },
  {
   "name": "金卫",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "spanDays": 48,
   "coverRate": 54.2,
   "records": 160,
   "links": 13743,
   "linkSites": 5,
   "snapDate": "2026-09-17",
   "orders": 87,
   "visits": 7539,
   "conv": 1.2,
   "orderFill": 65.0,
   "visitFill": 93.8,
   "stops": 10,
   "anomaly": null
  },
  {
   "name": "陆波波",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "spanDays": 48,
   "coverRate": 54.2,
   "records": 160,
   "links": 10011,
   "linkSites": 5,
   "snapDate": "2026-09-17",
   "orders": 50,
   "visits": 4674,
   "conv": 1.1,
   "orderFill": 53.1,
   "visitFill": 93.8,
   "stops": 43,
   "anomaly": null
  },
  {
   "name": "骆龙华",
   "owner": "石老师",
   "firstDate": "2026-07-02",
   "lastDate": "2026-09-18",
   "coverDays": 43,
   "spanDays": 79,
   "coverRate": 54.4,
   "records": 266,
   "links": 17760,
   "linkSites": 5,
   "snapDate": "2026-09-18",
   "orders": 179,
   "visits": 17361,
   "conv": 1.0,
   "orderFill": 79.3,
   "visitFill": 95.9,
   "stops": 7,
   "anomaly": null
  }
 ],
 "sites": [
  {
   "name": "巴西",
   "records": 761,
   "links": 48660,
   "orders": 542,
   "visits": 61404,
   "conv": 0.9,
   "visitAvg": 80.7,
   "linkShare": 21.4,
   "visitShare": 29.8,
   "orderShare": 19.3
  },
  {
   "name": "智利",
   "records": 761,
   "links": 48416,
   "orders": 313,
   "visits": 21267,
   "conv": 1.5,
   "visitAvg": 27.9,
   "linkShare": 21.3,
   "visitShare": 10.3,
   "orderShare": 11.2
  },
  {
   "name": "墨西哥",
   "records": 761,
   "links": 47369,
   "orders": 785,
   "visits": 74157,
   "conv": 1.1,
   "visitAvg": 97.4,
   "linkShare": 20.8,
   "visitShare": 36.0,
   "orderShare": 28.0
  },
  {
   "name": "哥伦比亚",
   "records": 761,
   "links": 42278,
   "orders": 124,
   "visits": 5819,
   "conv": 2.1,
   "visitAvg": 7.6,
   "linkShare": 18.6,
   "visitShare": 2.8,
   "orderShare": 4.4
  },
  {
   "name": "阿根廷",
   "records": 783,
   "links": 40948,
   "orders": 1039,
   "visits": 43221,
   "conv": 2.4,
   "visitAvg": 55.2,
   "linkShare": 18.0,
   "visitShare": 21.0,
   "orderShare": 37.1
  }
 ],
 "fields": [
  {
   "name": "日期",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "月份",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "管理人",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "店铺",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "站点",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "健康等级",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "等级分",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "是否封停",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "识别状态",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "来源",
   "grade": "good",
   "issue": null,
   "filled": 3827,
   "total": 3827,
   "rate": 100.0
  },
  {
   "name": "原始状态",
   "grade": "good",
   "issue": null,
   "filled": 3800,
   "total": 3827,
   "rate": 99.3
  },
  {
   "name": "总链接数",
   "grade": "caution",
   "issue": "批次内累计，跨批次不可比（断层 112 处）",
   "filled": 3750,
   "total": 3827,
   "rate": 98.0
  },
  {
   "name": "总访问",
   "grade": "caution",
   "issue": "批次内累计，口径与当日访问不一致",
   "filled": 3745,
   "total": 3827,
   "rate": 97.9
  },
  {
   "name": "今日上架",
   "grade": "caution",
   "issue": "填的是作业档位（仅 19 种取值），非真实上架条数",
   "filled": 3686,
   "total": 3827,
   "rate": 96.3
  },
  {
   "name": "当日访问",
   "grade": "caution",
   "issue": "站点间均值差 12 倍，口径待统一",
   "filled": 3682,
   "total": 3827,
   "rate": 96.2
  },
  {
   "name": "总出单",
   "grade": "caution",
   "issue": "批次内累计，跨批次不可比",
   "filled": 3184,
   "total": 3827,
   "rate": 83.2
  },
  {
   "name": "当日出单",
   "grade": "caution",
   "issue": "缺失 35%，9 月最严重（缺 62%）",
   "filled": 2496,
   "total": 3827,
   "rate": 65.2
  },
  {
   "name": "风险原因",
   "grade": "event",
   "issue": "店铺出现风险时才有标签",
   "filled": 1033,
   "total": 3827,
   "rate": 27.0
  },
  {
   "name": "不合规率",
   "grade": "event",
   "issue": "仅有不合规货件的记录填写",
   "filled": 277,
   "total": 3827,
   "rate": 7.2
  },
  {
   "name": "取消率",
   "grade": "event",
   "issue": "仅有取消风险的记录填写",
   "filled": 194,
   "total": 3827,
   "rate": 5.1
  },
  {
   "name": "投诉率",
   "grade": "event",
   "issue": "仅有投诉风险的记录填写",
   "filled": 96,
   "total": 3827,
   "rate": 2.5
  },
  {
   "name": "处置动作",
   "grade": "event",
   "issue": "记录处置动作时才填",
   "filled": 82,
   "total": 3827,
   "rate": 2.1
  },
  {
   "name": "投诉类型",
   "grade": "event",
   "issue": "仅投诉类记录填写",
   "filled": 76,
   "total": 3827,
   "rate": 2.0
  },
  {
   "name": "解封时限",
   "grade": "event",
   "issue": "仅封停类记录填写",
   "filled": 46,
   "total": 3827,
   "rate": 1.2
  },
  {
   "name": "备注",
   "grade": "event",
   "issue": "人工补充，非必填",
   "filled": 19,
   "total": 3827,
   "rate": 0.5
  },
  {
   "name": "延迟天数",
   "grade": "event",
   "issue": "仅延迟类记录填写",
   "filled": 17,
   "total": 3827,
   "rate": 0.4
  },
  {
   "name": "调解率",
   "grade": "event",
   "issue": "仅调解类记录填写",
   "filled": 5,
   "total": 3827,
   "rate": 0.1
  },
  {
   "name": "违规品类",
   "grade": "event",
   "issue": "仅侵权/违规类记录填写",
   "filled": 3,
   "total": 3827,
   "rate": 0.1
  }
 ],
 "fieldCounts": {
  "good": 11,
  "caution": 6,
  "event": 11
 },
 "batches": [
  {
   "name": "李源/7.7-8.3",
   "owner": "李源",
   "records": 205,
   "days": 22,
   "shops": 3,
   "from": "2026-07-01",
   "to": "2026-08-03"
  },
  {
   "name": "李源/8.4-8.31",
   "owner": "李源",
   "records": 850,
   "days": 25,
   "shops": 8,
   "from": "2026-08-01",
   "to": "2026-08-31"
  },
  {
   "name": "李源/9.1-",
   "owner": "李源",
   "records": 755,
   "days": 14,
   "shops": 9,
   "from": "2026-09-01",
   "to": "2026-09-19"
  },
  {
   "name": "石老/6.22-7月",
   "owner": "石老师",
   "records": 371,
   "days": 20,
   "shops": 4,
   "from": "2026-07-01",
   "to": "2026-07-29"
  },
  {
   "name": "石老/8月",
   "owner": "石老师",
   "records": 910,
   "days": 20,
   "shops": 9,
   "from": "2026-08-01",
   "to": "2026-08-29"
  },
  {
   "name": "石老/9月",
   "owner": "石老师",
   "records": 736,
   "days": 13,
   "shops": 9,
   "from": "2026-09-01",
   "to": "2026-09-18"
  }
 ],
 "breaks": [
  {
   "shop": "张玉博1",
   "site": "哥伦比亚",
   "date": "2026-07-03",
   "prev": 990,
   "curr": 394,
   "drop": 60.2
  },
  {
   "shop": "张玉博1",
   "site": "墨西哥",
   "date": "2026-07-03",
   "prev": 934,
   "curr": 498,
   "drop": 46.7
  },
  {
   "shop": "张玉博1",
   "site": "巴西",
   "date": "2026-07-03",
   "prev": 1013,
   "curr": 490,
   "drop": 51.6
  },
  {
   "shop": "张玉博1",
   "site": "阿根廷",
   "date": "2026-07-03",
   "prev": 1064,
   "curr": 727,
   "drop": 31.7
  },
  {
   "shop": "程志恒3",
   "site": "哥伦比亚",
   "date": "2026-07-07",
   "prev": 993,
   "curr": 164,
   "drop": 83.5
  },
  {
   "shop": "程志恒3",
   "site": "墨西哥",
   "date": "2026-07-07",
   "prev": 1432,
   "curr": 161,
   "drop": 88.8
  },
  {
   "shop": "程志恒3",
   "site": "巴西",
   "date": "2026-07-07",
   "prev": 988,
   "curr": 155,
   "drop": 84.3
  },
  {
   "shop": "程志恒3",
   "site": "智利",
   "date": "2026-07-07",
   "prev": 1315,
   "curr": 161,
   "drop": 87.8
  },
  {
   "shop": "程志恒3",
   "site": "阿根廷",
   "date": "2026-07-07",
   "prev": 994,
   "curr": 141,
   "drop": 85.8
  },
  {
   "shop": "姚振朋1",
   "site": "哥伦比亚",
   "date": "2026-07-11",
   "prev": 990,
   "curr": 185,
   "drop": 81.3
  },
  {
   "shop": "姚振朋1",
   "site": "墨西哥",
   "date": "2026-07-11",
   "prev": 1429,
   "curr": 179,
   "drop": 87.5
  },
  {
   "shop": "姚振朋1",
   "site": "巴西",
   "date": "2026-07-11",
   "prev": 991,
   "curr": 181,
   "drop": 81.7
  },
  {
   "shop": "姚振朋1",
   "site": "智利",
   "date": "2026-07-11",
   "prev": 990,
   "curr": 164,
   "drop": 83.4
  },
  {
   "shop": "姚振朋1",
   "site": "阿根廷",
   "date": "2026-07-11",
   "prev": 990,
   "curr": 183,
   "drop": 81.5
  },
  {
   "shop": "耿亚雄",
   "site": "哥伦比亚",
   "date": "2026-07-16",
   "prev": 1410,
   "curr": 713,
   "drop": 49.4
  },
  {
   "shop": "耿亚雄",
   "site": "巴西",
   "date": "2026-07-16",
   "prev": 1368,
   "curr": 741,
   "drop": 45.8
  },
  {
   "shop": "耿亚雄",
   "site": "墨西哥",
   "date": "2026-07-29",
   "prev": 1083,
   "curr": 752,
   "drop": 30.6
  },
  {
   "shop": "张玉博1",
   "site": "阿根廷",
   "date": "2026-08-01",
   "prev": 1409,
   "curr": 867,
   "drop": 38.5
  },
  {
   "shop": "程志恒3",
   "site": "巴西",
   "date": "2026-08-03",
   "prev": 1787,
   "curr": 1013,
   "drop": 43.3
  },
  {
   "shop": "程志恒3",
   "site": "智利",
   "date": "2026-08-03",
   "prev": 2100,
   "curr": 1389,
   "drop": 33.9
  },
  {
   "shop": "姚振朋1",
   "site": "墨西哥",
   "date": "2026-08-03",
   "prev": 2318,
   "curr": 1513,
   "drop": 34.7
  },
  {
   "shop": "姚振朋1",
   "site": "巴西",
   "date": "2026-08-03",
   "prev": 1526,
   "curr": 998,
   "drop": 34.6
  },
  {
   "shop": "程志恒3",
   "site": "墨西哥",
   "date": "2026-08-04",
   "prev": 2216,
   "curr": 1526,
   "drop": 31.1
  },
  {
   "shop": "程志恒3",
   "site": "巴西",
   "date": "2026-08-04",
   "prev": 1981,
   "curr": 1048,
   "drop": 47.1
  },
  {
   "shop": "程志恒3",
   "site": "智利",
   "date": "2026-08-04",
   "prev": 2344,
   "curr": 1423,
   "drop": 39.3
  },
  {
   "shop": "张玉博1",
   "site": "墨西哥",
   "date": "2026-08-04",
   "prev": 1566,
   "curr": 934,
   "drop": 40.4
  },
  {
   "shop": "张玉博1",
   "site": "巴西",
   "date": "2026-08-04",
   "prev": 1377,
   "curr": 882,
   "drop": 35.9
  },
  {
   "shop": "姚振朋1",
   "site": "墨西哥",
   "date": "2026-08-04",
   "prev": 2625,
   "curr": 1528,
   "drop": 41.8
  },
  {
   "shop": "姚振朋1",
   "site": "巴西",
   "date": "2026-08-04",
   "prev": 1523,
   "curr": 1013,
   "drop": 33.5
  },
  {
   "shop": "耿亚雄",
   "site": "哥伦比亚",
   "date": "2026-08-04",
   "prev": 2776,
   "curr": 1396,
   "drop": 49.7
  },
  {
   "shop": "耿亚雄",
   "site": "墨西哥",
   "date": "2026-08-04",
   "prev": 2506,
   "curr": 1075,
   "drop": 57.1
  },
  {
   "shop": "耿亚雄",
   "site": "巴西",
   "date": "2026-08-04",
   "prev": 2848,
   "curr": 1395,
   "drop": 51.0
  },
  {
   "shop": "张玉博1",
   "site": "阿根廷",
   "date": "2026-08-06",
   "prev": 1390,
   "curr": 916,
   "drop": 34.1
  },
  {
   "shop": "张玉博2",
   "site": "智利",
   "date": "2026-08-07",
   "prev": 968,
   "curr": 663,
   "drop": 31.5
  },
  {
   "shop": "张玉博1",
   "site": "巴西",
   "date": "2026-08-21",
   "prev": 1327,
   "curr": 867,
   "drop": 34.7
  },
  {
   "shop": "张玉博1",
   "site": "巴西",
   "date": "2026-09-02",
   "prev": 2291,
   "curr": 1017,
   "drop": 55.6
  },
  {
   "shop": "张玉博1",
   "site": "智利",
   "date": "2026-09-02",
   "prev": 3246,
   "curr": 1110,
   "drop": 65.8
  },
  {
   "shop": "张玉博2",
   "site": "墨西哥",
   "date": "2026-09-02",
   "prev": 2420,
   "curr": 996,
   "drop": 58.8
  },
  {
   "shop": "张玉博2",
   "site": "巴西",
   "date": "2026-09-02",
   "prev": 4300,
   "curr": 1985,
   "drop": 53.8
  },
  {
   "shop": "张玉博2",
   "site": "智利",
   "date": "2026-09-02",
   "prev": 2489,
   "curr": 1032,
   "drop": 58.5
  }
 ],
 "breakTotal": 112,
 "breakDenom": 3614,
 "daily": [
  {
   "date": "2026-07-01",
   "day": 1,
   "month": 7,
   "records": 15,
   "shops": 3,
   "full": 90,
   "rate": 16.7
  },
  {
   "date": "2026-07-02",
   "day": 2,
   "month": 7,
   "records": 40,
   "shops": 6,
   "full": 90,
   "rate": 44.4
  },
  {
   "date": "2026-07-03",
   "day": 3,
   "month": 7,
   "records": 41,
   "shops": 6,
   "full": 90,
   "rate": 45.6
  },
  {
   "date": "2026-07-04",
   "day": 4,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-05",
   "day": 5,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-06",
   "day": 6,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-07",
   "day": 7,
   "month": 7,
   "records": 15,
   "shops": 3,
   "full": 90,
   "rate": 16.7
  },
  {
   "date": "2026-07-08",
   "day": 8,
   "month": 7,
   "records": 15,
   "shops": 3,
   "full": 90,
   "rate": 16.7
  },
  {
   "date": "2026-07-09",
   "day": 9,
   "month": 7,
   "records": 35,
   "shops": 3,
   "full": 90,
   "rate": 38.9
  },
  {
   "date": "2026-07-10",
   "day": 10,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-07-11",
   "day": 11,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-12",
   "day": 12,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-07-13",
   "day": 13,
   "month": 7,
   "records": 20,
   "shops": 4,
   "full": 90,
   "rate": 22.2
  },
  {
   "date": "2026-07-14",
   "day": 14,
   "month": 7,
   "records": 20,
   "shops": 4,
   "full": 90,
   "rate": 22.2
  },
  {
   "date": "2026-07-15",
   "day": 15,
   "month": 7,
   "records": 20,
   "shops": 4,
   "full": 90,
   "rate": 22.2
  },
  {
   "date": "2026-07-16",
   "day": 16,
   "month": 7,
   "records": 40,
   "shops": 6,
   "full": 90,
   "rate": 44.4
  },
  {
   "date": "2026-07-17",
   "day": 17,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-18",
   "day": 18,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-19",
   "day": 19,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-07-20",
   "day": 20,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-07-21",
   "day": 21,
   "month": 7,
   "records": 30,
   "shops": 6,
   "full": 90,
   "rate": 33.3
  },
  {
   "date": "2026-07-22",
   "day": 22,
   "month": 7,
   "records": 30,
   "shops": 6,
   "full": 90,
   "rate": 33.3
  },
  {
   "date": "2026-07-23",
   "day": 23,
   "month": 7,
   "records": 30,
   "shops": 6,
   "full": 90,
   "rate": 33.3
  },
  {
   "date": "2026-07-24",
   "day": 24,
   "month": 7,
   "records": 50,
   "shops": 6,
   "full": 90,
   "rate": 55.6
  },
  {
   "date": "2026-07-25",
   "day": 25,
   "month": 7,
   "records": 10,
   "shops": 2,
   "full": 90,
   "rate": 11.1
  },
  {
   "date": "2026-07-26",
   "day": 26,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-07-27",
   "day": 27,
   "month": 7,
   "records": 30,
   "shops": 6,
   "full": 90,
   "rate": 33.3
  },
  {
   "date": "2026-07-28",
   "day": 28,
   "month": 7,
   "records": 30,
   "shops": 6,
   "full": 90,
   "rate": 33.3
  },
  {
   "date": "2026-07-29",
   "day": 29,
   "month": 7,
   "records": 30,
   "shops": 6,
   "full": 90,
   "rate": 33.3
  },
  {
   "date": "2026-07-30",
   "day": 30,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-07-31",
   "day": 31,
   "month": 7,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-08-01",
   "day": 1,
   "month": 8,
   "records": 90,
   "shops": 10,
   "full": 90,
   "rate": 100.0
  },
  {
   "date": "2026-08-02",
   "day": 2,
   "month": 8,
   "records": 85,
   "shops": 17,
   "full": 90,
   "rate": 94.4
  },
  {
   "date": "2026-08-03",
   "day": 3,
   "month": 8,
   "records": 55,
   "shops": 8,
   "full": 90,
   "rate": 61.1
  },
  {
   "date": "2026-08-04",
   "day": 4,
   "month": 8,
   "records": 35,
   "shops": 7,
   "full": 90,
   "rate": 38.9
  },
  {
   "date": "2026-08-05",
   "day": 5,
   "month": 8,
   "records": 35,
   "shops": 7,
   "full": 90,
   "rate": 38.9
  },
  {
   "date": "2026-08-06",
   "day": 6,
   "month": 8,
   "records": 35,
   "shops": 7,
   "full": 90,
   "rate": 38.9
  },
  {
   "date": "2026-08-07",
   "day": 7,
   "month": 8,
   "records": 55,
   "shops": 7,
   "full": 90,
   "rate": 61.1
  },
  {
   "date": "2026-08-08",
   "day": 8,
   "month": 8,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-08-09",
   "day": 9,
   "month": 8,
   "records": 20,
   "shops": 4,
   "full": 90,
   "rate": 22.2
  },
  {
   "date": "2026-08-10",
   "day": 10,
   "month": 8,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-08-11",
   "day": 11,
   "month": 8,
   "records": 50,
   "shops": 10,
   "full": 90,
   "rate": 55.6
  },
  {
   "date": "2026-08-12",
   "day": 12,
   "month": 8,
   "records": 50,
   "shops": 10,
   "full": 90,
   "rate": 55.6
  },
  {
   "date": "2026-08-13",
   "day": 13,
   "month": 8,
   "records": 80,
   "shops": 16,
   "full": 90,
   "rate": 88.9
  },
  {
   "date": "2026-08-14",
   "day": 14,
   "month": 8,
   "records": 120,
   "shops": 16,
   "full": 90,
   "rate": 133.3
  },
  {
   "date": "2026-08-15",
   "day": 15,
   "month": 8,
   "records": 40,
   "shops": 8,
   "full": 90,
   "rate": 44.4
  },
  {
   "date": "2026-08-16",
   "day": 16,
   "month": 8,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-08-17",
   "day": 17,
   "month": 8,
   "records": 85,
   "shops": 17,
   "full": 90,
   "rate": 94.4
  },
  {
   "date": "2026-08-18",
   "day": 18,
   "month": 8,
   "records": 85,
   "shops": 17,
   "full": 90,
   "rate": 94.4
  },
  {
   "date": "2026-08-19",
   "day": 19,
   "month": 8,
   "records": 85,
   "shops": 17,
   "full": 90,
   "rate": 94.4
  },
  {
   "date": "2026-08-20",
   "day": 20,
   "month": 8,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-08-21",
   "day": 21,
   "month": 8,
   "records": 85,
   "shops": 17,
   "full": 90,
   "rate": 94.4
  },
  {
   "date": "2026-08-22",
   "day": 22,
   "month": 8,
   "records": 130,
   "shops": 17,
   "full": 90,
   "rate": 144.4
  },
  {
   "date": "2026-08-23",
   "day": 23,
   "month": 8,
   "records": 40,
   "shops": 8,
   "full": 90,
   "rate": 44.4
  },
  {
   "date": "2026-08-24",
   "day": 24,
   "month": 8,
   "records": 40,
   "shops": 8,
   "full": 90,
   "rate": 44.4
  },
  {
   "date": "2026-08-25",
   "day": 25,
   "month": 8,
   "records": 85,
   "shops": 17,
   "full": 90,
   "rate": 94.4
  },
  {
   "date": "2026-08-26",
   "day": 26,
   "month": 8,
   "records": 86,
   "shops": 17,
   "full": 90,
   "rate": 95.6
  },
  {
   "date": "2026-08-27",
   "day": 27,
   "month": 8,
   "records": 86,
   "shops": 17,
   "full": 90,
   "rate": 95.6
  },
  {
   "date": "2026-08-28",
   "day": 28,
   "month": 8,
   "records": 86,
   "shops": 17,
   "full": 90,
   "rate": 95.6
  },
  {
   "date": "2026-08-29",
   "day": 29,
   "month": 8,
   "records": 92,
   "shops": 9,
   "full": 90,
   "rate": 102.2
  },
  {
   "date": "2026-08-30",
   "day": 30,
   "month": 8,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-08-31",
   "day": 31,
   "month": 8,
   "records": 40,
   "shops": 8,
   "full": 90,
   "rate": 44.4
  },
  {
   "date": "2026-09-01",
   "day": 1,
   "month": 9,
   "records": 177,
   "shops": 18,
   "full": 90,
   "rate": 196.7
  },
  {
   "date": "2026-09-02",
   "day": 2,
   "month": 9,
   "records": 86,
   "shops": 17,
   "full": 90,
   "rate": 95.6
  },
  {
   "date": "2026-09-03",
   "day": 3,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-04",
   "day": 4,
   "month": 9,
   "records": 137,
   "shops": 18,
   "full": 90,
   "rate": 152.2
  },
  {
   "date": "2026-09-05",
   "day": 5,
   "month": 9,
   "records": 90,
   "shops": 9,
   "full": 90,
   "rate": 100.0
  },
  {
   "date": "2026-09-06",
   "day": 6,
   "month": 9,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-09-07",
   "day": 7,
   "month": 9,
   "records": 46,
   "shops": 9,
   "full": 90,
   "rate": 51.1
  },
  {
   "date": "2026-09-08",
   "day": 8,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-09",
   "day": 9,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-10",
   "day": 10,
   "month": 9,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-09-11",
   "day": 11,
   "month": 9,
   "records": 136,
   "shops": 18,
   "full": 90,
   "rate": 151.1
  },
  {
   "date": "2026-09-12",
   "day": 12,
   "month": 9,
   "records": 92,
   "shops": 9,
   "full": 90,
   "rate": 102.2
  },
  {
   "date": "2026-09-13",
   "day": 13,
   "month": 9,
   "records": 0,
   "shops": 0,
   "full": 90,
   "rate": 0.0
  },
  {
   "date": "2026-09-14",
   "day": 14,
   "month": 9,
   "records": 45,
   "shops": 9,
   "full": 90,
   "rate": 50.0
  },
  {
   "date": "2026-09-15",
   "day": 15,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-16",
   "day": 16,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-17",
   "day": 17,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-18",
   "day": 18,
   "month": 9,
   "records": 91,
   "shops": 18,
   "full": 90,
   "rate": 101.1
  },
  {
   "date": "2026-09-19",
   "day": 19,
   "month": 9,
   "records": 45,
   "shops": 9,
   "full": 90,
   "rate": 50.0
  }
 ],
 "gears": [
  {
   "value": 100,
   "records": 1298,
   "share": 35.2
  },
  {
   "value": 50,
   "records": 936,
   "share": 25.4
  },
  {
   "value": 200,
   "records": 475,
   "share": 12.9
  },
  {
   "value": 150,
   "records": 390,
   "share": 10.6
  },
  {
   "value": 0,
   "records": 204,
   "share": 5.5
  },
  {
   "value": 60,
   "records": 120,
   "share": 3.3
  },
  {
   "value": 40,
   "records": 102,
   "share": 2.8
  },
  {
   "value": 300,
   "records": 59,
   "share": 1.6
  },
  {
   "value": 70,
   "records": 20,
   "share": 0.5
  },
  {
   "value": 30,
   "records": 18,
   "share": 0.5
  },
  {
   "value": 10,
   "records": 15,
   "share": 0.4
  },
  {
   "value": 220,
   "records": 10,
   "share": 0.3
  },
  {
   "value": 140,
   "records": 7,
   "share": 0.2
  },
  {
   "value": 110,
   "records": 7,
   "share": 0.2
  },
  {
   "value": 187,
   "records": 5,
   "share": 0.1
  },
  {
   "value": 800,
   "records": 5,
   "share": 0.1
  },
  {
   "value": 600,
   "records": 5,
   "share": 0.1
  },
  {
   "value": 90,
   "records": 5,
   "share": 0.1
  },
  {
   "value": 400,
   "records": 5,
   "share": 0.1
  }
 ],
 "coverage": [
  {
   "name": "李彦辉",
   "owner": "石老师",
   "spanDays": 48,
   "coverDays": 24,
   "coverRate": 50.0,
   "records": 166,
   "orderFill": 69.3,
   "visitFill": 84.3,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 42
  },
  {
   "name": "侯敏",
   "owner": "石老师",
   "spanDays": 48,
   "coverDays": 26,
   "coverRate": 54.2,
   "records": 160,
   "orderFill": 73.1,
   "visitFill": 96.9,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 40
  },
  {
   "name": "杨云光",
   "owner": "石老师",
   "spanDays": 48,
   "coverDays": 26,
   "coverRate": 54.2,
   "records": 160,
   "orderFill": 71.9,
   "visitFill": 96.9,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 40
  },
  {
   "name": "金卫",
   "owner": "石老师",
   "spanDays": 48,
   "coverDays": 26,
   "coverRate": 54.2,
   "records": 160,
   "orderFill": 65.0,
   "visitFill": 93.8,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 40
  },
  {
   "name": "陆波波",
   "owner": "石老师",
   "spanDays": 48,
   "coverDays": 26,
   "coverRate": 54.2,
   "records": 160,
   "orderFill": 53.1,
   "visitFill": 93.8,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 40
  },
  {
   "name": "耿亚雄",
   "owner": "石老师",
   "spanDays": 79,
   "coverDays": 43,
   "coverRate": 54.4,
   "records": 265,
   "orderFill": 83.8,
   "visitFill": 95.8,
   "missing": [
    "2026-07-01",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-17",
    "2026-07-18",
    "2026-07-25",
    "2026-08-03",
    "2026-08-09",
    "2026-08-15",
    "2026-08-23",
    "2026-08-24",
    "2026-08-31"
   ],
   "missingCount": 23
  },
  {
   "name": "骆龙华",
   "owner": "石老师",
   "spanDays": 79,
   "coverDays": 43,
   "coverRate": 54.4,
   "records": 266,
   "orderFill": 79.3,
   "visitFill": 95.9,
   "missing": [
    "2026-07-01",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-17",
    "2026-07-18",
    "2026-07-25",
    "2026-08-03",
    "2026-08-09",
    "2026-08-15",
    "2026-08-23",
    "2026-08-24",
    "2026-08-31"
   ],
   "missingCount": 23
  },
  {
   "name": "殷磊",
   "owner": "李源",
   "spanDays": 49,
   "coverDays": 31,
   "coverRate": 63.3,
   "records": 170,
   "orderFill": 65.9,
   "visitFill": 97.1,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 35
  },
  {
   "name": "程志恒1",
   "owner": "李源",
   "spanDays": 49,
   "coverDays": 31,
   "coverRate": 63.3,
   "records": 170,
   "orderFill": 61.8,
   "visitFill": 97.1,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 35
  },
  {
   "name": "张玉博1",
   "owner": "石老师",
   "spanDays": 80,
   "coverDays": 53,
   "coverRate": 66.2,
   "records": 340,
   "orderFill": 65.6,
   "visitFill": 96.8,
   "missing": [
    "2026-07-11",
    "2026-07-17",
    "2026-07-18",
    "2026-07-25",
    "2026-08-03",
    "2026-08-09",
    "2026-08-15",
    "2026-08-23",
    "2026-08-24",
    "2026-08-31",
    "2026-09-05",
    "2026-09-14",
    "2026-09-19"
   ],
   "missingCount": 13
  },
  {
   "name": "张玉博2",
   "owner": "石老师",
   "spanDays": 80,
   "coverDays": 53,
   "coverRate": 66.2,
   "records": 340,
   "orderFill": 67.1,
   "visitFill": 95.3,
   "missing": [
    "2026-07-11",
    "2026-07-17",
    "2026-07-18",
    "2026-07-25",
    "2026-08-03",
    "2026-08-09",
    "2026-08-15",
    "2026-08-23",
    "2026-08-24",
    "2026-08-31",
    "2026-09-05",
    "2026-09-14",
    "2026-09-19"
   ],
   "missingCount": 13
  },
  {
   "name": "莫雷",
   "owner": "李源",
   "spanDays": 50,
   "coverDays": 34,
   "coverRate": 68.0,
   "records": 185,
   "orderFill": 60.0,
   "visitFill": 97.3,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 32
  },
  {
   "name": "袁鹏辉",
   "owner": "李源",
   "spanDays": 50,
   "coverDays": 34,
   "coverRate": 68.0,
   "records": 185,
   "orderFill": 64.3,
   "visitFill": 97.3,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 32
  },
  {
   "name": "郭浩洋",
   "owner": "李源",
   "spanDays": 19,
   "coverDays": 13,
   "coverRate": 68.4,
   "records": 75,
   "orderFill": 12.0,
   "visitFill": 93.3,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 53
  },
  {
   "name": "唐博宏",
   "owner": "李源",
   "spanDays": 50,
   "coverDays": 35,
   "coverRate": 70.0,
   "records": 190,
   "orderFill": 63.2,
   "visitFill": 100.0,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 31
  },
  {
   "name": "姚振朋1",
   "owner": "李源",
   "spanDays": 80,
   "coverDays": 56,
   "coverRate": 70.0,
   "records": 300,
   "orderFill": 58.3,
   "visitFill": 98.3,
   "missing": [
    "2026-07-01",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-08-29",
    "2026-09-07",
    "2026-09-12"
   ],
   "missingCount": 10
  },
  {
   "name": "程志恒3",
   "owner": "李源",
   "spanDays": 81,
   "coverDays": 60,
   "coverRate": 74.1,
   "records": 320,
   "orderFill": 56.9,
   "visitFill": 98.4,
   "missing": [
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-08-29",
    "2026-09-07",
    "2026-09-12"
   ],
   "missingCount": 6
  },
  {
   "name": "杨晓丰",
   "owner": "李源",
   "spanDays": 50,
   "coverDays": 39,
   "coverRate": 78.0,
   "records": 215,
   "orderFill": 66.5,
   "visitFill": 97.7,
   "missing": [
    "2026-07-01",
    "2026-07-02",
    "2026-07-03",
    "2026-07-04",
    "2026-07-05",
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-11",
    "2026-07-13",
    "2026-07-14",
    "2026-07-15",
    "2026-07-16",
    "2026-07-17",
    "2026-07-18",
    "2026-07-21",
    "2026-07-22",
    "2026-07-23",
    "2026-07-24"
   ],
   "missingCount": 27
  }
 ],
 "gaps": [
  {
   "item": "今日上架",
   "problem": "填的是作业档位（50 / 100 / 150 / 200），非真实上架条数",
   "impact": "无法统计真实上架量，「日均上架」对不上实际",
   "level": "高"
  },
  {
   "item": "当日出单",
   "problem": "整体缺失 35%（7 月 44% / 9 月 62%）",
   "impact": "转化率只能按已填记录估算，9 月尤其不可信",
   "level": "高"
  },
  {
   "item": "总链接数 / 总出单",
   "problem": "批次内累计，跨批次不连续（断层 112 处）",
   "impact": "不能跨批次画趋势，只能做单批次快照",
   "level": "高"
  },
  {
   "item": "当日访问",
   "problem": "站点间均值差 12 倍（墨西哥 100.6 / 哥伦比亚 7.9）",
   "impact": "站点横向对比存疑，只能看结构占比",
   "level": "中"
  },
  {
   "item": "成本 / 售价 / 物流 / 广告费",
   "problem": "四类均未接入",
   "impact": "利润分析与广告分析无法建立，独立核算挂空挡",
   "level": "高"
  },
  {
   "item": "7 月覆盖率",
   "problem": "7 月多天仅 10~15 条记录（满额 90 条）",
   "impact": "7 月数据不足以支撑月度对比",
   "level": "中"
  }
 ]
};
