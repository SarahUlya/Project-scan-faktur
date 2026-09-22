import { colors } from "../theme/designTokens";

/* ══════════════════════════════════════════════════════════════════
 * CEK STATUS
 * ══════════════════════════════════════════════════════════════════ */
export const isStatusLunas = (status) => {
  const s = String(status || "").toUpperCase();
  return (
    s.includes("LUNAS") ||
    s.includes("SELESAI") ||
    s.includes("SUCCESS") ||
    s.includes("PAID")
  );
};

export const isStatusDibatalkan = (status) => {
  const s = String(status || "").toUpperCase();
  return s.includes("BATAL") || s.includes("CANCEL") || s.includes("VOID");
};

export const isStatusMenunggu = (status) => {
  const s = String(status || "").toUpperCase();
  return s.includes("MENUNGGU") || s.includes("PENDING");
};

export const isStatusRetur = (status) => {
  const s = String(status || "").toUpperCase();
  return s.includes("RETUR");
};

/* ══════════════════════════════════════════════════════════════════
 * GET STYLE — untuk badge / chip
 * ══════════════════════════════════════════════════════════════════ */
export const getStatusStyle = (status) => {
  const s = String(status || "").toUpperCase();

  if (isStatusLunas(s)) {
    return { bg: colors.successLight, color: colors.success, label: "LUNAS" };
  }
  if (isStatusMenunggu(s)) {
    return { bg: colors.warningLight, color: colors.warning, label: "MENUNGGU" };
  }
  if (isStatusRetur(s)) {
    return { bg: colors.dangerLight, color: colors.danger, label: "RETUR" };
  }
  if (isStatusDibatalkan(s)) {
    return { bg: colors.bgMuted, color: colors.textSecondary, label: "DIBATALKAN" };
  }

  return { bg: colors.bgMuted, color: colors.textSecondary, label: s || "-" };
};

export const getShiftStyle = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "OPEN") {
    return { bg: colors.successLight, color: colors.success, label: "OPEN" };
  }
  return { bg: colors.bgMuted, color: colors.textSecondary, label: "CLOSED" };
};