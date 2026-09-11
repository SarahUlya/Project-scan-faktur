import React from "react";
import { Collapse, Paper, TextField, Button, Typography } from "@mui/material";

const RiwayatFilterCollapse = ({ showFilter, startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <Collapse in={showFilter}>
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: "12px", border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", display: "flex", gap: 2, alignItems: "center" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>Filter Rentang Tanggal:</Typography>
        <TextField type="date" size="small" label="Mulai Tanggal" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <TextField type="date" size="small" label="Sampai Tanggal" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button variant="text" color="error" onClick={() => { setStartDate(""); setEndDate(""); }} disabled={!startDate && !endDate}>
          Reset
        </Button>
      </Paper>
    </Collapse>
  );
};

export default RiwayatFilterCollapse;