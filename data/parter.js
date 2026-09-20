/* 自动生成，请勿手改 —— 由 scripts/13_build_parterdata.py 生成
   数据源：数据底座/顺诚经营数据底座.xlsx
   生成时间：2026-09-20　口径见 meta.rules */
window.SC_PARTER = {
 "meta": {
  "generated": "2026-09-20",
  "source": "数据底座/顺诚经营数据底座.xlsx",
  "span": "2026-07-01 ~ 2026-09-19",
  "layer": "店铺合伙 · 人维度核算（钱的部分待接入）",
  "rules": [
   "合伙人 = 2 位管理人（李源 / 石老师），各带 9 家店，一人一页",
   "损益口径：销售额 − 变动费 = 边界利润；边界利润 − 个人工资 − 固定费分摊 = 经营利润",
   "「个人工资」单列，不并入固定费（老周 2026-09-20 明确）",
   "增量分红基准 = 本期实际经营利润 × 1.15（锁定）",
   "在架链接 / 出单 / 访问 / 风险天数：与「经营数据 · 独立核算」同口径，可直接横向对照",
   "金额字段（销售额/采购/佣金/运费/广告/退款/工资/固定费）现有底座一个都没有 → 一律 null，标「待接入」",
   "缺失与异常只标注、不填补、不篡改"
  ]
 },
 "summary": {
  "partners": 2,
  "shops": 18,
  "months": 3,
  "dateFrom": "2026-07-01",
  "dateTo": "2026-09-19",
  "spanDays": 81,
  "activeDays": 66,
  "links": 227671,
  "orders": 2803,
  "visits": 205868,
  "moneyReady": 0,
  "moneyTotal": 8
 },
 "plRows": [
  {
   "key": "revenue",
   "name": "销售额",
   "kind": "plus",
   "src": "美客多后台 · 订单明细（Ventas）",
   "owner": "运营导出",
   "status": "pending"
  },
  {
   "key": "purchase",
   "name": "采购成本",
   "kind": "minus",
   "src": "SKU 采购成本表",
   "owner": "顺诚自建",
   "status": "pending"
  },
  {
   "key": "commission",
   "name": "平台佣金",
   "kind": "minus",
   "src": "美客多后台 · 结算单",
   "owner": "运营导出",
   "status": "pending"
  },
  {
   "key": "shipping",
   "name": "物流运费",
   "kind": "minus",
   "src": "物流商账单 / 后台物流费用",
   "owner": "运营导出",
   "status": "pending"
  },
  {
   "key": "ads",
   "name": "广告费",
   "kind": "minus",
   "src": "美客多后台 · 广告报表（Publicidad）",
   "owner": "运营导出",
   "status": "pending"
  },
  {
   "key": "refund",
   "name": "退款损失",
   "kind": "minus",
   "src": "订单明细中的取消 / 退款记录",
   "owner": "运营导出",
   "status": "pending"
  },
  {
   "key": "margin",
   "name": "边界利润",
   "kind": "subtotal",
   "src": "销售额 − 变动费（自动计算）",
   "owner": "—",
   "status": "derived"
  },
  {
   "key": "salary",
   "name": "个人工资",
   "kind": "minus",
   "src": "合伙人本人工资（单列，不并入固定费）",
   "owner": "顺诚自建",
   "status": "pending"
  },
  {
   "key": "fixed",
   "name": "固定费分摊",
   "kind": "minus",
   "src": "场地 / 工具软件 / 管理费分摊",
   "owner": "顺诚自建",
   "status": "pending"
  },
  {
   "key": "operating",
   "name": "经营利润",
   "kind": "total",
   "src": "边界利润 − 个人工资 − 固定费分摊（自动计算）",
   "owner": "—",
   "status": "derived"
  }
 ],
 "months": [
  {
   "id": "2026-07",
   "label": "2026年7月",
   "naturalDays": 31,
   "coverDays": 24,
   "complete": false,
   "note": "覆盖 24/31 天，非完整月"
  },
  {
   "id": "2026-08",
   "label": "2026年8月",
   "naturalDays": 31,
   "coverDays": 26,
   "complete": false,
   "note": "覆盖 26/31 天，非完整月"
  },
  {
   "id": "2026-09",
   "label": "2026年9月",
   "naturalDays": 30,
   "coverDays": 16,
   "complete": false,
   "note": "覆盖 16/30 天，非完整月"
  }
 ],
 "partners": [
  {
   "id": "liyuan",
   "name": "李源",
   "role": "合伙人 · 管理人",
   "page": "parter-liyuan.html",
   "shops": [
    "唐博宏",
    "姚振朋1",
    "杨晓丰",
    "殷磊",
    "程志恒1",
    "程志恒3",
    "莫雷",
    "袁鹏辉",
    "郭浩洋"
   ],
   "totals": {
    "shops": 9,
    "links": 101092,
    "orders": 920,
    "visits": 94524,
    "conv": 0.97,
    "outPer1000": 9.1,
    "stops": 0,
    "riskDays": 0,
    "unlabeledDays": 0
   },
   "monthly": [
    {
     "month": "2026-07",
     "complete": false,
     "coverDays": 21,
     "shopsWithData": 2,
     "ops": {
      "links": 11122,
      "orders": 111,
      "visits": 9592,
      "conv": 1.16,
      "outPer1000": 10.0,
      "riskDays": 0,
      "unlabeledDays": 0
     },
     "money": {
      "revenue": null,
      "purchase": null,
      "commission": null,
      "shipping": null,
      "ads": null,
      "refund": null,
      "margin": null,
      "salary": null,
      "fixed": null,
      "operating": null
     },
     "status": "pending",
     "blockedBy": "销售额/成本/费用均未接入，本月损益不可计算"
    },
    {
     "month": "2026-08",
     "complete": false,
     "coverDays": 25,
     "shopsWithData": 8,
     "ops": {
      "links": 72481,
      "orders": 508,
      "visits": 47650,
      "conv": 1.07,
      "outPer1000": 7.0,
      "riskDays": 84,
      "unlabeledDays": 0
     },
     "money": {
      "revenue": null,
      "purchase": null,
      "commission": null,
      "shipping": null,
      "ads": null,
      "refund": null,
      "margin": null,
      "salary": null,
      "fixed": null,
      "operating": null
     },
     "status": "pending",
     "blockedBy": "销售额/成本/费用均未接入，本月损益不可计算"
    },
    {
     "month": "2026-09",
     "complete": false,
     "coverDays": 14,
     "shopsWithData": 9,
     "ops": {
      "links": 101092,
      "orders": 301,
      "visits": 37282,
      "conv": 0.81,
      "outPer1000": 3.0,
      "riskDays": 110,
      "unlabeledDays": 0
     },
     "money": {
      "revenue": null,
      "purchase": null,
      "commission": null,
      "shipping": null,
      "ads": null,
      "refund": null,
      "margin": null,
      "salary": null,
      "fixed": null,
      "operating": null
     },
     "status": "pending",
     "blockedBy": "销售额/成本/费用均未接入，本月损益不可计算"
    }
   ],
   "shopMonthly": [
    {
     "shop": "唐博宏",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 35,
     "stops": 0,
     "links": 12765,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 21,
        "riskDays": 3,
        "unlabeledDays": 0,
        "records": 105,
        "links": 9648,
        "orders": 40,
        "visits": 2644,
        "conv": 1.51,
        "ordersPerDay": 1.9,
        "outPer1000": 4.1,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 12765,
        "orders": 29,
        "visits": 3132,
        "conv": 0.93,
        "ordersPerDay": 2.1,
        "outPer1000": 2.3,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "姚振朋1",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 56,
     "stops": 0,
     "links": 8594,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": true,
       "ops": {
        "coverDays": 17,
        "riskDays": 0,
        "unlabeledDays": 0,
        "records": 85,
        "links": 5412,
        "orders": 51,
        "visits": 4181,
        "conv": 1.22,
        "ordersPerDay": 3.0,
        "outPer1000": 9.4,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 25,
        "riskDays": 20,
        "unlabeledDays": 0,
        "records": 130,
        "links": 7148,
        "orders": 110,
        "visits": 8319,
        "conv": 1.32,
        "ordersPerDay": 4.4,
        "outPer1000": 15.4,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 8594,
        "orders": 44,
        "visits": 4601,
        "conv": 0.96,
        "ordersPerDay": 3.1,
        "outPer1000": 5.1,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "杨晓丰",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 39,
     "stops": 0,
     "links": 18056,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 25,
        "riskDays": 7,
        "unlabeledDays": 0,
        "records": 130,
        "links": 11895,
        "orders": 57,
        "visits": 6466,
        "conv": 0.88,
        "ordersPerDay": 2.3,
        "outPer1000": 4.8,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 18056,
        "orders": 55,
        "visits": 6200,
        "conv": 0.89,
        "ordersPerDay": 3.9,
        "outPer1000": 3.0,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "殷磊",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 31,
     "stops": 0,
     "links": 11783,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 17,
        "riskDays": 9,
        "unlabeledDays": 0,
        "records": 85,
        "links": 9390,
        "orders": 24,
        "visits": 3846,
        "conv": 0.62,
        "ordersPerDay": 1.4,
        "outPer1000": 2.6,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 11783,
        "orders": 28,
        "visits": 2719,
        "conv": 1.03,
        "ordersPerDay": 2.0,
        "outPer1000": 2.4,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "程志恒1",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 31,
     "stops": 0,
     "links": 4677,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 17,
        "riskDays": 17,
        "unlabeledDays": 0,
        "records": 85,
        "links": 4120,
        "orders": 30,
        "visits": 2946,
        "conv": 1.02,
        "ordersPerDay": 1.8,
        "outPer1000": 7.3,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 4677,
        "orders": 19,
        "visits": 2095,
        "conv": 0.91,
        "ordersPerDay": 1.4,
        "outPer1000": 4.1,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "程志恒3",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 60,
     "stops": 0,
     "links": 10262,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": true,
       "ops": {
        "coverDays": 21,
        "riskDays": 0,
        "unlabeledDays": 0,
        "records": 105,
        "links": 5710,
        "orders": 60,
        "visits": 5411,
        "conv": 1.11,
        "ordersPerDay": 2.9,
        "outPer1000": 10.5,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 25,
        "riskDays": 24,
        "unlabeledDays": 0,
        "records": 130,
        "links": 9023,
        "orders": 117,
        "visits": 11707,
        "conv": 1.0,
        "ordersPerDay": 4.7,
        "outPer1000": 13.0,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 10262,
        "orders": 57,
        "visits": 5254,
        "conv": 1.08,
        "ordersPerDay": 4.1,
        "outPer1000": 5.6,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "莫雷",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 34,
     "stops": 0,
     "links": 11970,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 4,
        "unlabeledDays": 0,
        "records": 100,
        "links": 10661,
        "orders": 70,
        "visits": 6375,
        "conv": 1.1,
        "ordersPerDay": 3.5,
        "outPer1000": 6.6,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 14,
        "unlabeledDays": 0,
        "records": 85,
        "links": 11970,
        "orders": 18,
        "visits": 5082,
        "conv": 0.35,
        "ordersPerDay": 1.3,
        "outPer1000": 1.5,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "袁鹏辉",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 34,
     "stops": 0,
     "links": 14607,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 0,
        "unlabeledDays": 0,
        "records": 100,
        "links": 10596,
        "orders": 60,
        "visits": 5347,
        "conv": 1.12,
        "ordersPerDay": 3.0,
        "outPer1000": 5.7,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 14,
        "riskDays": 12,
        "unlabeledDays": 0,
        "records": 85,
        "links": 14607,
        "orders": 40,
        "visits": 6639,
        "conv": 0.6,
        "ordersPerDay": 2.9,
        "outPer1000": 2.7,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "郭浩洋",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 13,
     "stops": 0,
     "links": 8378,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 0,
        "records": 75,
        "links": 8378,
        "orders": 11,
        "visits": 1560,
        "conv": 0.71,
        "ordersPerDay": 0.8,
        "outPer1000": 1.3,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    }
   ],
   "bonus": {
    "status": "blocked",
    "reason": "经营利润未接入 → 增量无法计算 → 分红为 0 或不可计算",
    "baseMultiplier": 1.15,
    "ledger": [
     {
      "month": "2026-07",
      "operatingProfit": null,
      "baseLine": null,
      "increment": null,
      "pool": null,
      "personal": null,
      "paid": null,
      "deferred": null,
      "status": "pending"
     },
     {
      "month": "2026-08",
      "operatingProfit": null,
      "baseLine": null,
      "increment": null,
      "pool": null,
      "personal": null,
      "paid": null,
      "deferred": null,
      "status": "pending"
     },
     {
      "month": "2026-09",
      "operatingProfit": null,
      "baseLine": null,
      "increment": null,
      "pool": null,
      "personal": null,
      "paid": null,
      "deferred": null,
      "status": "pending"
     }
    ]
   }
  },
  {
   "id": "shi",
   "name": "石老师",
   "role": "合伙人 · 管理人",
   "page": "parter-shi.html",
   "shops": [
    "侯敏",
    "张玉博1",
    "张玉博2",
    "李彦辉",
    "杨云光",
    "耿亚雄",
    "金卫",
    "陆波波",
    "骆龙华"
   ],
   "totals": {
    "shops": 9,
    "links": 126579,
    "orders": 1883,
    "visits": 111344,
    "conv": 1.69,
    "outPer1000": 14.9,
    "stops": 82,
    "riskDays": 0,
    "unlabeledDays": 0
   },
   "monthly": [
    {
     "month": "2026-07",
     "complete": false,
     "coverDays": 20,
     "shopsWithData": 4,
     "ops": {
      "links": 19266,
      "orders": 106,
      "visits": 9444,
      "conv": 1.12,
      "outPer1000": 5.5,
      "riskDays": 5,
      "unlabeledDays": 7
     },
     "money": {
      "revenue": null,
      "purchase": null,
      "commission": null,
      "shipping": null,
      "ads": null,
      "refund": null,
      "margin": null,
      "salary": null,
      "fixed": null,
      "operating": null
     },
     "status": "pending",
     "blockedBy": "销售额/成本/费用均未接入，本月损益不可计算"
    },
    {
     "month": "2026-08",
     "complete": false,
     "coverDays": 20,
     "shopsWithData": 9,
     "ops": {
      "links": 102604,
      "orders": 759,
      "visits": 59955,
      "conv": 1.27,
      "outPer1000": 7.4,
      "riskDays": 9,
      "unlabeledDays": 69
     },
     "money": {
      "revenue": null,
      "purchase": null,
      "commission": null,
      "shipping": null,
      "ads": null,
      "refund": null,
      "margin": null,
      "salary": null,
      "fixed": null,
      "operating": null
     },
     "status": "pending",
     "blockedBy": "销售额/成本/费用均未接入，本月损益不可计算"
    },
    {
     "month": "2026-09",
     "complete": false,
     "coverDays": 13,
     "shopsWithData": 9,
     "ops": {
      "links": 126579,
      "orders": 1018,
      "visits": 41945,
      "conv": 2.43,
      "outPer1000": 8.0,
      "riskDays": 18,
      "unlabeledDays": 114
     },
     "money": {
      "revenue": null,
      "purchase": null,
      "commission": null,
      "shipping": null,
      "ads": null,
      "refund": null,
      "margin": null,
      "salary": null,
      "fixed": null,
      "operating": null
     },
     "status": "pending",
     "blockedBy": "销售额/成本/费用均未接入，本月损益不可计算"
    }
   ],
   "shopMonthly": [
    {
     "shop": "侯敏",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 26,
     "stops": 8,
     "links": 15491,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 7,
        "records": 80,
        "links": 13096,
        "orders": 48,
        "visits": 6122,
        "conv": 0.78,
        "ordersPerDay": 3.7,
        "outPer1000": 3.7,
        "stops": 8
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 80,
        "links": 15491,
        "orders": 67,
        "visits": 4560,
        "conv": 1.47,
        "ordersPerDay": 5.2,
        "outPer1000": 4.3,
        "stops": 8
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "张玉博1",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 53,
     "stops": 0,
     "links": 9243,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 0,
        "unlabeledDays": 1,
        "records": 130,
        "links": 4366,
        "orders": 31,
        "visits": 3049,
        "conv": 1.02,
        "ordersPerDay": 1.6,
        "outPer1000": 7.1,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 4,
        "unlabeledDays": 7,
        "records": 130,
        "links": 5824,
        "orders": 73,
        "visits": 7328,
        "conv": 1.0,
        "ordersPerDay": 3.6,
        "outPer1000": 12.5,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 80,
        "links": 9243,
        "orders": 47,
        "visits": 5196,
        "conv": 0.9,
        "ordersPerDay": 3.6,
        "outPer1000": 5.1,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "张玉博2",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 53,
     "stops": 13,
     "links": 11063,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 5,
        "unlabeledDays": 5,
        "records": 130,
        "links": 4861,
        "orders": 53,
        "visits": 4208,
        "conv": 1.26,
        "ordersPerDay": 2.6,
        "outPer1000": 10.9,
        "stops": 13
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 5,
        "unlabeledDays": 7,
        "records": 130,
        "links": 5975,
        "orders": 63,
        "visits": 7169,
        "conv": 0.88,
        "ordersPerDay": 3.1,
        "outPer1000": 10.5,
        "stops": 13
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 80,
        "links": 11063,
        "orders": 35,
        "visits": 5154,
        "conv": 0.68,
        "ordersPerDay": 2.7,
        "outPer1000": 3.2,
        "stops": 13
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "李彦辉",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 24,
     "stops": 0,
     "links": 13519,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 11,
        "riskDays": 0,
        "unlabeledDays": 6,
        "records": 70,
        "links": 11815,
        "orders": 247,
        "visits": 5568,
        "conv": 4.44,
        "ordersPerDay": 22.5,
        "outPer1000": 20.9,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 96,
        "links": 13519,
        "orders": 575,
        "visits": 5803,
        "conv": 9.91,
        "ordersPerDay": 44.2,
        "outPer1000": 42.5,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "杨云光",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 26,
     "stops": 0,
     "links": 16714,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 9,
        "records": 80,
        "links": 13842,
        "orders": 84,
        "visits": 9298,
        "conv": 0.9,
        "ordersPerDay": 6.5,
        "outPer1000": 6.1,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 80,
        "links": 16714,
        "orders": 83,
        "visits": 6118,
        "conv": 1.36,
        "ordersPerDay": 6.4,
        "outPer1000": 5.0,
        "stops": 0
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "耿亚雄",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 43,
     "stops": 1,
     "links": 19035,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": true,
       "ops": {
        "coverDays": 10,
        "riskDays": 0,
        "unlabeledDays": 0,
        "records": 55,
        "links": 4733,
        "orders": 8,
        "visits": 705,
        "conv": 1.13,
        "ordersPerDay": 0.8,
        "outPer1000": 1.7,
        "stops": 1
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 0,
        "unlabeledDays": 2,
        "records": 130,
        "links": 15542,
        "orders": 68,
        "visits": 6949,
        "conv": 0.98,
        "ordersPerDay": 3.4,
        "outPer1000": 4.4,
        "stops": 1
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 80,
        "links": 19035,
        "orders": 85,
        "visits": 4543,
        "conv": 1.87,
        "ordersPerDay": 6.5,
        "outPer1000": 4.5,
        "stops": 1
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "金卫",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 26,
     "stops": 10,
     "links": 13743,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 7,
        "records": 80,
        "links": 11066,
        "orders": 44,
        "visits": 4004,
        "conv": 1.1,
        "ordersPerDay": 3.4,
        "outPer1000": 4.0,
        "stops": 10
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 7,
        "unlabeledDays": 13,
        "records": 80,
        "links": 13743,
        "orders": 43,
        "visits": 3535,
        "conv": 1.22,
        "ordersPerDay": 3.3,
        "outPer1000": 3.1,
        "stops": 10
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "陆波波",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 26,
     "stops": 43,
     "links": 10011,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": false,
       "ops": null,
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 12,
        "records": 80,
        "links": 9043,
        "orders": 30,
        "visits": 3111,
        "conv": 0.96,
        "ordersPerDay": 2.3,
        "outPer1000": 3.3,
        "stops": 43
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 11,
        "unlabeledDays": 10,
        "records": 80,
        "links": 10011,
        "orders": 20,
        "visits": 1563,
        "conv": 1.28,
        "ordersPerDay": 1.5,
        "outPer1000": 2.0,
        "stops": 43
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    },
    {
     "shop": "骆龙华",
     "sites": [
      "哥伦比亚",
      "墨西哥",
      "巴西",
      "智利",
      "阿根廷"
     ],
     "coverDays": 43,
     "stops": 7,
     "links": 17760,
     "cells": [
      {
       "month": "2026-07",
       "hasOps": true,
       "ops": {
        "coverDays": 10,
        "riskDays": 0,
        "unlabeledDays": 1,
        "records": 56,
        "links": 5306,
        "orders": 14,
        "visits": 1482,
        "conv": 0.94,
        "ordersPerDay": 1.4,
        "outPer1000": 2.6,
        "stops": 7
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-08",
       "hasOps": true,
       "ops": {
        "coverDays": 20,
        "riskDays": 0,
        "unlabeledDays": 12,
        "records": 130,
        "links": 16401,
        "orders": 102,
        "visits": 10406,
        "conv": 0.98,
        "ordersPerDay": 5.1,
        "outPer1000": 6.2,
        "stops": 7
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      },
      {
       "month": "2026-09",
       "hasOps": true,
       "ops": {
        "coverDays": 13,
        "riskDays": 0,
        "unlabeledDays": 13,
        "records": 80,
        "links": 17760,
        "orders": 63,
        "visits": 5473,
        "conv": 1.15,
        "ordersPerDay": 4.8,
        "outPer1000": 3.5,
        "stops": 7
       },
       "money": {
        "revenue": null,
        "purchase": null,
        "commission": null,
        "shipping": null,
        "ads": null,
        "refund": null,
        "margin": null,
        "salary": null,
        "fixed": null,
        "operating": null
       },
       "status": "pending"
      }
     ]
    }
   ],
   "bonus": {
    "status": "blocked",
    "reason": "经营利润未接入 → 增量无法计算 → 分红为 0 或不可计算",
    "baseMultiplier": 1.15,
    "ledger": [
     {
      "month": "2026-07",
      "operatingProfit": null,
      "baseLine": null,
      "increment": null,
      "pool": null,
      "personal": null,
      "paid": null,
      "deferred": null,
      "status": "pending"
     },
     {
      "month": "2026-08",
      "operatingProfit": null,
      "baseLine": null,
      "increment": null,
      "pool": null,
      "personal": null,
      "paid": null,
      "deferred": null,
      "status": "pending"
     },
     {
      "month": "2026-09",
      "operatingProfit": null,
      "baseLine": null,
      "increment": null,
      "pool": null,
      "personal": null,
      "paid": null,
      "deferred": null,
      "status": "pending"
     }
    ]
   }
  }
 ],
 "rule": {
  "base": {
   "type": "actual_x_multiplier",
   "multiplier": 1.15,
   "formula": "分红基准线 = 基期实际经营利润 × 1.15",
   "desc": "超出基准线的部分才算增量，才进分红池",
   "status": "倍数已确认 · 基数待定",
   "source": "老周 2026-09-20 定 ×1.15",
   "open": "×1.15 的基数必须取【基期】（上月 / 前 3 月均值 / 锁定某月）。若取本期实际利润，则「本期 − 本期×1.15」恒为负数，分红永远为 0，机制空转。这一条落地前必须定死。"
  },
  "chain": [
   "本期经营利润 − 分红基准线 = 增量利润（负数记 0）",
   "增量利润 × 分配比例 = 分红池",
   "分红池 × 个人系数 = 个人分红",
   "个人分红 × 70% 当期发放 + 30% 年终递延"
  ],
  "tiers": [
   {
    "from": 0,
    "to": 500000,
    "rate": 0.15,
    "label": "增量 0 ~ 50 万"
   },
   {
    "from": 500000,
    "to": 1500000,
    "rate": 0.2,
    "label": "增量 50 ~ 150 万"
   },
   {
    "from": 1500000,
    "to": null,
    "rate": 0.25,
    "label": "增量 150 万以上"
   }
  ],
  "tiersNote": "阶梯为参考值，非最终口径 —— 待老周确认；规则页参数面板可调",
  "tiersStatus": "待确认",
  "deferral": {
   "current": 0.7,
   "yearEnd": 0.3,
   "note": "参考值，待确认"
  },
  "gates": [
   {
    "no": 1,
    "name": "门槛线",
    "rule": "本期经营利润低于基准线 → 不分红（增量记 0）",
    "why": "防止亏损月份也在讨论分红",
    "status": "建议"
   },
   {
    "no": 2,
    "name": "质量闸门",
    "rule": "当月出现封店 / 强制下架 / 严重侵权投诉 → 当月分红打折或清零",
    "why": "只看利润会诱导「违规冲量换分红」，而封店是顺诚最大风险",
    "status": "建议"
   },
   {
    "no": 3,
    "name": "封顶线",
    "rule": "单人单月分红设上限（上限口径待定）",
    "why": "防止数据异常月份产生天价分红（底座里已有出单口径异常的店）",
    "status": "建议"
   },
   {
    "no": 4,
    "name": "亏损结转",
    "rule": "上月亏损先补平，才算增量",
    "why": "防止把「填坑」误当成「增量」发出去",
    "status": "建议"
   }
  ],
  "gateNote": "「质量闸门」建议挂「封店 / 强制下架」这类硬后果，不要挂「风险率」——底座里李源色级风险率 21.2% 而封停 0 次、石老师 5.0% 而封停 82 次，本身说明风险记录与真实后果是两回事。"
 },
 "gaps": [
  {
   "item": "销售额",
   "tier": "变动费",
   "from": "美客多后台 · 订单明细（Ventas）",
   "owner": "顺诚运营",
   "status": "待导",
   "impact": "边界利润的起点，缺它全表为空"
  },
  {
   "item": "采购成本",
   "tier": "变动费",
   "from": "SKU 采购成本表",
   "owner": "顺诚采购",
   "status": "待建",
   "impact": "变动费最大项，必须自建"
  },
  {
   "item": "平台佣金",
   "tier": "变动费",
   "from": "美客多后台 · 结算单",
   "owner": "顺诚运营",
   "status": "待导",
   "impact": "通常按类目费率结算"
  },
  {
   "item": "物流运费",
   "tier": "变动费",
   "from": "物流商账单 / 后台物流费用",
   "owner": "顺诚运营",
   "status": "待导",
   "impact": "头程 + 尾程"
  },
  {
   "item": "广告费",
   "tier": "变动费",
   "from": "美客多后台 · 广告报表",
   "owner": "顺诚运营",
   "status": "待导",
   "impact": "配合 ACOS 看投放效率"
  },
  {
   "item": "退款损失",
   "tier": "变动费",
   "from": "订单明细中的取消 / 退款",
   "owner": "顺诚运营",
   "status": "待导",
   "impact": "底座里已有「取消订单数」可交叉验证"
  },
  {
   "item": "个人工资",
   "tier": "固定费",
   "from": "合伙人本人工资",
   "owner": "顺诚自建",
   "status": "待建",
   "impact": "老周要求单列，并入固定费会失真"
  },
  {
   "item": "固定费分摊",
   "tier": "固定费",
   "from": "场地 / 工具 / 管理费分摊",
   "owner": "顺诚自建",
   "status": "待建",
   "impact": "分摊口径需先定规则"
  }
 ]
};
