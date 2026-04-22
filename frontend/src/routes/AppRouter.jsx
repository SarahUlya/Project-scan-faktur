import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";


import DashboardPage from "../pages/DashboardPage";
import ProdukPage from "../pages/ProdukPage";
import SupplierPage from "../pages/SupplierPage";
import StokBatchPage from "../pages/StokBatchPage";
import PembelianPage from "../pages/PembelianPage";
import TambahFakturPage from "../pages/TambahFakturPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { ROLE } from "../auth/auth";
import Unauthorized from "../pages/Unauthorized";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.STAFF, ROLE.KASIR]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/produk" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            <ProdukPage />
          </ProtectedRoute>
        } />
        <Route path="/supplier" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            <SupplierPage />
          </ProtectedRoute>
        } />
        <Route path="/stok-batch" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
            <StokBatchPage />
          </ProtectedRoute>
        } />
        <Route path="/pembelian" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <PembelianPage />
          </ProtectedRoute>
        } />
        <Route path="/pembelian/tambah" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <TambahFakturPage />
          </ProtectedRoute>
        } />
      
      </Route>
      </Routes>
    </BrowserRouter >
  );
};

export default AppRouter;