export function renderLaporan(content) {
	const data = JSON.parse(localStorage.getItem("transaksiKasKu") || '[]');

	let totalMasuk = 0;
	let totalKeluar = 0;
	const perKategori = {};

	data.forEach(item => {
		const jumlah = Number(item.nominal);
		if (item.jenis === 'pemasukan') {
			totalMasuk += jumlah;
			perKategori[item.kategori] = perKategori[item.kategori] || { masuk: 0, keluar: 0 };
			perKategori[item.kategori].masuk += jumlah;
		} else {
			totalKeluar += jumlah;
			perKategori[item.kategori] = perKategori[item.kategori] || { masuk: 0, keluar: 0 };
			perKategori[item.kategori].keluar += jumlah;
		}
	});

	const saldo = totalMasuk - totalKeluar;

	content.innerHTML = `
		<div class="mtxl">
			<section class="laporan">
				<h2>Laporan Keuangan</h2>
				<div class="ringkasan">
					<div class="card pemasukan">Pemasukan: Rp ${totalMasuk.toLocaleString()}</div>
					<div class="card pengeluaran">Pengeluaran: Rp ${totalKeluar.toLocaleString()}</div>
					<div class="card saldo">Saldo: Rp ${saldo.toLocaleString()}</div>
				</div>
	
				<h3>Ringkasan per Kategori</h3>
				<table>
					<thead>
						<tr><th>Kategori</th><th>Pemasukan</th><th>Pengeluaran</th></tr>
					</thead>
					<tbody>
						${Object.entries(perKategori).map(([kat, val]) => `
							<tr>
								<td>${kat}</td>
								<td>Rp ${val.masuk.toLocaleString()}</td>
								<td>Rp ${val.keluar.toLocaleString()}</td>
							</tr>
						`).join('')}
					</tbody>
				</table>
			</section>
    </div>
  `;
}
