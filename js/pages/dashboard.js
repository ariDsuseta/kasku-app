export function renderDashboard(content) {
	content.innerHTML = `
		<div class="mtxl">
			<section class="dashboard">
				<div class="stat-box saldo">
					<h3>Saldo</h3>
					<p id="saldo">Rp 0</p>
				</div>
				<div class="stat-box masuk">
					<h3>Pemasukan</h3>
					<p id="pemasukan">Rp 0</p>
				</div>
				<div class="stat-box keluar">
					<h3>Pengeluaran</h3>
					<p id="pengeluaran">Rp 0</p>
				</div>
				<div class="stat-box jumlah">
					<h3>Jumlah Transaksi</h3>
					<p id="jumlah-transaksi">0</p>
				</div>
			</section>
    </div>
  `;

	const data = JSON.parse(localStorage.getItem("transaksiKasKu") || "[]");
	let pemasukan = 0;
	let pengeluaran = 0;

	data.forEach(item => {
		if (item.jenis === "pemasukan") {
			pemasukan += parseFloat(item.nominal);
		} else {
			pengeluaran += parseFloat(item.nominal);
		}
	});

	const saldo = pemasukan - pengeluaran;

	document.getElementById("saldo").textContent = `Rp ${saldo.toLocaleString()}`;
	document.getElementById("pemasukan").textContent = `Rp ${pemasukan.toLocaleString()}`;
	document.getElementById("pengeluaran").textContent = `Rp ${pengeluaran.toLocaleString()}`;
	document.getElementById("jumlah-transaksi").textContent = data.length;
}
