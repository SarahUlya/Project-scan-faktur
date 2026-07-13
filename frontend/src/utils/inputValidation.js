/**
 * Input Validation Utilities
 * Untuk standardisasi validasi input di seluruh aplikasi
 */

// Validasi hanya angka
export const validateNumberOnly = (value) => {
  return /^\d*$/.test(value);
};

// Validasi hanya huruf (termasuk spasi untuk nama)
export const validateLettersOnly = (value) => {
  return /^[a-zA-Z\s]*$/.test(value);
};

// Validasi huruf dan angka (untuk barcode)
export const validateAlphanumeric = (value) => {
  return /^[a-zA-Z0-9]*$/.test(value);
};

// Format nomor telepon (hanya angka)
export const formatPhoneInput = (value) => {
  return value.replace(/\D/g, "");
};

// Format nama (hanya huruf dan spasi)
export const formatNameInput = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, "");
};

// Format barcode (huruf dan angka)
export const formatBarcodeInput = (value) => {
  return value.replace(/[^a-zA-Z0-9]/g, "");
};

// Validasi telepon Indonesia
export const validatePhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  // Telepon Indonesia biasanya 10-13 digit
  return cleaned.length >= 10 && cleaned.length <= 13;
};

// Validasi barcode (minimal 5 karakter)
export const validateBarcode = (value) => {
  return value.length >= 5;
};
