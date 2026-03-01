import React from "react";

export default function Alerts({ errors }) {
  if (!errors?.length) return null;
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
      <div className="font-semibold text-rose-700">資料驗證失敗</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-rose-700 space-y-1">
        {errors.map((e, i) => <li key={i}>{e}</li>)}
      </ul>
    </div>
  );
}
