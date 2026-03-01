import React, { useMemo } from "react";
import Money from "./Money.jsx";

function fmtDateTime(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}/${String(dt.getMonth() + 1).padStart(2, "0")}/${String(dt.getDate()).padStart(2, "0")} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

export default function CustomerPage({ customer, generatedAt }) {
  const created = useMemo(() => fmtDateTime(generatedAt), [generatedAt]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold">客戶請款明細</div>
          <div className="text-sm text-slate-700 mt-2">
            客戶：<span className="font-semibold">{customer.customerId}</span> / {customer.customerName}
          </div>
          <div className="text-xs text-slate-500 mt-1">製表時間：{created}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Net（A - B）</div>
          <div className="text-2xl font-extrabold">
            <Money value={customer.net} />
          </div>
        </div>
      </div>

      {/* Sales table */}
      <div className="mt-6">
        <div className="font-semibold">銷貨單付款明細</div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 border border-slate-200">銷貨單編號</th>
                <th className="text-left p-2 border border-slate-200">付款編號</th>
                <th className="text-left p-2 border border-slate-200">出貨日期</th>
                <th className="text-right p-2 border border-slate-200">付款金額</th>
                <th className="text-left p-2 border border-slate-200">付款備註</th>
              </tr>
            </thead>
            <tbody>
              {customer.sales.length === 0 ? (
                <tr>
                  <td className="p-2 border border-slate-200 text-slate-500" colSpan={5}>
                    本期無銷貨付款明細
                  </td>
                </tr>
              ) : (
                customer.sales.map((row, idx) => {
                  const prev = customer.sales[idx - 1];
                  const sameSoConsecutive = prev && prev.soNo === row.soNo;
                  const hideSo = sameSoConsecutive;     // 連續相同才隱藏
                  const hideShipDate = sameSoConsecutive;

                  return (
                    <tr key={`${row.soNo}-${row.payNo}-${idx}`}>
                      <td className="p-2 border border-slate-200">{hideSo ? "" : row.soNo}</td>
                      <td className="p-2 border border-slate-200">{row.payNo}</td>
                      <td className="p-2 border border-slate-200">{hideShipDate ? "" : row.shipDate}</td>
                      <td className="p-2 border border-slate-200 text-right">
                        <Money value={row.payAmount} />
                      </td>
                      <td className="p-2 border border-slate-200">{row.payRemark}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td className="p-2 border border-slate-200 font-semibold" colSpan={3}>
                  Subtotal A（付款）
                </td>
                <td className="p-2 border border-slate-200 text-right font-semibold">
                  <Money value={customer.subtotalA} />
                </td>
                <td className="p-2 border border-slate-200"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* RMA table */}
      <div className="mt-6">
        <div className="font-semibold">銷退單</div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left p-2 border border-slate-200">退換貨單號</th>
                <th className="text-right p-2 border border-slate-200">退換貨金額合計</th>
                <th className="text-left p-2 border border-slate-200">退換貨單備註</th>
              </tr>
            </thead>
            <tbody>
              {customer.rmas.length === 0 ? (
                <tr>
                  <td className="p-2 border border-slate-200 text-slate-500" colSpan={3}>
                    本期無銷退單
                  </td>
                </tr>
              ) : (
                customer.rmas.map((row, idx) => (
                  <tr key={`${row.rmaNo}-${idx}`}>
                    <td className="p-2 border border-slate-200">{row.rmaNo}</td>
                    <td className="p-2 border border-slate-200 text-right">
                      <Money value={row.rmaAmount} />
                    </td>
                    <td className="p-2 border border-slate-200">{row.rmaRemark}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td className="p-2 border border-slate-200 font-semibold">
                  Subtotal B（退換貨）
                </td>
                <td className="p-2 border border-slate-200 text-right font-semibold">
                  <Money value={customer.subtotalB} />
                </td>
                <td className="p-2 border border-slate-200"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Net summary */}
      <div className="mt-6 flex items-center justify-end">
        <div className="w-full max-w-md border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-slate-50">
            <div className="text-sm font-semibold">Net（A - B）</div>
            <div className="text-lg font-extrabold">
              <Money value={customer.net} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}