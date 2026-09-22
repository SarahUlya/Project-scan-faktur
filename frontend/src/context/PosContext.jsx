import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getShiftAktifApi } from "@/api/transaksiApi";
import { getUser } from "@/auth/auth";

const PosContext = createContext();

const SHIFT_STORAGE_KEY = "pos_active_shift";

/* ══════════════════════════════════════════════════════════════════
 * HITUNG SUBTOTAL PER ITEM (dengan diskon)
 * ══════════════════════════════════════════════════════════════════ */
const hitungSubtotalItem = (item) => {
  const harga = Number(item.harga || item.harga_jual || 0);
  const diskonPerUnit = Number(item.diskon_item) || 0;
  const hargaEfektif = Math.max(0, harga - diskonPerUnit);
  return hargaEfektif * Number(item.qty || 0);
};

const isShiftToday = (shift) => {
  const tgl = shift?.waktu_buka || shift?.tanggal || shift?.opened_at || shift?.created_at;
  if (!tgl) return true;
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return true;
  return d.toDateString() === new Date().toDateString();
};

const parseShiftResponse = (res, namaDefault) => {
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
  if (res && (res.id_shift != null || res.id != null)) {
    return {
      ...res,
      kasir: res.nama_kasir || namaDefault,
      status: res.status || "OPEN",
    };
  }
  return null;
};

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

  /* ── 1. CART ─────────────────────────────────────────────────── */
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

  /* ── 2. SHIFT ────────────────────────────────────────────────── */
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

  useEffect(() => {
    if (shift?.status === "OPEN") {
      localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(shift));
    } else {
      localStorage.removeItem(SHIFT_STORAGE_KEY);
    }
  }, [shift]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getShiftAktifApi();
        if (cancelled) return;
        const parsed = parseShiftResponse(res, namaDefault);
        if (parsed && isShiftToday(parsed)) {
          setShift(parsed);
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
        }
      } catch (err) {
        console.warn("[Shift] gagal fetch:", err?.message);
      } finally {
        if (!cancelled) setShiftLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 3. HOLD LIST ────────────────────────────────────────────── */
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

  /* ══════════════════════════════════════════════════════════════════
   * 4. KALKULASI — subtotal item sudah termasuk diskon per item
   * ══════════════════════════════════════════════════════════════════ */
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + hitungSubtotalItem(item), 0);
  }, [cart]);

  const totalBayar = useMemo(() => {
    return Math.max(0, subtotal - diskonNominal + pajakNominal);
  }, [subtotal, diskonNominal, pajakNominal]);

  /* ── 5. CART HANDLERS ────────────────────────────────────────── */
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
      return [
        ...prevCart,
        {
          ...product,
          qty: initialQty,
          diskon_item: 0,
          diskon_tipe: "Rp",
          diskon_input: 0,
        },
      ];
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

  /* ══════════════════════════════════════════════════════════════════
   * ⚡ 5b. DISKON PER ITEM
   * ══════════════════════════════════════════════════════════════════ */
  const applyItemDiscount = (id_produk, { tipe, nilai }) => {
    setCart((prev) =>
      prev.map((item) => {
        if ((item.id_produk || item.id) !== id_produk) return item;

        const hargaAsli = Number(item.harga || item.harga_jual || 0);
        let diskonPerUnit = 0;

        if (tipe === "%") {
          diskonPerUnit = Math.round(hargaAsli * (Number(nilai) / 100));
        } else {
          diskonPerUnit = Number(nilai) || 0;
        }

        // Validasi
        if (diskonPerUnit > hargaAsli) diskonPerUnit = hargaAsli;
        if (diskonPerUnit < 0) diskonPerUnit = 0;

        return {
          ...item,
          diskon_item: diskonPerUnit,        // nilai diskon dalam Rp per unit
          diskon_tipe: tipe,                 // "Rp" atau "%"
          diskon_input: Number(nilai) || 0,  // nilai asli yang user input
        };
      })
    );
  };

  const removeItemDiscount = (id_produk) => {
    setCart((prev) =>
      prev.map((item) => {
        if ((item.id_produk || item.id) !== id_produk) return item;
        const { diskon_item, diskon_tipe, diskon_input, ...rest } = item;
        return {
          ...rest,
          diskon_item: 0,
          diskon_tipe: "Rp",
          diskon_input: 0,
        };
      })
    );
  };

  /* ── 6. HOLD / RECALL ────────────────────────────────────────── */
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
        // ⚡ BARU
        applyItemDiscount,
        removeItemDiscount,
        hitungSubtotalItem,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => useContext(PosContext);