import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import useTransaksiDb from "../../hooks/useTransaksiDb";
import PosStruk from "../kasir/PosStruk";
import { formatRupiahPos } from "../../utils/posCalculations";
import { getUser, ROLE } from "../../auth/auth";

const DetailTransaksiModal = ({
  open,
  transaksiId,
  onClose
}) => {

  const {
    getTransaksiDetail,
    cancelTransaksi
  } = useTransaksiDb();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !transaksiId) return;

    setLoading(true);

    getTransaksiDetail(transaksiId)
      .then((d) => {
        setDetail(d);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [open, transaksiId, getTransaksiDetail]);

  const handleBatalkan = async () => {
    try {
      await cancelTransaksi(transaksiId);

      alert("Transaksi berhasil dibatalkan");

      // refresh detail
      const d = await getTransaksiDetail(
        transaksiId
      );

      setDetail(d);

    } catch (err) {
      alert(err.message);
    }
  };

  if (!open) return null;

  const strukData = detail
    ? {
        header: detail.header,
        items: detail.items,
        cetakStruk: true,
      }
    : null;

  const user = getUser();

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={480}
    >

      <h3
        style={{
          margin: "0 0 16px",
          fontWeight: 800,
          fontSize: 20
        }}
      >
        Detail Transaksi
      </h3>

      {loading && (
        <p
          style={{
            color: "#94A3B8"
          }}
        >
          Memuat...
        </p>
      )}

      {!loading && detail && (
        <>
          <div
            style={{
              marginBottom: 16
            }}
          >
            {detail.items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  marginBottom: 6,
                  color: "#475569"
                }}
              >
                <span>
                  {it.nama_produk} × {it.qty}
                </span>

                <span>
                  Rp {formatRupiahPos(it.subtotal)}
                </span>

              </div>
            ))}
          </div>

          <PosStruk data={strukData} />

          {/* tombol cetak */}
          <button
            onClick={() => window.print()}
            style={{
              width: "100%",
              marginTop: 16,
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: "#E91E63",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Cetak Ulang Struk
          </button>

          {/* tombol batal khusus admin */}
          {user?.role === ROLE.ADMIN &&
            detail.header.status !== "DIBATALKAN" && (
            <button
              onClick={handleBatalkan}
              style={{
                width: "100%",
                marginTop: 10,
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#DC2626",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Batalkan Transaksi
            </button>
          )}

          {detail.header.status === "DIBATALKAN" && (
            <p
              style={{
                marginTop: 12,
                color: "#DC2626",
                fontWeight: 700,
                textAlign: "center"
              }}
            >
              Transaksi telah dibatalkan
            </p>
          )}

        </>
      )}

    </Modal>
  );
};

export default DetailTransaksiModal;