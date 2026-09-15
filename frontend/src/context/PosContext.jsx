import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getShiftAktifApi } from "@/api/transaksiApi";
import { getUser } from "@/auth/auth";

const PosContext = createContext();

const SHIFT_STORAGE_KEY = "pos_active_shift";

// ── Helper: cek apakah shift dibuka hari ini ─────────────────────
// Backend pakai field "waktu_buka", bukan "tanggal"/"opened_at"
const isShiftToday = (shift) => {
  const tgl = shift?.waktu_buka || shift?.tanggal || shift?.opened_at || shift?.created_at;
  if (!tgl) return true; // kalau gak ada tanggal, anggap valid
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return true;
  return d.toDateString() === new Date().toDateString();
};

// ── Helper: parse response backend { active, data } ──────────────
const parseShiftResponse = (res, namaDefault) => {
  // Bentuk baru dari backend: { active: boolean, data: {...} | null }
  if (res && typeof res === "object" && "active" in res) {
    if (res.active && res.data) {
      return {
        ...res.data,
        kasir: res.data.nama_kasir || namaDefault,
        status: "OPEN",
      };
    }
    return null;
  }

  // Fallback: kalau backend balas data langsung
  if (res && (res.id_shift != null || res.id != null)) {
    return {
      ...res,
      kasir: res.nama_kasir || namaDefault,
      status: res.status || "OPEN",
    };
  }

  return null;
};

// ── Helper: load cache shift dari localStorage ───────────────────
const loadCachedShift = (namaDefault) => {
  try {
    const raw = localStorage.getItem(SHIFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.status !== "OPEN") return null;
    if (!isShiftToday(parsed)) {
      localStorage.removeItem(SHIFT_STORAGE_KEY);
      return null;
    }
    return { ...parsed, kasir: parsed.kasir || namaDefault };
  } catch {
    return null;
  }
};

export const PosProvider = ({ children }) => {
  const currentUser = getUser();
  const namaDefault =
    currentUser?.nama || currentUser?.name || currentUser?.username || "Kasir Utama";

  // ── 1. CART ─────────────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [diskonNominal, setDiskonNominal] = useState(() => {
    try { return Number(localStorage.getItem("pos_diskon")) || 0; } catch { return 0; }
  });
  const [pajakNominal, setPajakNominal] = useState(0);

  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("pos_diskon", diskonNominal.toString());
  }, [diskonNominal]);

  // ── 2. SHIFT ────────────────────────────────────────────────────
  const [shift, setShift] = useState(() => {
    const cached = loadCachedShift(namaDefault);
    return cached || {
      id_shift: null,
      modal_awal: 0,
      kasir: namaDefault,
      total_tunai: 0,
      total_kas_kecil: 0,
      status: "CLOSED",
    };
  });

  const [shiftLoading, setShiftLoading] = useState(true);

  // Persist shift tiap berubah
  useEffect(() => {
    if (shift?.status === "OPEN") {
      localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(shift));
    } else {
      localStorage.removeItem(SHIFT_STORAGE_KEY);
    }
  }, [shift]);

  // Rekonsiliasi dengan backend saat mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getShiftAktifApi();
        if (cancelled) return;

        console.log("[PosContext] shift/active response:", res);

        const parsed = parseShiftResponse(res, namaDefault);

        if (parsed && isShiftToday(parsed)) {
          setShift(parsed);
          console.log("[PosContext] shift aktif ditemukan:", parsed);
        } else {
          setShift({
            id_shift: null,
            modal_awal: 0,
            kasir: namaDefault,
            total_tunai: 0,
            total_kas_kecil: 0,
            status: "CLOSED",
          });
          localStorage.removeItem(SHIFT_STORAGE_KEY);
          console.log("[PosContext] tidak ada shift aktif");
        }
      } catch (err) {
        // Gagal fetch → tetap pakai cache lokal
        console.warn("[PosContext] gagal fetch shift:", err?.message);
      } finally {
        if (!cancelled) setShiftLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. HOLD LIST ────────────────────────────────────────────────
  const [holdList, setHoldList] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_hold_list");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pos_hold_list", JSON.stringify(holdList));
  }, [holdList]);

  // ── 4. KALKULASI ────────────────────────────────────────────────
  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + (item.harga || item.harga_jual || 0) * item.qty,
      0
    );
  }, [cart]);

  const totalBayar = useMemo(() => {
    return Math.max(0, subtotal - diskonNominal + pajakNominal);
  }, [subtotal, diskonNominal, pajakNominal]);

  // ── 5. CART HANDLERS ────────────────────────────────────────────
  const addToCart = (product, qty = 1, forceQty = false) => {
    setCart((prevCart) => {
      const id = product.id_produk || product.id;
      const existingIndex = prevCart.findIndex(
        (item) => (item.id_produk || item.id) === id
      );
      const maxStok = product.stok || 9999;

      if (existingIndex > -1) {
        const updated = [...prevCart];
        let newQty = forceQty ? qty : updated[existingIndex].qty + qty;
        if (newQty > maxStok) newQty = maxStok;
        if (newQty < 1) newQty = 1;
        updated[existingIndex].qty = newQty;
        return updated;
      }

      const initialQty = qty > maxStok ? maxStok : qty < 1 ? 1 : qty;
      return [...prevCart, { ...product, qty: initialQty }];
    });
  };

  const updateQuantity = (id_produk, newQty) => {
    const product = cart.find((item) => (item.id_produk || item.id) === id_produk);
    if (product) addToCart(product, newQty, true);
  };

  const removeFromCart = (id_produk) => {
    setCart((prev) =>
      prev.filter((item) => (item.id_produk || item.id) !== id_produk)
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiskonNominal(0);
    setPajakNominal(0);
    localStorage.removeItem("pos_cart");
    localStorage.removeItem("pos_diskon");
  };

  // ── 6. HOLD / RECALL ────────────────────────────────────────────
  const holdCurrentCart = (referenceName = "") => {
    if (cart.length === 0) return;
    const now = new Date();
    const newHoldItem = {
      id: `HOLD-${now.getTime().toString().slice(-5)}`,
      reference:
        referenceName ||
        `Antrean ${now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      waktu: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: [...cart],
      total: totalBayar,
      diskon: diskonNominal,
    };
    setHoldList((prev) => [newHoldItem, ...prev]);
    clearCart();
  };

  const recallCart = (indexOrId) => {
    const target =
      typeof indexOrId === "number"
        ? holdList[indexOrId]
        : holdList.find((h) => h.id === indexOrId);
    if (target) {
      setCart(target.items);
      setDiskonNominal(target.diskon || 0);
      setHoldList((prev) => prev.filter((h) => h.id !== target.id));
    }
  };

  const removeHoldCart = (idOrIndex) => {
    setHoldList((prev) =>
      prev.filter((h, idx) =>
        typeof idOrIndex === "number" ? idx !== idOrIndex : h.id !== idOrIndex
      )
    );
  };

  return (
    <PosContext.Provider
      value={{
        cart, setCart, search, setSearch,
        addToCart, updateQuantity, removeFromCart, clearCart,
        subtotal, totalBayar,
        shift, setShift, shiftLoading,
        diskonNominal, setDiskonNominal,
        pajakNominal, setPajakNominal,
        holdList, holdCurrentCart, recallCart, removeHoldCart,
        currentUser,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => useContext(PosContext);