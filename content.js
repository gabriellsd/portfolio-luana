import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function carregarConteudo() {
  try {
    // Coleção "portfolios", documento "principal" (você pode trocar o nome depois)
    const ref = doc(db, "portfolios", "principal");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.warn("Documento de conteúdo ainda não existe no Firestore.");
      return;
    }

    const data = snap.data();

    // Campos de texto (data-field="nomeDoCampo")
    document.querySelectorAll("[data-field]").forEach((el) => {
      const key = el.dataset.field;
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        el.textContent = data[key];
      }
    });

    // Campos de link (data-link-field="whatsapp" / "email")
    document.querySelectorAll("[data-link-field]").forEach((el) => {
      const key = el.dataset.linkField;
      if (data.links && data.links[key]) {
        el.href = data.links[key];
      }
    });

    // Foto de perfil vinda do Cloudinary
    if (data.fotoUrl) {
      const foto = document.querySelector("[data-foto]");
      if (foto) foto.src = data.fotoUrl;
    }

    // Banner do hero vindo do Cloudinary
    if (data.bannerUrl) {
      const hero = document.querySelector(".hero-gradient");
      if (hero) {
        const opacidade = data.bannerOpacidade !== undefined ? data.bannerOpacidade / 100 : 0.8;
        hero.style.backgroundImage = `linear-gradient(rgba(249,247,242,${opacidade}), rgba(249,247,242,${opacidade})), url('${data.bannerUrl}')`;
        hero.style.backgroundSize = "cover";
        hero.style.backgroundPosition = "center";
      }
    }
  } catch (err) {
    console.error("Erro ao carregar conteúdo:", err);
  }
}

carregarConteudo();

