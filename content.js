import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

async function carregarConteudo() {
  try {
    const snap = await getDoc(doc(db, "portfolios", "principal"));
    if (!snap.exists()) return;
    const data = snap.data();

    // ── Texto (data-field) ────────────────────────────────────
    document.querySelectorAll("[data-field]").forEach((el) => {
      const key = el.dataset.field;
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        el.textContent = data[key];
      }
    });

    // ── Logo ──────────────────────────────────────────────────
    const siteLogo = document.getElementById("site-logo");
    if (siteLogo && data.logoUrl) {
      siteLogo.src = data.logoUrl;
      siteLogo.classList.remove("hidden");
    }

    // ── Links (data-link-field) ───────────────────────────────
    document.querySelectorAll("[data-link-field]").forEach((el) => {
      const key = el.dataset.linkField;
      if (data.links?.[key]) {
        el.href = data.links[key];
        el.classList.remove("hidden");
      }
    });

    // ── Foto de perfil ────────────────────────────────────────
    const foto = document.querySelector("[data-foto]");
    if (foto) {
      if (data.fotoUrl) foto.src = data.fotoUrl;
      foto.style.opacity = data.fotoOpacidade !== undefined ? data.fotoOpacidade / 100 : 1;
    }

    // ── Banner do hero ────────────────────────────────────────
    const hero = document.querySelector(".hero-gradient");
    if (hero) {
      const opacidade = data.bannerOpacidade !== undefined ? data.bannerOpacidade / 100 : 0.85;
      const bgUrl = data.bannerUrl ||
        "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=2070";
      // Usa cor de fundo salva para o overlay do gradiente
      const fundoHex = data.estilos?.["cor-fundo"] || "#F9F7F2";
      const r = parseInt(fundoHex.slice(1,3),16), g = parseInt(fundoHex.slice(3,5),16), b = parseInt(fundoHex.slice(5,7),16);
      hero.style.backgroundImage =
        `linear-gradient(rgba(${r},${g},${b},${opacidade}), rgba(${r},${g},${b},${opacidade})), url('${bgUrl}')`;
      hero.style.backgroundSize = "cover";
      hero.style.backgroundPosition = "center";
    }

    // ── Estilos salvos (cores, fontes, tamanhos) ──────────────
    if (data.estilos) {
      const e = data.estilos;
      const root = document.documentElement;

      const mapaCSS = {
        "cor-primaria":        "--primary-sage",
        "cor-fundo":           "--cor-fundo",
        "cor-nav":             "--cor-nav",
        "cor-nav-texto":       "--cor-nav-texto",
        "cor-nav-btn":         "--cor-nav-btn",
        "cor-nav-btn-texto":   "--cor-nav-btn-texto",
        "cor-hero-titulo":     "--cor-hero-titulo",
        "cor-hero-texto":      "--cor-hero-texto",
        "cor-sobre-fundo":     "--cor-sobre-fundo",
        "cor-sobre-titulo":    "--cor-sobre-titulo",
        "cor-sobre-texto":     "--cor-sobre-texto",
        "cor-sessoes-fundo":   "--cor-sessoes-fundo",
        "cor-sessoes-titulo":  "--cor-sessoes-titulo",
        "cor-sessoes-texto":   "--cor-sessoes-texto",
        "cor-publicos-titulo": "--cor-publicos-titulo",
        "cor-publicos-texto":  "--cor-publicos-texto",
        "cor-contato-fundo":   "--cor-contato-fundo",
      };
      Object.entries(mapaCSS).forEach(([key, cssVar]) => {
        if (e[key]) root.style.setProperty(cssVar, e[key]);
      });
      if (e.tamanhoTitulos) root.style.setProperty("--titulo-scale", e.tamanhoTitulos);

      // Fontes
      if (e.fonteTitulos || e.fonteTexto) {
        const fontes = [
          e.fonteTitulos && `family=${e.fonteTitulos.replace(/ /g,"+")}:ital,wght@0,400;0,600;1,400`,
          e.fonteTexto   && `family=${e.fonteTexto.replace(/ /g,"+")}:wght@300;400;500;600`,
        ].filter(Boolean).join("&");
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${fontes}&display=swap`;
        document.head.appendChild(link);
        link.onload = () => {
          if (e.fonteTitulos) document.querySelectorAll("h1,h2,h3,.font-serif").forEach(el => el.style.fontFamily = `'${e.fonteTitulos}', serif`);
          if (e.fonteTexto)   document.body.style.fontFamily = `'${e.fonteTexto}', sans-serif`;
        };
      }
    }

  } catch (err) {
    console.error("Erro ao carregar conteúdo:", err);
  }
}

carregarConteudo();
