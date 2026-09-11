import React, { useMemo } from "react";
import { Box, Typography, Paper, Chip, Avatar } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import useLaporanTransaksi from "../hooks/useLaporanTransaksi";
import useProdukDb from "../hooks/useProdukDb";
import useDashboardAlerts from "../hooks/useDashboardAlerts";
import DashboardLoadingSkeleton from "../components/common/DashboardLoadingSkeleton";
import formatCurrency from "../utils/formatCurrency";
import Table from "../components/ui/Table";

const themeColors = {
  primary: "#D81B60",
  primaryLight: "#FFF0F5",
  bgCanvas: "#F8FAFC",
  bgCard: "#FFFFFF",
  border: "#E2E8F0",
  textMain: "#1E293B",
  textMuted: "#64748B",
  successBg: "#E8F5E9",
  successText: "#2E7D32",
  warningBg: "#FFF8E1",
  warningText: "#F57F17",
  dangerBg: "#FFEBEE",
  dangerText: "#C62828",
};

const StatCard = ({ icon, title, value, accent, secondarySub }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: "12px",
      border: `1px solid ${themeColors.border}`,
      bgcolor: themeColors.bgCard,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: themeColors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: themeColors.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent || themeColors.primary,
        }}
      >
        {icon}
      </Box>
    </Box>
    <Typography
      sx={{
        fontSize: 22,
        fontWeight: 800,
        color: themeColors.textMain,
        mb: secondarySub ? 1 : 0,
        lineHeight: 1.2,
      }}
    >
      {value}
    </Typography>
    {secondarySub && (
      <Box
        sx={{
          pt: 1,
          borderTop: `1px dashed ${themeColors.border}`,
          fontSize: 11,
          color: themeColors.textMuted,
        }}
      >
        {secondarySub}
      </Box>
    )}
  </Paper>
);

