import {
	escapeHTML,
	getLocalstorage,
	validateDataFormat,
	renderGrafik,
	saveLocalStorage, setAlert, tampilkanStatus,
} from "../utils.js";


export function renderDashboard(content) {
  fetch("pages/dashboard.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupDashboard();
			if (getLocalstorage("alert")){
				status();
			}
    });
}

function status() {
	tampilkanStatus(getLocalstorage("alert"), 700);
}

function setupDashboard() {
  const data = getLocalstorage("transaksiKasKu") || [];
  const pageActive = getLocalstorage("page");

  let pemasukan = 0;
  let pengeluaran = 0;

  if (pageActive) {
    saveLocalStorage("page", "dashboard");
  }

  data.forEach((item) => {
    if (item.jenis === "pemasukan") {
      pemasukan += parseFloat(item.nominal);
    } else {
      pengeluaran += parseFloat(item.nominal);
    }
  });

  const saldo = pemasukan - pengeluaran;

  // render chart bar
  renderGrafik({
    datakey: "transaksiKasKu",
    jenis: "pemasukan",
    brdColor: ["rgb(40,110,177)"],
    parentEl: document.getElementById("chart-bar1"),
    labelGrafik: "chart-label-bar1",
    tipe: "bar",
    callback: () => handleCloseDetails(document.getElementById("closed")),
  });

  renderGrafik({
    datakey: "transaksiKasKu",
    jenis: "pengeluaran",
    brdColor: ["orange"],
    parentEl: document.getElementById("chart-bar2"),
    labelGrafik: "chart-label-bar2",
    tipe: "bar",
    callback: () => handleCloseDetails(document.getElementById("closed")),
  });

  renderGrafik({
    datakey: "transaksiKasKu",
    jenis: ["pemasukan", "pengeluaran"],
    brdColor: ["rgb(40,110,177)", "orange"],
    parentEl: document.getElementById("chart-bar3"),
    labelGrafik: "chart-label-bar3",
    tipe: "bar",
    callback: () => handleCloseDetails(document.getElementById("closed")),
  });

  const transaksiKeluar = data.filter((data) => data.jenis === "pengeluaran");
  const transaksiMasuk = data.filter((data) => data.jenis === "pemasukan");
  const pengeluaranPerKategori = {},
    pemasukanPerKategori = {};
  transaksiKeluar.forEach((tx) => {
    if (!pengeluaranPerKategori[tx.kategori]) {
      pengeluaranPerKategori[tx.kategori] = 0;
    }
    pengeluaranPerKategori[tx.kategori] += tx.nominal;
  });

  transaksiMasuk.forEach((tx) => {
    if (!pemasukanPerKategori[tx.kategori]) {
      pemasukanPerKategori[tx.kategori] = 0;
    }
    pemasukanPerKategori[tx.kategori] += tx.nominal;
  });

  // const labels = Object.keys(pengeluaranPerKategori);
  // const dataBar = Object.values(pengeluaranPerKategori);

  // render chart bar

  document.getElementById("saldo").textContent = saldo > 0 ? `Rp ${escapeHTML(
    saldo.toLocaleString(),
  )}` : "";
  document.getElementById("pemasukan").textContent = pemasukan > 0 ? `Rp ${escapeHTML(
    pemasukan.toLocaleString(),
  )}` : "";
  document.getElementById("pengeluaran").textContent = pengeluaran > 0 ? `Rp ${escapeHTML(
    pengeluaran.toLocaleString(),
  )}` : "";
  document.getElementById("jumlah-transaksi").textContent = data.length > 0 ? data.length : "";

  document.querySelector(".import-data").addEventListener("change", importData);
  document.querySelector(".btn-export").addEventListener("click", exportData);

  renderGrafik({
    datakey: "transaksiKasKu",
    jenis: "pengeluaran",
    brdColor: "rgb(134,20,20)",
    parentEl: document.getElementById("pengeluaran-chart"),
    labelGrafik: "label-grafik-pengeluaran",
  });

  renderGrafik({
    datakey: "transaksiKasKu",
    jenis: "pemasukan",
    parentEl: document.getElementById("pemasukan-chart"),
    labelGrafik: "label-grafik-pemasukan",
    callback: () => handleCloseDetails(document.getElementById("closed")),
  });

  renderGrafik({
    datakey: "transaksiKasKu",
    jenis: ["pemasukan", "pengeluaran"],
    brdColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
    parentEl: document.getElementById("pemasukan-pengeluaran-chart"),
    labelGrafik: "label-grafik-pemasukan-pengeluaran",
    callback: () => handleCloseDetails(document.getElementById("closed")),
  });
}

function exportData() {
  const data = {
    transaksi: JSON.parse(localStorage.getItem("transaksiKasKu") || "[]"),
    kategori: JSON.parse(localStorage.getItem("data-kategori") || "[]"),
  };

	if(data.transaksi.length === 0 && data.kategori.length === 0){
		setAlert({
			status: true,
			message: "❌ Data Masih kosong!",
			info: "alert-info"
		});
		status(true);
		return;
	}

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date();
  const tanggal = date.getDate();
  const bulan = date.getMonth();
  const tahun = date.getFullYear();
  const tanggalSaatIni = `${tanggal}-${bulan + 1}-${tahun}`;
  a.href = url;
  a.download = `backup_kas_${tanggalSaatIni}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.getElementById("import-file");
  const file = input.files[0];

  if (!file) {
		setAlert({
			status: true,
			message: "⚠️ Pilih File terlebih dahulu!",
			alert: "alert-warning"
		});
		status(true);
		return;
	}
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const result = JSON.parse(e.target.result);
      // Validasi struktur dan isi
      validateDataFormat(result);

      // Simpan ke localStorage
      localStorage.setItem("data-kategori", JSON.stringify(result.kategori));
      localStorage.setItem("transaksiKasKu", JSON.stringify(result.transaksi));

			setAlert({
				status: true,
				message: "✅ Data berhasil di Import!",
			});

      location.reload(); // refresh halaman agar data tampil
    } catch (err) {
      alert("Gagal import: " + err.message);
    }
  };
  reader.readAsText(file);
}

function handleCloseDetails(el) {
  el.addEventListener("click", function () {
    this.parentElement.removeAttribute("style");
  });
}
