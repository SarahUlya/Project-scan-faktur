import React from "react";
import { Box, Skeleton } from "@mui/material";
import { colors } from "@/theme/designTokens";

const SupplierLoadingSkeleton = () => {
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: colors.bgCard,
          borderRadius: 3,
          boxShadow: "0 20px 40px " + colors.primaryLight,
          p: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Skeleton variant="text" width={220} height={36} />
            <Skeleton variant="text" width={320} height={22} />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              minWidth: 480,
            }}
          >
            <Skeleton
              variant="rounded"
              width={360}
              height={44}
              sx={{ borderRadius: 3 }}
            />

            <Skeleton
              variant="rounded"
              width={170}
              height={44}
              sx={{ borderRadius: 3 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <Box
        sx={{
          background: colors.bgLight,
          borderRadius: 3,
          boxShadow: "0 20px 40px " + colors.primaryLight,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "220px 140px 120px 70px",
            px: 3,
            py: 2,
            gap: 2,
            borderBottom: `2px solid ${colors.border}`,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={22} />
          ))}
        </Box>

        {/* Rows */}
        {Array.from({ length: 8 }).map((_, row) => (
          <Box
            key={row}
            sx={{
              display: "grid",
              gridTemplateColumns: "220px 140px 120px 70px",
              alignItems: "center",
              px: 3,
              py: 2,
              gap: 2,
              borderBottom: `1px solid ${colors.borderLight}`,
            }}
          >
            {/* Nama Supplier */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Skeleton
                variant="circular"
                width={36}
                height={36}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton width="85%" height={22} />
                <Skeleton width="45%" height={18} />
              </Box>
            </Box>

            {/* Telepon */}
            <Skeleton width="80%" height={22} />

            {/* Status */}
            <Skeleton
              variant="rounded"
              width={80}
              height={28}
              sx={{ borderRadius: 999 }}
            />

            {/* Aksi */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton
                variant="rounded"
                width={34}
                height={34}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Box>
        ))}

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <Skeleton width={220} height={22} />

          <Skeleton
            variant="rounded"
            width={220}
            height={36}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SupplierLoadingSkeleton;