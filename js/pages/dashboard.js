import { escapeHTML, validateDataFormat } from "../utils.js";

export function renderDashboard(content) {
  fetch("pages/dashboard.html")
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html;
      setupDashboard();
    });
}

function setupDashboard() {
  const data = JSON.parse(localStorage.getItem("transaksiKasKu") || "[]");
  let pemasukan = 0;
  let pengeluaran = 0;

  data.forEach((item) => {
    if (item.jenis === "pemasukan") {
      pemasukan += parseFloat(item.nominal);
    } else {
      pengeluaran += parseFloat(item.nominal);
    }
  });

  const saldo = pemasukan - pengeluaran;

  document.getElementById("saldo").textContent = `Rp ${escapeHTML(
    saldo.toLocaleString()
  )}`;
  document.getElementById("pemasukan").textContent = `Rp ${escapeHTML(
    pemasukan.toLocaleString()
  )}`;
  document.getElementById("pengeluaran").textContent = `Rp ${escapeHTML(
    pengeluaran.toLocaleString()
  )}`;
  document.getElementById("jumlah-transaksi").textContent = data.length;

  document.querySelector(".import-data").addEventListener("change", importData);
  document.querySelector(".btn-export").addEventListener("click", exportData);
}

function exportData() {
  const data = {
    transaksi: JSON.parse(localStorage.getItem("transaksiKasKu") || "[]"),
    kategori: JSON.parse(localStorage.getItem("data-kategori") || "[]"),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_kas.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.getElementById("import-file");
  const file = input.files[0];

  if (!file) return alert("Pilih file terlebih dahulu!");
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const result = JSON.parse(e.target.result);
      console.log(result);

      // Validasi struktur dan isi
      validateDataFormat(result);

      // Simpan ke localStorage
      localStorage.setItem("data-kategori", JSON.stringify(result.kategori));
      localStorage.setItem("transaksiKasKu", JSON.stringify(result.transaksi));

      alert("Import berhasil!");
      location.reload(); // refresh halaman agar data tampil
    } catch (err) {
      alert("Gagal import: " + err.message);
    }
  };
  reader.readAsText(file);
}
