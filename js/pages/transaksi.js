import {
	getLocalstorage,
	paginate,
	saveLocalStorage,
	dataSum,
	createElement, loadStatus, setAlert, escapeHTML,
} from "../utils.js";

export function renderTransaksi(content) {
  fetch("pages/transaksi.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupTransaksiPage();
    });
}

const transaksiKey = "transaksiKasKu";

window.tampilkanDaftarTransaksi = (page = 1) => {
  const transaksi = getLocalstorage(transaksiKey) || [];
  const tableBody = document.querySelector("#transaksi-table tbody");
  const paginationContainer = document.querySelector("#pagination");
  const totalPemasukan = dataSum(transaksi, "pemasukan");
  const totalPengeluaran = dataSum(transaksi, "pengeluaran");
  const saldo = totalPemasukan - totalPengeluaran;

	const statusAlert = getLocalstorage("alert");
	if (statusAlert){
		// 	tampilkan alert jika status bernilai true
		if(statusAlert.status){
			loadStatus({
				status: true,
				message: statusAlert.message,
				info: statusAlert.info
			});
			const alertEl = document.querySelector(".alert");
			setTimeout(() => {
				alertEl.classList.add("hide");
				setTimeout(() => {
					alertEl.remove();
					localStorage.removeItem("alert");
				}, 500);
			}, 1500);
		}
	}
  document.getElementById(
    "total-pemasukan"
  ).innerText = `Rp ${totalPemasukan.toLocaleString()}`;
  document.getElementById(
    "total-pengeluaran"
  ).innerText = `Rp ${totalPengeluaran.toLocaleString()}`;
  document.getElementById("saldo").innerText = `Rp ${saldo.toLocaleString()}`;

  paginate({
    data: transaksi,
    rowsPerPage: 5,
    currentPage: page,
    maxButton: 5,
    renderRows: (data, startIndex) =>
      data
        .map(
          (item, i) => `
            <tr class="no-wrap">
              <td>${startIndex + i + 1}</td>
              <td>${item.kategori}</td>
              <td class="${item.jenis === "pemasukan" ? 'c-success' : 'c-danger'}">${item.jenis}</td>
              <td>Rp ${item.nominal.toLocaleString("id-ID")}</td>
              <td>${item.tanggal}</td>
              <td>${item.catatan}</td>
              <td>
                <div class="flex gap-1">
                  <button onclick="edit(${item.id})">✏️</button>
                  <button onclick="hapusTransaksi(${item.id})">🗑️</button>
                </div>
              </td>
            </tr>
				`
        )
        .join(""),
    renderContainer: tableBody,
    paginationContainer,
  });
};

window.hapusTransaksi = (
  id,
  conf = confirm("Yakin ingin menghapus data ini!")
) => {
  if (!conf) return;

  const data = getLocalstorage(transaksiKey);
  const index = data.findIndex((item) => item.id === id);

  if (index !== -1) {
    data.splice(index, 1);
    saveLocalStorage(transaksiKey, JSON.stringify(data));
    // status
		setAlert({
			status: true,
			message: "Data berhasil di hapus",
			info: "alert-success"
		});

    tampilkanDaftarTransaksi(pageIndex());
  }
};

window.edit = (id) => {
  const dataTransaksi = getLocalstorage(transaksiKey);
  const form = document.getElementById("form-transaksi");
  form.dataset.edit = id;
  document
    .querySelector("#app-content")
    .scrollIntoView({ behavior: "smooth", block: "start" });
  const data = dataTransaksi.find((data) => data.id === id);
  form.elements.tanggal.value = data.tanggal;
  form.elements.kategori.value = data.kategori;
  form.elements.jenis.value = data.jenis;
  form.elements.nominal.value = data.nominal;
  form.elements.catatan.value = escapeHTML(data.catatan);

  let btnBtl = document.querySelector(
    "button[data-action = 'batal-edit-transaksi']"
  );
  if (!btnBtl) {
    btnBtl = createElement({
      tag: "button",
      attributes: {
        type: "button",
        class: "btn-btl",
        style: "background-color:#e34442",
        "data-action": "batal-edit-transaksi",
      },
      textContent: "Batal",
    });
    form.appendChild(btnBtl);
  }

  const btnEdit = document.querySelector(".form-transaksi button");
  btnEdit.innerText = "Edit Data";
  btnBtl.onclick = (e) => btlEdit(form, e, btnEdit);
};

function btlEdit(form, e, btnEdit) {
  form.reset();
  form.removeAttribute("data-edit");
  e.target.remove();
  btnEdit.innerText = "Tambah Transaksi";
}

function pageIndex() {
  let index;
  const btnPagination = document.querySelectorAll(".pagination-btn");
  btnPagination.forEach((el) => {
    if (el.classList.contains("active")) {
      index = el.textContent;
    }
  });
  return index;
}

function addDataForm(form, event) {
  event.preventDefault();
  const data = getLocalstorage(transaksiKey) || [];
  const dataInput = {
    id: Date.now(),
    tanggal: form.elements.tanggal.value,
    kategori: form.elements.kategori.value,
    jenis: form.elements.jenis.value,
    nominal: parseFloat(form.elements.nominal.value),
    catatan: escapeHTML(form.elements.catatan.value),
  };

  // mode edit
  if (form.dataset.edit !== undefined) {
    const index = data.findIndex(
      (item) => item.id === parseInt(form.dataset.edit)
    );
    dataInput.id = parseInt(form.dataset.edit);
    data[index] = dataInput;
    form.reset();
    event.target.querySelector("button").innerText = "Tambah Transaksi";
    event.target.querySelector(".btn-btl").remove();
    event.target.removeAttribute("data-edit");

    saveLocalStorage(transaksiKey, JSON.stringify(data));
    // status
		setAlert({
			status: true,
			message: "Data Berhasil di Edit",
		});
    tampilkanDaftarTransaksi(pageIndex());
    return;
  }

  data.push(dataInput);
  saveLocalStorage(transaksiKey, JSON.stringify(data));
  form.reset();
  // status
	setAlert({
		status:true,
		message: "Data berhasil di tambahkan"
	});
  tampilkanDaftarTransaksi(pageIndex());
}

function setupTransaksiPage() {
  const transaksi = getLocalstorage(transaksiKey) || [];
  const formEl = document.getElementById("form-transaksi");
  const elOptionKategori = document.getElementById("kategori");
  const getDataOptionKategori = getLocalstorage("data-kategori");

  // data kategori default
  const elOption = document.createElement("option");
  elOption.disabled = true;
  elOption.setAttribute("selected", "");
  elOption.setAttribute("value", "");
  elOption.textContent = "Pilih Kategori";
  elOptionKategori.appendChild(elOption);

  getDataOptionKategori && getDataOptionKategori.forEach((data) => {
    const elOption = document.createElement("option");
    elOption.value = data.nama;
    elOption.textContent = data.nama;
    elOptionKategori.appendChild(elOption);
  });

	if (transaksi.length === 0){
		setAlert({
			status: true,
			message: "Data Masih Kosong",
			info: "alert-info",
		});
	}

	formEl.addEventListener("submit", function (e) {
		addDataForm(this, e);
	});
	tampilkanDaftarTransaksi(pageIndex());
}

