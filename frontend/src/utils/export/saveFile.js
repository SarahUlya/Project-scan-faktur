/**
 * Save blob ke file — pakai File System Access API kalau didukung,
 * fallback ke download link biasa.
 */
export async function saveFile(blob, fileName, mimeType) {
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: mimeType,
            accept: {
              [mimeType]: ["." + fileName.split(".").pop()],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper: bikin nama file dengan tanggal suffix
 */
export function buildFilename(baseName, ext) {
  const date = new Date().toISOString().slice(0, 10);
  return `${baseName}_${date}.${ext}`;
}