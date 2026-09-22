/* ══════════════════════════════════════════════════════════════════
 * FILTER — Tanggal
 * ══════════════════════════════════════════════════════════════════ */
export const filterByDateRange = (
  list,
  startDate,
  endDate,
  dateField = "tanggal_transaksi"
) => {
  let result = [...list];

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    result = result.filter(
      (t) => new Date(t[dateField] || t.created_at) >= start
    );
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    result = result.filter(
      (t) => new Date(t[dateField] || t.created_at) <= end
    );
  }

  return result;
};

/* ══════════════════════════════════════════════════════════════════
 * FILTER — Search
 * ══════════════════════════════════════════════════════════════════ */
export const filterBySearch = (list, search) => {
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter((row) => {
    const idMatch = String(row.no_transaksi || "")
      .toLowerCase()
      .includes(q);
    const kasirMatch = String(row.user?.nama || row.kasir?.nama || "")
      .toLowerCase()
      .includes(q);
    return idMatch || kasirMatch;
  });
};

/* ══════════════════════════════════════════════════════════════════
 * SORT
 * ══════════════════════════════════════════════════════════════════ */
export const sortByDate = (
  list,
  sortOrder = "terbaru",
  dateField = "tanggal_transaksi"
) => {
  return [...list].sort((a, b) => {
    const dA = new Date(a[dateField] || a.created_at);
    const dB = new Date(b[dateField] || b.created_at);
    return sortOrder === "terbaru" ? dB - dA : dA - dB;
  });
};

/* ══════════════════════════════════════════════════════════════════
 * COMPOSE — apply semua filter + search + sort sekaligus
 * ══════════════════════════════════════════════════════════════════ */
export const applyTransaksiFilters = (
  list,
  { startDate, endDate, search, sortOrder }
) => {
  let result = filterByDateRange(list, startDate, endDate);
  result = filterBySearch(result, search);
  result = sortByDate(result, sortOrder);
  return result;
};