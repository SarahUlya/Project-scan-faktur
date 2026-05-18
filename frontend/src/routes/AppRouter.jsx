import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";


import DashboardPage from "../pages/DashboardPage";
import ProdukPage from "../pages/ProdukPage";
import SupplierPage from "../pages/SupplierPage";
import StokBatchPage from "../pages/StokBatchPage";
import PembelianPage from "../pages/PembelianPage";
import TambahFakturPage from "../pages/TambahFakturPage";
import LihatFakturPage from "../pages/LihatFakturPage";
import LoginPage from "../pages/LoginPage";
import LaporanPage from "../pages/LaporanPage";
import ProtectedRoute from "./ProtectedRoute";
import { ROLE } from "../auth/auth";
import Unauthorized from "../pages/Unauthorized";
import RiwayatPage from "../pages/RiwayatPage";
import UserManagementPage from "../pages/UserManagementPage";
import KasirPage from "../pages/KasirPage";


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
        <Route path="/pembelian/lihat/:fakturId" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <LihatFakturPage />
          </ProtectedRoute>
        } />
        <Route path="/laporan" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <LaporanPage />
          </ProtectedRoute>
        } />
        <Route path="/riwayat" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN, ROLE.STAFF, ROLE.KASIR]}>
            <RiwayatPage />
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <UserManagementPage />
          </ProtectedRoute>
         } />
        <Route path="/kasir" element={
          <ProtectedRoute allowedRoles={[ROLE.KASIR, ROLE.ADMIN]}>
            <KasirPage />
          </ProtectedRoute>
        } />
        <Route path="/pos" element={
          <ProtectedRoute allowedRoles={[ROLE.KASIR, ROLE.ADMIN]}>
            <KasirPage />
          </ProtectedRoute>
        } />
      </Route>
      </Routes>
    </BrowserRouter >
  );
};

export default AppRouter;