export function formatMoney(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return `$${numeric.toFixed(2)}`;
  }
  return `${value}`;
}

export function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}
