import React from "react";
import Money from "./Money.jsx";

export default function SummaryPage({ result }) {
  const dt = new Date(result.generatedAt);
  const created = `${dt.getFullYear()}/${String(dt.getMonth()+1).padStart(2,"0")}/${String(dt.getDate()).padStart(2,"0")} ${String(dt.getHours()).padStart(2,"0")}:${String(dt.getMinutes()).padStart(2,"0")}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:shadow-none print:border-slate-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-bold">月結請款單總表（摘要）</div>
          <div className="text-sm text-slate-600 mt-2">製表時間：{created}</div>
          <div className="text-xs text-slate-500 mt-1">
            來源工作表：銷貨單付款明細「{result.salesSheetName}」 / 退換貨單「{result.rmaSheetName}」
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">本期請款總金額 (Grand Total)</div>
          <div className="text-3xl font-extrabold mt-1">
            <Money value={result.grandTotal} />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-2 border border-slate-200">客戶編號</th>
              <th className="text-left p-2 border border-slate-200">客戶姓名</th>
              <th className="text-right p-2 border border-slate-200">Subtotal A（付款）</th>
              <th className="text-right p-2 border border-slate-200">Subtotal B（退換貨）</th>
              <th className="text-right p-2 border border-slate-200">Net（A - B）</th>
            </tr>
          </thead>
          <tbody>
            {result.customers.map((c) => (
              <tr key={c.customerId}>
                <td className="p-2 border border-slate-200">{c.customerId}</td>
                <td className="p-2 border border-slate-200">{c.customerName}</td>
                <td className="p-2 border border-slate-200 text-right"><Money value={c.subtotalA} /></td>
                <td className="p-2 border border-slate-200 text-right"><Money value={c.subtotalB} /></td>
                <td className="p-2 border border-slate-200 text-right font-semibold"><Money value={c.net} /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50">
              <td className="p-2 border border-slate-200 font-semibold" colSpan={4}>Grand Total</td>
              <td className="p-2 border border-slate-200 text-right font-extrabold"><Money value={result.grandTotal} /></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="no-print mt-4 text-xs text-slate-500">
        提示：列印時會自動套用 A4 排版，每位客戶固定換頁。
      </div>
    </div>
  );
}
