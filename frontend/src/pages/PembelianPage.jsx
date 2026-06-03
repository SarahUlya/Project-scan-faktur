import React, { useMemo, useState } from "react";
import FakturTable from "../components/pembelian/FakturTable";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePembelianDb from "../hooks/usePembelianDb";
import PaginationControls from "../components/ui/PaginationControls";

const PAGE_SIZE = 25;

const PembelianPage = () => {
  const navigate = useNavigate();

  const { pembelian = [], loading } = usePembelianDb();

  const [page, setPage] = useState(1);

  const totalFaktur = pembelian.length;

  const totalPembelian = useMemo(
    () =>
      pembelian.reduce(
        (acc, curr) => acc + Number(curr.total || 0),
        0
      ),
    [pembelian]
  );

  const lunas = useMemo(
    () =>
      pembelian.filter(
        (p) => p.status?.toUpperCase() === "LUNAS"
      ).length,
    [pembelian]
  );

  const belumBayar = useMemo(
    () =>
      pembelian.filter(
        (p) => p.status?.toUpperCase() !== "LUNAS"
      ).length,
    [pembelian]
  );

  const totalPages = Math.ceil(
    totalFaktur / PAGE_SIZE
  );

  const pagedPembelian = useMemo(
    () =>
      pembelian.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      ),
    [pembelian, page]
  );

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 28,
              color: "#172033",
            }}
          >
            Daftar Data Faktur
          </h2>

          <div
            style={{
              marginTop: 8,
              color: "#64748B",
              fontSize: 15,
            }}
          >
            Manajemen invoice pembelian barang ke supplier
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          {/* SEARCH */}
          <div
            style={{
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              placeholder="Cari faktur..."
              style={{
                width: 260,
                padding: "14px 16px 14px 45px",
                borderRadius: 18,
                border: "none",
                outline: "none",
                background: "#fff",
                fontSize: 14,
                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.04)",
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              navigate("/pembelian/tambah")
            }
            style={{
              border: "none",
              borderRadius: 18,
              background:
                "linear-gradient(135deg,#EC4899,#E91E63)",
              color: "#fff",
              padding: "14px 24px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow:
                "0 10px 25px rgba(233,30,99,0.25)",
            }}
          >
            <span
              style={{
                fontSize: 18,
              }}
            >
              +
            </span>

            Tambah Data Faktur
          </button>
        </div>
      </div>

      {/* CARD STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0,1fr))",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {[
          {
            title: "TOTAL FAKTUR",
            value: loading ? "-" : totalFaktur,
            color: "#94A3B8",
          },
          {
            title: "TOTAL PEMBELIAN",
            value: loading
              ? "-"
              : `Rp ${totalPembelian.toLocaleString(
                "id-ID"
              )}`,
            color: "#94A3B8",
          },
          {
            title: "SUDAH LUNAS",
            value: loading ? "-" : lunas,
            color: "#22C55E",
          },
          {
            title: "BELUM BAYAR",
            value: loading ? "-" : belumBayar,
            color: "#EF4444",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "20px 24px",
              height: 95,
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                color: item.color,
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#172033",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow:
            "0 20px 40px rgba(233,30,99,0.08)",
        }}
      >
        <FakturTable
          data={pagedPembelian}
          loading={loading}
          startIndex={(page - 1) * PAGE_SIZE}
          onView={(row) => {
            navigate(
              `/pembelian/lihat/${encodeURIComponent(
                row.id
              )}`
            );
          }}
        />

        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#64748B",
            fontSize: 14,
          }}
        >
          <div>
            Menampilkan {pagedPembelian.length}
            {" dari "}
            {pembelian.length} faktur
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </Box>
    </Box>
  );
};

export default PembelianPage;