import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
                           from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig }  from "./firebase-config.js";

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── Elementos globais ─────────────────────────────────────────────────
const telaLogin    = document.getElementById("tela-login");
const painel       = document.getElementById("painel");
const formLogin    = document.getElementById("form-login");
const erroLogin    = document.getElementById("erro-login");
const btnLogout    = document.getElementById("btn-logout");
const iframe       = document.getElementById("preview-site");
const painelEdicao = document.getElementById("painel-edicao");
const painelTitulo = document.getElementById("painel-titulo");
const painelConteudo = document.getElementById("painel-conteudo");
const fecharPainel = document.getElementById("fechar-painel");
const btnSalvar    = document.getElementById("btn-salvar");
const msgSalvar    = document.getElementById("msg-salvar");

// ── Login / Logout ────────────────────────────────────────────────────
formLogin?.addEventListener("submit", async (e) => {
  e.preventDefault();
  erroLogin.classList.add("hidden");
  try {
    await signInWithEmailAndPassword(auth,
      document.getElementById("login-email").value,
      document.getElementById("login-senha").value
    );
  } catch {
    erroLogin.textContent = "E-mail ou senha incorretos.";
    erroLogin.classList.remove("hidden");
  }
});

btnLogout?.addEventListener("click", () => signOut(auth));

// ── Estado de autenticação ────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    telaLogin.classList.add("hidden");
    painel.classList.remove("hidden");
    iniciarPainel();
  } else {
    telaLogin.classList.remove("hidden");
    painel.classList.add("hidden");
  }
});

// ── Seção atualmente aberta ───────────────────────────────────────────
let secaoAtiva = null;
let dadosAtuais = {};   // dados carregados do Firestore

// ── Helper: injeta CSS no iframe ──────────────────────────────────────
function iframeDoc() {
  try { return iframe.contentDocument; } catch { return null; }
}

function setCSSVar(nome, valor) {
  const doc = iframeDoc();
  if (!doc) return;
  doc.documentElement.style.setProperty(nome, valor);
}

function setIframeStyle(seletor, prop, valor, importante = false) {
  const doc = iframeDoc();
  if (!doc) return;
  doc.querySelectorAll(seletor).forEach(el =>
    el.style.setProperty(prop, valor, importante ? "important" : "")
  );
}

