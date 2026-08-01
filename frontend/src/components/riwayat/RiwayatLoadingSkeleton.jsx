import React from "react";
import { Box, Skeleton, Paper } from "@mui/material";
import { colors, radii, spacing, typography, shadows, statCardSx } from "@/theme/designTokens";

const RiwayatLoadingSkeleton = () => {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="text" width={200} height={24} />
      </Box>

      {/* Summary Cards Skeleton */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map((i) => (
          <Paper key={i} sx={{ p: 2, flex: 1, minWidth: 150 }}>
            <Skeleton variant="text" width={60} height={32} />
            <Skeleton variant="text" width={80} height={20} />
          </Paper>
        ))}
      </Box>

      {/* Filters Skeleton */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Skeleton variant="rectangular" width="23%" height={40} />
          <Skeleton variant="rectangular" width="23%" height={40} />
          <Skeleton variant="rectangular" width="23%" height={40} />
          <Skeleton variant="rectangular" width="23%" height={40} />
        </Box>
      </Paper>

      {/* Table Skeleton */}
      <Paper sx={{ p: 0 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ p: 2, borderBottom: colors.border }}>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 1 }} />
            {[1, 2, 3].map((j) => (
              <Box key={j} sx={{ display: "flex", gap: 2, mb: 1 }}>
                <Skeleton variant="rectangular" width="10%" height={40} />
                <Skeleton variant="rectangular" width="25%" height={40} />
                <Skeleton variant="rectangular" width="20%" height={40} />
                <Skeleton variant="rectangular" width="15%" height={40} />
                <Skeleton variant="rectangular" width="15%" height={40} />
                <Skeleton variant="rectangular" width="15%" height={40} />
              </Box>
            ))}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default RiwayatLoadingSkeleton;