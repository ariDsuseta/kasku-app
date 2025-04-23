function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[
        tag
      ] || tag)
  );
}

function validateDataFormat(data) {
  if (!data || typeof data !== "object")
    throw new Error("File JSON tidak valid");
  if (!Array.isArray(data.kategori))
    throw new Error("Data kategori tidak valid");
  if (!Array.isArray(data.transaksi))
    throw new Error("Data transaksi tidak valid");

  // Validasi kategori
  data.kategori.forEach((kat) => {
    if (typeof kat.nama !== "string") throw new Error("Format kategori salah");
  });

  // Validasi transaksi
  data.transaksi.forEach((tx) => {
    if (
      typeof tx.id !== "number" ||
      typeof tx.tanggal !== "string" ||
      typeof tx.kategori !== "string" ||
      typeof tx.jenis !== "string" ||
      typeof tx.nominal !== "number" ||
      typeof tx.catatan !== "string"
    ) {
      throw new Error("Format transaksi salah");
    }
  });

  return true;
}

// ========== SIMULASI LOGIN (sementara) ==========
function logoutUser() {
  localStorage.removeItem("kasku_login");
  window.location.href = "./login.html";
}

function checkLogin() {
  const loginData = JSON.parse(localStorage.getItem("kasku_login"));
  if (!loginData || !loginData.isLoggedIn)
    window.location.href = "./login.html";
}

const saveLocalStorage = (key, value) => {
  if (typeof value === "string") localStorage.setItem(key, value);
  else localStorage.setItem(key, JSON.stringify(value));
};

const getLocalstorage = (key) => {
  const dataVal = localStorage.getItem(key);
  if (dataVal === null) return null;
  try {
    const data = JSON.parse(dataVal);
    if (typeof data == "object" && data !== null) {
      return data;
    }
  } catch (e) {
    return dataVal;
  }
};
// mouse follow
function elFollowMe(followerEl, event, offsetX, offsetY) {
  document.addEventListener(event, (e) => {
    if (followerEl.classList.value.split(" ")[1] !== undefined) {
      offsetX =
        e.clientX >= window.innerWidth - followerEl.offsetWidth
          ? followerEl.offsetWidth
          : 0;
      offsetY =
        e.clientY >= window.innerHeight - followerEl.offsetHeight
          ? -followerEl.offsetHeight
          : 15;
      followerEl.style.left = e.clientX - offsetX + "px";
      followerEl.style.top = e.clientY + offsetY + "px";
    }
  });
}

// paginasi 2
function paginate({
  data = [],
  rowsPerPage = 5,
  currentPage = 10,
  maxButton = 5,
  renderRows,
  renderContainer,
  paginationContainer,
}) {
  const totalPages = Math.ceil(data.length / rowsPerPage);
  currentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  // 	render rows ke tabel / kontainer
  if (typeof renderRows === "function") {
    renderContainer.innerHTML = renderRows(pageData, startIndex);
  }

  // render pagination buttons
  if (data.length !== 0) {
    renderPaginationButtons(
      currentPage,
      totalPages,
      maxButton,
      paginationContainer,
      (page) => {
        paginate({
          data,
          rowsPerPage,
          currentPage: page,
          maxButton,
          renderRows,
          renderContainer,
          paginationContainer,
        });
      }
    );
  }
}

function renderPaginationButtons(
  currentPage,
  totalPages,
  maxButtons,
  container,
  onPageChange
) {
  container.innerHTML = "";

  const createBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = `pagination-btn${active ? " active" : ""}`;
    if (disabled) btn.disabled = true;
    btn.addEventListener("click", () => onPageChange(page));
    container.appendChild(btn);
  };

  createBtn("Prev", currentPage - 1, currentPage === 1);

  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);

  if (end - start + 1 < maxButtons && start > 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    createBtn(i, i, false, i === currentPage);
  }

  createBtn("Next", currentPage + 1, currentPage === totalPages);
}
// menjumblahkan data nominal
const dataSum = (data, val) =>
  data
    .filter((item) => item.jenis === val)
    .reduce((item, nominal) => item + nominal.nominal, 0);
