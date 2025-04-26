import { renderDashboard } from "./pages/dashboard.js";
import { renderTransaksi } from "./pages/transaksi.js";
import { renderKategori } from "./pages/kategori.js";
import { renderRiwayat } from "./pages/riwayat.js";
import { renderLaporan } from "./pages/laporan.js";
import { logoutUser } from "./utils.js";
import { renderSetting } from "./pages/setting.js";
import { renderInfo } from "./pages/info.js";
// load halaman berdasarkan nama halaman
export function loadPage(page, content) {
  switch (page) {
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
    case "setting":
      renderSetting(content);
      break;
    case "info":
      renderInfo(content);
      break;
    case "logout":
      logoutUser();
      break;
    default:
      renderDashboard(content);
  }
}