function carregarFonteIframe(nomeFonte) {
  const doc = iframeDoc();
  if (!doc || !nomeFonte) return;
  const id = "admin-font-" + nomeFonte.replace(/ /g, "-");
  if (doc.getElementById(id)) return;
  const link = doc.createElement("link");
  link.id   = id;
  link.rel  = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${nomeFonte.replace(/ /g, "+")}:wght@300;400;500;600&display=swap`;
  doc.head.appendChild(link);
}

// ── Fontes disponíveis ────────────────────────────────────────────────
const FONTES = [
  "Inter", "Lato", "Open Sans", "Raleway", "Nunito", "Montserrat",
  "Playfair Display", "Cormorant Garamond", "Lora", "Merriweather",
];

// ════════════════════════════════════════════════════════════════════════
// DEFINIÇÕES DE SEÇÕES
// Cada seção sabe: como renderizar controles e como aplicar ao iframe
// ════════════════════════════════════════════════════════════════════════

const SECOES = {

  // ── NAVEGAÇÃO ────────────────────────────────────────────────────────
  nav: {
    titulo: "Navegação",
    defaults: {
      fundoCor:       "#ffffff",
      linksCor:       "#374151",
      btnCor:         "#8DAA91",
      btnTextoCor:    "#ffffff",
      letraTamanho:   "14",
      fonte:          "Inter",
      layout:         "logo-esq-links-dir",
    },

    renderControles(dados) {
      return `
        <!-- Cores -->
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Cores</p>
          <div class="space-y-3">
            ${colorRow("fundoCor",    "Fundo da nav",       dados.fundoCor)}
            ${colorRow("linksCor",    "Cor das letras",     dados.linksCor)}
            ${colorRow("btnCor",      "Cor do botão",       dados.btnCor)}
            ${colorRow("btnTextoCor", "Texto do botão",     dados.btnTextoCor)}
          </div>
        </div>

        <!-- Tipografia -->
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Tipografia</p>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-gray-500 block mb-1.5">Fonte</label>
              <select id="ctrl-fonte" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-gray-400">
                ${FONTES.map(f => `<option value="${f}" ${f === dados.fonte ? "selected" : ""}>${f}</option>`).join("")}
              </select>
            </div>
            <div>
              <div class="flex justify-between mb-1.5">
                <label class="text-xs text-gray-500">Tamanho da letra</label>
                <span id="ctrl-letraTamanho-val" class="text-xs font-mono text-gray-400">${dados.letraTamanho}px</span>
              </div>
              <input id="ctrl-letraTamanho" type="range" min="11" max="20" value="${dados.letraTamanho}" class="w-full" />
              <div class="flex justify-between text-[10px] text-gray-400 mt-0.5"><span>Menor</span><span>Maior</span></div>
            </div>
          </div>
        </div>

        <!-- Posicionamento -->
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Posicionamento</p>
          <div class="grid grid-cols-1 gap-2">
            ${layoutBtn("logo-esq-links-dir",  dados.layout, "Logo esquerda · Links direita",  "◼ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — — ● ")}
            ${layoutBtn("logo-esq-links-centro",dados.layout, "Logo esquerda · Links centro",   "◼ &nbsp;&nbsp; — — &nbsp;&nbsp; ● ")}
            ${layoutBtn("logo-centro",          dados.layout, "Logo centralizada",               "&nbsp;&nbsp;&nbsp; ◼ &nbsp;&nbsp;&nbsp; — — — ● ")}
          </div>
        </div>
      `;
    },

    aplicar(dados) {
      const doc = iframeDoc();
      if (!doc) return;

      // Fundo
      setIframeStyle("#main-nav", "background-color", dados.fundoCor, true);

      // Cor das letras
      setIframeStyle("#main-nav a, #main-nav span[data-field]", "color", dados.linksCor, true);

      // Botão Agendar
      setIframeStyle("#nav-btn", "background-color", dados.btnCor, true);
      setIframeStyle("#nav-btn", "color", dados.btnTextoCor, true);

      // Tamanho e fonte
      carregarFonteIframe(dados.fonte);
      setIframeStyle("#main-nav", "font-size", dados.letraTamanho + "px", true);
      setIframeStyle("#main-nav", "font-family", `'${dados.fonte}', sans-serif`, true);

      // Layout / posicionamento
      const inner = doc.querySelector("#main-nav > div");
      if (inner) {
        inner.style.display = "flex";
        inner.style.alignItems = "center";
        if (dados.layout === "logo-esq-links-dir") {
          inner.style.justifyContent = "space-between";
          inner.style.flexDirection  = "row";
        } else if (dados.layout === "logo-esq-links-centro") {
          inner.style.justifyContent = "space-between";
          const linksEl = doc.querySelector("#main-nav nav");
          if (linksEl) {
            linksEl.style.position = "absolute";
            linksEl.style.left     = "50%";
            linksEl.style.transform = "translateX(-50%)";
          }
        } else if (dados.layout === "logo-centro") {
          inner.style.justifyContent = "center";
          inner.style.position = "relative";
          const logo = doc.querySelector("#main-nav > div > div:first-child");
          if (logo) { logo.style.position = "absolute"; logo.style.left = "50%"; logo.style.transform = "translateX(-50%)"; }
        }
      }
    },
  },

};

// ── Helpers de UI ─────────────────────────────────────────────────────
function colorRow(id, label, valor) {
  return `
    <div class="flex items-center justify-between">
      <label class="text-sm text-gray-600">${label}</label>
      <div class="flex items-center gap-2">
        <span id="ctrl-${id}-hex" class="text-xs font-mono text-gray-400">${valor}</span>
        <input id="ctrl-${id}" type="color" value="${valor}" />
      </div>
    </div>`;
}

function layoutBtn(valor, atual, titulo, preview) {
  const ativo = valor === atual;
  return `
    <button data-layout="${valor}"
      class="layout-btn text-left border rounded-xl px-3 py-2.5 transition text-xs ${ativo ? "border-gray-800 bg-gray-50 font-semibold text-gray-800" : "border-gray-200 text-gray-500 hover:border-gray-400"}">
      <span class="block font-mono text-[10px] mb-0.5 opacity-60">${preview}</span>
      ${titulo}
    </button>`;
}

// ── Abrir seção no painel ─────────────────────────────────────────────
function abrirSecao(id) {
  const secao = SECOES[id];
  if (!secao) return;

  // Botões da barra
  document.querySelectorAll(".btn-secao").forEach(b => b.classList.remove("ativo"));
  document.querySelector(`.btn-secao[data-secao="${id}"]`)?.classList.add("ativo");

  secaoAtiva = id;
  painelTitulo.textContent = secao.titulo;

  // Dados salvos ou defaults
  const dados = { ...secao.defaults, ...(dadosAtuais?.estilos?.[id] || {}) };
  painelConteudo.innerHTML = secao.renderControles(dados);

  // Registrar listeners dos controles
  registrarListeners(id, dados);

  // Abrir painel
  painelEdicao.classList.add("aberto");
}

function fecharSecao() {
  painelEdicao.classList.remove("aberto");
  document.querySelectorAll(".btn-secao").forEach(b => b.classList.remove("ativo"));
  secaoAtiva = null;
}

// ── Registrar listeners dinâmicos dos controles ───────────────────────
function registrarListeners(id, dados) {
  const secao = SECOES[id];

  // Color pickers
  painelConteudo.querySelectorAll("input[type=color]").forEach(input => {
    const campo = input.id.replace("ctrl-", "");
    const hex   = document.getElementById(`ctrl-${campo}-hex`);
    input.addEventListener("input", () => {
      dados[campo] = input.value;
      if (hex) hex.textContent = input.value;
      secao.aplicar(dados);
    });
  });

  // Range sliders
  const slider = document.getElementById("ctrl-letraTamanho");
  const sliderVal = document.getElementById("ctrl-letraTamanho-val");
  if (slider) {
    slider.addEventListener("input", () => {
      dados.letraTamanho = slider.value;
      if (sliderVal) sliderVal.textContent = slider.value + "px";
      secao.aplicar(dados);
    });
  }

  // Select de fonte
  const selectFonte = document.getElementById("ctrl-fonte");
  if (selectFonte) {
    selectFonte.addEventListener("change", () => {
      dados.fonte = selectFonte.value;
      secao.aplicar(dados);
    });
  }

  // Botões de layout
  painelConteudo.querySelectorAll(".layout-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      dados.layout = btn.dataset.layout;
      // Atualiza visual dos botões
      painelConteudo.querySelectorAll(".layout-btn").forEach(b => {
        b.classList.remove("border-gray-800", "bg-gray-50", "font-semibold", "text-gray-800");
        b.classList.add("border-gray-200", "text-gray-500");
      });
      btn.classList.remove("border-gray-200", "text-gray-500");
      btn.classList.add("border-gray-800", "bg-gray-50", "font-semibold", "text-gray-800");
      secao.aplicar(dados);
    });
  });

  // Guarda referência dos dados editados para o salvar
  painelConteudo._dadosAtivos = dados;
}

// ── Salvar no Firestore ───────────────────────────────────────────────
async function salvarSecao() {
  if (!secaoAtiva) return;
  const dados = painelConteudo._dadosAtivos;
  if (!dados) return;

  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando...";
  msgSalvar.classList.add("hidden");

  try {
    const ref = doc(db, "portfolios", "principal");
    await setDoc(ref, { estilos: { [secaoAtiva]: dados } }, { merge: true });
    dadosAtuais.estilos = { ...dadosAtuais.estilos, [secaoAtiva]: dados };
    mostrarMsg("Salvo com sucesso!", "ok");
  } catch (err) {
    console.error(err);
    mostrarMsg("Erro ao salvar.", "erro");
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = "Salvar alterações";
  }
}

function mostrarMsg(texto, tipo) {
  msgSalvar.textContent = texto;
  msgSalvar.className = "text-xs text-center mt-2 " + (tipo === "ok" ? "text-green-600" : "text-red-500");
  msgSalvar.classList.remove("hidden");
  setTimeout(() => msgSalvar.classList.add("hidden"), 3000);
}

// ── Carregar dados do Firestore ───────────────────────────────────────
async function carregarDados() {
  try {
    const snap = await getDoc(doc(db, "portfolios", "principal"));
    dadosAtuais = snap.exists() ? snap.data() : {};
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
}

// ── Iniciar painel ────────────────────────────────────────────────────
async function iniciarPainel() {
  await carregarDados();

  // Listeners dos botões de seção
  document.querySelectorAll(".btn-secao").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.secao;
      if (secaoAtiva === id) {
        fecharSecao();
      } else {
        // Aguarda iframe carregar antes de aplicar
        if (iframe.contentDocument?.readyState === "complete") {
          abrirSecao(id);
        } else {
          iframe.addEventListener("load", () => abrirSecao(id), { once: true });
        }
      }
    });
  });

  // Fechar painel
  fecharPainel?.addEventListener("click", fecharSecao);

  // Salvar
  btnSalvar?.addEventListener("click", salvarSecao);

  // Quando iframe carrega, aplica estilos salvos automaticamente
  iframe.addEventListener("load", () => {
    const estilos = dadosAtuais?.estilos || {};
    Object.entries(SECOES).forEach(([id, secao]) => {
      const dados = { ...secao.defaults, ...(estilos[id] || {}) };
      secao.aplicar(dados);
    });
  });
}
