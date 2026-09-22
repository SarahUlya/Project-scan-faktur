import React, { useState } from "react";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { colors } from "@/theme/designTokens";

const ExportPrintMenu = ({
  onPrint,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  disabled = false,
  label = "Cetak & Export",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const close = () => setAnchorEl(null);
  const handle = (fn) => () => {
    close();
    fn?.();
  };

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        disabled={disabled}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<PrintIcon />}
        sx={{
          fontWeight: 500,
          textTransform: "none",
          borderRadius: "8px",
          px: 2.5,
          py: 1,
          bgcolor: colors.text,
          color: colors.textOnDark,
          "&:hover": { bgcolor: colors.text },
          "&.Mui-disabled": { bgcolor: colors.border, color: colors.textMuted },
        }}
      >
        {label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ elevation: 3, sx: { borderRadius: "8px", minWidth: 180, mt: 0.5 } }}
      >
        <MenuItem onClick={handle(onPrint)}>
          <ListItemIcon>
            <PrintIcon fontSize="small" sx={{ color: colors.text }} />
          </ListItemIcon>
          <ListItemText primary="Cetak Printer" primaryTypographyProps={{ fontSize: 13 }} />
        </MenuItem>
        <MenuItem onClick={handle(onExportPDF)}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" sx={{ color: colors.text }} />
          </ListItemIcon>
          <ListItemText primary="Export PDF" primaryTypographyProps={{ fontSize: 13 }} />
        </MenuItem>
        <MenuItem onClick={handle(onExportExcel)}>
          <ListItemIcon>
            <TableChartIcon fontSize="small" sx={{ color: colors.text }} />
          </ListItemIcon>
          <ListItemText primary="Export Excel" primaryTypographyProps={{ fontSize: 13 }} />
        </MenuItem>
        <MenuItem onClick={handle(onExportCSV)}>
          <ListItemIcon>
            <InsertDriveFileIcon fontSize="small" sx={{ color: colors.text }} />
          </ListItemIcon>
          <ListItemText primary="Export CSV" primaryTypographyProps={{ fontSize: 13 }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportPrintMenu;