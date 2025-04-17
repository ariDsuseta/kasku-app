import {renderDashboard} from "./pages/dashboard.js";
import {renderTransaksi} from "./pages/transaksi.js";
import {renderKategori} from "./pages/kategori.js";
import {renderRiwayat} from "./pages/riwayat.js";
import {renderLaporan} from "./pages/laporan.js";

// cek login
checkLogin();

//=========== DARK MODE ==========
const toggleThemeBtn = document.getElementById("toggle-theme");
const body = document.body;

//load mode dari local storage
const theme = localStorage.getItem("theme") || "light";
body.classList.toggle("dark", theme === "dark");

//event toggle
toggleThemeBtn.addEventListener("click", () => {
	body.classList.toggle("dark");
	localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});


// ========== SIMPLE SPA ROUTING ==========

const content = document.getElementById("app-content");
const menuItems = document.querySelectorAll(".sidebar li");

// ganti konten berdasarkan click menu
menuItems.forEach((item) => {
	item.addEventListener("click", () => {
		const page = item.getAttribute("data-page");
		loadPage(page);
	});
});

// load halaman berdasarkan nama halaman
function loadPage (page){
	switch (page){
		case "dashboard":
			renderDashboard(content);
			break;
		case "transaksi":
			renderTransaksi(content);
			break;
		case "kategori":
			renderKategori(content);
			break;
		case "riwayat":
			renderRiwayat(content);
			break;
		case "laporan":
			renderLaporan(content);
			break;
		case "logout":
			logoutUser();
			break;
		default:
			renderDashboard(content);
	}
};

loadPage("dashboard");

// ========== SIMULASI LOGIN (sementara) ==========
function logoutUser() {
	localStorage.removeItem("kasku_login");
	window.location.href = './login.html';
}

function checkLogin(){
	const loginData = JSON.parse(localStorage.getItem("kasku_login"));
	if (!loginData || !loginData.isLoggedIn) window.location.href = "./login.html";
}