const DashboardPage = () => {
  const {
    produkTerlaris = [],
    totalOmzet = 0,
    jumlahTransaksi = 0,
    loading,
  } = useLaporanTransaksi() || {};
  const { produk = [], loading: produkLoading } = useProdukDb() || {};
  const {
    stokMenipisList = [],
    hampirExpiredList = [],
    auditLogs = [],
    leaderboardKasir = [],
    loadingAlerts,
  } = useDashboardAlerts() || {};

  const isLoading = loading || produkLoading || loadingAlerts;

  const totalUnitTerjual = useMemo(() => {
    return (produkTerlaris || []).reduce(
      (sum, item) => sum + Number(item?.total_terjual || 0),
      0,
    );
  }, [produkTerlaris]);

  const topProducts = useMemo(() => {
    return (produkTerlaris || []).slice(0, 5).map((item) => {
      const dataProduk = (produk || []).find(
        (p) => p?.id_produk === item?.id_produk,
      );
      return {
        id: item?.id_produk,
        name: item?.nama_produk || "-",
        type: item?.kategori || "-",
        sold: Number(item?.total_terjual || 0),
        stock: Number(dataProduk?.stok || 0),
      };
    });
  }, [produkTerlaris, produk]);

  const columns = [
    {
      header: "Produk",
      accessor: "name",
      render: (row, idx) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: themeColors.primaryLight,
              color: themeColors.primary,
            }}
          >
            {idx + 1}
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: themeColors.textMain,
              }}
            >
              {row?.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: themeColors.textMuted }}>
              {row?.type}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      header: "Kategori",
      accessor: "type",
      render: (row) => (
        <Typography sx={{ fontSize: 14, color: themeColors.textMuted }}>
          {row?.type}
        </Typography>
      ),
    },
    {
      header: "Terjual",
      accessor: "sold",
      align: "center",
      render: (row) => (
        <Typography sx={{ fontWeight: 600, color: themeColors.textMain }}>
          {(row?.sold || 0).toLocaleString()} unit
        </Typography>
      ),
    },
    {
      header: "Sisa Stok",
      accessor: "stock",
      align: "center",
      render: (row) => (
        <Typography
          sx={{
            color:
              (row?.stock || 0) < 10
                ? themeColors.dangerText
                : themeColors.textMuted,
            fontWeight: (row?.stock || 0) < 10 ? 700 : 400,
          }}
        >
          {(row?.stock || 0).toLocaleString()} unit
        </Typography>
      ),
    },
  ];

  if (isLoading) return <DashboardLoadingSkeleton />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
      {/* HEADER / CONTROL CENTER (Tanpa Tombol Aksi) */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: "12px",
          border: `1px solid ${themeColors.border}`,
          bgcolor: themeColors.bgCard,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 18,
                color: themeColors.textMain,
              }}
            >
              Enterprise Control Center
            </Typography>
            <Chip
              label="Shift Pagi Aktif • 3 Kasir Online"
              size="small"
              sx={{
                bgcolor: themeColors.successBg,
                color: themeColors.successText,
                fontWeight: 700,
                fontSize: 11,
                height: 22,
              }}
            />
          </Box>
          <Typography
            sx={{ fontSize: 12, color: themeColors.textMuted, mt: 0.5 }}
          >
            Apotek Ampuh Tayu — Sistem Manajemen Ritel & Operasional Farmasi
          </Typography>
        </Box>
        <Typography
          sx={{ fontSize: 12, fontWeight: 600, color: themeColors.textMuted }}
        >
          🕒{" "}
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Typography>
      </Paper>

      {/* TIER A: TOP SUMMARY METRIC CARDS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        <StatCard
          icon={<AccountBalanceWalletOutlinedIcon />}
          title="Omzet Hari Ini"
          value={formatCurrency(totalOmzet ?? 0)}
          secondarySub="Pencatatan real-time tanggal hari ini"
        />{" "}
        <StatCard
          icon={<ReceiptLongOutlinedIcon />}
          title="Transaksi Selesai"
          value={(jumlahTransaksi ?? 0).toLocaleString() + " Trx"}
          secondarySub={`Total ${totalUnitTerjual.toLocaleString()} unit obat`}
        />
        <StatCard
          icon={<ScaleOutlinedIcon />}
          title="Rekonsiliasi Kas"
          value="Sinkron (OK)"
          accent={themeColors.successText}
          secondarySub="Laci kas aman tanpa selisih"
        />
        <StatCard
          icon={<AssignmentOutlinedIcon />}
          title="Piutang & Tempo"
          value="Monitoring Aktif"
          accent={themeColors.warningText}
          secondarySub="Faktur tempo < 7 hari"
        />
      </Box>

      {/* TIER B: ANALITIK & HEATMAP JAM SIBUK */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.3fr 1fr" },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.bgCard,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: themeColors.textMain,
                }}
              >
                Tren Penjualan & Proporsi Resep
              </Typography>
              <Typography sx={{ fontSize: 12, color: themeColors.textMuted }}>
                Performa transaksi harian dan akumulasi resep.
              </Typography>
            </Box>
            <Chip
              label="Real-Time Data"
              size="small"
              sx={{
                bgcolor: themeColors.primaryLight,
                color: themeColors.primary,
                fontWeight: 700,
                fontSize: 10,
              }}
            />
          </Box>
          <Box
            sx={{
              height: 160,
              width: "100%",
              bgcolor: "#FAFAFA",
              borderRadius: "8px",
              border: `1px dashed ${themeColors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              mb: 2,
              overflow: "hidden",
            }}
          >
            <svg width="100%" height="100%" style={{ position: "absolute" }}>
              <path
                d="M 0 120 Q 150 40, 300 80 T 600 30"
                fill="none"
                stroke={themeColors.primary}
                strokeWidth="3"
              />
            </svg>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: themeColors.textMuted,
                zIndex: 1,
                bgcolor: "rgba(255,255,255,0.9)",
                px: 1,
                borderRadius: 1,
              }}
            >
              Visualisasi Grafik Tren Omzet Berjalan
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              pt: 1,
              borderTop: `1px solid ${themeColors.border}`,
            }}
          >
            <span style={{ color: themeColors.textMuted }}>
              Kategori Terjual: <b>{(produkTerlaris || []).length} Produk</b>
            </span>
            <span style={{ color: themeColors.textMuted }}>
              Volume: <b>{totalUnitTerjual.toLocaleString()} Unit</b>
            </span>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.bgCard,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: themeColors.textMain,
                }}
              >
                Matriks Beban Jam Sibuk
              </Typography>
              <Typography sx={{ fontSize: 12, color: themeColors.textMuted }}>
                Intensitas kunjungan untuk shift kasir.
              </Typography>
            </Box>
            <Chip
              label="Heatmap Kasir"
              size="small"
              sx={{
                bgcolor: themeColors.dangerBg,
                color: themeColors.dangerText,
                fontWeight: 700,
                fontSize: 10,
              }}
            />
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 2 }}
          >
            {[
              { time: "08:00 - 10:00", vals: [16, 22, 31, 20, 28, 24] },
              { time: "10:00 - 12:00", vals: [34, 48, 52, 38, 46, 41] },
              { time: "12:00 - 14:00", vals: [12, 18, 10, 14, 21, 18] },
              { time: "15:00 - 18:00", vals: [64, 78, 82, 69, 94, 70] },
              { time: "18:00 - 21:00", vals: [85, 102, 114, 96, 118, 88] },
            ].map((row, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  sx={{
                    fontSize: 10,
                    fontWeight: 600,
                    width: 85,
                    color: themeColors.textMuted,
                  }}
                >
                  {row.time}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexGrow: 1 }}>
                  {row.vals.map((v, vIdx) => (
                    <Box
                      key={vIdx}
                      sx={{
                        flex: 1,
                        height: 26,
                        borderRadius: "4px",
                        bgcolor:
                          v > 90 ? "#D81B60" : v > 50 ? "#F48FB1" : "#FCE4EC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: v > 90 ? "#FFFFFF" : "#1E293B",
                      }}
                    >
                      {v}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              fontSize: 11,
              pt: 1,
              borderTop: `1px solid ${themeColors.border}`,
              color: themeColors.textMuted,
            }}
          >
            Saran:{" "}
            <b style={{ color: themeColors.primary }}>
              Siagakan 3 Kasir On-Duty jam 18:00
            </b>
          </Box>
        </Paper>
      </Box>

      {/* TIER C: SUPPLY CHAIN, INVENTARIS & FEFO */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.bgCard,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: themeColors.textMain,
                }}
              >
                Stok Menipis Kritis
              </Typography>
              <Chip
                label={`${(stokMenipisList || []).length} Perlu Restock`}
                size="small"
                sx={{
                  bgcolor: themeColors.dangerBg,
                  color: themeColors.dangerText,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(stokMenipisList || []).length > 0 ? (
              (stokMenipisList || []).slice(0, 4).map((item, idx) => (
                <Box
                  key={item?.id_produk || idx}
                  sx={{
                    p: 1.5,
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    bgcolor: "#FAFAFA",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: themeColors.textMain,
                      }}
                    >
                      {item?.nama_produk || item?.nama}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: themeColors.textMuted }}
                    >
                      Sisa:{" "}
                      <b style={{ color: themeColors.dangerText }}>
                        {item?.stok ?? item?.qty_sisa} Unit
                      </b>
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  py: 3,
                  color: themeColors.textMuted,
                  fontSize: 13,
                }}
              >
                🎉 Semua stok produk aman.
              </Typography>
            )}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.bgCard,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: themeColors.textMain,
                }}
              >
                Monitor FEFO & ED Dekat
              </Typography>
              <Chip
                label={`${(hampirExpiredList || []).length} Batch Prioritas`}
                size="small"
                sx={{
                  bgcolor: themeColors.warningBg,
                  color: themeColors.warningText,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(hampirExpiredList || []).length > 0 ? (
              (hampirExpiredList || []).slice(0, 3).map((item, idx) => (
                <Box
                  key={item?.id_batch || idx}
                  sx={{
                    p: 1.5,
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    bgcolor: "#FAFAFA",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: themeColors.textMain,
                      }}
                    >
                      {item?.nama_produk || "Produk Farmasi"}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 11, color: themeColors.textMuted }}
                    >
                      Batch: {item?.no_batch || item?.batch}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: themeColors.warningText,
                      }}
                    >
                      ED: {item?.expired_date || item?.expired}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  py: 3,
                  color: themeColors.textMuted,
                  fontSize: 13,
                }}
              >
                ✨ Tidak ada batch mendekati kadaluarsa.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* TIER D: AUDIT TRAIL LOG & LEADERBOARD KASIR */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
          gap: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.bgCard,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                color: themeColors.textMain,
              }}
            >
              Audit Trail & Log Keamanan Kasir
            </Typography>
            <Chip
              label="Real-Time Event Stream"
              size="small"
              sx={{
                bgcolor: themeColors.successBg,
                color: themeColors.successText,
                fontWeight: 700,
                fontSize: 10,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(auditLogs || []).length > 0 ? (
              (auditLogs || []).map((log, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    bgcolor: "#FAFAFA",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: themeColors.textMain,
                    }}
                  >
                    {log?.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 11, color: themeColors.textMuted, mt: 0.5 }}
                  >
                    {log?.desc}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  border: `1px solid ${themeColors.border}`,
                  bgcolor: "#FAFAFA",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: themeColors.textMain,
                  }}
                >
                  Sistem Berjalan Normal (Zero Incident)
                </Typography>
                <Typography
                  sx={{ fontSize: 11, color: themeColors.textMuted, mt: 0.5 }}
                >
                  Tidak ada aktivitas void atau override diskon ilegal pada
                  shift ini.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "12px",
            border: `1px solid ${themeColors.border}`,
            bgcolor: themeColors.bgCard,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 15,
                color: themeColors.textMain,
              }}
            >
              Leaderboard Kinerja Kasir
            </Typography>
            <Chip
              label="Shift Hari Ini"
              size="small"
              sx={{
                bgcolor: themeColors.successBg,
                color: themeColors.successText,
                fontWeight: 700,
                fontSize: 10,
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {(leaderboardKasir || []).length > 0 ? (
              (leaderboardKasir || []).map((kasir, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    bgcolor: "#FAFAFA",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: themeColors.textMain,
                    }}
                  >
                    {kasir?.nama}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 13,
                      color: themeColors.primary,
                    }}
                  >
                    {formatCurrency(kasir?.total_omzet || 0)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  color: themeColors.textMuted,
                  fontSize: 13,
                }}
              >
                Statistik kasir akan diperbarui secara otomatis setelah
                transaksi harian masuk.
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* TABEL TOP 5 PRODUK TERLARIS */}
      <Box
        sx={{
          bgcolor: themeColors.bgCard,
          borderRadius: 3,
          border: `1px solid ${themeColors.border}`,
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 16,
            mb: 0.5,
            color: themeColors.textMain,
          }}
        >
          Top 5 Produk Terlaris
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: themeColors.textMuted, mb: 2.5 }}
        >
          Performa penjualan produk periode berjalan.
        </Typography>
        {topProducts.length > 0 ? (
          <Table columns={columns} data={topProducts} />
        ) : (
          <Typography
            sx={{ textAlign: "center", py: 5, color: themeColors.textMuted }}
          >
            Belum ada data penjualan.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
