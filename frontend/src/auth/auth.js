export const ROLE = {
    ADMIN: "ADMIN",
    KASIR: "KASIR",
    STAFF: "STAFF",
};

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
