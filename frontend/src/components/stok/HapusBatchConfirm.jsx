import React from "react";

const HapusBatchConfirm = ({ batchId, onClose }) => {
  if (!batchId) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Hapus Batch</h3>
      <p>Apakah Anda yakin ingin menghapus batch <b>{batchId}</b>?</p>
      <div style={{ marginTop: 24 }}>
        <button onClick={onClose} style={{ marginRight: 12 }}>
          Batal
        </button>
        <button style={{ background: "#ff4d4f", color: "#fff" }}>
          Hapus
        </button>
      </div>
    </div>
  );
};

export default HapusBatchConfirm;
