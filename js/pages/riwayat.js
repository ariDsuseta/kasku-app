export function renderRiwayat(content) {
	content.innerHTML = `
		<div class="mtxl">
			<section class="riwayat-section">
				<h2>📋 Riwayat Transaksi</h2>
				<div class="riwayat-container">
					<table class="riwayat-table">
						<thead>
							<tr>
								<th>No</th>
								<th>Tanggal</th>
								<th>Kategori</th>
								<th>Jumlah</th>
								<th>Jenis</th>
								<th>Catatan</th>
							</tr>
						</thead>
						<tbody id="riwayat-body"></tbody>
					</table>
				</div>
			</section>
    </div>
  `;

	const data = JSON.parse(localStorage.getItem("transaksiKasKu") || "[]");

	// Urutkan dari terbaru
	const sorted = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

	const tbody = document.getElementById("riwayat-body");
	tbody.innerHTML = "";

	sorted.forEach((item, index) => {
		const row = document.createElement("tr");

		row.innerHTML = `
			<td>${index + 1}</td>
      <td>${item.tanggal}</td>
      <td>${item.kategori}</td>
      <td class="${item.jenis === 'pengeluaran' ? 'minus' : 'plus'}">Rp ${Number(item.nominal).toLocaleString()}</td>
      <td class="${item.jenis === 'pengeluaran' ? 'minus' : 'plus'}">${item.jenis}</td>
      <td>${item.catatan}</td>
    `;

		tbody.appendChild(row);
	});
}
