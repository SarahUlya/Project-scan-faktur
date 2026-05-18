import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  hitungSubtotalKeranjang,
  hitungNominalDiskon,
  hitungTotalBayar,
} from "../utils/posCalculations";
import { getStokFromBatches } from "../services/stockService";

const PosContext = createContext(null);

export const usePos = () => {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos harus digunakan dalam PosProvider");
  return ctx;
};

const makeCartKey = (produkId) => `${produkId}-${Date.now()}`;

export const PosProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [diskon, setDiskon] = useState({ tipe: "%", nilai: 0 });
  const [viewMode, setViewMode] = useState("grid");
  const [kategoriFilter, setKategoriFilter] = useState("semua");
  const [search, setSearch] = useState("");

  const subtotal = useMemo(() => hitungSubtotalKeranjang(cart), [cart]);
  const diskonNominal = useMemo(
    () => hitungNominalDiskon(subtotal, diskon),
    [subtotal, diskon]
  );
  const totalBayar = useMemo(
    () => hitungTotalBayar(subtotal, diskon),
    [subtotal, diskon]
  );

  const addToCart = useCallback((produk, qty = 1) => {
    const stok = produk.stok ?? getStokFromBatches(produk.batch);
    const harga = Number(produk.harga_jual) || 0;
    const satuan = produk.nama_satuan || produk.satuan || "Pcs";

    if (stok <= 0) {
      alert("Stok produk kosong.");
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.produk_id === produk.id_produk);
      if (existing) {
        const newQty = existing.qty + qty;
        if (newQty > stok) {
          alert(`Stok tersedia hanya ${stok} ${satuan}`);
          return prev;
        }
        return prev.map((c) =>
          c.produk_id === produk.id_produk ? { ...c, qty: newQty } : c
        );
      }
      if (qty > stok) {
        alert(`Stok tersedia hanya ${stok} ${satuan}`);
        return prev;
      }
      return [
        ...prev,
        {
          cartKey: makeCartKey(produk.id_produk),
          produk_id: produk.id_produk,
          nama: produk.nama_produk,
          barcode: produk.barcode,
          harga,
          qty,
          satuan,
          stok,
        },
      ];
    });
    return true;
  }, []);

  const updateQty = useCallback((cartKey, qty) => {
    const newQty = Math.max(1, parseInt(qty, 10) || 1);
    setCart((prev) =>
      prev.map((c) => {
        if (c.cartKey !== cartKey) return c;
        if (newQty > c.stok) {
          alert(`Stok tersedia hanya ${c.stok}`);
          return c;
        }
        return { ...c, qty: newQty };
      })
    );
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCart((prev) => prev.filter((c) => c.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiskon({ tipe: "%", nilai: 0 });
  }, []);

  const value = {
    cart,
    diskon,
    setDiskon,
    viewMode,
    setViewMode,
    kategoriFilter,
    setKategoriFilter,
    search,
    setSearch,
    subtotal,
    diskonNominal,
    totalBayar,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
  };

  return <PosContext.Provider value={value}>{children}</PosContext.Provider>;
};
