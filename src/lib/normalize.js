export function normalizeString(s) {
  return String(s ?? "").trim();
}

export function normalizeHeaderKey(s) {
  return normalizeString(s).replace(/\s+/g, " ");
}

export function parseMoney(value) {
  const raw = normalizeString(value);
  if (!raw) return 0;

  const cleaned = raw.replace(/[^0-9.\-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function extractNumericSuffix(id) {
  const s = normalizeString(id);
  const m = s.match(/(\d+)\s*$/);
  return m ? Number(m[1]) : Number.NaN;
}
