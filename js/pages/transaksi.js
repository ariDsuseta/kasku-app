import { escapeHTML, getPaginationPages } from "../utils.js";

export function renderTransaksi(content) {
  fetch("pages/transaksi.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupTransaksiPage();
    });
}

function setupTransaksiPage() {
  const form = document.getElementById("form-transaksi");
  const daftar = document.getElementById("daftar-transaksi");
  const totalPemasukan = document.getElementById("total-pemasukan");
  const totalPengeluaran = document.getElementById("total-pengeluaran");
  const saldo = document.getElementById("saldo");
  const transaksiKey = "transaksiKasKu";

  function getData() {
    return JSON.parse(localStorage.getItem(transaksiKey)) || [];
  }

  function tampilkanDaftarTransaksi(page = 1) {
		const data = getData(); // Ambil dari localStorage
		const perHalaman = 5;
		const totalHalaman = Math.ceil(data.length / perHalaman);
		const mulai = (page - 1) * perHalaman;
		const dataShow = data.slice(mulai, mulai + perHalaman);

    daftar.innerHTML = "";
    let pemasukan = 0;
    let pengeluaran = 0;

    dataShow.forEach((tx) => {
      const li = document.createElement("li");
      li.classList.add("tx-transaksi", tx.jenis);
      li.innerHTML = `
        <div class="flex columns relative">
        	<strong>${escapeHTML(tx.kategori)}</strong> - ${escapeHTML(tx.tanggal)}
					<span>${tx.jenis === "pemasukan" ? "+" : "-"} Rp${escapeHTML(
        tx.nominal.toLocaleString()
      )}</span>
					<em>${escapeHTML(tx.catatan) || ""}</em>
					<div class="aksi absolute">
						<button class="edit-btn" data-id="${tx.id}">✏️</button>
						<button class="hapus-btn" data-id="${tx.id}">🗑️</button>
					</div>
				</div>
      `;
      daftar.appendChild(li);
    });

    data.forEach((tx) => {
      if (tx.jenis === "pemasukan") pemasukan += tx.nominal;
      else pengeluaran += tx.nominal;
    });

    tampilkanPagination(page, totalHalaman);
    totalPemasukan.textContent = `Rp ${escapeHTML(pemasukan.toLocaleString())}`;
    totalPengeluaran.textContent = `Rp ${escapeHTML(
      pengeluaran.toLocaleString()
    )}`;
    saldo.textContent = `Rp ${escapeHTML(
      (pemasukan - pengeluaran).toLocaleString()
    )}`;

    // 	event listener tombol edit dan hapus
    daftar
      .querySelectorAll(".edit-btn")
      .forEach((btn) =>
        btn.addEventListener("click", () => editTransaksi(btn.dataset.id))
      );
    daftar
      .querySelectorAll(".hapus-btn")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          hapusTransaksi(
            btn.dataset.id,
            "Yakin ingin menghapus data ini!",
            true
          )
        )
      );
  }

	function tampilkanPagination(currentPage, totalPages) {
		const paginationEl = document.getElementById("pagination");
		paginationEl.innerHTML = "";

		// Tombol Prev
		const prevBtn = document.createElement("button");
		prevBtn.textContent = "Prev";
		prevBtn.className = "pagination-btn";
		prevBtn.disabled = currentPage === 1;
		prevBtn.addEventListener("click", () => {
			if (currentPage > 1) tampilkanDaftarTransaksi(currentPage - 1);
		});
		paginationEl.appendChild(prevBtn);

		const pages = getPaginationPages(currentPage, totalPages);

		pages.forEach(page => {
			const button = document.createElement("button");
			button.className = "pagination-btn";

			if (page === "...") {
				button.textContent = "...";
				button.disabled = true;
			} else {
				button.textContent = page;
				if (page === currentPage) button.classList.add("active");
				button.addEventListener("click", () => {
					tampilkanDaftarTransaksi(page); // refresh data untuk halaman tsb
				});
			}

			paginationEl.appendChild(button);
		});

		// Tombol Next
		const nextBtn = document.createElement("button");
		nextBtn.textContent = "Next";
		nextBtn.className = "pagination-btn";
		nextBtn.disabled = currentPage === totalPages;
		nextBtn.addEventListener("click", () => {
			if (currentPage < totalPages) tampilkanDaftarTransaksi(currentPage + 1);
		});
		paginationEl.appendChild(nextBtn);
	}


	function hapusTransaksi(index, message, conf = false) {
    // cek mode edit
    if (form.dataset.editing) {
      form.tanggal.disabled = false;
      delete form.dataset.editing;
    }

    if (conf) {
      const konvirmasi = confirm(message);
      if (!konvirmasi) return;
    }
    const data = JSON.parse(localStorage.getItem(transaksiKey));
    const dataId = data.findIndex((item) => item.id.toString() === index);

    data.splice(dataId, 1); // menghapus
    localStorage.setItem(transaksiKey, JSON.stringify(data));
    tampilkanDaftarTransaksi();
  }

  function editTransaksi(index) {
    const data = JSON.parse(localStorage.getItem(transaksiKey));
    const tx = data.find((item) => item.id.toString() === index);
    const form = document.querySelector(".form-transaksi");

    form.tanggal.value = tx.tanggal;
    form.tanggal.disabled = true;
    form.nominal.value = tx.nominal;
    form.jenis.value = tx.jenis;
    form.kategori.value = tx.kategori;
    form.catatan.value = tx.catatan;
    form.scrollIntoView({ behavior: "smooth" });
    // tambahkan penanda mode edit
    form.dataset.editing = index;
    form.querySelector("button").textContent = "Edit Transaksi";
    const btnBtlEdit = document.querySelector(".btn-btl-edit");
    if (!btnBtlEdit) {
      const btnBtl = document.createElement("button");
      btnBtl.textContent = "Batal";
      btnBtl.type = "button";
      btnBtl.classList.add("btn-btl-edit");
      form.appendChild(btnBtl);

      btnBtl.onclick = function () {
        form.reset();
        delete form.dataset.editing;
        form.tanggal.disabled = false;
        this.remove();
        form.querySelector("button").textContent = "Tambah Transaksi";
      };
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const transaksi = JSON.parse(localStorage.getItem(transaksiKey) || "[]");

    const data = {
      id: Date.now(),
      tanggal: form.tanggal.value, // nanti bisa pakai input date
      nominal: parseInt(form.nominal.value),
      jenis: form.jenis.value,
      kategori: escapeHTML(form.kategori.value),
      catatan: escapeHTML(form.catatan.value),
    };

    const indexEdit = transaksi.findIndex(
      (item) => item.id.toString() === form.dataset.editing
    );
    if (indexEdit !== -1) {
      // Mode edit
      data.tanggal = transaksi[indexEdit].tanggal; // pertahankan tanggal lama
      transaksi[indexEdit] = data;
      delete form.dataset.editing;
      form.tanggal.disabled = false;
    } else {
      // Mode tambah
      transaksi.push(data);
    }

    localStorage.setItem(transaksiKey, JSON.stringify(transaksi));
    tampilkanDaftarTransaksi(); // refresh tampilan
    form.reset();
    form.querySelector("button").textContent = "Tambah Transaksi";
    const btlEdit = form.querySelector(".btn-btl-edit");
    if (btlEdit) btlEdit.remove();
  });

  tampilkanDaftarTransaksi();
  isiPilihanOption(form.kategori);
}

function isiPilihanOption(selectEl) {
  // ambil data kategori
  const dataKategori = JSON.parse(
    localStorage.getItem("data-kategori") || "[]"
  );
  selectEl.innerHTML =
    '<option value="" disabled selected>Pilih Kategori</option>';
  dataKategori.forEach((item) => {
    const option = document.createElement("option");
    option.setAttribute("value", item.nama);
    option.textContent = item.nama;
    selectEl.appendChild(option);
  });
}