const createElement = ({
  tag = "div",
  id = "",
  className = "",
  textContent = "",
  innerHTML = "",
  attributes = {},
  eventListeners = {},
  children = [],
	simbol = {
		status: false,
		teged: ''
	},
}) => {
  const elemen = document.createElement(tag);
  if (id) elemen.id = id;
  if (className) elemen.className = className;
  if (textContent) elemen.textContent = textContent;
	if (simbol.status) elemen.innerHTML = simbol.taged;
  if (innerHTML) elemen.innerHTML = innerHTML;

  // 	setel atribute
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      elemen.setAttribute(key, attributes[key]);
    }
  }

  //tambahkan event listener
  for (const type in eventListeners) {
    if (eventListeners.hasOwnProperty(type)) {
      elemen.addEventListener(type, eventListeners[type]);
    }
  }

  //tambahkan element anak
  children.forEach((child) => {
    if (child instanceof Node) {
      elemen.appendChild(child);
    } else if (typeof child === "string") {
      elemen.appendChild(document.createTextNode(child));
    }
  });

  return elemen;
};

// fungsi untuk alert / pemberitahuan
function loadStatus({
	status = false,
	message = '',
	info = 'alert-success',
	parentEl = document.body,
	time = 500,
	datakey = 'alert'
}){
	if (status) {
		const alertEl = createElement({
			textContent: message,
			attributes: {
				'class' : 'alert ' + info +' show',
				style: 'z-index: 40; position:absolute; top:5rem; right:1rem;'
			},
			children:[
				createElement({
					tag: 'span',
					className: 'closebtn',
					simbol: {
						status: true,
						taged: '&times;'
					},
					eventListeners: {
						click: function() {
							this.parentElement.classList.add('hide');
							setTimeout(function (){
								this.parentElement.style.display = 'none';
								this.parentElement.remove();
								localStorage.removeItem(datakey);
							}.bind(this), time)
						}
					}
				})
			]
		});
		parentEl.appendChild(alertEl);
	}
}

function capitalize(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}).join(' ');
}

// GRAFIK LINE

function renderGrafik({
	datakey = "",
	jenis = [], // string atau array
	brdColor = ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
	parentEl,
	labelGrafik,
	tipe = "line" // bisa "line", "bar", dll
}) {
	const transaksi = getLocalstorage(datakey) || [];

	const jenisList = Array.isArray(jenis) ? jenis : [jenis];
	const colors = Array.isArray(brdColor) ? brdColor : [brdColor];

	// Ambil dan urutkan semua tanggal unik
	const allTanggal = [...new Set(
		transaksi.map(item => item.tanggal)
	)].sort((a, b) => new Date(a) - new Date(b));

	const datasets = jenisList.map((jns, idx) => {
		const dataJenis = transaksi.filter(item => item.jenis === jns);
		const dataPerTanggal = {};

		dataJenis.forEach(item => {
			const tgl = item.tanggal;
			if (!dataPerTanggal[tgl]) dataPerTanggal[tgl] = 0;
			dataPerTanggal[tgl] += item.nominal;
		});

		const data = allTanggal.map(tgl => dataPerTanggal[tgl] || 0);

		return {
			label: capitalize(jns),
			data,
			backgroundColor: colors[idx] || "rgba(0,0,0,0.5)",
			borderColor: colors[idx] || "rgba(0,0,0,1)",
			borderWidth: 2,
			fill: false,
			tension: tipe === "line" ? 0.3 : 0,
			pointRadius: tipe === "line" ? 4 : 0,
			pointHoverRadius: tipe === "line" ? 6 : 0
		};
	});

	if (!parentEl) return;

	const grafikLabel = document.getElementById(labelGrafik);
	grafikLabel.textContent = `Grafik ${jenisList.map(capitalize).join(" & ")}`;

	const ctx = parentEl.getContext("2d");

	// Hapus chart lama jika ada
	if (parentEl._chartInstance) {
		parentEl._chartInstance.destroy();
	}

	const chart = new Chart(ctx, {
		type: tipe,
		data: {
			labels: allTanggal,
			datasets
		},
		options: {
			responsive: true,
			plugins: {
				tooltip: {
					callbacks: {
						label: ctx => `Rp ${ctx.raw.toLocaleString('id-ID')}`
					}
				},
				legend: {
					display: true
				}
			},
			scales: ["line", "bar"].includes(tipe) ? {
				y: {
					beginAtZero: true,
					ticks: {
						callback: val => `Rp ${val.toLocaleString("id-ID")}`
					}
				}
			} : undefined
		}
	});

	parentEl._chartInstance = chart;
}


function setAlert({
	status= false,
	message = "",
	info = "alert-success"
}){
	const setAlert = {
		status,
		message,
		info
	}
	saveLocalStorage("alert", setAlert);
}

export {
  escapeHTML,
  validateDataFormat,
  logoutUser,
  checkLogin,
  saveLocalStorage,
  getLocalstorage,
  elFollowMe,
  paginate,
  dataSum,
  createElement,
	loadStatus,
	capitalize,
	renderGrafik,
	setAlert
};
