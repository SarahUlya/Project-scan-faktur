import React from "react";
import { Box, Skeleton } from "@mui/material";
import { colors } from "@/theme/designTokens";

const LaporanLoadingSkeleton = () => {
  return (
    <Box sx={{ minHeight: "100vh", background: colors.bg, px: 3, pt: 3, pb: 4 }}>

      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Skeleton variant="text" width={300} height={42} />
          <Skeleton
            variant="text"
            width={240}
            height={24}
            sx={{ mt: 1 }}
          />
        </Box>

        <Skeleton
          variant="rounded"
          width={250}
          height={52}
          sx={{ borderRadius: 3 }}
        />
      </Box>

      {/* ================= MENU ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 3,
          mb: 4,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: colors.bgCard,
              borderRadius: 4,
              border: `1px solid ${colors.border}`,
              p: 3,
            }}
          >
            <Skeleton
              variant="rounded"
              width={46}
              height={46}
              sx={{ borderRadius: 3, mb: 2 }}
            />

            <Skeleton
              variant="text"
              width="80%"
              height={28}
            />

            <Skeleton
              variant="text"
              width="60%"
              height={20}
            />
          </Box>
        ))}
      </Box>

      {/* ================= SUMMARY ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 3,
          mb: 3,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: colors.bgCard,
              borderRadius: 4,
              border: `1px solid ${colors.border}`,
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={50}
              height={50}
            />

            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width={60}
                height={34}
              />

              <Skeleton
                variant="text"
                width={120}
                height={20}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* ================= PREVIEW ================= */}

      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: 4,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <Box>
            <Skeleton
              variant="text"
              width={260}
              height={32}
            />

            <Skeleton
              variant="text"
              width={180}
              height={20}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton
              variant="rounded"
              width={150}
              height={42}
              sx={{ borderRadius: 3 }}
            />

            <Skeleton
              variant="rounded"
              width={150}
              height={42}
              sx={{ borderRadius: 3 }}
            />
          </Box>
        </Box>

        {/* TABLE */}

        <Box sx={{ p: 3 }}>

          {/* Header */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr 1fr 1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                height={24}
              />
            ))}
          </Box>

          {/* Rows */}

          {Array.from({ length: 8 }).map((_, row) => (
            <Box
              key={row}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1fr 1fr 1fr 1fr",
                gap: 2,
                py: 1.8,
                borderBottom:
                  row !== 7
                    ? `1px solid ${colors.borderLight}`
                    : "none",
              }}
            >
              {Array.from({ length: 5 }).map((_, col) => (
                <Skeleton
                  key={col}
                  height={24}
                />
              ))}
            </Box>
          ))}

          {/* Footer */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            <Skeleton
              width={170}
              height={22}
            />

            <Skeleton
              width={210}
              height={36}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LaporanLoadingSkeleton;