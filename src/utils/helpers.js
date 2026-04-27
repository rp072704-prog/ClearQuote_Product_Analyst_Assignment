export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export function formatPercent(value, digits = 1) {
  return `${((value || 0) * 100).toFixed(digits)}%`;
}

export function average(values) {
  const filtered = values.filter((value) => Number.isFinite(value));
  if (!filtered.length) return 0;
  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
}

export function statusClass(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function compactMonth(value) {
  const [year, month] = String(value).split("-");
  return `${month}/${year.slice(2)}`;
}

export function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const groupKey = typeof key === "function" ? key(item) : item[key];
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}
