import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "./Card";

const DashboardStat = ({ icon, label, value, color = '#E91E63', bg = '#FCE7F3', sublabel, sx = {} }) => (
  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 120, ...sx }}>
    <Box sx={{ width: 48, height: 48, borderRadius: 2, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
      {icon}
    </Box>
    <Typography sx={{ color: '#B0B0B0', fontWeight: 600, fontSize: 15 }}>{label}</Typography>
    <Typography sx={{ fontWeight: 900, fontSize: 32, color: color }}>{value}</Typography>
    {sublabel && <Typography sx={{ color, fontWeight: 700, fontSize: 13 }}>{sublabel}</Typography>}
  </Card>
);

export default DashboardStat;
