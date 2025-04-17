export function renderRiwayat(content) {
  fetch("pages/riwayat.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupRiwayatPage();
    });
}

const setupRiwayatPage = () => {
  const data = JSON.parse(localStorage.getItem("transaksiKasKu") || "[]");

  // Urutkan dari terbaru
  const sorted = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const tbody = document.getElementById("riwayat-body");
  tbody.innerHTML = "";

  sorted.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
			<td>${index + 1}</td>
      <td>${item.tanggal}</td>
      <td>${item.kategori}</td>
      <td class="${
        item.jenis === "pengeluaran" ? "minus" : "plus"
      }">Rp ${Number(item.nominal).toLocaleString()}</td>
      <td class="${item.jenis === "pengeluaran" ? "minus" : "plus"}">${
      item.jenis
    }</td>
      <td>${item.catatan}</td>
    `;

    tbody.appendChild(row);
  });
};
