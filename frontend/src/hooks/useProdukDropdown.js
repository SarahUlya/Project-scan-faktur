import { useEffect, useState } from "react";
import { getProduk } from "../api/produkApi";

export default function useProdukDropdown() {
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProduk(1, 5000, "");
        setProduk(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return { produk };
}