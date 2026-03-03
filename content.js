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

    // Logo na nav
    const siteLogo = document.getElementById("site-logo");
    if (siteLogo && data.logoUrl) {
      siteLogo.src = data.logoUrl;
      siteLogo.classList.remove("hidden");
    }

    // Campos de link (data-link-field="whatsapp" / "email" / "instagram" / "linkedin")
    document.querySelectorAll("[data-link-field]").forEach((el) => {
      const key = el.dataset.linkField;
      if (data.links && data.links[key]) {
        el.href = data.links[key];
        el.classList.remove("hidden"); // mostra redes sociais quando o link estiver preenchido
      }
    });

    // Fontes e cores personalizadas
    if (data.estilos) {
      const e = data.estilos;
      const root = document.documentElement;

      // 1. Atualiza todas as CSS custom properties de uma vez
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
        "cor-nav":           "--cor-nav",
        "cor-nav-texto":     "--cor-nav-texto",
        "cor-sobre-fundo":   "--cor-sobre-fundo",
        "cor-cards":         "--cor-cards",
        "cor-footer-fundo":  "--cor-footer-fundo",
        "cor-footer-texto":  "--cor-footer-texto",
        "cor-borda-foto":       "--cor-borda-foto",
        // Nav específicos
        "cor-nav-btn":          "--cor-nav-btn",
        "cor-nav-btn-texto":    "--cor-nav-btn-texto",
        // Por seção — aplicadas via CSS rules com fallback para o global
        "cor-hero-titulo":      "--cor-hero-titulo",
        "cor-hero-texto":       "--cor-hero-texto",
        "cor-sobre-titulo":     "--cor-sobre-titulo",
        "cor-sobre-texto":      "--cor-sobre-texto",
        "cor-sessoes-titulo":   "--cor-sessoes-titulo",
        "cor-sessoes-texto":    "--cor-sessoes-texto",
        "cor-publicos-titulo":  "--cor-publicos-titulo",
        "cor-publicos-texto":   "--cor-publicos-texto",
      };
      Object.entries(mapaCSS).forEach(([key, css]) => {
        if (e[key]) root.style.setProperty(css, e[key]);
      });

      if (e["cards-radius"] !== undefined) root.style.setProperty("--cards-radius", `${e["cards-radius"]}px`);
      if (e["cards-sombra"])               root.style.setProperty("--cards-sombra",  e["cards-sombra"]);
      if (e["espacamento-secoes"])         root.style.setProperty("--py-secoes",      e["espacamento-secoes"]);
      if (e["tamanho-titulos"])            root.style.setProperty("--titulo-scale",   e["tamanho-titulos"]);

      // 2. Aplica inline nos elementos — garante override sobre classes Tailwind
      // Nav — fundo e links (excluindo o botão Agendar que tem cores próprias)
      const nav = document.getElementById("main-nav");
      if (nav) {
        if (e["cor-nav"]) nav.style.setProperty("background-color", e["cor-nav"], "important");
        if (e["cor-nav-texto"]) nav.querySelectorAll("a, span:not(#nav-btn)").forEach(el =>
          el.style.setProperty("color", e["cor-nav-texto"], "important")
        );
      }
      // Botão Agendar da nav — cores independentes dos outros links
      const navBtn = document.getElementById("nav-btn");
      if (navBtn) {
        if (e["cor-nav-btn"]) navBtn.style.setProperty("background-color", e["cor-nav-btn"], "important");
        if (e["cor-nav-btn-texto"]) navBtn.style.setProperty("color", e["cor-nav-btn-texto"], "important");
      }

      // Fundo geral do site
      if (e["cor-fundo"]) document.body.style.backgroundColor = e["cor-fundo"];

      // Sobre mim — fundo da seção
      const secSobre = document.getElementById("sobre");
      if (secSobre && e["cor-sobre-fundo"]) secSobre.style.setProperty("background-color", e["cor-sobre-fundo"], "important");

      // Sessões — fundo da seção e dos cards
      const secAtendimento = document.getElementById("atendimento");
      if (secAtendimento && e["cor-fundo-alt"]) secAtendimento.style.setProperty("background-color", e["cor-fundo-alt"], "important");
      document.querySelectorAll(".sessao-card").forEach(card => {
        if (e["cor-cards"]) card.style.setProperty("background-color", e["cor-cards"], "important");
      });

      // Contato — fundo da seção
      const secContato = document.getElementById("contato");
      if (secContato && e["cor-fundo-contato"]) secContato.style.setProperty("background-color", e["cor-fundo-contato"], "important");

      // Footer — fundo e texto
      const footer = document.getElementById("main-footer");
      if (footer) {
        if (e["cor-footer-fundo"]) footer.style.setProperty("background-color", e["cor-footer-fundo"], "important");
        if (e["cor-footer-texto"]) footer.querySelectorAll("p, span").forEach(p =>
          p.style.setProperty("color", e["cor-footer-texto"], "important")
        );
      }

      // Títulos globais (base; seções específicas sobrescreverão abaixo)
      if (e["cor-titulos"]) document.querySelectorAll("h1, h2, h3").forEach(el =>
        el.style.setProperty("color", e["cor-titulos"], "important")
      );

      // Texto do corpo (base global)
      if (e["cor-texto"]) document.body.style.color = e["cor-texto"];

      // Texto secundário
      if (e["cor-texto-claro"]) document.querySelectorAll(".text-gray-500, .text-gray-600, .opacity-80").forEach(el =>
        el.style.color = e["cor-texto-claro"]
      );

      // Botões de contato (WhatsApp / Email) — excluindo o botão Agendar da nav
      if (e["cor-botao"] || e["cor-botao-texto"]) {
        document.querySelectorAll(".bg-sage:not(#nav-btn)").forEach(el => {
          if (e["cor-botao"]) el.style.setProperty("background-color", e["cor-botao"], "important");
          if (e["cor-botao-texto"]) el.style.setProperty("color", e["cor-botao-texto"], "important");
        });
      }

      // ── Cores por seção ──────────────────────────────────────────────────────
      // Aplicadas DEPOIS do global para sobrescrever onde necessário (inline !important)
      const secaoCorMap = [
        { sel: ".hero-gradient", tk: "cor-hero-titulo",    txk: "cor-hero-texto"    },
        { sel: "#sobre",         tk: "cor-sobre-titulo",   txk: "cor-sobre-texto"   },
        { sel: "#atendimento",   tk: "cor-sessoes-titulo", txk: "cor-sessoes-texto" },
        { sel: "#publico",       tk: "cor-publicos-titulo",txk: "cor-publicos-texto"},
      ];
      secaoCorMap.forEach(({ sel, tk, txk }) => {
        const sec = document.querySelector(sel);
        if (!sec) return;
        if (e[tk])  sec.querySelectorAll("h1, h2, h3").forEach(el => el.style.setProperty("color", e[tk],  "important"));
        if (e[txk]) sec.querySelectorAll("p").forEach(el => el.style.setProperty("color", e[txk], "important"));
      });

      // Alinhamento do hero
      if (e["hero-alinhamento"]) {
        const heroSection = document.querySelector(".hero-gradient");
        if (heroSection) {
          heroSection.style.textAlign = e["hero-alinhamento"];
          heroSection.style.alignItems = e["hero-alinhamento"] === "left" ? "flex-start" : "center";
        }
      }

      // Animação dos cards
      if (e["cards-animacao"] === false || e["cards-animacao"] === "false") {
        document.body.classList.add("sem-animacao-cards");
      }

      // Fontes (carrega Google Fonts e aplica)
      if (e.fonteTitulos || e.fonteTexto || e.fonteNav) {
        const fonteNavBase = e.fonteNav ? e.fonteNav.split(",")[0].replace(/'/g,"").trim() : null;
        const fonts = [
          e.fonteTitulos && `family=${e.fonteTitulos.replace(/ /g, "+")}:ital,wght@0,400;0,600;1,400`,
          e.fonteTexto   && `family=${e.fonteTexto.replace(/ /g, "+")}:wght@300;400;500;600`,
          fonteNavBase   && `family=${fonteNavBase.replace(/ /g, "+")}:wght@300;400;500;600`,
        ].filter(Boolean).join("&");
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
        document.head.appendChild(link);
        link.onload = () => {
          if (e.fonteTitulos) document.querySelectorAll("h1,h2,h3,.font-serif").forEach(el =>
            el.style.fontFamily = `'${e.fonteTitulos}', serif`
          );
          if (e.fonteTexto) document.body.style.fontFamily = `'${e.fonteTexto}', sans-serif`;
          if (e.fonteNav) {
            root.style.setProperty("--fonte-nav", e.fonteNav);
            const nav = document.getElementById("main-nav");
            if (nav) nav.style.fontFamily = e.fonteNav;
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

