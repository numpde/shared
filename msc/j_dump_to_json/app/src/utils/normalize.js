// Robustly normalize an entry to a list of row records.
// Supports:
//   A) { nmr_data, ..., predictions: [ {...}, {...} ] }
//   B) [ {...}, {...} ]  (already records)
//   C) { col: {i: val}, ... }  (columnar)
function normalizeEntryToRecords(entry) {
  if (!entry) return [];
  if (Array.isArray(entry)) return entry;

  if (Array.isArray(entry.predictions)) {
    const meta = Object.fromEntries(
      Object.entries(entry).filter(([k]) => k !== "predictions")
    );
    return entry.predictions.map((pred) => ({ ...meta, ...pred }));
  }

  if (typeof entry === "object") {
    const keys = Object.keys(entry);
    const len = Math.max(
      0,
      ...keys.map((k) =>
        entry[k] && typeof entry[k] === "object" ? Object.keys(entry[k]).length : 0
      )
    );
    const rows = [];
    for (let i = 0; i < len; i++) {
      const row = {};
      for (const k of keys) {
        const col = entry[k];
        row[k] = col && typeof col === "object" ? col[i] : undefined;
      }
      rows.push(row);
    }
    return rows;
  }

  return [];
}

function isExact(v) {
  if (v === true) return true;
  const n = Number(v);
  if (Number.isFinite(n)) return n >= 1;
  return String(v).toLowerCase() === "true";
}

function trimZeros(s) {
  return s.replace(/\.0+$/, "").replace(/(\.\d*?[1-9])0+$/, "$1");
}
