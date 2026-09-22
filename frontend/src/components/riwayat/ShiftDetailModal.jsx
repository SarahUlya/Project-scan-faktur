import React, { useEffect, useState, useMemo } from "react";
import { Dialog, Box, Typography, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentsIcon from "@mui/icons-material/Payments";
import PrintIcon from "@mui/icons-material/Print";
import InboxIcon from "@mui/icons-material/Inbox";
import TimelapseIcon from "@mui/icons-material/Timelapse";

import { colors, radii, typography, shadows, transitions } from "../../theme/designTokens";
import { getShiftDetailApi, getKasKecilListApi } from "../../api/transaksiApi";

import {
  formatRupiah,
  formatDate,
  formatTime,
  hitungDurasi,
  hitungTotalKasKecil,
  getSelisihInfo,
} from "../../utils/shiftDetailHelpers";

import ShiftInfoBox from "./shift-detail/ShiftInfoBox";
import ShiftStatCard from "./shift-detail/ShiftStatCard";
import ShiftTransaksiItem from "./shift-detail/ShiftTransaksiItem";
import ShiftKasKecilItem from "./shift-detail/ShiftKasKecilItem";
import ScrollableList from "./shift-detail/ScrollableList";
import LihatSemuaButton from "./shift-detail/LihatSemuaButton";

/* ══════════════════════════════════════════════════════════════════
 * KONFIGURASI — Limit tampilan transaksi
 * ══════════════════════════════════════════════════════════════════ */
const VISIBLE_LIMIT = 15;

/* ══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ══════════════════════════════════════════════════════════════════ */
const ShiftDetailModal = ({ open, onClose, shift }) => {
  const [transaksiList, setTransaksiList] = useState([]);
  const [kasKecilList, setKasKecilList] = useState([]);
  const [loadingTrx, setLoadingTrx] = useState(false);
  const [loadingKas, setLoadingKas] = useState(false);
  const [trxError, setTrxError] = useState("");

  // ── Base data ───────────────────────────────────────────────────
  const idShift = shift?.id_shift ?? shift?.id ?? null;
  const status = String(shift?.status || "").toUpperCase();
  const isOpen = status === "OPEN";
  const namaKasir = shift?.nama_kasir || shift?.kasir || "-";
  const modalAwal = Number(shift?.modal_awal || 0);
  const modalAkhir = shift?.modal_akhir != null ? Number(shift.modal_akhir) : null;
  const waktuBuka = shift?.waktu_buka;
  const waktuTutup = shift?.waktu_tutup;
  const totalOmzet = Number(shift?.total_omzet ?? 0);

  const durasi = hitungDurasi(waktuBuka, waktuTutup, status);

  // ══════════════════════════════════════════════════════════════════
  // FETCH data saat modal dibuka
  // ══════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!open || !idShift) return;
    let cancelled = false;

    // Detail shift → transaksi
    (async () => {
      setLoadingTrx(true);
      setTrxError("");
      setTransaksiList([]);
      try {
        const res = await getShiftDetailApi(idShift);
        if (cancelled) return;
        const detail = res?.data ?? res;
        const trxList =
          detail?.transaksi || detail?.transaksis || detail?.transactions || [];
        setTransaksiList(Array.isArray(trxList) ? trxList : []);
      } catch (err) {
        if (cancelled) return;
        console.warn("[ShiftDetail] gagal fetch detail:", err?.message);
        setTrxError(
          err?.response?.data?.message ||
            "Transaksi tidak bisa dimuat. Total di atas tetap akurat."
        );
      } finally {
        if (!cancelled) setLoadingTrx(false);
      }
    })();

    // Kas kecil list
    (async () => {
      setLoadingKas(true);
      setKasKecilList([]);
      try {
        const res = await getKasKecilListApi({ id_shift: idShift });
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.data || [];
        setKasKecilList(list);
      } catch (err) {
        if (cancelled) return;
        console.warn("[ShiftDetail] gagal fetch kas kecil:", err?.message);
        setKasKecilList([]);
      } finally {
        if (!cancelled) setLoadingKas(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, idShift]);

  // ══════════════════════════════════════════════════════════════════
  // ⚡ SORT & LIMIT — Transaksi
  // ══════════════════════════════════════════════════════════════════
  const sortedTransaksi = useMemo(() => {
    if (!Array.isArray(transaksiList)) return [];
    return [...transaksiList].sort((a, b) => {
      const dateA = new Date(a.tanggal_transaksi || a.created_at || 0).getTime();
      const dateB = new Date(b.tanggal_transaksi || b.created_at || 0).getTime();
      return dateB - dateA; // DESC — terbaru di atas
    });
  }, [transaksiList]);

  const visibleTransaksi = useMemo(
    () => sortedTransaksi.slice(0, VISIBLE_LIMIT),
    [sortedTransaksi]
  );

  const hasMore = sortedTransaksi.length > VISIBLE_LIMIT;

  const totalTransaksi = sortedTransaksi.length;
  const totalLunas = useMemo(
    () =>
      sortedTransaksi.filter((t) => {
        const s = String(t.status || "").toUpperCase();
        return s.includes("LUNAS") || s.includes("SELESAI");
      }).length,
    [sortedTransaksi]
  );
  const totalBatal = useMemo(
    () =>
      sortedTransaksi.filter((t) => {
        const s = String(t.status || "").toUpperCase();
        return s.includes("BATAL");
      }).length,
    [sortedTransaksi]
  );

  // ══════════════════════════════════════════════════════════════════
  // PERHITUNGAN KAS KECIL
  // ══════════════════════════════════════════════════════════════════
  const { totalMasuk: kasMasuk, totalKeluar: kasKeluar } = useMemo(
    () => hitungTotalKasKecil(kasKecilList),
    [kasKecilList]
  );

  const saldoSistem = modalAwal + totalOmzet + kasMasuk - kasKeluar;
  const selisih = modalAkhir != null ? modalAkhir - saldoSistem : null;
  const selisihInfo = getSelisihInfo(selisih, saldoSistem);

  if (!shift) return null;

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 520 },
          maxWidth: { xs: "calc(100% - 32px)", sm: 520 },
          maxHeight: { xs: "calc(100vh - 32px)", sm: "90vh" },
          borderRadius: `${radii.lg}px`,
          boxShadow: shadows.floating,
          overflow: "hidden",
          bgcolor: colors.bgCard,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ① HEADER */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          pb: { xs: 1.5, sm: 2 },
          borderBottom: `1px solid ${colors.borderLight}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: `${radii.md + 4}px`,
              bgcolor: colors.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ReceiptLongIcon sx={{ color: colors.primary, fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: typography.h5,
                fontWeight: typography.bold,
                color: colors.text,
                lineHeight: 1.2,
                letterSpacing: "-0.3px",
              }}
            >
              Detail Sesi Kasir
            </Typography>
            <Typography
              sx={{
                fontSize: typography.caption,
                fontWeight: typography.medium,
                color: colors.textMuted,
                mt: 0.25,
              }}
            >
              Shift #{idShift} · {formatDate(waktuBuka)}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: colors.textMuted,
            borderRadius: `${radii.md}px`,
            transition: transitions.fast,
            "&:hover": { bgcolor: colors.bgMuted, color: colors.text },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ② STATUS BANNER */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 1.5,
          bgcolor: isOpen ? colors.successLight : colors.borderLight,
          borderBottom: `1px solid ${colors.borderLight}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            bgcolor: isOpen ? colors.success : colors.textMuted,
            color: colors.textOnDark,
            px: 1.25,
            py: 0.5,
            borderRadius: `${radii.s}px`,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: colors.textOnDark,
              opacity: isOpen ? 1 : 0.7,
            }}
          />
          <Typography
            sx={{
              fontSize: typography.small,
              fontWeight: typography.bold,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {isOpen ? "OPEN" : "CLOSED"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TimelapseIcon sx={{ fontSize: 15, color: colors.textMuted }} />
          <Typography sx={{ fontSize: typography.caption, color: colors.textSecondary }}>
            {isOpen ? "Durasi Berjalan: " : "Durasi Total: "}
            <Box component="span" sx={{ fontWeight: typography.bold, color: colors.text }}>
              {durasi}
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* BODY SCROLLABLE */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { bgcolor: colors.bgMuted },
          "&::-webkit-scrollbar-thumb": { bgcolor: colors.border, borderRadius: 3 },
          "&::-webkit-scrollbar-thumb:hover": { bgcolor: colors.borderHover },
        }}
      >
        {/* ③ INFO KASIR & WAKTU */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <ShiftInfoBox
            label="Kasir"
            icon={<AccountCircleOutlinedIcon sx={{ fontSize: 18 }} />}
            value={namaKasir}
            subValue={shift?.nama_toko || "Apotek Ampuh Tayu"}
          />
          <ShiftInfoBox
            label="Waktu Buka"
            icon={<LoginIcon sx={{ fontSize: 18 }} />}
            value={formatDate(waktuBuka)}
            subValue={`${formatTime(waktuBuka)} WIB`}
          />
          <ShiftInfoBox
            label="Modal Awal"
            value={formatRupiah(modalAwal)}
            rightIcon={<PaymentsIcon sx={{ fontSize: 16 }} />}
          />
          {isOpen ? (
            <ShiftInfoBox
              label="Waktu Tutup"
              value="— (Sesi Aktif)"
              empty
              rightIcon={
                <Box
                  sx={{
                    bgcolor: colors.successLight,
                    color: colors.success,
                    fontWeight: typography.bold,
                    fontSize: typography.tiny,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: `${radii.xs}px`,
                    textTransform: "uppercase",
                  }}
                >
                  Live
                </Box>
              }
            />
          ) : (
            <ShiftInfoBox
              label="Waktu Tutup"
              icon={<LogoutIcon sx={{ fontSize: 18 }} />}
              value={formatDate(waktuTutup)}
              subValue={`${formatTime(waktuTutup)} WIB`}
            />
          )}
        </Box>

        {/* ④ 3 STAT CARDS */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 3 },
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
          }}
        >
          <ShiftStatCard
            label="Transaksi"
            value={totalTransaksi}
            sub={
              totalTransaksi === 0
                ? "transaksi"
                : totalBatal > 0
                ? `${totalLunas} lunas · ${totalBatal} batal`
                : `${totalLunas} lunas`
            }
          />
          <ShiftStatCard
            label="Omzet"
            value={formatRupiah(totalOmzet)}
            sub="total penjualan"
            highlight
            valueColor={colors.success}
          />
          <ShiftStatCard
            label="Selisih Kas"
            value={
              selisih == null ? "—" : selisih === 0 ? "Rp 0" : formatRupiah(selisih)
            }
            sub={
              selisih == null
                ? "audit saat tutup"
                : selisih === 0
                ? "fisik = sistem"
                : selisih > 0
                ? "kas lebih"
                : "kas kurang"
            }
            valueColor={selisihInfo.color}
          />
        </Box>

        {/* ⑤ DAFTAR TRANSAKSI */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.25,
            }}
          >
            <Typography
              sx={{
                fontSize: typography.body,
                fontWeight: typography.bold,
                color: colors.text,
              }}
            >
              Transaksi dalam Sesi Ini
            </Typography>
            <Box
              sx={{
                bgcolor: colors.primaryLight,
                color: colors.primary,
                fontWeight: typography.bold,
                fontSize: typography.small,
                borderRadius: `${radii.s}px`,
                px: 1,
                py: 0.25,
              }}
            >
              {totalTransaksi} transaksi
              {totalBatal > 0 && (
                <Box
                  component="span"
                  sx={{ ml: 0.5, opacity: 0.75, fontSize: "10px" }}
                >
                  ({totalBatal} batal)
                </Box>
              )}
            </Box>
          </Box>

          {loadingTrx && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={22} sx={{ color: colors.primary }} />
            </Box>
          )}

          {!loadingTrx && trxError && (
            <Box
              sx={{
                bgcolor: colors.warningLight,
                border: `1px solid ${colors.warning}`,
                borderRadius: `${radii.md}px`,
                p: 1.5,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.caption,
                  color: colors.text,
                  fontWeight: typography.medium,
                }}
              >
                {trxError}
              </Typography>
            </Box>
          )}

          {!loadingTrx && !trxError && sortedTransaksi.length > 0 && (
            <>
              {/* Counter kalau > 5 */}
              {sortedTransaksi.length > 5 && (
                <Box
                  sx={{
                    bgcolor: colors.bgMuted,
                    border: `1px solid ${colors.borderLight}`,
                    borderRadius: `${radii.md}px`,
                    px: 1.5,
                    py: 1,
                    mb: 1.25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: typography.tiny,
                      color: colors.textSecondary,
                      fontWeight: typography.medium,
                    }}
                  >
                    {hasMore ? (
                      <>
                        Menampilkan{" "}
                        <strong style={{ color: colors.text }}>
                          {VISIBLE_LIMIT}
                        </strong>{" "}
                        dari{" "}
                        <strong style={{ color: colors.text }}>
                          {sortedTransaksi.length}
                        </strong>{" "}
                        · <span style={{ color: colors.primary }}>terbaru dulu</span>
                      </>
                    ) : (
                      <>
                        Menampilkan{" "}
                        <strong style={{ color: colors.text }}>
                          {sortedTransaksi.length}
                        </strong>{" "}
                        transaksi
                      </>
                    )}
                  </Typography>
                  {hasMore && (
                    <Typography
                      sx={{
                        fontSize: typography.tiny,
                        color: colors.textMuted,
                        fontStyle: "italic",
                      }}
                    >
                      Scroll ↓
                    </Typography>
                  )}
                </Box>
              )}

              <ScrollableList
                maxHeight={sortedTransaksi.length > 5 ? 320 : "none"}
                hint={
                  hasMore
                    ? `↓ ${sortedTransaksi.length - VISIBLE_LIMIT} lainnya di halaman Riwayat`
                    : null
                }
              >
                {visibleTransaksi.map((trx, idx) => (
                  <ShiftTransaksiItem
                    key={trx.id_transaksi || trx.no_transaksi || idx}
                    trx={trx}
                  />
                ))}
              </ScrollableList>

              {/* ⚡ Tombol "Lihat Semua" — muncul kalau ada lebih dari limit */}
              {hasMore && (
                <LihatSemuaButton
                  idShift={idShift}
                  count={sortedTransaksi.length}
                  type="transaksi"
                />
              )}
            </>
          )}

          {!loadingTrx && !trxError && sortedTransaksi.length === 0 && (
            <Box
              sx={{
                bgcolor: colors.bgMuted,
                border: `1px dashed ${colors.border}`,
                borderRadius: `${radii.md + 4}px`,
                p: 3,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: colors.borderLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.textMuted,
                  mx: "auto",
                  mb: 1.25,
                }}
              >
                <InboxIcon sx={{ fontSize: 26 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: typography.body,
                  fontWeight: typography.semibold,
                  color: colors.text,
                  mb: 0.5,
                }}
              >
                Belum ada transaksi di sesi ini
              </Typography>
              <Typography
                sx={{
                  fontSize: typography.small,
                  color: colors.textMuted,
                  maxWidth: 280,
                  mx: "auto",
                  lineHeight: 1.5,
                }}
              >
                Transaksi akan muncul otomatis saat kasir memproses penjualan
                melalui modul Kasir POS.
              </Typography>
            </Box>
          )}
        </Box>

        {/* ⑥ DAFTAR KAS KECIL */}
        {!loadingKas && kasKecilList.length > 0 && (
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.25,
              }}
            >
              <Typography
                sx={{
                  fontSize: typography.body,
                  fontWeight: typography.bold,
                  color: colors.text,
                }}
              >
                Kas Kecil dalam Sesi Ini
              </Typography>
              <Box
                sx={{
                  bgcolor: colors.primaryLight,
                  color: colors.primary,
                  fontWeight: typography.bold,
                  fontSize: typography.small,
                  borderRadius: `${radii.s}px`,
                  px: 1,
                  py: 0.25,
                }}
              >
                {kasKecilList.length} catatan
              </Box>
            </Box>

            <ScrollableList
              maxHeight={kasKecilList.length > 5 ? 220 : "none"}
              hint={
                kasKecilList.length > 3
                  ? `↓ ${kasKecilList.length} catatan`
                  : null
              }
            >
              {kasKecilList.map((item, idx) => (
                <ShiftKasKecilItem
                  key={item.id || item.id_kas_kecil || idx}
                  item={item}
                />
              ))}
            </ScrollableList>
          </Box>
        )}
      </Box>

      {/* ⑦ FOOTER */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          bgcolor: colors.surfacePink,
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Box
          component="button"
          onClick={onClose}
          sx={{
            flex: 1,
            px: 2,
            py: 1.25,
            bgcolor: colors.bgCard,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: `${radii.md}px`,
            fontSize: typography.body,
            fontWeight: typography.semibold,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: transitions.fast,
            "&:hover": { bgcolor: colors.bgMuted },
          }}
        >
          Tutup
        </Box>
        <Box
          component="button"
          onClick={() => window.print()}
          sx={{
            flex: 1,
            px: 2,
            py: 1.25,
            bgcolor: colors.primary,
            color: colors.textOnDark,
            border: "none",
            borderRadius: `${radii.md}px`,
            fontSize: typography.body,
            fontWeight: typography.bold,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            transition: transitions.fast,
            "&:hover": { bgcolor: colors.primaryHover },
          }}
        >
          <PrintIcon sx={{ fontSize: 16 }} />
          Cetak Laporan
        </Box>
      </Box>
    </Dialog>
  );
};

export default ShiftDetailModal;