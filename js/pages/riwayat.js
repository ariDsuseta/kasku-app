import { getLocalstorage, paginate, printElement } from "../utils.js";

export function renderRiwayat(content) {
  fetch("pages/riwayat.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupRiwayatPage();
      renderPrint();
    });
}

const kategoriKey = "transaksiKasKu";

const setupRiwayatPage = () => {
  const dataKategori = getLocalstorage(kategoriKey) || [];
  const tableBody = document.getElementById("riwayat-body");
  const paginationContainer = document.querySelector("#pagination");
  paginate({
    data: dataKategori,
    rowsPerPage: 12,
    currentPage: 1,
    maxButton: 5,
    renderRows: (data, startIndex) =>
      data
        .map(
          (item, i) => `
					<tr class="no-wrap ${item.jenis === "pemasukan" ? "bg-success" : ""}">
						<td>${startIndex + i + 1}</td>
						<td>${item.tanggal}</td>
						<td>${item.kategori}</td>
						<td>Rp ${item.nominal.toLocaleString("id-ID")}</td>
						<td>${item.jenis}</td>
						<td>${item.catatan}</td>
					</tr>
				`
        )
        .join(""),
    renderContainer: tableBody,
    paginationContainer,
  });
};

function renderPrint() {
  document.getElementById("btnPrintRiwayat").addEventListener("click", () => {
    const html = getAllTransaksiHTML();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    printElement(
      tempDiv,
      "Riwayat Transaksi",
      "td:last-child, th:last-child { display: none; }"
    );
  });
}

function getAllTransaksiHTML(storageKey = "transaksiKasKu") {
  const transaksi = getLocalstorage(storageKey) || [];
  if (transaksi.length === 0) return "<p>Tidak ada data transaksi.</p>";

  const rows = transaksi
    .map(
      (item, i) => `
		<tr>
			<td style="text-align: center;">${i + 1}</td>
			<td>${item.kategori}</td>
			<td style="color:${item.jenis === "pemasukan" ? "#28a745" : "#dc3545"}">${
        item.jenis
      }</td>
			<td>Rp ${item.nominal.toLocaleString("id-ID")}</td>
			<td>${item.tanggal}</td>
			<td>${item.catatan}</td>
		</tr>
	`
    )
    .join("");

  return `
		<table border="1" cellspacing="0" cellpadding="6" style="width:100%; border-collapse: collapse;">
			<thead>
				<tr>
					<th style="width: 30px; text-align:center;">No</th>
					<th>Kategori</th>
					<th>Jenis</th>
					<th>Nominal</th>
					<th>Tanggal</th>
					<th>Catatan</th>
				</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>
	`;
}
