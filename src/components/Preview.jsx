import React from "react";
import SummaryPage from "./SummaryPage.jsx";
import CustomerPage from "./CustomerPage.jsx";

export default function Preview({ result }) {
  return (
    <div className="print-root">
      <div className="print-page">
        <SummaryPage result={result} />
      </div>

      {result.customers.map((c) => (
        <div key={c.customerId} className="print-page print-break-before">
          <CustomerPage customer={c} generatedAt={result.generatedAt} />
        </div>
      ))}
    </div>
  );
}
