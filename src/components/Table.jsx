import { useMemo, useState } from "react";

const PAGE_SIZE = 15;

function Table({ data = [], columns = [], emptyMessage = "No records found." }) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  if (!data.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={sortKey === col.key ? "sorted" : ""}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.id || `${row.customer_id || "r"}-${safePage}-${idx}`}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="table-pagination">
          <span>{sorted.length} records — page {safePage + 1} of {totalPages}</span>
          <div className="table-pagination-buttons">
            <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Prev</button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let p = i;
              if (totalPages > 5) {
                p = Math.max(0, Math.min(safePage - 2, totalPages - 5)) + i;
              }
              return (
                <button key={p} className={p === safePage ? "active" : ""} onClick={() => setPage(p)}>
                  {p + 1}
                </button>
              );
            })}
            <button disabled={safePage >= totalPages - 1} onClick={() => setPage(safePage + 1)}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
