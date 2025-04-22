import {createElement, elFollowMe, escapeHTML, getLocalstorage, saveLocalStorage} from "../utils.js";

export function renderKategori(content) {
	fetch("pages/kategori.html")
	.then(res => res.text())
	.then(html => {
		content.innerHTML = html;
		setupKategoriPage();
	});
}


const kategoriKey = "data-kategori";
const dataKategori = getLocalstorage(kategoriKey) || [];

function addData(form, event){
	event.preventDefault();
	const dataInput = {
		id: Date.now(),
		nama: form.nama.value
	}
	// jika ada data yang sama timpa
	const index = dataKategori.findIndex(item => item.nama === dataInput.nama);
	if (index !== -1){
		dataKategori[index] = dataInput;
		tampilkanDaftarKategori();
		form.reset();
		return;
	}
	dataKategori.push(dataInput);
	saveLocalStorage(kategoriKey, JSON.stringify(dataKategori));
	tampilkanDaftarKategori();
	form.reset();
}

function setupKategoriPage(){
	const formEl = document.getElementById("form-kategori");

	if (dataKategori!== 0){
		tampilkanDaftarKategori();
		formEl.addEventListener("submit", function (e) {
			addData(this, e);
		});
	}
}

function hapusData(id, conf = confirm("Yakin ingin menghapus data ini!")){
	const index = dataKategori.findIndex(data => data.id === id);

	if (!conf) return;

	if (index !== -1){
		dataKategori.splice(index, 1);
		saveLocalStorage(kategoriKey, JSON.stringify(dataKategori));
		tampilkanDaftarKategori();
	}
}

function editData(id) {
	if (window.innerWidth <= 375) document.getElementById("app-content").scrollIntoView({behavior:"smooth", block: "start"});
// 	lanjut nanti
}

function tampilkanDaftarKategori(){
	const tableBody = document.getElementById("daftar-kategori");
	tableBody.innerHTML = "";
	if (tableBody){
		dataKategori.forEach((data, index) => {
			const row = createElement({tag:'tr'});
			const noCell = createElement({tag:"td", textContent: index + 1});
			const namaCell = createElement({tag:"td", textContent: data.nama});
			const aksiCell = createElement({
				tag: "td",
				attributes: {
					'style' : "text-align:center"
				},
				children:[
					createElement({
						tag: "button",
						attributes: {
							'type': "button"
						},
						textContent: "edit",
						eventListeners: {
							'click': () => editData(data.id)
						}
					}),
					createElement({
						tag: "button",
						attributes: {
							'type': "button"
						},
						textContent: "hapus",
						eventListeners: {
							'click': () => hapusData(data.id)
						}
					})
				]
			});
			row.appendChild(noCell);
			row.appendChild(namaCell);
			row.appendChild(aksiCell);
			tableBody.appendChild(row);
		});
	}
}