import React from "react";
import formatCurrency from "../../utils/formatCurrency";
import { IconButton, Box, Chip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const statusStyle = {
  LUNAS: { background: "#D1FAE5", color: "#10B981" },
  "BELUM BAYAR": { background: "#FEE2E2", color: "#EF4444" },
};

const thStyle = {
  padding: "16px 14px",
  color: "#94A3B8",
  fontWeight: 700,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  borderBottom: "2px solid #F1F5F9",
  whiteSpace: "nowrap",
};

const formatTanggalLengkap = (dateStr) => {
  if (!dateStr) return { tanggal: "-", jam: "" };
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { tanggal: dateStr, jam: "" };
  return {
    tanggal: d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    jam: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  };
};

const FakturTable = ({ data = [], loading, onView, startIndex = 0 }) => {
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          color: "#94A3B8",
        }}
      >
        Memuat data faktur...
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", padding: 10 }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 1100 }}>
          <thead>
            <tr>
              <th style={thStyle}>No.</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>No. Faktur</th>
              <th style={thStyle}>Supplier</th>
              <th style={{ ...thStyle, minWidth: 200 }}>Produk</th>
              <th style={thStyle}>Pembayaran</th>
              <th style={thStyle}>Jatuh Tempo</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Cashback</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                  Belum ada faktur
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const { tanggal, jam } = formatTanggalLengkap(
                  row.tanggal_penerimaan || row.tanggal
                );
                const isKredit = row.jenis_pembayaran === "Kredit";

                return (
                  <tr
                    key={row.id}
                    onClick={() => onView && onView(row)}
                    style={{
                      borderBottom: idx === data.length - 1 ? "none" : "1px solid #F1F5F9",
                      cursor: onView ? "pointer" : "default",
                    }}
                  >
                    <td style={{ padding: "16px 14px", color: "#94A3B8", fontWeight: 600 }}>
                      {startIndex + idx + 1}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{tanggal}</div>
                      {jam && (
                        <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>{jam}</div>
                      )}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>
                        {row.no_faktur || row.id}
                      </div>
                      {row.no_surat_pesanan && (
                        <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>
                          PO: {row.no_surat_pesanan}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{row.supplier}</div>
                      <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>
                        {row.supplierType || "Distributor"}
                      </div>
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                        {row.produkRingkasan}
                      </div>
                      {row.sisaItem > 0 && (
                        <Chip
                          label={`+ ${row.sisaItem} lainnya`}
                          size="small"
                          sx={{
                            mt: 0.75,
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: "#E0F2FE",
                            color: "#0284C7",
                          }}
                        />
                      )}
                      {row.jumlahItem === 0 && (
                        <span style={{ fontSize: 12, color: "#CBD5E1" }}>Belum ada item</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 13 }}>
                        {row.jenis_pembayaran || "Tunai"}
                      </div>
                      {row.akun_kas && (
                        <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>{row.akun_kas}</div>
                      )}
                    </td>
                    <td style={{ padding: "16px 14px", color: "#475569", fontSize: 13 }}>
                      {isKredit && row.jatuh_tempo
                        ? formatTanggalLengkap(row.jatuh_tempo).tanggal
                        : "-"}
                    </td>
                    <td style={{ padding: "16px 14px", textAlign: "right", color: "#64748B", fontSize: 13 }}>
                      {(row.cashback || 0).toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "16px 14px", textAlign: "right", fontWeight: 800, color: "#1E293B" }}>
                      {formatCurrency(row.total)}
                    </td>
                    <td style={{ padding: "16px 14px", textAlign: "center" }}>
                      <span
                        style={{
                          borderRadius: 20,
                          padding: "4px 12px",
                          fontWeight: 800,
                          fontSize: 11,
                          letterSpacing: 0.5,
                          ...statusStyle[row.status],
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 14px", textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                        <IconButton
                          size="small"
                          title="Lihat & cetak faktur"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(row);
                          }}
                          sx={{
                            color: "#64748B",
                            border: "1px solid #F3F6F9",
                            bgcolor: "#fff",
                            "&:hover": { bgcolor: "#f8f4f8" },
                          }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FakturTable;
