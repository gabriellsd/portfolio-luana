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

    // Fontes e cores personalizadas
    if (data.estilos) {
      const e = data.estilos;
      const root = document.documentElement;

      // Cores via CSS custom properties
      const mapaCSS = {
        "cor-primaria":      "--primary-sage",
        "cor-titulos":       "--cor-titulos",
        "cor-texto":         "--text-dark",
        "cor-texto-claro":   "--cor-texto-claro",
        "cor-fundo":         "--soft-cream",
        "cor-fundo-alt":     "--cor-fundo-alt",
        "cor-fundo-contato": "--cor-contato",
        "cor-botao":         "--cor-botao",
        "cor-botao-texto":   "--cor-botao-texto",
      };
      Object.entries(mapaCSS).forEach(([key, css]) => {
        if (e[key]) root.style.setProperty(css, e[key]);
      });

      // Aplica cor de fundo alternado às seções
      if (e["cor-fundo-alt"]) {
        document.querySelectorAll("section.bg-stone-50, section.bg-\\[var\\(--cor-fundo-alt\\)\\]").forEach(el => {
          el.style.backgroundColor = e["cor-fundo-alt"];
        });
      }
      // Aplica cor de fundo da seção contato
      if (e["cor-fundo-contato"]) {
        const secContato = document.querySelector("section.bg-sage, #contato");
        if (secContato) secContato.style.backgroundColor = e["cor-fundo-contato"];
      }
      // Aplica cor de botões
      if (e["cor-botao"]) {
        document.querySelectorAll(".bg-sage, button.rounded-full").forEach(el => {
          el.style.backgroundColor = e["cor-botao"];
        });
      }
      if (e["cor-botao-texto"]) {
        document.querySelectorAll(".bg-sage, button.rounded-full").forEach(el => {
          el.style.color = e["cor-botao-texto"];
        });
      }
      // Cor dos títulos
      if (e["cor-titulos"]) {
        document.querySelectorAll("h1,h2,h3").forEach(el => {
          el.style.color = e["cor-titulos"];
        });
      }
      // Cor do texto claro
      if (e["cor-texto-claro"]) {
        document.querySelectorAll(".text-gray-500, .text-slate-500").forEach(el => {
          el.style.color = e["cor-texto-claro"];
        });
      }

      if (e.fonteTitulos || e.fonteTexto) {
        const fonts = [
          e.fonteTitulos && `family=${e.fonteTitulos.replace(/ /g, "+")}:ital,wght@0,400;0,600;1,400`,
          e.fonteTexto   && `family=${e.fonteTexto.replace(/ /g, "+")}:wght@300;400;500;600`,
        ].filter(Boolean).join("&");
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
        document.head.appendChild(link);

        link.onload = () => {
          if (e.fonteTitulos) {
            document.querySelectorAll("h1,h2,h3,.font-serif").forEach(el => {
              el.style.fontFamily = `'${e.fonteTitulos}', serif`;
            });
          }
          if (e.fonteTexto) {
            document.body.style.fontFamily = `'${e.fonteTexto}', sans-serif`;
          }
        };
      }
    }

    // Foto de perfil: troca imagem (se tiver) e aplica opacidade sempre
    const foto = document.querySelector("[data-foto]");
    if (foto) {
      if (data.fotoUrl) foto.src = data.fotoUrl;
      foto.style.opacity = data.fotoOpacidade !== undefined ? data.fotoOpacidade / 100 : 1;
    }

    // Banner do hero: troca imagem (se tiver) e aplica opacidade sempre
    const hero = document.querySelector(".hero-gradient");
    if (hero) {
      const opacidade = data.bannerOpacidade !== undefined ? data.bannerOpacidade / 100 : 0.8;
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

