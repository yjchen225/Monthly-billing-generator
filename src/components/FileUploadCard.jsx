import React from "react";

export default function FileUploadCard({ title, hint, file, onChange, accept }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-slate-500 mt-1">{hint}</div>
        </div>
        {file && (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            已選擇
          </span>
        )}
      </div>

      <div className="mt-3">
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white hover:file:bg-slate-800"
        />
      </div>

      {file && (
        <div className="mt-3 text-sm text-slate-700">
          <div className="truncate">檔名：{file.name}</div>
          <div className="text-xs text-slate-500">大小：{Math.round(file.size / 1024)} KB</div>
        </div>
      )}
    </div>
  );
}
