import {loadPage} from "./router.js";
import {checkLogin, getLocalstorage, saveLocalStorage} from "./utils.js";

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
	item.addEventListener("click", (e) => {
		const page = e.target.dataset.page;
		// Hapus kelas "active-page" dari semua elemen menu
		menuItems.forEach(el => el.classList.remove("active-page"));
		e.target.classList.add("active-page");
		saveLocalStorage("page", page !== "logout" ? page : "dashboard");
		loadPage(page, content);
	});
});


// default jika belum diset page nya
const dataPage = getLocalstorage('page');
if(dataPage) {
	loadPage(dataPage, content);
	menuItems.forEach(el=>{
		if(el.getAttribute("data-page") === dataPage) el.classList.add("active-page");
	})
}

