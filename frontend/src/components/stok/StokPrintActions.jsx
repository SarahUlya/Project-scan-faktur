import { Button, Menu, MenuItem } from "@mui/material";

import { useState } from "react";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export default function StokPrintActions({ disabled, onExport }) {
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled}
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={onExport}
      >
        Export
      </Button>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchor(null);
            onExportPdf();
          }}
        >
          Export PDF
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchor(null);
            onExportExcel();
          }}
        >
          Export Excel
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchor(null);
            onExportCsv();
          }}
        >
          Export CSV
        </MenuItem>
      </Menu>
    </>
  );
}
