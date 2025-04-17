import {sanitizeInput} from "../utils.js";

const kategoriKey = 'data-kategori';
export function renderKategori(content) {
	content.innerHTML = `
		<div class="mtxl">
			<section class="kategori-page">
				<h2>Manajemen Kategori</h2>
				<form id="form-kategori">
					<input type="hidden" name="id" />
					<input type="text" name="nama" placeholder="Nama kategori" required />
					<button type="submit">Simpan</button>
				</form>
	
				<table class="tabel-kategori">
					<thead>
						<tr>
							<th>No</th>
							<th>Nama Kategori</th>
							<th>Aksi</th>
						</tr>
					</thead>
					<tbody id="daftar-kategori"></tbody>
				</table>
			</section>
		</div>
  `;

	const form = document.querySelector("#form-kategori");
	const tBody = document.querySelector("#daftar-kategori");

	// 	render tabel
	function tampilkanKategori() {
		const data = JSON.parse(localStorage.getItem(kategoriKey) || '[]');
		tBody.innerHTML = "";

		data.forEach((item, i) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${i + 1}</td>
        <td>${item.nama}</td>
        <td class="text-center">
          <button data-id="${item.id}" class="edit-btn">Edit</button>
          <button data-id="${item.id}" class="hapus-btn">Hapus</button>
        </td>
			`;
			tBody.appendChild(tr);
		});
	}

	tampilkanKategori();
	// 	submit form
	form.onsubmit = function (e){
		e.preventDefault();
		const id = form.id.value;
		const nama = sanitizeInput(form.nama.value.trim());
		if (!nama) return;

		let data = JSON.parse(localStorage.getItem(kategoriKey) || '[]');
		if (id) {
			const index = data.findIndex(k => k.id.toString() === id);
			data[index].nama = nama;
		} else {
			const newKategori = {id: Date.now(), nama};
			data.push(newKategori);
		}
		localStorage.setItem("data-kategori", JSON.stringify(data));
		form.id.removeAttribute('value');
		form.reset();
		tampilkanKategori();
	};

	// Tombol Edit & Hapus
	tBody.onclick = function (e) {
		if (e.target.classList.contains("edit-btn")) {
			const id = e.target.dataset.id;
			const data = JSON.parse(localStorage.getItem("data-kategori") || "[]");
			const kategori = data.find(k => k.id == id);
			if (kategori) {
				form.id.value = kategori.id;
				form.nama.value = kategori.nama;
			}
		}

		if (e.target.classList.contains("hapus-btn")) {
			const id = e.target.dataset.id;
			if (confirm("Yakin ingin menghapus kategori ini?")) {
				let data = JSON.parse(localStorage.getItem("data-kategori") || "[]");
				data = data.filter(k => k.id != id);
				localStorage.setItem("data-kategori", JSON.stringify(data));
				tampilkanKategori();
			}
		}
	};
}