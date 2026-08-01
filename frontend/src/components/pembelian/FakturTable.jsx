import React from "react";
import formatCurrency from "../../utils/formatCurrency";
import { IconButton, Box, Chip } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  transitions,
} from "@/theme/designTokens";

const statusStyle = {
  LUNAS: { background: colors.successLight, color: colors.success },
  "BELUM BAYAR": { background: colors.dangerLight, color: colors.danger },
};

const thStyle = {
  padding: "16px 14px",
  color: colors.textSecondary,
  fontWeight: 700,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  borderBottom: "2px solid " + colors.border,
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
          background: colors.bgCard,
          borderRadius: 20,
          padding: 40,
          textAlign: "center",
          color: colors.textMuted,
        }}
      >
        Memuat data faktur...
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.bgCard,
        borderRadius: 20,
        boxShadow: colors.boxShadow,
        padding: 10,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            minWidth: 1100,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>No.</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>No. Faktur</th>
              <th style={thStyle}>Supplier</th>
              <th style={thStyle}>Pembayaran</th>
              <th style={thStyle}>Jatuh Tempo</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  style={{ padding: 40, textAlign: "center", color: colors.textMuted }}
                >
                  Belum ada faktur
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const { tanggal, jam } = formatTanggalLengkap(
                  row.tanggal_penerimaan || row.tanggal,
                );
                const isKredit = row.jenis_pembayaran === "Kredit";

                return (
                  <tr
                    key={row.id}
                    onClick={() => onView && onView(row)}
                    style={{
                      borderBottom:
                        idx === data.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                      cursor: onView ? "pointer" : "default",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 14px",
                        color: colors.textSecondary,
                        fontWeight: 600,
                      }}
                    >
                      {startIndex + idx + 1}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: colors.text,
                          fontSize: 14,
                        }}
                      >
                        {tanggal}
                      </div>
                      {jam && (
                        <div
                          style={{
                            color: colors.textSecondary,
                            fontSize: 12,
                            marginTop: 2,
                          }}
                        >
                          {jam}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: colors.text,
                          fontSize: 14,
                        }}
                      >
                        {row.no_faktur || row.id}
                      </div>
                      {row.no_surat_pesanan && (
                        <div
                          style={{
                            color: colors.textSecondary,
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          PO: {row.no_surat_pesanan}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "16px 14px" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: colors.text,
                          fontSize: 14,
                        }}
                      >
                        {row.supplier}
                      </div>
                      <div
                        style={{
                          color: colors.textSecondary,
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        {row.supplierType || "Distributor"}
                      </div>
                    </td>
                   
                    <td style={{ padding: "16px 14px" }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: colors.text,
                          fontSize: 13,
                        }}
                      >
                        {row.jenis_pembayaran || "Tunai"}
                      </div>
                      {row.akun_kas && (
                        <div
                          style={{
                            color: colors.textSecondary,
                            fontSize: 11,
                            marginTop: 2,
                          }}
                        >
                          {row.akun_kas}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "16px 14px",
                        color: colors.textSecondary,
                        fontSize: 13,
                      }}
                    >
                      {isKredit && row.jatuh_tempo
                        ? formatTanggalLengkap(row.jatuh_tempo).tanggal
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "16px 14px",
                        textAlign: "right",
                        fontWeight: 800,
                        color: colors.text,
                      }}
                    >
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
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          title="Lihat & cetak faktur"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(row);
                          }}
                          sx={{
                            color: colors.textSecondary,
                            border: "1px solid" + colors.bg,
                            bgcolor: colors.bgCard,
                            "&:hover": { bgcolor: colors.bgCard },
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
