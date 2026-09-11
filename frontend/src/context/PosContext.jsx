import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getShiftAktifApi } from "@/api/transaksiApi";
import { getUser } from "@/auth/auth";

const PosContext = createContext();

export const PosProvider = ({ children }) => {
  const currentUser = getUser();
  
  // 1. STATE KERANJANG (CART) - Terhubung ke LocalStorage agar tidak hilang
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [diskonNominal, setDiskonNominal] = useState(() => {
    try { return Number(localStorage.getItem("pos_diskon")) || 0; } catch (e) { return 0; }
  });
  const [pajakNominal, setPajakNominal] = useState(0);

  // Auto-Save Cart ke LocalStorage
  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart));
  }, [cart]);

  // Auto-Save Diskon ke LocalStorage
  useEffect(() => {
    localStorage.setItem("pos_diskon", diskonNominal.toString());
  }, [diskonNominal]);

  // 2. STATE SHIFT
  const defaultShift = {
    id_shift: null,
    modal_awal: 0,
    kasir: currentUser?.nama || currentUser?.name || currentUser?.username || "Kasir Utama",
    total_tunai: 0,
    total_kas_kecil: 0,
    status: "CLOSED", // Penting untuk deteksi blur halaman
  };
  const [shift, setShift] = useState(defaultShift);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const res = await getShiftAktifApi();
        if (res && res.data) setShift({ ...res.data, status: "OPEN" });
      } catch (err) {
        setShift({ ...defaultShift, status: "CLOSED" });
      }
    };
    fetchShift();
  }, []);

  // 3. STATE HOLD LIST
  const [holdList, setHoldList] = useState(() => {
    try {
      const saved = localStorage.getItem("pos_hold_list");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pos_hold_list", JSON.stringify(holdList));
  }, [holdList]);

  // 4. KALKULASI DINAMIS
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.harga || item.harga_jual || 0) * item.qty, 0);
  }, [cart]);

  const totalBayar = useMemo(() => {
    return Math.max(0, subtotal - diskonNominal + pajakNominal);
  }, [subtotal, diskonNominal, pajakNominal]);


  // 5. CART HANDLERS
  const addToCart = (product, qty = 1, forceQty = false) => {
    setCart((prevCart) => {
      const id = product.id_produk || product.id;
      const existingIndex = prevCart.findIndex((item) => (item.id_produk || item.id) === id);
      
      const maxStok = product.stok || 9999; // Fallback jika stok undefined

      if (existingIndex > -1) {
        const updated = [...prevCart];
        // Jika forceQty true (diketik manual), set qty. Jika false (tombol +), tambah qty.
        let newQty = forceQty ? qty : updated[existingIndex].qty + qty;
        
        // Batasi qty maksimal sesuai stok
        if (newQty > maxStok) newQty = maxStok; 
        if (newQty < 1) newQty = 1;

        updated[existingIndex].qty = newQty;
        return updated;
      }

      // Untuk produk baru, batasi juga jika request qty melebihi stok
      const initialQty = qty > maxStok ? maxStok : (qty < 1 ? 1 : qty);
      return [...prevCart, { ...product, qty: initialQty }];
    });
  };

  const updateQuantity = (id_produk, newQty) => {
    // Kita arahkan ke addToCart dengan flag forceQty = true agar tervalidasi stoknya
    const product = cart.find(item => (item.id_produk || item.id) === id_produk);
    if(product) addToCart(product, newQty, true);
  };

  const removeFromCart = (id_produk) => {
    setCart((prev) => prev.filter((item) => (item.id_produk || item.id) !== id_produk));
  };

  const clearCart = () => {
    setCart([]);
    setDiskonNominal(0);
    setPajakNominal(0);
    localStorage.removeItem("pos_cart");
    localStorage.removeItem("pos_diskon");
  };

  // 6. HOLD & RECALL HANDLERS
  const holdCurrentCart = (referenceName = "") => {
    if (cart.length === 0) return;
    const now = new Date();
    const newHoldItem = {
      id: `HOLD-${now.getTime().toString().slice(-5)}`,
      reference: referenceName || `Antrean ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
      waktu: now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      items: [...cart],
      total: totalBayar,
      diskon: diskonNominal
    };
    setHoldList((prev) => [newHoldItem, ...prev]);
    clearCart();
  };

  const recallCart = (indexOrId) => {
    const target = typeof indexOrId === "number" ? holdList[indexOrId] : holdList.find((h) => h.id === indexOrId);
    if (target) {
      setCart(target.items);
      setDiskonNominal(target.diskon || 0);
      setHoldList((prev) => prev.filter((h) => h.id !== target.id));
    }
  };

  const removeHoldCart = (idOrIndex) => {
    setHoldList((prev) =>
      prev.filter((h, idx) => (typeof idOrIndex === "number" ? idx !== idOrIndex : h.id !== idOrIndex))
    );
  };

  return (
    <PosContext.Provider
      value={{
        cart, setCart, search, setSearch,
        addToCart, updateQuantity, removeFromCart, clearCart,
        subtotal, totalBayar,
        shift, setShift,
        diskonNominal, setDiskonNominal,
        pajakNominal, setPajakNominal,
        holdList, holdCurrentCart, recallCart, removeHoldCart,
        currentUser
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => useContext(PosContext);