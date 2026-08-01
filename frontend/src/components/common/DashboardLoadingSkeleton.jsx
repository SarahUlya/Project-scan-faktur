import React from "react";
import {
  Box,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { colors, pageHeaderSx, statCardSx } from "@/theme/designTokens";

const DashboardLoadingSkeleton = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={220} height={42} />
        <Skeleton variant="text" width={320} height={24} />
      </Box>

      {/* Stat Card Atas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 2,
          mb: 2,
        }}
      >
        {[1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              ...statCardSx,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Skeleton
              variant="rounded"
              width={44}
              height={44}
              sx={{ borderRadius: 2 }}
            />

            <Box sx={{ flex: 1 }}>
              <Skeleton width={120} height={18} />
              <Skeleton width={160} height={34} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Stat Card Bawah */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              ...statCardSx,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Skeleton
              variant="rounded"
              width={44}
              height={44}
              sx={{ borderRadius: 2 }}
            />

            <Box sx={{ flex: 1 }}>
              <Skeleton width={110} height={18} />
              <Skeleton width={140} height={34} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Table Card */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: 2,
          border: `1px solid ${colors.borderLight}`,
          p: 2.5,
        }}
      >
        <Skeleton width={220} height={28} />
        <Skeleton width={280} height={20} sx={{ mb: 2 }} />

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            borderRadius: 2,
          }}
        >
          <Table>
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "17.5%" }} />
              <col style={{ width: "17.5%" }} />
            </colgroup>

            <TableHead>
              <TableRow>
                {[160, 110, 80, 90].map((width, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      borderBottom: "2px solid" + colors.borderLight,
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Skeleton width={width} height={20} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: 5 }).map((_, row) => (
                <TableRow key={row}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                      />

                      <Box>
                        <Skeleton width={150} height={20} />
                        <Skeleton width={100} height={16} />
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Skeleton width={100} height={20} />
                  </TableCell>

                  <TableCell align="center">
                    <Skeleton
                      width={60}
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Skeleton
                      width={60}
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DashboardLoadingSkeleton;