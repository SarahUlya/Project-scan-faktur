import { Navigate } from "react-router-dom";
import { getUser, hasAccess } from "../auth/auth";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !hasAccess(allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;