import React, { useMemo, useState } from "react";
import FileUploadCard from "./components/FileUploadCard.jsx";
import Preview from "./components/Preview.jsx";
import Alerts from "./components/Alerts.jsx";
import { readFirstSheet, validateHeaders } from "./lib/excel.js";
import { aggregateData, REQUIRED_RMA_HEADERS, REQUIRED_SALES_HEADERS } from "./lib/aggregate.js";

export default function App() {
  const [salesFile, setSalesFile] = useState(null);
  const [rmaFile, setRmaFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);

  const canGenerate = useMemo(() => !!salesFile && !!rmaFile && !loading, [salesFile, rmaFile, loading]);

  async function onGenerate() {
    setErrors([]);
    setResult(null);
    setLoading(true);

    try {
      const sales = await readFirstSheet(salesFile);
      const rma = await readFirstSheet(rmaFile);

      const v1 = validateHeaders(sales.headers, REQUIRED_SALES_HEADERS);
      const v2 = validateHeaders(rma.headers, REQUIRED_RMA_HEADERS);

      const nextErrors = [];
      if (!v1.ok) nextErrors.push(`「銷貨單付款明細」缺少欄位：${v1.missing.join(", ")}`);
      if (!v2.ok) nextErrors.push(`「退換貨單」缺少欄位：${v2.missing.join(", ")}`);

      if (nextErrors.length) {
        setErrors(nextErrors);
        return;
      }

      const aggregated = aggregateData(sales.rows, rma.rows);

      setResult({
        generatedAt: new Date(),
        salesSheetName: sales.sheetName,
        rmaSheetName: rma.sheetName,
        ...aggregated
      });
    } catch (e) {
      setErrors([`讀取檔案失敗：${e?.message || String(e)}`]);
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setSalesFile(null);
    setRmaFile(null);
    setErrors([]);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="no-print sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Monthly Billing Generator</div>
            <div className="text-xs text-slate-500">上傳兩份 Excel → 生成摘要與客戶明細 → A4 列印</div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm disabled:opacity-40"
              onClick={onGenerate}
              disabled={!canGenerate}
            >
              {loading ? "生成中…" : "生成預覽"}
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
              onClick={onReset}
              disabled={loading}
            >
              重設
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm disabled:opacity-40"
              onClick={() => window.print()}
              disabled={!result}
            >
              列印 / 存成 PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadCard
            title="銷貨單付款明細"
            hint="固定讀取第1個工作表、表頭在第1列"
            file={salesFile}
            onChange={setSalesFile}
            accept=".xlsx,.xls"
          />
          <FileUploadCard
            title="退換貨單"
            hint="固定讀取第1個工作表、表頭在第1列"
            file={rmaFile}
            onChange={setRmaFile}
            accept=".xlsx,.xls"
          />
        </div>

        <div className="no-print mt-4">
          <Alerts errors={errors} />
        </div>

        {result && (
          <div className="mt-6">
            <Preview result={result} />
          </div>
        )}

        {!result && (
          <div className="no-print mt-8 text-sm text-slate-600">
            1) 上傳兩份 Excel（銷貨單付款明細 / 退換貨單）<br />
            2) 點「生成預覽」檢查資料是否正確<br />
            3) 點「列印 / 存成 PDF」輸出 A4
          </div>
        )}
      </main>
    </div>
  );
}
