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

import { colors } from "@/theme/designTokens";

const ProdukLoadingSkeleton = () => {
  const rows = Array.from({ length: 8 });

  return (
    <Box>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          background: colors.bgLight,
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(15,118,110,.08)",
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
          <Box
            sx={{
              flex: 1,
              minWidth: 280,
            }}
          >
            <Skeleton
              variant="text"
              width={260}
              height={42}
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
              gap: 2,
              alignItems: "center",
              minWidth: 480,
            }}
          >
            <Skeleton
              variant="rounded"
              width={320}
              height={44}
              sx={{ borderRadius: 3 }}
            />

            <Skeleton
              variant="rounded"
              width={130}
              height={44}
              sx={{ borderRadius: 3 }}
            />
          </Box>
        </Box>
      </Box>

      {/* ================= TABLE ================= */}

      <Box
        sx={{
          background: colors.bgLight,
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(15,118,110,.08)",
          overflow: "hidden",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            borderRadius: 3,
            background: colors.bgLight,
          }}
        >
          <Table sx={{ minWidth: 980 }}>
            <colgroup>
              <col style={{ width: 260 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 80 }} />
            </colgroup>

            {/* HEADER */}

            <TableHead>
              <TableRow>
                {[
                  180,
                  110,
                  80,
                  120,
                  80,
                  60,
                  50,
                ].map((w, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      borderBottom: `2px solid ${colors.border}`,
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Skeleton
                      width={w}
                      height={20}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* BODY */}

            <TableBody>
              {rows.map((_, index) => (
                <TableRow key={index}>
                  {/* Nama */}
                  <TableCell
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      width="75%"
                      height={22}
                    />

                    <Skeleton
                      width="45%"
                      height={16}
                    />
                  </TableCell>

                  {/* kategori */}

                  <TableCell
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      width="80%"
                      height={20}
                    />
                  </TableCell>

                  {/* satuan */}

                  <TableCell
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      width="60%"
                      height={20}
                    />
                  </TableCell>

                  {/* harga */}

                  <TableCell
                    align="right"
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      width={90}
                      height={20}
                      sx={{ ml: "auto" }}
                    />
                  </TableCell>

                  {/* stok */}

                  <TableCell
                    align="center"
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      width={40}
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                  </TableCell>

                  {/* status */}

                  <TableCell
                    align="center"
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      width={60}
                      height={26}
                      sx={{
                        mx: "auto",
                        borderRadius: 999,
                      }}
                    />
                  </TableCell>

                  {/* aksi */}

                  <TableCell
                    align="center"
                    sx={{
                      borderBottom:
                        index === rows.length - 1
                          ? "none"
                          : `1px solid ${colors.border}`,
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      width={34}
                      height={34}
                      sx={{
                        mx: "auto",
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ================= FOOTER ================= */}

        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton
            width={180}
            height={20}
          />

          <Skeleton
            variant="rounded"
            width={180}
            height={36}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProdukLoadingSkeleton;