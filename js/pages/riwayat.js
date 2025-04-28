import {
	createElement, escapeHTML,
	exportToCSV,
	getLocalstorage,
	paginate,
	printElement,
	tampilkanStatus,
} from "../utils.js";

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
  const rowsPerPage = 12;
  if (dataKategori.length <= rowsPerPage)
    document.getElementById("pagination").style.display = "none";
  // console.log(dataKategori);
  paginate({
    data: dataKategori,
    rowsPerPage,
    currentPage: 1,
    maxButton: 5,
    renderRows: (data, startIndex) =>
      data
        .map(
          (item, i) => `
					<tr class="no-wrap ${item.jenis === "pemasukan" ? "bg-success" : ""}">
						<td style="text-align: center!important;">${startIndex + i + 1}</td>
						<td>${item.tanggal}</td>
						<td>${item.kategori}</td>
						<td>Rp ${item.nominal.toLocaleString("id-ID")}</td>
						<td>${item.jenis}</td>
						<td>${item.catatan}</td>
					</tr>
				`,
        )
        .join(""),
    renderContainer: tableBody,
    paginationContainer,
  });

  // 	load status
  tampilkanStatus(getLocalstorage("alert"), 700, 1500);
};

function renderPrint() {

  document.getElementById("btnPrintRiwayat").addEventListener("click", () => {
		const formElTitle = document.querySelector("form#judul-transaksi[data-content-title='judul-transaksi']");
		if (formElTitle) return;

		const formTitle = createElement({
			tag:"form",
			className: "form-title absolute flex gap-1 item-center",
			id:"judul-transaksi",
			attributes:{
				style: "top:20px; right:10px; min-width:300px; z-index:60;",
				'data-content-title': "judul-transaksi"
			},
			children:[
				createElement({
					tag: "input",
					className: "input-title",
					attributes:{
						style: "margin-bottom:0;",
						name: "title",
						placeholder: "Judul transaksi"
					}
				}),
				createElement({
					tag: "button",
					className: "print",
					textContent: "Print",
					attributes:{
						type: "submit",
						style: "padding: .5rem 1.2rem; background-color:var(--success-color)"
					}
				})
			],
			eventListeners: {
				submit: (e) => {
					e.preventDefault();
					titleInput(formTitle);
				}
			}
		});
		document.body.appendChild(formTitle);

		document.addEventListener("keydown", (event) => {
			if(event.key === "Escape"){
				formTitle.remove();
			}
		});
		document.onclick = (event) => {
			const titleClassName = event.target.className;
			const excludeClass = ["print", "form-title", "input-title"];
			const shouldProcess = !excludeClass.includes(titleClassName);
			if(shouldProcess) formTitle.remove();
		}
  });
  // 	CSV export
  document
    .getElementById("btn-export-csv")
    .addEventListener("click", () => handleExportCSV());
}

function titleInput(formInput) {
	const html = getAllTransaksiHTML();
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = html;

	printElement(
		tempDiv,
		escapeHTML(formInput.title.value),
		"td:last-child, th:last-child { display: none; }",
	);
	formInput.remove();
}

function handleExportCSV() {
  const filter = document.getElementById("filter-export").value;
  const data = getLocalstorage(kategoriKey) || [];
  let dataExport = data;

  if (filter !== "semua")
    dataExport = data.filter((item) => item.jenis === filter);

  exportToCSV({
    data: dataExport,
    fileName: `riwayat-${filter}.csv`,
    headers: ["id", "tanggal", "kategori", "nominal", "jenis", "catatan"],
  });
  setupRiwayatPage();
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
	`,
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
