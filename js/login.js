document.addEventListener("DOMContentLoaded", () => {
	const login = JSON.parse(localStorage.getItem("kasku_login"));

	if (login) window.location.href = './index.html';

	const form = document.getElementById("loginForm");

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const username = form.username.value.trim();
		const password = form.password.value.trim();

		if (!username || !password) {
			alert("username / password tidak boleh kosong");
			return;
		}

		if (!isValidUser(username, password)) {
			alert("Username / pasword salah");
			return;
		}

		// 	simulasi validasi login lokal
		const userData = {
			isLoggedIn : true,
			username: username
		}

		localStorage.setItem("kasku_login", JSON.stringify(userData));

		// redirect ke halaman utama
		window.location.href = './index.html';
	});

	function aplyTheme(){
		let theme = localStorage.getItem("theme");

		// jika belum diset, ikuti prefersi sistem
		if(!theme) {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			theme = prefersDark ? "dark" : "light";
			localStorage.setItem("theme", theme);
		}

		document.body.classList.remove("light", "dark");
		document.body.classList.add(theme);
		const toggleBtn = document.getElementById("toggle-theme");
		toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
	}

	document.getElementById("toggle-theme").addEventListener("click", (e) => {
		e.preventDefault();
		const isDark = document.body.classList.contains("dark");
		const newTheme = isDark ? 'light' : 'dark';
		localStorage.setItem("theme", newTheme);
		aplyTheme();
	});

	aplyTheme();

});

const isValidUser = (usr, pswd) => (usr.toLowerCase() === "admin" && pswd.toLowerCase() === "admin" ? true : false);
