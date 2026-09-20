/* 自动生成，请勿手改 —— 由 scripts/10_build_shopmatrix.py 生成
   数据源：数据底座/顺诚经营数据底座.xlsx
   生成时间：2026-09-20　口径见 meta.rules */
window.SC_SHOPS = {
 "meta": {
  "generated": "2026-09-20",
  "source": "数据底座/顺诚经营数据底座.xlsx",
  "span": "2026-07-01 ~ 2026-09-19",
  "rules": [
   "色级风险率 = 红橙黄记录数 ÷ 有色级记录数（分母不含未标注）",
   "未标注率单独成列，不参与健康评分",
   "封停/30天 = 封停次数 ÷ 覆盖天数 × 30，消除各店覆盖天数差异",
   "快照 = 该店最新一天、各站点中的最差色级"
  ]
 },
 "summary": {
  "shops": 18,
  "owners": 2,
  "sites": 5,
  "records": 3827,
  "riskRecords": 452,
  "stops": 82,
  "unlabeled": 645,
  "dateFrom": "2026-07-01",
  "dateTo": "2026-09-19"
 },
 "owners": [
  {
   "name": "李源",
   "shops": 9,
   "records": 1810,
   "red": 202,
   "orange": 96,
   "yellow": 86,
   "green": 1426,
   "unlabeled": 0,
   "riskCount": 384,
   "riskRate": 21.2,
   "unlabeledRate": 0.0,
   "stops": 0,
   "latest": "2026-09-19"
  },
  {
   "name": "石老师",
   "shops": 9,
   "records": 2017,
   "red": 51,
   "orange": 5,
   "yellow": 12,
   "green": 1304,
   "unlabeled": 645,
   "riskCount": 68,
   "riskRate": 5.0,
   "unlabeledRate": 32.0,
   "stops": 82,
   "latest": "2026-09-18"
  }
 ],
 "sites": [
  {
   "name": "墨西哥",
   "records": 761,
   "red": 108,
   "orange": 5,
   "yellow": 44,
   "riskCount": 157,
   "riskRate": 27.0,
   "unlabeledRate": 23.7,
   "orders": 785,
   "visits": 74157,
   "conv": 1.1
  },
  {
   "name": "阿根廷",
   "records": 783,
   "red": 60,
   "orange": 66,
   "yellow": 0,
   "riskCount": 126,
   "riskRate": 20.1,
   "unlabeledRate": 19.8,
   "orders": 1039,
   "visits": 43221,
   "conv": 2.4
  },
  {
   "name": "巴西",
   "records": 761,
   "red": 54,
   "orange": 12,
   "yellow": 24,
   "riskCount": 90,
   "riskRate": 14.4,
   "unlabeledRate": 17.9,
   "orders": 542,
   "visits": 61404,
   "conv": 0.9
  },
  {
   "name": "智利",
   "records": 761,
   "red": 19,
   "orange": 13,
   "yellow": 30,
   "riskCount": 62,
   "riskRate": 9.7,
   "unlabeledRate": 16.4,
   "orders": 313,
   "visits": 21267,
   "conv": 1.5
  },
  {
   "name": "哥伦比亚",
   "records": 761,
   "red": 12,
   "orange": 5,
   "yellow": 0,
   "riskCount": 17,
   "riskRate": 2.4,
   "unlabeledRate": 6.4,
   "orders": 124,
   "visits": 5819,
   "conv": 2.1
  }
 ],
 "months": [
  {
   "month": 7,
   "records": 561,
   "red": 1,
   "orange": 1,
   "yellow": 4,
   "riskCount": 6,
   "riskRate": 1.1,
   "unlabeledRate": 2.7
  },
  {
   "month": 8,
   "records": 1775,
   "red": 68,
   "orange": 50,
   "yellow": 48,
   "riskCount": 166,
   "riskRate": 10.4,
   "unlabeledRate": 10.0
  },
  {
   "month": 9,
   "records": 1491,
   "red": 184,
   "orange": 50,
   "yellow": 46,
   "riskCount": 280,
   "riskRate": 26.9,
   "unlabeledRate": 30.3
  }
 ],
 "riskTypes": [
  {
   "name": "取消",
   "count": 531,
   "shops": 15,
   "topShops": [
    "侯敏",
    "姚振朋1",
    "张玉博1",
    "张玉博2"
   ]
  },
  {
   "name": "不合规货件",
   "count": 450,
   "shops": 14,
   "topShops": [
    "侯敏",
    "唐博宏",
    "姚振朋1",
    "张玉博1"
   ]
  },
  {
   "name": "投诉",
   "count": 239,
   "shops": 12,
   "topShops": [
    "侯敏",
    "唐博宏",
    "张玉博1",
    "张玉博2"
   ]
  },
  {
   "name": "暂停销售",
   "count": 42,
   "shops": 1,
   "topShops": [
    "陆波波"
   ]
  },
  {
   "name": "限制",
   "count": 32,
   "shops": 6,
   "topShops": [
    "侯敏",
    "张玉博2",
    "耿亚雄",
    "金卫"
   ]
  },
  {
   "name": "侵权",
   "count": 29,
   "shops": 5,
   "topShops": [
    "侯敏",
    "杨云光",
    "耿亚雄",
    "金卫"
   ]
  },
  {
   "name": "封店",
   "count": 8,
   "shops": 1,
   "topShops": [
    "金卫"
   ]
  },
  {
   "name": "调解",
   "count": 5,
   "shops": 1,
   "topShops": [
    "张玉博2"
   ]
  },
  {
   "name": "警告",
   "count": 1,
   "shops": 1,
   "topShops": [
    "张玉博1"
   ]
  },
  {
   "name": "待自动退款",
   "count": 1,
   "shops": 1,
   "topShops": [
    "李彦辉"
   ]
  }
 ],
 "shops": [
  {
   "name": "唐博宏",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 35,
   "records": 190,
   "red": 22,
   "orange": 0,
   "yellow": 0,
   "green": 168,
   "unlabeled": 0,
   "riskCount": 22,
   "labeled": 190,
   "riskRate": 11.6,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 20
    },
    {
     "name": "投诉",
     "count": 2
    }
   ],
   "orders": 69,
   "visits": 5776,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "姚振朋1",
   "owner": "李源",
   "firstDate": "2026-07-02",
   "lastDate": "2026-09-19",
   "coverDays": 56,
   "records": 300,
   "red": 49,
   "orange": 7,
   "yellow": 15,
   "green": 229,
   "unlabeled": 0,
   "riskCount": 71,
   "labeled": 300,
   "riskRate": 23.7,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 37
    },
    {
     "name": "取消",
     "count": 34
    }
   ],
   "orders": 205,
   "visits": 17101,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "杨晓丰",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 39,
   "records": 215,
   "red": 24,
   "orange": 0,
   "yellow": 0,
   "green": 191,
   "unlabeled": 0,
   "riskCount": 24,
   "labeled": 215,
   "riskRate": 11.2,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "取消",
     "count": 24
    }
   ],
   "orders": 112,
   "visits": 12666,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "殷磊",
   "owner": "李源",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-19",
   "coverDays": 31,
   "records": 170,
   "red": 42,
   "orange": 8,
   "yellow": 0,
   "green": 120,
   "unlabeled": 0,
   "riskCount": 50,
   "labeled": 170,
   "riskRate": 29.4,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "取消",
     "count": 46
    },
    {
     "name": "不合规货件",
     "count": 3
    },
    {
     "name": "投诉",
     "count": 1
    }
   ],
   "orders": 52,
   "visits": 6565,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "程志恒1",
   "owner": "李源",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-19",
   "coverDays": 31,
   "records": 170,
   "red": 12,
   "orange": 38,
   "yellow": 52,
   "green": 68,
   "unlabeled": 0,
   "riskCount": 102,
   "labeled": 170,
   "riskRate": 60.0,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 34
    },
    {
     "name": "投诉",
     "count": 34
    },
    {
     "name": "取消",
     "count": 20
    }
   ],
   "orders": 49,
   "visits": 5041,
   "snapshot": "橙",
   "anomaly": null
  },
  {
   "name": "程志恒3",
   "owner": "李源",
   "firstDate": "2026-07-01",
   "lastDate": "2026-09-19",
   "coverDays": 60,
   "records": 320,
   "red": 25,
   "orange": 35,
   "yellow": 19,
   "green": 241,
   "unlabeled": 0,
   "riskCount": 79,
   "labeled": 320,
   "riskRate": 24.7,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "投诉",
     "count": 37
    },
    {
     "name": "取消",
     "count": 32
    },
    {
     "name": "不合规货件",
     "count": 5
    }
   ],
   "orders": 234,
   "visits": 22372,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "莫雷",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 34,
   "records": 185,
   "red": 21,
   "orange": 0,
   "yellow": 0,
   "green": 164,
   "unlabeled": 0,
   "riskCount": 21,
   "labeled": 185,
   "riskRate": 11.4,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "取消",
     "count": 21
    }
   ],
   "orders": 88,
   "visits": 11457,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "袁鹏辉",
   "owner": "李源",
   "firstDate": "2026-08-01",
   "lastDate": "2026-09-19",
   "coverDays": 34,
   "records": 185,
   "red": 7,
   "orange": 8,
   "yellow": 0,
   "green": 170,
   "unlabeled": 0,
   "riskCount": 15,
   "labeled": 185,
   "riskRate": 8.1,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 15
    }
   ],
   "orders": 100,
   "visits": 11986,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "郭浩洋",
   "owner": "李源",
   "firstDate": "2026-09-01",
   "lastDate": "2026-09-19",
   "coverDays": 13,
   "records": 75,
   "red": 0,
   "orange": 0,
   "yellow": 0,
   "green": 75,
   "unlabeled": 0,
   "riskCount": 0,
   "labeled": 75,
   "riskRate": 0.0,
   "unlabeledRate": 0.0,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [],
   "orders": 11,
   "visits": 1560,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "侯敏",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "records": 160,
   "red": 0,
   "orange": 0,
   "yellow": 0,
   "green": 88,
   "unlabeled": 72,
   "riskCount": 0,
   "labeled": 88,
   "riskRate": 0.0,
   "unlabeledRate": 45.0,
   "stops": 8,
   "stopsPer30": 9.2,
   "risks": [
    {
     "name": "投诉",
     "count": 34
    },
    {
     "name": "不合规货件",
     "count": 34
    },
    {
     "name": "取消",
     "count": 30
    }
   ],
   "orders": 115,
   "visits": 10682,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "张玉博1",
   "owner": "石老师",
   "firstDate": "2026-07-01",
   "lastDate": "2026-09-18",
   "coverDays": 53,
   "records": 340,
   "red": 0,
   "orange": 4,
   "yellow": 2,
   "green": 250,
   "unlabeled": 84,
   "riskCount": 6,
   "labeled": 256,
   "riskRate": 2.3,
   "unlabeledRate": 24.7,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 53
    },
    {
     "name": "取消",
     "count": 44
    },
    {
     "name": "投诉",
     "count": 16
    }
   ],
   "orders": 151,
   "visits": 15573,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "张玉博2",
   "owner": "石老师",
   "firstDate": "2026-07-01",
   "lastDate": "2026-09-18",
   "coverDays": 53,
   "records": 340,
   "red": 1,
   "orange": 1,
   "yellow": 10,
   "green": 283,
   "unlabeled": 45,
   "riskCount": 12,
   "labeled": 295,
   "riskRate": 4.1,
   "unlabeledRate": 13.2,
   "stops": 13,
   "stopsPer30": 7.4,
   "risks": [
    {
     "name": "取消",
     "count": 25
    },
    {
     "name": "投诉",
     "count": 19
    },
    {
     "name": "限制",
     "count": 13
    }
   ],
   "orders": 151,
   "visits": 16531,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "李彦辉",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 24,
   "records": 166,
   "red": 0,
   "orange": 0,
   "yellow": 0,
   "green": 108,
   "unlabeled": 58,
   "riskCount": 0,
   "labeled": 108,
   "riskRate": 0.0,
   "unlabeledRate": 34.9,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 33
    },
    {
     "name": "取消",
     "count": 15
    },
    {
     "name": "投诉",
     "count": 4
    }
   ],
   "orders": 822,
   "visits": 11371,
   "snapshot": "绿",
   "anomaly": "出单口径待核（转化 7.23%，为中位数 1.05% 的 6.9 倍）"
  },
  {
   "name": "杨云光",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "records": 160,
   "red": 0,
   "orange": 0,
   "yellow": 0,
   "green": 73,
   "unlabeled": 87,
   "riskCount": 0,
   "labeled": 73,
   "riskRate": 0.0,
   "unlabeledRate": 54.4,
   "stops": 0,
   "stopsPer30": 0.0,
   "risks": [
    {
     "name": "不合规货件",
     "count": 47
    },
    {
     "name": "投诉",
     "count": 37
    },
    {
     "name": "取消",
     "count": 25
    }
   ],
   "orders": 167,
   "visits": 15416,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "耿亚雄",
   "owner": "石老师",
   "firstDate": "2026-07-02",
   "lastDate": "2026-09-18",
   "coverDays": 43,
   "records": 265,
   "red": 0,
   "orange": 0,
   "yellow": 0,
   "green": 206,
   "unlabeled": 59,
   "riskCount": 0,
   "labeled": 206,
   "riskRate": 0.0,
   "unlabeledRate": 22.3,
   "stops": 1,
   "stopsPer30": 0.7,
   "risks": [
    {
     "name": "不合规货件",
     "count": 51
    },
    {
     "name": "取消",
     "count": 23
    },
    {
     "name": "侵权",
     "count": 1
    }
   ],
   "orders": 161,
   "visits": 12197,
   "snapshot": "绿",
   "anomaly": null
  },
  {
   "name": "金卫",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "records": 160,
   "red": 8,
   "orange": 0,
   "yellow": 0,
   "green": 74,
   "unlabeled": 78,
   "riskCount": 8,
   "labeled": 82,
   "riskRate": 9.8,
   "unlabeledRate": 48.8,
   "stops": 10,
   "stopsPer30": 11.5,
   "risks": [
    {
     "name": "不合规货件",
     "count": 50
    },
    {
     "name": "取消",
     "count": 29
    },
    {
     "name": "投诉",
     "count": 26
    }
   ],
   "orders": 87,
   "visits": 7539,
   "snapshot": null,
   "anomaly": null
  },
  {
   "name": "陆波波",
   "owner": "石老师",
   "firstDate": "2026-08-02",
   "lastDate": "2026-09-18",
   "coverDays": 26,
   "records": 160,
   "red": 42,
   "orange": 0,
   "yellow": 0,
   "green": 40,
   "unlabeled": 78,
   "riskCount": 42,
   "labeled": 82,
   "riskRate": 51.2,
   "unlabeledRate": 48.8,
   "stops": 43,
   "stopsPer30": 49.6,
   "risks": [
    {
     "name": "取消",
     "count": 119
    },
    {
     "name": "暂停销售",
     "count": 42
    },
    {
     "name": "不合规货件",
     "count": 30
    }
   ],
   "orders": 50,
   "visits": 4674,
   "snapshot": "红",
   "anomaly": null
  },
  {
   "name": "骆龙华",
   "owner": "石老师",
   "firstDate": "2026-07-02",
   "lastDate": "2026-09-18",
   "coverDays": 43,
   "records": 266,
   "red": 0,
   "orange": 0,
   "yellow": 0,
   "green": 182,
   "unlabeled": 84,
   "riskCount": 0,
   "labeled": 182,
   "riskRate": 0.0,
   "unlabeledRate": 31.6,
   "stops": 7,
   "stopsPer30": 4.9,
   "risks": [
    {
     "name": "取消",
     "count": 44
    },
    {
     "name": "不合规货件",
     "count": 38
    },
    {
     "name": "投诉",
     "count": 28
    }
   ],
   "orders": 179,
   "visits": 17361,
   "snapshot": null,
   "anomaly": null
  }
 ],
 "events": [
  {
   "date": "2026-09-18",
   "shop": "陆波波",
   "site": "智利",
   "text": "取消单过多，暂停销售",
   "level": "红",
   "reason": "取消|暂停销售"
  },
  {
   "date": "2026-09-18",
   "shop": "陆波波",
   "site": "哥伦比亚",
   "text": "取消单过多，暂停销售",
   "level": "红",
   "reason": "取消|暂停销售"
  },
  {
   "date": "2026-09-18",
   "shop": "李彦辉",
   "site": "阿根廷",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "李彦辉",
   "site": "智利",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "李彦辉",
   "site": "哥伦比亚",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "李彦辉",
   "site": "巴西",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "陆波波",
   "site": "墨西哥",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "骆龙华",
   "site": "巴西",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "耿亚雄",
   "site": "巴西",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "张玉博2",
   "site": "墨西哥",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "张玉博2",
   "site": "智利",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "张玉博1",
   "site": "阿根廷",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "张玉博1",
   "site": "巴西",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-18",
   "shop": "李彦辉",
   "site": "墨西哥",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "陆波波",
   "site": "智利",
   "text": "取消单过多，暂停销售",
   "level": "红",
   "reason": "取消|暂停销售"
  },
  {
   "date": "2026-09-17",
   "shop": "陆波波",
   "site": "哥伦比亚",
   "text": "取消单过多，暂停销售",
   "level": "红",
   "reason": "取消|暂停销售"
  },
  {
   "date": "2026-09-17",
   "shop": "李彦辉",
   "site": "阿根廷",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "李彦辉",
   "site": "智利",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "李彦辉",
   "site": "哥伦比亚",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "李彦辉",
   "site": "巴西",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "陆波波",
   "site": "墨西哥",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "金卫",
   "site": "墨西哥",
   "text": "侵权暂停至9.18",
   "level": "未标注",
   "reason": "侵权"
  },
  {
   "date": "2026-09-17",
   "shop": "骆龙华",
   "site": "墨西哥",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  },
  {
   "date": "2026-09-17",
   "shop": "骆龙华",
   "site": "巴西",
   "text": "上架受限",
   "level": "未标注",
   "reason": "上架受限|限制"
  }
 ]
};
