export const ROLE = {
    ADMIN: "ADMIN",
    KASIR: "KASIR",
    STAFF: "STAFF",
};

/** Sesi admin sementara untuk Bypass Dev Mode */
export const DEFAULT_ADMIN_USER = {
    id: 1,
    name: "Administrator",
    username: "admin",
    email: "admin@ampuhtayu.local",
    role: ROLE.ADMIN,
};

/**
 * Mendapatkan data user aktif.
 * Jika belum ada di localStorage, mengembalikan DEFAULT_ADMIN_USER agar bypass dev mode berjalan.
 */
export const getUser = () => {
    try {
        const user = localStorage.getItem("user");

        if (!user || user === "undefined") {
            // 🔓 BYPASS DEV MODE: Kembalikan default admin jika localStorage kosong
            return DEFAULT_ADMIN_USER;
        }

        return JSON.parse(user);
    } catch (err) {
        console.error("Gagal parse user:", err);
        return DEFAULT_ADMIN_USER;
    }
};

/**
 * Cek hak akses role user.
 * Mengembalikan true jika role user diizinkan atau jika allowedRoles kosong.
 */
export const hasAccess = (allowedRoles = []) => {
    const user = getUser();
    if (!user) return false;

    if (!allowedRoles || allowedRoles.length === 0) return true;

    // 🔓 BYPASS DEV MODE: Jika user adalah ADMIN, selalu berikan akses penuh
    if (user.role === ROLE.ADMIN) return true;

    return allowedRoles.includes(user.role);
};