import {
  exportToCSV,
  getLocalstorage,
  printElement,
  tampilkanStatus,
} from '../utils.js'

export function renderLaporan(content) {
  const data = JSON.parse(localStorage.getItem('transaksiKasKu') || '[]')

  let totalMasuk = 0
  let totalKeluar = 0
  const perKategori = {}

  // cek status jika ada tamilkan
  tampilkanStatus(getLocalstorage('alert'), 700, 1500)

  data.forEach((item) => {
    const jumlah = Number(item.nominal)
    if (item.jenis === 'pemasukan') {
      totalMasuk += jumlah
      perKategori[item.kategori] = perKategori[item.kategori] || {
        masuk: 0,
        keluar: 0,
      }
      perKategori[item.kategori].masuk += jumlah
    } else {
      totalKeluar += jumlah
      perKategori[item.kategori] = perKategori[item.kategori] || {
        masuk: 0,
        keluar: 0,
      }
      perKategori[item.kategori].keluar += jumlah
    }
  })

  const saldo = totalMasuk - totalKeluar

  renderElContent(content, {
    totalMasuk,
    totalKeluar,
    saldo,
    perKategori,
  })

  document.getElementById('btnPrintRingkasan').addEventListener('click', () => {
    const table = document.getElementById('riwayat')
    printElement(table, 'Ringkasan Perkategori')
  })

  // 	CSV export
  document.getElementById('btn-export-csv').addEventListener('click', () => {
    const data = Object.entries(perKategori).map((item, index) => ({
      no: index + 1,
      kategori: item[0],
      pemasukan: item[1].masuk,
      pengeluaran: item[1].keluar,
    }))

    exportToCSV({
      data,
      fileName: 'Ringkasan-Perkategori.csv',
      headers: ['no', 'kategori', 'pemasukan', 'pengeluaran'],
    })
    renderElLaporan(content)
  })
}

function renderElLaporan(el) {
  renderLaporan(el)
}

function renderElContent(
  content,
  { totalMasuk, totalKeluar, saldo, perKategori }
) {
  content.innerHTML = `
		<div class="mtxl">
			<section class="laporan">
				<h2>📈 Laporan Keuangan</h2>
				<div class="ringkasan">
					<div class="card pemasukan">Pemasukan: Rp ${totalMasuk.toLocaleString()}</div>
					<div class="card pengeluaran">Pengeluaran: Rp ${totalKeluar.toLocaleString()}</div>
					<div class="card saldo">Saldo: Rp ${saldo.toLocaleString()}</div>
				</div>
        <div class="flex beetwen mb item-center">
          <h3>📑 Ringkasan per Kategori</h3>
          <div class="flex item-center gap-1">
						<button id="btnPrintRingkasan" class="print" type="button">
							🖨️ Print Ringkasan
						</button>
						<button id="btn-export-csv" class="print">📁 Export CSV</button>
					</div>
        </div>
				<table id="riwayat">
					<thead>
						<tr><th>Kategori</th><th>Pemasukan</th><th>Pengeluaran</th></tr>
					</thead>
					<tbody>
						${Object.entries(perKategori)
              .map(
                ([kat, val]) => `
							<tr>
								<td>${kat}</td>
								<td>Rp ${val.masuk.toLocaleString()}</td>
								<td>Rp ${val.keluar.toLocaleString()}</td>
							</tr>
						`
              )
              .join('')}
					</tbody>
				</table>
			</section>
    </div>
  `
}
