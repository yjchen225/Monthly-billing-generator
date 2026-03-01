import * as XLSX from "xlsx";
import { normalizeHeaderKey, normalizeString } from "./normalize.js";

/**
 * Read first sheet, header at row 1
 * Returns: { rows: object[], headers: string[], sheetName: string }
 */
export async function readFirstSheet(file) {
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: "array" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(ws, {
    defval: "",
    raw: false
  });

  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
  const headerRowIndex = range.s.r; // 0-based
  const headers = [];
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: headerRowIndex, c });
    const cell = ws[addr];
    const v = cell ? String(cell.v) : "";
    if (v !== "") headers.push(normalizeString(v));
  }

  return { rows, headers, sheetName };
}

export function validateHeaders(actualHeaders, requiredHeaders) {
  const actualSet = new Set(actualHeaders.map(normalizeHeaderKey));
  const missing = requiredHeaders.filter(h => !actualSet.has(normalizeHeaderKey(h)));
  return { ok: missing.length === 0, missing };
}
