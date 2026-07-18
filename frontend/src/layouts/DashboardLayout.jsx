import { Box } from "@mui/material";
import Sidebar from "../components/navigation/Sidebar";
import { Outlet } from "react-router-dom";
import { colors } from "../theme/designTokens";

const DashboardLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.bg }}>
      <Box className="no-print" component="nav">
        <Sidebar />
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            flexGrow: 1,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Outlet />
        </Box>
        <Box
          className="no-print"
          sx={{
            py: 2,
            textAlign: "center",
            color: colors.textMuted,
            fontSize: 12,
            borderTop: `1px solid ${colors.borderLight}`,
          }}
        >
          Apotek Ampuh Tayu — Pharmacy Management System
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
