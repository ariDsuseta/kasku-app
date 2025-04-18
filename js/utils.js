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

export function getPaginationPages(currentPage, totalPages, maxVisible = 5) {
	const pages = [];
	const half = Math.floor(maxVisible / 2);
	let start = Math.max(1, currentPage - half);
	let end = Math.min(totalPages, currentPage + half);

	if (start > 1) {
		pages.push(1);
		if (start > 2) pages.push('...');
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	if (end < totalPages) {
		if (end < totalPages - 1) pages.push('...');
		pages.push(totalPages);
	}

	return pages;
}

export function getData(key) {
	return JSON.parse(localStorage.getItem(key)) || [];
}