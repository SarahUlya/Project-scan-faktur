export const getStokFromBatches = (batches = []) =>
  (batches || []).reduce(
    (sum, b) => sum + Number(b.stok ?? b.qty_sisa ?? 0),
    0
  );

export const getStokProduk = async (produkId, apiBatches = []) => {
  return getStokFromBatches(apiBatches);
};


