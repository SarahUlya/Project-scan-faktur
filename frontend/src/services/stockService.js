const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const isBatchExpired = (expiredDate) => {
  if (!expiredDate) return false;
  const exp = new Date(expiredDate);
  if (Number.isNaN(exp.getTime())) return false;
  exp.setHours(0, 0, 0, 0);
  return exp < startOfToday();
};

export const filterActiveBatches = (batches = []) =>
  (batches || []).filter((b) => !isBatchExpired(b.expired_date ?? b.expired));

export const getStokFromBatches = (batches = []) =>
  filterActiveBatches(batches).reduce(
    (sum, b) => sum + Number(b.stok ?? b.qty_sisa ?? 0),
    0
  );

export const getStokProduk = async (_produkId, apiBatches = []) =>
  getStokFromBatches(apiBatches);

export const getNearExpiredBatches = (batches = [], withinDays = 30) => {
  const today = startOfToday();
  const limit = new Date(today);
  limit.setDate(limit.getDate() + withinDays);

  return filterActiveBatches(batches).filter((b) => {
    const expRaw = b.expired_date ?? b.expired;
    if (!expRaw) return false;
    const exp = new Date(expRaw);
    if (Number.isNaN(exp.getTime())) return false;
    exp.setHours(0, 0, 0, 0);
    return exp >= today && exp <= limit;
  });
};

export const countNearExpiredProducts = (produkList = [], withinDays = 30) =>
  produkList.filter((p) => {
    const batches = p.batch || p.batchproduk || [];
    return getNearExpiredBatches(batches, withinDays).length > 0;
  }).length;

export const countLowStockProducts = (produkList = [], threshold = 10) =>
  produkList.filter((p) => {
    const batches = p.batch || p.batchproduk || [];
    const stok = getStokFromBatches(batches);
    return stok > 0 && stok <= threshold;
  }).length;


