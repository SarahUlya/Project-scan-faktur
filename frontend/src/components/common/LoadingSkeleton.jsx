import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens";

/**
 * Universal Loading Skeleton
 *
 * Variants:
 * - table (default)
 * - cards
 * - form
 * - list
 *
 * Examples:
 *
 * <LoadingSkeleton />
 * <LoadingSkeleton variant="table" rows={10} />
 * <LoadingSkeleton variant="cards" rows={4} />
 * <LoadingSkeleton variant="form" />
 * <LoadingSkeleton variant="list" rows={8} />
 */

const LoadingSkeleton = ({
  variant = "table",
  rows = 5,
  columns = 5,
  height = 56,
}) => {
  switch (variant) {
    case "cards":
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(4,1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              animation="wave"
              height={120}
            />
          ))}
        </Box>
      );

    case "form":
      return (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={55} animation="wave" />
          <Skeleton variant="rounded" height={55} animation="wave" />
          <Skeleton variant="rounded" height={55} animation="wave" />
          <Skeleton variant="rounded" height={150} animation="wave" />
          <Skeleton variant="rounded" width={180} height={45} animation="wave" />
        </Stack>
      );

    case "list":
      return (
        <Stack spacing={1}>
          {Array.from({ length: rows }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1,
                borderRadius: `${radii.sm}px`,
                backgroundColor: colors.bgCard,
                boxShadow: shadows.card,
                transition: transitions.fast,
                "&:hover": {
                  boxShadow: shadows.cardHover,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                animation="wave"
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton height={18} animation="wave" />
                <Skeleton width="60%" height={18} animation="wave" />
              </Box>
            </Box>
          ))}
        </Stack>
      );

    case "table":
    default:
      return (
        <Stack spacing={1}>
          {Array.from({ length: rows }).map((_, row) => (
            <Box
              key={row}
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: 2,
              }}
            >
              {Array.from({ length: columns }).map((_, col) => (
                <Skeleton
                  key={col}
                  variant="rounded"
                  animation="wave"
                  height={height}
                />
              ))}
            </Box>
          ))}
        </Stack>
      );
  }
};

export default LoadingSkeleton;