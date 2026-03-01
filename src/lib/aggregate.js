import { normalizeString, parseMoney, extractNumericSuffix } from "./normalize.js";

export const REQUIRED_SALES_HEADERS = [
  "客戶編號",
  "客戶姓名",
  "銷貨單編號",
  "付款編號",
  "付款金額",
  "出貨日期",
  "付款備註",
];

export const REQUIRED_RMA_HEADERS = [
  "客戶編號",
  "客戶姓名",
  "退換貨單號",
  "退換貨金額合計",
  "退換貨單備註",
];

// Field mapping（若 Excel header 名稱完全一致，這裡不用改）
const FIELDS = {
  sales: {
    customerId: "客戶編號",
    customerName: "客戶姓名",
    soNo: "銷貨單編號",
    payNo: "付款編號",
    payAmount: "付款金額",
    shipDate: "出貨日期",
    payRemark: "付款備註",
  },
  rma: {
    customerId: "客戶編號",
    customerName: "客戶姓名",
    rmaNo: "退換貨單號",
    rmaAmount: "退換貨金額合計",
    rmaRemark: "退換貨單備註",
  },
};

function pick(row, key) {
  return normalizeString(row[key]);
}

export function aggregateData(salesRows, rmaRows) {
  const map = new Map();

  // Sales
  for (const r of salesRows) {
    const cid = pick(r, FIELDS.sales.customerId);
    if (!cid) continue;

    const cname = pick(r, FIELDS.sales.customerName);

    const rec = map.get(cid) || {
      customerId: cid,
      customerName: cname,
      sales: [],
      rmas: [],
    };

    rec.customerName = rec.customerName || cname;

    rec.sales.push({
      soNo: pick(r, FIELDS.sales.soNo),
      payNo: pick(r, FIELDS.sales.payNo),
      shipDate: pick(r, FIELDS.sales.shipDate),
      payAmount: parseMoney(pick(r, FIELDS.sales.payAmount)),
      payRemark: pick(r, FIELDS.sales.payRemark),
    });

    map.set(cid, rec);
  }

  // RMA
  for (const r of rmaRows) {
    const cid = pick(r, FIELDS.rma.customerId);
    if (!cid) continue;

    const cname = pick(r, FIELDS.rma.customerName);

    const rec = map.get(cid) || {
      customerId: cid,
      customerName: cname,
      sales: [],
      rmas: [],
    };

    rec.customerName = rec.customerName || cname;

    rec.rmas.push({
      rmaNo: pick(r, FIELDS.rma.rmaNo),
      rmaAmount: parseMoney(pick(r, FIELDS.rma.rmaAmount)), // 你確認永遠正數
      rmaRemark: pick(r, FIELDS.rma.rmaRemark),
    });

    map.set(cid, rec);
  }

  // Sort customers by numeric suffix: C0000001 -> 1
  const customers = Array.from(map.values()).sort((a, b) => {
    const na = extractNumericSuffix(a.customerId);
    const nb = extractNumericSuffix(b.customerId);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
    return a.customerId.localeCompare(b.customerId);
  });

  for (const c of customers) {
    // Sort sales by numeric suffix: SO-20260226-0016 -> 16
    c.sales.sort((a, b) => {
      const na = extractNumericSuffix(a.soNo);
      const nb = extractNumericSuffix(b.soNo);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return a.soNo.localeCompare(b.soNo);
    });

    // Sort rmas by numeric suffix: RMA-20260225-002 -> 2
    c.rmas.sort((a, b) => {
      const na = extractNumericSuffix(a.rmaNo);
      const nb = extractNumericSuffix(b.rmaNo);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return a.rmaNo.localeCompare(b.rmaNo);
    });

    c.subtotalA = c.sales.reduce((sum, x) => sum + (x.payAmount || 0), 0);
    c.subtotalB = c.rmas.reduce((sum, x) => sum + (x.rmaAmount || 0), 0);
    c.net = c.subtotalA - c.subtotalB;
  }

  const grandTotal = customers.reduce((sum, c) => sum + (c.net || 0), 0);
  return { customers, grandTotal };
}