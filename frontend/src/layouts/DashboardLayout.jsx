import { Box } from "@mui/material";
import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      
      <Sidebar />

      <Box sx={{ flexGrow: 1, background: '#FFF5F8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1, maxWidth: 1600, mx: "auto", w: "100%", width: "100%" }}>
          {children}
        </Box>
        <Box sx={{ p: 3, textAlign: "center", color: "#B0B0B0", fontSize: 13 }}>
          © 2024 Apotek Ampuh Tayul Management System. Data dikelola oleh Master Admin.
        </Box>
      </Box>

    </Box>
  );
};

export default DashboardLayout;