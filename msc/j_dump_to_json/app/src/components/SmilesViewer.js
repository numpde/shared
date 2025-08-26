function SmilesViewer({ data }) {
  const entries = Object.entries(data);

  return (
    <div className="tables">
      {entries.map(([parentSmiles, entry]) => {
        const rows = normalizeEntryToRecords(entry);
        if (!rows.length) return null;

        const allCols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
        const metaKeys = allCols.filter((k) => {
          const v0 = rows[0][k];
          return rows.every((r) => r[k] === v0);
        });
        const meta = Object.fromEntries(metaKeys.map((k) => [k, rows[0][k]]));
        const rowCols = allCols.filter((c) => !metaKeys.includes(c));

        const rowPriority = ["can_smiles", "is_exact", "is_isomer", "is_sum_ok", "is_valid", "score"];
        rowCols.sort((a, b) => {
          const ia = rowPriority.indexOf(a);
          const ib = rowPriority.indexOf(b);
          if (ia !== -1 && ib !== -1) return ia - ib;
          if (ia !== -1) return -1;
          if (ib !== -1) return 1;
          return a.localeCompare(b);
        });

        return (
          <details key={parentSmiles} className="card" open>
            <summary className="card__summary">
              <span className="parent">
                <span className="parent__value">
                  <a
                    href={`https://numpde.github.io/kemukle/show.html?smiles=${encodeURIComponent(parentSmiles)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-plain"
                  >
                    {parentSmiles}
                  </a>
                </span>
              </span>
              <span className="count">{rows.length} predictions</span>
            </summary>

            {metaKeys.length > 0 && (
              <div className="meta">
                {metaKeys.map((k) => (
                  <div key={k} className="meta__item">
                    <div className="meta__key">{k}</div>
                    <div className="meta__val mono">
                      {k === "nmr_data"
                        ? <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{String(meta[k])}</pre>
                        : (typeof meta[k] === "number"
                            ? trimZeros(meta[k].toFixed(6))
                            : String(meta[k]))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    {rowCols.map((c) => (
                      <th key={c} className="th">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 ? "tr tr--odd" : "tr"}>
                      {rowCols.map((c) => {
                        const val = row[c];

                        if (c === "can_smiles") {
                          const exact = isExact(row["is_exact"]);
                          const cls = exact ? "badge badge--ok" : "badge badge--warn";
                          return (
                            <td key={c} className="td">
                              <a
                                href={`https://numpde.github.io/kemukle/show.html?smiles=${encodeURIComponent(val)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`link-plain ${cls}`}
                              >
                                {String(val)}
                              </a>
                            </td>
                          );
                        }

                        return (
                          <td key={c} className="td">
                            <span className="mono">
                              {val === undefined || val === null
                                ? ""
                                : typeof val === "number"
                                  ? trimZeros(val.toFixed(6))
                                  : String(val)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        );
      })}
    </div>
  );
}
