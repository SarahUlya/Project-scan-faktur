import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PaginationControls = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];

    // Kalau total halaman sedikit, tampilkan semua
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Selalu tampilkan halaman pertama
      pages.push(1);

      // Titik kiri
      if (page > 3) {
        pages.push("...");
      }

      // Halaman sekitar current page
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      // Titik kanan
      if (page < totalPages - 2) {
        pages.push("...");
      }

      // Selalu tampilkan halaman terakhir
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
          background: "#fff",
          border: "1px solid #F1F5F9",
          borderRadius: 8,
          color: page <= 1 ? "#CBD5E1" : "#64748B",
          cursor: page <= 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </button>

      {/* Nomor halaman */}
      {getPageNumbers().map((item, index) => {
        // Ellipsis (...)
        if (item === "...") {
          return (
            <span
              key={index}
              style={{
                padding: "0 4px",
                color: "#64748B",
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
              background: isCurrent ? "rgb(233, 30, 99)" : "#fff",
              border: isCurrent ? "none" : "1px solid #F1F5F9",
              borderRadius: 8,
              color: isCurrent ? "#fff" : "#64748B",
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
          background: "#fff",
          border: "1px solid #F1F5F9",
          borderRadius: 8,
          color: page >= totalPages ? "#CBD5E1" : "#64748B",
          cursor: page >= totalPages ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </button>
    </div>
  );
};

export default PaginationControls;