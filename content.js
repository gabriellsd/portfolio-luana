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
      hero.style.backgroundImage =
        `linear-gradient(rgba(249,247,242,${opacidade}), rgba(249,247,242,${opacidade})), url('${bgUrl}')`;
      hero.style.backgroundSize = "cover";
      hero.style.backgroundPosition = "center";
    }

  } catch (err) {
    console.error("Erro ao carregar conteúdo:", err);
  }
}

carregarConteudo();
