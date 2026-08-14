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
      {/* ================= HEADER ================= */}
      <Box sx={{ px: 3, pt: 3 }}>
        <Box
          sx={{
            bgcolor: colors.bgCard,
            borderRadius: `${radii.lg}px`,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.card,
            px: 3,
            py: 3,
            mb: 3,
          }}
        >
          <Skeleton
            variant="text"
            width={160}
            height={38}
            sx={{ borderRadius: 1 }}
          />

          <Skeleton
            variant="text"
            width={150}
            height={20}
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* ================= MAIN ================= */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* ================================================= */}
          {/* LEFT - KERANJANG */}
          {/* ================================================= */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
                overflow: "hidden",
              }}
            >
              {/* HEADER KERANJANG */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <Skeleton
                  variant="text"
                  width={110}
                  height={28}
                />
              </Box>

              {/* EMPTY CART */}
              <Box
                sx={{
                  height: 103,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <Skeleton
                  variant="text"
                  width={330}
                  height={22}
                />
              </Box>

              {/* SUBTOTAL */}
              <Box
                sx={{
                  px: 2,
                  pt: 1.5,
                  pb: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  variant="text"
                  width={65}
                  height={22}
                />

                <Skeleton
                  variant="text"
                  width={55}
                  height={22}
                />
              </Box>

              {/* DISKON NOTA */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton
                  variant="text"
                  width={105}
                  height={22}
                />

                <Skeleton
                  variant="text"
                  width={55}
                  height={22}
                />
              </Box>

              {/* TOTAL */}
              <Box
                sx={{
                  px: 2,
                  pt: 1,
                  pb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Skeleton
                  variant="text"
                  width={65}
                  height={35}
                />

                <Skeleton
                  variant="text"
                  width={75}
                  height={18}
                />
              </Box>

              {/* PROSES */}
              <Box sx={{ px: 2, pb: 2 }}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={50}
                  sx={{ borderRadius: `${radii.md}px` }}
                />
              </Box>
            </Box>
          </Box>

          {/* ================================================= */}
          {/* RIGHT - PRODUK */}
          {/* ================================================= */}
          <Box
            sx={{
              width: 430,
              flexShrink: 0,
            }}
          >
            {/* SEARCH */}
            <Box
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: `${radii.md}px`,
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.card,
                p: 2,
                mb: 2,
              }}
            >
              <Skeleton
                variant="rounded"
                width="100%"
                height={60}
                sx={{
                  borderRadius: `${radii.md}px`,
                }}
              />
            </Box>

            {/* CATEGORY */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              <Skeleton
                variant="text"
                width={90}
                height={24}
              />

              <Skeleton
                variant="rounded"
                width={250}
                height={45}
                sx={{
                  borderRadius: `${radii.md}px`,
                }}
              />
            </Box>

            {/* PRODUCT LIST */}
            <Box
              sx={{
                maxHeight: "calc(100vh - 300px)",
                overflow: "hidden",
                pr: 0.5,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    bgcolor: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    borderRadius: `${radii.md}px`,
                    p: 1.5,
                    mb: 1.2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  {/* ICON */}
                  <Skeleton
                    variant="rounded"
                    width={32}
                    height={32}
                  />

                  {/* PRODUCT INFO */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width="75%"
                      height={22}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Skeleton
                        variant="text"
                        width={75}
                        height={18}
                      />

                      <Skeleton
                        variant="text"
                        width={50}
                        height={18}
                      />
                    </Box>
                  </Box>

                  {/* PRICE */}
                  <Skeleton
                    variant="text"
                    width={85}
                    height={25}
                  />

                  {/* PLUS */}
                  <Skeleton
                    variant="circular"
                    width={22}
                    height={22}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KasirLoadingSkeleton;