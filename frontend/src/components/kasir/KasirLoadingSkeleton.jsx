import React from "react";
import {
  Box,
  Skeleton,
} from "@mui/material";

import {
  colors,
  radii,
  spacing,
  shadows,
} from "@/theme/designTokens";

const KasirLoadingSkeleton = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.bg,
        pb: spacing.xxl,
      }}
    >
      <Box sx={{ px: 3, pt: 3 }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width={220}
            height={42}
            sx={{ borderRadius: 1 }}
          />

          <Skeleton
            variant="text"
            width={180}
            height={22}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* LEFT */}
          <Box sx={{ flex: 1 }}>
            {/* SEARCH */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 3,
                p: "16px 20px",
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
              }}
            >
              <Skeleton
                variant="rounded"
                height={46}
                sx={{ flex: 1 }}
              />

              <Skeleton
                variant="rounded"
                width={220}
                height={46}
              />

              <Skeleton
                variant="rounded"
                width={90}
                height={46}
              />
            </Box>

            {/* CATEGORY */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 3,
              }}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={95}
                  height={36}
                  sx={{ borderRadius: 30 }}
                />
              ))}
            </Box>

            {/* PRODUCT GRID */}
            <Box
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(180px,1fr))",
                  gap: 2,
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: radii.md,
                      p: 2,
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      height={130}
                    />

                    <Skeleton
                      width="70%"
                      height={28}
                      sx={{ mt: 2 }}
                    />

                    <Skeleton
                      width="45%"
                      height={20}
                    />

                    <Skeleton
                      width="55%"
                      height={24}
                      sx={{ mt: 1 }}
                    />

                    <Skeleton
                      variant="rounded"
                      height={38}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* CART */}
          <Box
            sx={{
              width: 390,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
                p: 3,
              }}
            >
              <Skeleton
                width={170}
                height={34}
              />

              <Skeleton
                width={100}
                height={20}
                sx={{ mb: 3 }}
              />

              {Array.from({ length: 5 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    width={60}
                    height={60}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Skeleton
                      width="80%"
                      height={22}
                    />

                    <Skeleton
                      width="40%"
                      height={18}
                    />

                    <Skeleton
                      width="60%"
                      height={18}
                    />
                  </Box>
                </Box>
              ))}

              <Skeleton
                width="100%"
                height={2}
                sx={{ my: 3 }}
              />

              <Skeleton
                width="50%"
                height={26}
              />

              <Skeleton
                width="65%"
                height={34}
                sx={{ mb: 3 }}
              />

              <Skeleton
                variant="rounded"
                height={48}
              />

              <Skeleton
                variant="rounded"
                height={48}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KasirLoadingSkeleton;