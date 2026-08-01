import React from "react";
import { Box, Skeleton } from "@mui/material";
import {
  colors,
  statCardSx,
} from "@/theme/designTokens";

const PembelianLoadingSkeleton = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Skeleton
            variant="text"
            width={280}
            height={42}
            sx={{ mb: 0.5 }}
          />
          <Skeleton
            variant="text"
            width={360}
            height={24}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={240}
            height={40}
          />

          <Skeleton
            variant="rounded"
            width={160}
            height={40}
          />
        </Box>
      </Box>

      {/* Statistik */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              ...statCardSx,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Skeleton
                variant="text"
                width={100}
                height={18}
              />

              <Skeleton
                variant="text"
                width={130}
                height={38}
                sx={{ mt: 0.5 }}
              />

              <Skeleton
                variant="text"
                width={120}
                height={18}
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Skeleton
              variant="circular"
              width={54}
              height={54}
            />
          </Box>
        ))}
      </Box>

      {/* Table */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: 2,
          border: `1px solid ${colors.borderLight}`,
          overflow: "hidden",
        }}
      >
        {/* Header Table */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "70px 220px 180px 180px 150px 180px",
            gap: 2,
            px: 3,
            py: 2,
            borderBottom: `1px solid ${colors.borderLight}`,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width="80%"
              height={24}
            />
          ))}
        </Box>

        {/* Body */}
        {Array.from({ length: 6 }).map((_, row) => (
          <Box
            key={row}
            sx={{
              display: "grid",
              gridTemplateColumns:
                "70px 220px 180px 180px 150px 180px",
              gap: 2,
              px: 3,
              py: 2,
              alignItems: "center",
              borderBottom:
                row !== 5
                  ? `1px solid ${colors.borderLight}`
                  : "none",
            }}
          >
            <Skeleton variant="text" width={30} />

            <Box>
              <Skeleton
                variant="text"
                width={160}
                height={22}
              />
              <Skeleton
                variant="text"
                width={110}
                height={18}
              />
            </Box>

            <Skeleton
              variant="text"
              width={140}
              height={22}
            />

            <Skeleton
              variant="rounded"
              width={90}
              height={28}
            />

            <Skeleton
              variant="text"
              width={120}
              height={22}
            />

            <Skeleton
              variant="rounded"
              width={120}
              height={34}
            />
          </Box>
        ))}

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${colors.borderLight}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="text"
            width={200}
            height={22}
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton
              variant="rounded"
              width={36}
              height={36}
            />
            <Skeleton
              variant="rounded"
              width={36}
              height={36}
            />
            <Skeleton
              variant="rounded"
              width={36}
              height={36}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PembelianLoadingSkeleton;