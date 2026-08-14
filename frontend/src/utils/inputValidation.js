export const validateNumberOnly = (value) => {
  return /^\d*$/.test(value);
};

export const validateLettersOnly = (value) => {
  return /^[a-zA-Z\s]*$/.test(value);
};

export const validateAlphanumeric = (value) => {
  return /^[a-zA-Z0-9]*$/.test(value);
};

export const formatPhoneInput = (value) => {
  return value.replace(/\D/g, "");
};

export const formatNameInput = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, "");
};

export const formatBarcodeInput = (value) => {
  return value.replace(/[^a-zA-Z0-9]/g, "");
};

export const validatePhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 13;
};

export const validateBarcode = (value) => {
  return value.length >= 5;
};
