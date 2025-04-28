import {getLocalstorage, setAlert, tampilkanStatus, saveLocalStorage} from "../utils.js";
function renderSetting(content){
	fetch("pages/settings.html")
	.then(res => res.text())
	.then(html => {
		content.innerHTML = html;
		settingHandler.init();
		if (getLocalstorage("alert")){
			settingHandler.status(true);
		}
	});
}

class SettingHandler {
	constructor() {
		this.transaksiKey = 'transaksiKasKu';
		this.kategoriKey = 'data-kategori';
		this.statusAlert = getLocalstorage("alert");
		this.init();
	}

	status(bool, time){
		if (bool) tampilkanStatus(this.statusAlert, time? time/2 : 700, time ? time : 1500);
	}

	// Toggle Dark Mode
	toggleDarkMode() {
		document.body.classList.toggle('dark');
		const isDark = document.body.classList.contains('dark');
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}

	// Backup data ke JSON
	backupDataJSON() {
		setAlert({
			status: true,
			message: "Data Sedang di Proses",
			info: "alert-info",
		});

		this.status(true);

		const data = {
			transaksi: getLocalstorage(this.transaksiKey) || [],
			kategori: getLocalstorage(this.kategoriKey) || []
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `backup-${new Date().toISOString()}.json`;
		link.click();
	}


	// Restore data dari file JSON
	restoreDataJSON(event) {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target.result);

				if (Array.isArray(data.transaksi) && Array.isArray(data.kategori)) {
					saveLocalStorage(this.transaksiKey, JSON.stringify(data.transaksi));
					saveLocalStorage(this.kategoriKey, JSON.stringify(data.kategori));
					setAlert({
						status: true,
						message: "✅ Data berhasil di-restore!",
						info: "alert-success",
					});

					setTimeout(() => {
						location.reload();
					}, 500);

				} else {
					setAlert({
						status: true,
						message: "⚠️ File tidak valid! (Struktur salah)",
						info: "alert-warning",
					});
					this.status(true);
				}
			} catch (error) {
				setAlert({
					status: true,
					message: "❌ Gagal membaca file JSON!",
					info: "alert-error",
				});

				this.status(true);
			}
		};
		reader.readAsText(file);
	}


	// Export data ke CSV
	exportDataCSV() {
		const transaksi = getLocalstorage(this.transaksiKey) || [];
		if (!transaksi.length) {
			setAlert({
				status: true,
				message: "❌ Tidak ada data untuk di expor!",
				info: "alert-error",
			});
			this.status(true);
			return;
		}

		let csvContent = "data:text/csv;charset=utf-8,";
		csvContent += "No,Tanggal,Kategori,Jenis,Nominal\n";
		transaksi.forEach((item, idx) => {
			csvContent += `${idx + 1},${item.tanggal},${item.kategori},${item.jenis},${item.nominal}\n`;
		});

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `transaksi-${new Date().toISOString()}.csv`);
		link.click();
	}

	// Reset semua data
	resetAllData() {
		if (confirm('⚠️ Yakin mau menghapus semua data? Ini tidak bisa dikembalikan!')) {
			localStorage.removeItem(this.transaksiKey);
			localStorage.removeItem(this.kategoriKey);
			setAlert({
				status: true,
				message: "✅ Data berhasil di Hapus!",
				info: "alert-success",
			});
			location.reload();
		}
	}

	// Event untuk buka file JSON restore
	handleRestoreClick() {
		const inputFile = document.createElement('input');
		inputFile.type = 'file';
		inputFile.accept = '.json';
		inputFile.onchange = (e) => this.restoreDataJSON(e);
		inputFile.click();
	}

	// Inisialisasi Event di Setting Page
	init() {
		const btnDarkMode = document.getElementById('toggle-darkmode');
		const btnBackup = document.getElementById('backup-json');
		const btnRestore = document.getElementById('restore-json');
		const btnExport = document.getElementById('export-csv');
		const btnReset = document.getElementById('reset-all-data');
		btnDarkMode?.addEventListener('click', () => this.toggleDarkMode());

		btnBackup?.addEventListener('click', () => this.backupDataJSON());
		btnRestore?.addEventListener('click', () => this.handleRestoreClick());
		btnExport?.addEventListener('click', () => this.exportDataCSV());
		btnReset?.addEventListener('click', () => this.resetAllData());
		// Auto load darkmode kalau ada
		if (localStorage.getItem('darkmode') === 'on') {
			document.body.classList.add('darkmode');
		}
	}
}

// Inisialisasi objek
const settingHandler = new SettingHandler();

export {
	renderSetting
}