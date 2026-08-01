import React from "react";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Table = ({ columns, data, highlightRows = [] }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        borderRadius: 1,
        background: colors.bgCard,
        overflowX: "auto",
      }}
    >
      <MuiTable sx={{ minWidth: 650, width: "100%" }}>
        <colgroup>
          {columns.map((col, idx) => (
            <col key={idx} style={{ width: col.width || "auto" }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                sx={{
                  fontWeight: 700,
                  color: colors.textMuted,
                  background: "transparent",
                  borderBottom: "2px solid " + colors.border,
                  fontSize: 15,
                  px: 2,
                  py: 1.5,
                  textAlign: col.align || "left",
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: "center", color: colors.textMuted, py: 8, fontSize: 15 }}>
                Tidak ada data untuk ditampilkan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={row.id || idx}>
                {columns.map((col, cidx) => (
                  <TableCell
                    key={cidx}
                    sx={{
                      fontWeight: col.bold ? 700 : 500,
                      color: col.bold && col.color ? col.color : colors.text,
                      fontSize: 15,
                      borderBottom:
                        idx === data.length - 1 ? "none" : "1px solid " + colors.border,
                      px: 2,
                      py: 1.5,
                      textAlign: col.align || "left",
                    }}
                  >
                    {col.render ? col.render(row, idx) : row[col.accessor]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
