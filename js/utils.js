export function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[
        tag
      ] || tag)
  );
}

export function validateDataFormat(data) {
  if (!data || typeof data !== "object")
    throw new Error("File JSON tidak valid");
  if (!Array.isArray(data.kategori))
    throw new Error("Data kategori tidak valid");
  if (!Array.isArray(data.transaksi))
    throw new Error("Data transaksi tidak valid");

  // Validasi kategori
  data.kategori.forEach((kat) => {
    if (typeof kat.nama !== "string") throw new Error("Format kategori salah");
  });

  // Validasi transaksi
  data.transaksi.forEach((tx) => {
    if (
      typeof tx.id !== "number" ||
      typeof tx.tanggal !== "string" ||
      typeof tx.kategori !== "string" ||
      typeof tx.jenis !== "string" ||
      typeof tx.nominal !== "number" ||
      typeof tx.catatan !== "string"
    ) {
      throw new Error("Format transaksi salah");
    }
  });

  return true;
}
