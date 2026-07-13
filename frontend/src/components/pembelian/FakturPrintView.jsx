import React from "react";
import terbilang from "../../utils/terbilang";
import { APOTEK_INFO } from "../../config/apotekConfig";

const formatRupiah = (n) =>
  (n || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 });

const formatTanggal = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatEd = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}.${yy}`;
};

const FakturPrintView = ({ faktur }) => {
  if (!faktur) return null;

  const { header, supplier, items = [] } = faktur;
  console.log(header);
  console.log(items);
  const subtotal = header.subtotal ?? items.reduce((acc, it) => acc + (it.subtotal || 0), 0);
  const ppn = header.ppn ?? Math.round(subtotal * ((header.nilai_ppn || 11) / 100));
  const dpp = header.jenis_ppn === "sudah_termasuk" ? subtotal - ppn : subtotal;
  const total = header.total || (header.jenis_ppn === "sudah_termasuk" ? subtotal : subtotal + ppn);

  return (
    <div className="faktur-print-area">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 2 }}>FAKTUR</div>
          <div style={{ border: "2px solid #111", padding: "8px 14px", minWidth: 180 }}>
            <div style={{ fontWeight: 700 }}>No. {header.no_faktur}</div>
            <div>Tgl. {formatTanggal(header.tanggal)}</div>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11 }}>
          <div style={{ fontWeight: 700 }}>Jatuh tempo</div>
          <div>{formatTanggal(header.jatuh_tempo)}</div>
          <div style={{ marginTop: 8, color: "#555" }}>Halaman 1 dari 1</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
            {supplier?.nama || header.supplier_name}
          </div>
          <div style={{ color: "#333" }}>{supplier?.alamat || "-"}</div>
          <div>Telp: {supplier?.telepon || "-"}</div>
          <div>Penanggung jawab: {supplier?.penanggungJawab || "-"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{APOTEK_INFO.nama}</div>
          <div>{APOTEK_INFO.alamat}</div>
          <div>Telp: {APOTEK_INFO.telepon}</div>
          <div>NPWP: {APOTEK_INFO.npwp}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          fontSize: 11,
          marginBottom: 14,
          padding: "10px 12px",
          border: "1px solid #ddd",
        }}
      >
        <div>
          <strong>Pembayaran:</strong> {header.jenis_pembayaran || "Tunai"}
        </div>
        <div>
          <strong>Akun:</strong> {header.akun_kas?.nama || header.akun_kas || "-"}
        </div>

        <div>
          <strong>Gudang:</strong> {header.gudang?.nama || header.gudang || "-"}
        </div>
        <div>
          <strong>Penerimaan:</strong> {formatTanggal(header.tanggal_penerimaan)}
        </div>
      </div>

      <table style={{ marginBottom: 12 }}>
        <thead>
          <tr>
            <th style={{ width: 36 }}>No.</th>
            <th>Barang</th>
            <th style={{ width: 80 }}>Batch</th>
            <th style={{ width: 56 }}>ED</th>
            <th style={{ width: 90 }}>Qty Satuan</th>
            <th style={{ width: 90 }}>Harga @</th>
            <th style={{ width: 70 }}>Diskon</th>
            <th style={{ width: 100 }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: 20, color: "#666" }}>
                Detail item belum tersedia untuk faktur ini.
              </td>
            </tr>
          ) : (
            items.map((row) => (
              <tr key={row.no}>
                <td style={{ textAlign: "center" }}>{row.no}</td>
                <td>{row.nama}</td>
                <td style={{ textAlign: "center" }}>{row.batch}</td>
                <td style={{ textAlign: "center" }}>{formatEd(row.expired_date)}</td>
                <td style={{ textAlign: "center" }}>
                  {row.qty} {row.satuan?.nama || row.satuan || "-"}
                </td>
                <td style={{ textAlign: "right" }}>{formatRupiah(row.harga)}</td>
                <td style={{ textAlign: "center" }}>
                  {row.diskon
                    ? row.diskon_tipe === "%"
                      ? `${row.diskon}%`
                      : formatRupiah(row.diskon)
                    : "-"}
                </td>
                <td style={{ textAlign: "right" }}>{formatRupiah(row.subtotal)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, alignItems: "start" }}>
        <div style={{ border: "1px solid #111", padding: 10, minHeight: 72 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Terbilang:</div>
          <div style={{ fontStyle: "italic", textTransform: "uppercase" }}>{terbilang(total)}</div>
        </div>
        <table>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700 }}>Subtotal</td>
              <td style={{ textAlign: "right", width: 120 }}>{formatRupiah(subtotal)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>DPP</td>
              <td style={{ textAlign: "right" }}>{formatRupiah(dpp)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>PPN {header.nilai_ppn || 11}%</td>
              <td style={{ textAlign: "right" }}>{formatRupiah(ppn)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 800 }}>Total</td>
              <td style={{ textAlign: "right", fontWeight: 800 }}>{formatRupiah(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 36, textAlign: "center" }}>
        <div>
          <div style={{ marginBottom: 56 }}>Penerima,</div>
          <div style={{ borderTop: "1px solid #111", paddingTop: 4 }}>(........................)</div>
        </div>
        <div>
          <div style={{ marginBottom: 56 }}>Hormat kami,</div>
          <div style={{ fontWeight: 700 }}>{supplier?.penanggungJawab || supplier?.nama || "-"}</div>
        </div>
        <div>
          <div style={{ marginBottom: 56 }}>Pegawai gudang,</div>
          <div style={{ borderTop: "1px solid #111", paddingTop: 4 }}>(........................)</div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "right", fontSize: 10, color: "#888" }}>
        Status pembayaran: {header.status}
      </div>
    </div>
  );
};

export default FakturPrintView;