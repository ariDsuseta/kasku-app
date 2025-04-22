import {getLocalstorage, paginate} from "../utils.js";

export function renderRiwayat(content) {
  fetch("pages/riwayat.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupRiwayatPage();
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
