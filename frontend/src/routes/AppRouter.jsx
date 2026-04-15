import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";


import DashboardPage from "../pages/DashboardPage";
import ProdukPage from "../pages/ProdukPage";
import SupplierPage from "../pages/SupplierPage";
import StokBatchPage from "../pages/StokBatchPage";
import PembelianPage from "../pages/PembelianPage";
import TambahFakturPage from "../pages/TambahFakturPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/produk" element={<ProdukPage />} />
          <Route path="/supplier" element={<SupplierPage />} />
          <Route path="/stok-batch" element={<StokBatchPage />} />
          <Route path="/pembelian" element={<PembelianPage />} />
          <Route path="/pembelian/tambah" element={<TambahFakturPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default AppRouter;