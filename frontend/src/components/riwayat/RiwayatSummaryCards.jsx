import React from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import BlockIcon from "@mui/icons-material/Block";
import { formatRupiahPos } from "../../utils/posCalculations";

const RiwayatSummaryCards = ({ isFilterActive, totalTransaksi, omzet, itemTerjual }) => {
  const cards = [
    {
      title: isFilterActive
        ? "TOTAL TRANSAKSI (DIFILTER)"
        : "TOTAL TRANSAKSI HARI INI",
      value: totalTransaksi,
      icon: <ReceiptLongIcon sx={{ color: "#3B82F6" }} />,
      bgIcon: "#EFF6FF",
    },
    {
      title: isFilterActive ? "OMZET (DIFILTER)" : "OMZET HARI INI",
      value: `Rp ${formatRupiahPos(omzet)}`,
      icon: <PaymentsIcon sx={{ color: "#10B981" }} />,
      bgIcon: "#ECFDF5",
    },
    {
      title: isFilterActive
        ? "TRANSAKSI DIBATALKAN (DIFILTER)"
        : "TRANSAKSI DIBATALKAN HARI INI",
      value: itemTerjual,
      icon: <BlockIcon sx={{ color: "#EF4444" }} />,
      bgIcon: "#FEF2F2",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, idx) => (
        // ⚡ Grid v2: pakai size={{ xs, md }} — bukan item + xs/md
        <Grid size={{ xs: 12, md: 4 }} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                bgcolor: card.bgIcon,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#94A3B8" }}>
                {card.title}
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#1E293B" }}>
                {card.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default RiwayatSummaryCards;