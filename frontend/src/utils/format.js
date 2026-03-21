export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "Sin dato";
  return new Intl.NumberFormat("es-AR").format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "Sin dato";
  return `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(value)}%`;
}

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "Sin dato";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
