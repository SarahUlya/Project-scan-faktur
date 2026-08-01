import React from "react";
import { Box, Skeleton, Grid, Paper } from "@mui/material";
import { colors, radii, statCardSx } from "@/theme/designTokens";

const StokBatchLoadingSkeleton = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={320} height={24} />
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Skeleton variant="rounded" width={130} height={42} sx={{ borderRadius: radii.sm }} />
          <Skeleton variant="rounded" width={130} height={42} sx={{ borderRadius: radii.sm }} />
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ ...statCardSx, borderRadius: radii.lg, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Skeleton variant="circular" width={44} height={44} />
                <Box>
                  <Skeleton variant="text" width={100} height={18} />
                  <Skeleton variant="text" width={60} height={32} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Skeleton variant="rounded" width={360} height={42} sx={{ borderRadius: radii.md, mb: 3 }} />

      {/* Table */}
      <Paper sx={{ borderRadius: radii.lg, overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.borderLight}` }}>
          <Skeleton variant="text" width="100%" height={20} />
        </Box>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 2,
              p: 2,
              borderBottom: i < 5 ? `1px solid ${colors.borderLight}` : "none",
            }}
          >
            <Skeleton variant="text" width="25%" height={28} />
            <Skeleton variant="text" width="12%" height={28} />
            <Skeleton variant="text" width="12%" height={28} />
            <Skeleton variant="text" width="20%" height={28} />
            <Skeleton variant="text" width="12%" height={28} />
            <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: radii.sm }} />
          </Box>
        ))}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${colors.borderLight}`,
            display: "flex",
            justifyContent: "space-between",
            bgcolor: colors.bgMuted,
          }}
        >
          <Skeleton variant="text" width={250} height={20} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: radii.s }} />
            <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: radii.s }} />
            <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: radii.s }} />
            <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: radii.s }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default StokBatchLoadingSkeleton;