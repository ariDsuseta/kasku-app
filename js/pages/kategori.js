import {
  createElement,
  getLocalstorage,
  saveLocalStorage,
  setAlert,
  tampilkanStatus,
} from '../utils.js'

export function renderKategori(content) {
  fetch('pages/kategori.html')
    .then((res) => res.text())
    .then((html) => {
      content.innerHTML = html
      setupKategoriPage()
    })
}

const kategoriKey = 'data-kategori'
const dataKategori = getLocalstorage(kategoriKey) || []

function addData(form, event) {
  event.preventDefault()
  const dataInput = {
    id: Date.now(),
    nama: form.nama.value,
  }
  const idEdit = form.getAttribute('data-edit')
  // cek mode edit
  if (idEdit) {
    const id = dataKategori.findIndex((data) => data.id === parseInt(idEdit))
    dataKategori[id] = dataInput
    dataKategori[id].id = parseInt(idEdit)
    const btnBtl = form['batal']
    handleBtl(btnBtl, form)
    saveLocalStorage(kategoriKey, JSON.stringify(dataKategori))

    setAlert({
      status: true,
      message: 'Data Berhasil di Edit',
      info: 'alert-success',
    })
    tampilkanDaftarKategori()
    return
  }

  // jika ada data yang sama timpa
  const index = dataKategori.findIndex((item) => item.nama === dataInput.nama)
  if (index !== -1) {
    dataKategori[index] = dataInput
    tampilkanDaftarKategori()
    // tambahkan alert jika perlu
    form.reset()
    return
  }

  dataKategori.push(dataInput)
  saveLocalStorage(kategoriKey, JSON.stringify(dataKategori))
  setAlert({
    status: true,
    message: 'Data Berhasil di Tambahkan',
    info: 'alert-success',
  })
  tampilkanDaftarKategori()
  form.reset()
}

function setupKategoriPage() {
  const formEl = document.getElementById('form-kategori')

  document.addEventListener('keydown', (event) => {
    const key = event.key
    const ctrl = event.ctrlKey
    if (ctrl && key === 'k') {
      event.preventDefault()
      document.getElementById('form-kategori').nama.focus()
    }
  })

  if (dataKategori !== 0) {
    tampilkanDaftarKategori()
    formEl.addEventListener('submit', function (e) {
      addData(this, e)
    })
  }
}

function hapusData(id, conf = confirm('Yakin ingin menghapus data ini!')) {
  const index = dataKategori.findIndex((data) => data.id === id)

  if (!conf) return

  if (index !== -1) {
    dataKategori.splice(index, 1)
    saveLocalStorage(kategoriKey, JSON.stringify(dataKategori))

    setAlert({
      status: true,
      message: 'Data Berhasil di hapus',
      info: 'alert-error',
    })
    tampilkanDaftarKategori()
  }
}

function editData(id) {
  if (window.innerWidth <= 375)
    document
      .getElementById('app-content')
      .scrollIntoView({ behavior: 'smooth', block: 'start' })
  const dataEdit = dataKategori.find((data) => data.id === id)
  const formEl = document.getElementById('form-kategori')
  formEl.dataset.edit = id
  formEl.nama.value = dataEdit.nama
  const btlKategori = document.querySelector(
    'button[data-action="batal-edit-data"]'
  )

  formEl['btn-kategori'].textContent = 'Edit Data'

  if (!btlKategori) {
    formEl.appendChild(
      createElement({
        tag: 'button',
        attributes: {
          type: 'button',
          name: 'batal',
          style: 'background-color: #861414; color:white; margin-left:-10px;',
          'data-action': 'batal-edit-data',
        },
        textContent: 'Batal',
        eventListeners: {
          click: function () {
            handleBtl(this, formEl, true)
          },
        },
      })
    )
  }
}

function handleBtl(el, form, sts = false) {
  if (sts) {
    setAlert({
      status: true,
      message: 'Data Batal di Edit',
      info: 'alert-error',
    })
    tampilkanDaftarKategori()
  }

  form.removeAttribute('data-edit')
  form.reset()
  form['btn-kategori'].innerText = 'Simpan'
  el.remove()
}

function tampilkanDaftarKategori() {
  const statusAlert = getLocalstorage('alert')
  // tampilkan alert
  tampilkanStatus(statusAlert)

  const tableBody = document.getElementById('daftar-kategori')
  tableBody.innerHTML = ''
  if (tableBody) {
    dataKategori.forEach((data, index) => {
      const row = createElement({ tag: 'tr' })
      const noCell = createElement({ tag: 'td', textContent: index + 1 })
      const namaCell = createElement({ tag: 'td', textContent: data.nama })
      const aksiCell = createElement({
        tag: 'td',
        attributes: {
          style: 'text-align:center',
          class: 'no-wrap',
        },
        children: [
          createElement({
            tag: 'button',
            attributes: {
              type: 'button',
            },
            textContent: 'edit',
            eventListeners: {
              click: () => editData(data.id),
            },
          }),
          createElement({
            tag: 'button',
            attributes: {
              type: 'button',
            },
            textContent: 'hapus',
            eventListeners: {
              click: () => hapusData(data.id),
            },
          }),
        ],
      })
      row.appendChild(noCell)
      row.appendChild(namaCell)
      row.appendChild(aksiCell)
      tableBody.appendChild(row)
    })
  }
}
