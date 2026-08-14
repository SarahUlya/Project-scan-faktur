import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";


const PaginationControls = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Tombol Previous */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        style={{
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: page <= 1 ? colors.textSecondary : colors.text,
          cursor: page <= 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </button>

      {/* Nomor halaman */}
      {getPageNumbers().map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={index}
              style={{
                padding: "0 4px",
                color: colors.textSecondary,
                fontWeight: 600,
              }}
            >
              ...
            </span>
          );
        }

        const isCurrent = page === item;

        return (
          <button
            key={index}
            onClick={() => onChange(item)}
            style={{
              minWidth: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isCurrent ? "rgb(233, 30, 99)" : colors.bg,
              border: isCurrent ? "none" : `1px solid ${colors.border}`,
              borderRadius: 8,
              color: isCurrent ? colors.bgCard : colors.text,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              padding: "0 8px",
            }}
          >
            {item}
          </button>
        );
      })}

      {/* Tombol Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: page >= totalPages ? colors.textSecondary : colors.text,
          cursor: page >= totalPages ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </button>
    </div>
  );
};

export default PaginationControls;