export const ROLE = {
    ADMIN: "ADMIN",
    KASIR: "KASIR",
    STAFF: "STAFF",
};

/** Sesi admin sementara saat login API belum dipakai */
// export const DEFAULT_ADMIN_USER = {
//   id: 1,
//   name: "Administrator",
//   username: "admin",
//   email: "admin@ampuhtayu.local",
//   role: ROLE.ADMIN,
// };

/**
 * Isi sesi admin default jika belum login.
 * Dipanggil saat app start agar langsung masuk dashboard.
 */
// export const ensureDefaultAdminSession = () => {
//   if (getUser()) return;

//   localStorage.setItem("user", JSON.stringify(DEFAULT_ADMIN_USER));
//   localStorage.setItem("isLogin", "true");
// };

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user || user === "undefined") return null;

    return JSON.parse(user);
  } catch (err) {
    console.error("Gagal parse user:", err);
    return null;
  }
};

export const hasAccess = (allowedRoles = []) => {
    const user = getUser();
    if (!user) return false;

    if (!allowedRoles || allowedRoles.length === 0) return true;

    return allowedRoles.includes(user.role);
};
