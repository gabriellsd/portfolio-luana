import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById("portfolio-form");
const msgEl = document.getElementById("mensagem");

const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const previewFields = document.querySelectorAll("[data-preview-field]");
const previewFoto = document.getElementById("preview-foto");
const btnUploadFoto = document.getElementById("btn-upload-foto");
const inputFoto = document.getElementById("input-foto");
const previewHero = document.getElementById("preview-hero");
const btnUploadBanner      = document.getElementById("btn-upload-banner");
const btnUploadBannerModal = document.getElementById("btn-upload-banner-modal");
const inputBanner = document.getElementById("input-banner");
const sliderOpacidade = document.getElementById("banner-opacidade");
const labelOpacidade = document.getElementById("banner-opacidade-valor");
const sliderOpacidadeFoto = document.getElementById("foto-opacidade");
const labelOpacidadeFoto = document.getElementById("foto-opacidade-valor");

// Estilos
const toggleEstilos  = document.getElementById("toggle-estilos");
const modalEstilos   = document.getElementById("modal-estilos");
const modalOverlay   = document.getElementById("modal-overlay");
const fecharEstilos  = document.getElementById("fechar-estilos");
const fonteTitulos   = document.getElementById("fonte-titulos");
const fonteTexto     = document.getElementById("fonte-texto");
const salvarEstilos  = document.getElementById("salvar-estilos");

// Todos os color pickers
const coresCfg = [
  { id: "cor-primaria",      hex: "cor-primaria-hex",       css: "--primary-sage",    def: "#8DAA91" },
  { id: "cor-titulos",       hex: "cor-titulos-hex",         css: "--cor-titulos",     def: "#2D2D2D" },
  { id: "cor-texto",         hex: "cor-texto-hex",           css: "--text-dark",       def: "#4A4A4A" },
  { id: "cor-texto-claro",   hex: "cor-texto-claro-hex",     css: "--cor-texto-claro", def: "#6B7280" },
  { id: "cor-fundo",         hex: "cor-fundo-hex",           css: "--soft-cream",      def: "#F9F7F2" },
  { id: "cor-fundo-alt",     hex: "cor-fundo-alt-hex",       css: "--cor-fundo-alt",   def: "#F5F5F4" },
  { id: "cor-fundo-contato", hex: "cor-fundo-contato-hex",   css: "--cor-contato",     def: "#8DAA91" },
  { id: "cor-botao",         hex: "cor-botao-hex",           css: "--cor-botao",       def: "#8DAA91" },
  { id: "cor-botao-texto",   hex: "cor-botao-texto-hex",     css: "--cor-botao-texto", def: "#FFFFFF" },
  { id: "cor-nav",           hex: "cor-nav-hex",             css: "--cor-nav",         def: "#FFFFFF" },
  { id: "cor-nav-texto",     hex: "cor-nav-texto-hex",       css: "--cor-nav-texto",   def: "#374151" },
  { id: "cor-sobre-fundo",   hex: "cor-sobre-fundo-hex",     css: "--cor-sobre-fundo", def: "#FFFFFF" },
  { id: "cor-cards",         hex: "cor-cards-hex",           css: "--cor-cards",       def: "#FFFFFF" },
  { id: "cor-footer-fundo",  hex: "cor-footer-fundo-hex",    css: "--cor-footer-fundo",def: "#F1F0EB" },
  { id: "cor-footer-texto",  hex: "cor-footer-texto-hex",    css: "--cor-footer-texto",def: "#6B7280" },
  { id: "cor-borda-foto",    hex: "cor-borda-foto-hex",      css: "--cor-borda-foto",  def: "#8DAA91" },
];

const CLOUDINARY_CLOUD = "gabriellsd";
const CLOUDINARY_PRESET = "portfolio-luana";

// Logo
const areaLogo       = document.getElementById("area-logo");
const inputLogo      = document.getElementById("input-logo");
const previewLogo    = document.getElementById("preview-logo");
const logoPlaceholder= document.getElementById("logo-placeholder");

function mostrarMensagem(texto, tipo = "sucesso") {
  msgEl.textContent = texto;
  msgEl.classList.remove("hidden");
  msgEl.classList.remove("bg-red-100", "text-red-700", "bg-emerald-100", "text-emerald-700");

  if (tipo === "erro") {
    msgEl.classList.add("bg-red-100", "text-red-700");
  } else {
    msgEl.classList.add("bg-emerald-100", "text-emerald-700");
  }

  setTimeout(() => {
    msgEl.classList.add("hidden");
  }, 4000);
}

// Converte os campos do formulário em um objeto para o Firestore
function formToData(formEl) {
  const data = {};

  const formData = new FormData(formEl);
  for (const [name, value] of formData.entries()) {
    // Se o campo estiver em branco, não sobrescreve o que já existe no Firestore
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    if (name.startsWith("links.")) {
      const key = name.split(".")[1];
      if (!data.links) data.links = {};
      data.links[key] = value;
    } else {
      data[name] = value;
    }
  }

  return data;
}

// Preenche o formulário com dados vindos do Firestore
function preencherFormulario(data) {
  if (!data) return;

  Array.from(form.elements).forEach((el) => {
    if (!el.name) return;

    if (el.name.startsWith("links.")) {
      const key = el.name.split(".")[1];
      if (data.links && data.links[key]) {
        el.value = data.links[key];
      }
    } else if (Object.prototype.hasOwnProperty.call(data, el.name)) {
      el.value = data[el.name];
    }
  });

  // Carrega logo salva
  if (data.logoUrl && previewLogo) {
    previewLogo.src = data.logoUrl;
    previewLogo.classList.remove("hidden");
    if (logoPlaceholder) logoPlaceholder.classList.add("hidden");
  }

  // Carrega foto de perfil salva
  if (previewFoto && data.fotoUrl) {
    previewFoto.src = data.fotoUrl;
  }

  // Carrega opacidade salva da foto
  const opacidadeFoto = data.fotoOpacidade !== undefined ? data.fotoOpacidade : 100;
  if (sliderOpacidadeFoto) {
    sliderOpacidadeFoto.value = opacidadeFoto;
    if (labelOpacidadeFoto) labelOpacidadeFoto.textContent = `${opacidadeFoto}%`;
  }
  aplicarOpacidadeFoto(opacidadeFoto);

  // Carrega banner salvo
  if (previewHero && data.bannerUrl) {
    previewHero.dataset.bannerUrl = data.bannerUrl;
    const opacidade = data.bannerOpacidade !== undefined ? data.bannerOpacidade : 85;
    if (sliderOpacidade) {
      sliderOpacidade.value = opacidade;
      if (labelOpacidade) labelOpacidade.textContent = `${opacidade}%`;
    }
    aplicarOpacidadeBanner(opacidade, data.bannerUrl);
  }

  // Sincroniza inputs com o preview visual
  syncInputsToPreview();
}

// Copia valores dos inputs para o preview visual
function syncInputsToPreview() {
  previewFields.forEach((el) => {
    const key = el.dataset.previewField;
    const input = form.elements.namedItem(key);
    if (input && typeof input.value === "string" && input.value.trim() !== "") {
      el.textContent = input.value;
    }
  });
}

// Configura edição no preview: ao digitar no bloco visual, atualiza o input oculto
function setupPreviewEditing() {
  previewFields.forEach((el) => {
    el.addEventListener("input", () => {
      const key = el.dataset.previewField;
      const input = form.elements.namedItem(key);
      if (input) {
        input.value = el.textContent.trim();
      }
    });
  });
}

// Valida a foto antes de enviar
function validarFoto(file) {
  return new Promise((resolve, reject) => {
    // Máx. 5 MB
    if (file.size > 5 * 1024 * 1024) {
      reject("A foto é muito grande. Use uma imagem de até 5 MB.");
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const proporcao = img.width / img.height;
      // Ideal 4:5 (0.8) — aceita entre 0.6 e 1.1
      if (proporcao < 0.6 || proporcao > 1.1) {
        reject(
          `Proporção fora do ideal. Use uma foto no formato retrato (ex.: 800×1000 px). Sua imagem: ${img.width}×${img.height} px.`
        );
      } else {
        resolve();
      }
    };
    img.onerror = () => reject("Não foi possível ler a imagem.");
    img.src = url;
  });
}

// Aplica opacidade na foto de perfil
function aplicarOpacidadeFoto(valor) {
  if (!previewFoto) return;
  previewFoto.style.opacity = valor / 100;
}

// Aplica opacidade do filtro no banner do hero
function aplicarOpacidadeBanner(valor, bannerUrl) {
  if (!previewHero) return;
  const opacidade = valor / 100;
  const bgUrl = bannerUrl || previewHero.dataset.bannerUrl ||
    "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=2070";
  previewHero.style.backgroundImage =
    `linear-gradient(rgba(249,247,242,${opacidade}), rgba(249,247,242,${opacidade})), url('${bgUrl}')`;
  previewHero.style.backgroundSize = "cover";
  previewHero.style.backgroundPosition = "center";
}

// Upload genérico para Cloudinary — retorna a URL
async function uploadCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", "portfolio");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: formData }
  );
  const json = await res.json();
  if (!json.secure_url) throw new Error("URL não retornada");
  return json.secure_url;
}

// Upload da foto para Cloudinary e salva URL no Firestore
async function uploadFoto(file) {
  mostrarMensagem("Enviando foto...", "sucesso");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  formData.append("folder", "portfolio");

  try {
    const url = await uploadCloudinary(file);
    previewFoto.src = url;
    const ref = doc(db, "portfolios", "principal");
    await setDoc(ref, { fotoUrl: url }, { merge: true });
    mostrarMensagem("Foto atualizada com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao enviar foto. Tente novamente.", "erro");
  }
}

// Upload do banner Hero
async function uploadBanner(file) {
  mostrarMensagem("Enviando banner...", "sucesso");
  try {
    const url = await uploadCloudinary(file);
    previewHero.dataset.bannerUrl = url;
    const opacidade = sliderOpacidade ? Number(sliderOpacidade.value) : 85;
    aplicarOpacidadeBanner(opacidade, url);
    const ref = doc(db, "portfolios", "principal");
    await setDoc(ref, { bannerUrl: url }, { merge: true });
    mostrarMensagem("Banner atualizado com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao enviar banner. Tente novamente.", "erro");
  }
}

// Upload da logo
async function uploadLogo(file) {
  mostrarMensagem("Enviando logo...");
  try {
    const url = await uploadCloudinary(file);
    if (previewLogo) { previewLogo.src = url; previewLogo.classList.remove("hidden"); }
    if (logoPlaceholder) logoPlaceholder.classList.add("hidden");
    const ref = doc(db, "portfolios", "principal");
    await setDoc(ref, { logoUrl: url }, { merge: true });
    mostrarMensagem("Logo atualizada com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao enviar logo.", "erro");
  }
}

// Carrega uma fonte do Google Fonts dinamicamente
function carregarFonte(nomeFonte) {
  if (!nomeFonte) return;
  const id = `gfont-${nomeFonte.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return; // já carregada
  const link = document.createElement("link");
  link.id   = id;
  link.rel  = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(nomeFonte)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

// Aplica estilos (fontes e cores) no preview do admin
function aplicarEstilos(estilos = {}) {
  const root = document.documentElement;

  // Fontes — carrega do Google Fonts se necessário
  const prevTitulo = document.getElementById("prev-titulo");
  const prevTexto  = document.getElementById("prev-texto");
  const prevBotao  = document.getElementById("prev-botao");

  if (estilos.fonteTitulos) {
    carregarFonte(estilos.fonteTitulos);
    const ff = `'${estilos.fonteTitulos}', serif`;
    document.querySelectorAll("h1,h2,h3,.font-serif").forEach(el => el.style.fontFamily = ff);
    if (prevTitulo) prevTitulo.style.fontFamily = ff;
  }
  if (estilos.fonteTexto) {
    carregarFonte(estilos.fonteTexto);
    const ff = `'${estilos.fonteTexto}', sans-serif`;
    document.querySelectorAll("p,span:not(.text-sage)").forEach(el => el.style.fontFamily = ff);
    if (prevTexto) prevTexto.style.fontFamily = ff;
  }

  // Aplica cada cor via CSS var
  coresCfg.forEach(({ id, css, def }) => {
    const val = estilos[id] || def;
    root.style.setProperty(css, val);
  });

  // As cores do preview atualizam via CSS vars automaticamente.
  // Só precisamos aplicar as fontes via JS pois não há CSS var para font-family.
  if (prevTitulo && estilos.fonteTitulos) prevTitulo.style.fontFamily = `'${estilos.fonteTitulos}', serif`;
  if (prevTexto  && estilos.fonteTexto)   prevTexto.style.fontFamily  = `'${estilos.fonteTexto}', sans-serif`;

  // Seção contato
  const previewContato = document.getElementById("preview-contato");
  if (previewContato && estilos["cor-fundo-contato"]) {
    previewContato.style.backgroundColor = estilos["cor-fundo-contato"];
  }

  // Fundo alternado (sessões)
  const previewSessoes = document.getElementById("preview-sessoes");
  if (previewSessoes && estilos["cor-fundo-alt"]) {
    previewSessoes.style.backgroundColor = estilos["cor-fundo-alt"];
  }

  // Nav
  const previewNav = document.querySelector("#app-section nav");
  if (previewNav) {
    if (estilos["cor-nav"])       previewNav.style.backgroundColor = estilos["cor-nav"];
    if (estilos["cor-nav-texto"]) {
      previewNav.querySelectorAll("a, span").forEach(el => el.style.color = estilos["cor-nav-texto"]);
    }
  }

  // Seção sobre
  const previewSobre = document.getElementById("preview-sobre");
  if (previewSobre && estilos["cor-sobre-fundo"]) {
    previewSobre.style.backgroundColor = estilos["cor-sobre-fundo"];
  }

  // Cards
  const radius = estilos["cards-radius"] ? `${estilos["cards-radius"]}px` : null;
  const sombra = estilos["cards-sombra"] || null;
  document.querySelectorAll(".sessao-card-preview").forEach(card => {
    if (estilos["cor-cards"])  card.style.backgroundColor = estilos["cor-cards"];
    if (radius)                card.style.borderRadius    = radius;
    if (sombra)                card.style.boxShadow       = sombra;
  });
  root.style.setProperty("--cards-radius", radius || "1rem");
  root.style.setProperty("--cards-sombra", sombra || "0 1px 3px rgba(0,0,0,0.06)");

  // Footer
  const previewFooter = document.getElementById("preview-footer");
  if (previewFooter) {
    if (estilos["cor-footer-fundo"]) previewFooter.style.backgroundColor = estilos["cor-footer-fundo"];
    if (estilos["cor-footer-texto"]) previewFooter.querySelectorAll("p").forEach(p => p.style.color = estilos["cor-footer-texto"]);
  }

  // Slider de radius: atualiza label
  const radiusLabel = document.getElementById("cards-radius-val");
  if (radiusLabel && estilos["cards-radius"] !== undefined) {
    radiusLabel.textContent = `${estilos["cards-radius"]}px`;
  }

  // Espaçamento das seções
  if (estilos["espacamento-secoes"]) {
    root.style.setProperty("--py-secoes", estilos["espacamento-secoes"]);
  }
  // Tamanho dos títulos
  if (estilos["tamanho-titulos"]) {
    root.style.setProperty("--titulo-scale", estilos["tamanho-titulos"]);
  }
  // Alinhamento no hero
  const heroEl = document.getElementById("preview-hero");
  if (heroEl && estilos["hero-alinhamento"]) {
    heroEl.style.textAlign = estilos["hero-alinhamento"];
  }
  // Animação dos cards
  if (estilos["cards-animacao"] === false || estilos["cards-animacao"] === "false") {
    document.body.classList.add("sem-animacao-cards");
  } else {
    document.body.classList.remove("sem-animacao-cards");
  }
  // Borda decorativa da foto
  if (estilos["cor-borda-foto"]) {
    root.style.setProperty("--cor-borda-foto", estilos["cor-borda-foto"]);
    document.querySelectorAll(".borda-foto").forEach(el => {
      el.style.borderColor = estilos["cor-borda-foto"];
    });
  }
}

// Preenche os controles de estilo com os valores salvos
function preencherEstilos(estilos) {
  if (!estilos) return;
  if (estilos.fonteTitulos && fonteTitulos) fonteTitulos.value = estilos.fonteTitulos;
  if (estilos.fonteTexto   && fonteTexto)   fonteTexto.value   = estilos.fonteTexto;

  coresCfg.forEach(({ id, hex }) => {
    const input = document.getElementById(id);
    const label = document.getElementById(hex);
    if (input && estilos[id]) {
      input.value = estilos[id];
      if (label) label.textContent = estilos[id];
    }
  });

  // Campos não-cor
  const radiusEl = document.getElementById("cards-radius");
  const radiusLabel = document.getElementById("cards-radius-val");
  if (radiusEl && estilos["cards-radius"] !== undefined) {
    radiusEl.value = estilos["cards-radius"];
    if (radiusLabel) radiusLabel.textContent = `${estilos["cards-radius"]}px`;
  }
  const sombraEl = document.getElementById("cards-sombra");
  if (sombraEl && estilos["cards-sombra"]) sombraEl.value = estilos["cards-sombra"];

  const espacamentoEl = document.getElementById("espacamento-secoes");
  if (espacamentoEl && estilos["espacamento-secoes"]) espacamentoEl.value = estilos["espacamento-secoes"];
  const tamanhoEl = document.getElementById("tamanho-titulos");
  if (tamanhoEl && estilos["tamanho-titulos"]) tamanhoEl.value = estilos["tamanho-titulos"];
  const alinhamentoEl = document.getElementById("hero-alinhamento");
  if (alinhamentoEl && estilos["hero-alinhamento"]) alinhamentoEl.value = estilos["hero-alinhamento"];
  const animacaoEl = document.getElementById("cards-animacao");
  if (animacaoEl && estilos["cards-animacao"] !== undefined) animacaoEl.checked = estilos["cards-animacao"] !== false && estilos["cards-animacao"] !== "false";

  aplicarEstilos(estilos);
}

// Lê todos os valores do modal e retorna objeto de estilos
function lerEstilosDoModal() {
  const estilos = {
    fonteTitulos: fonteTitulos?.value || "Playfair Display",
    fonteTexto:   fonteTexto?.value   || "Inter",
  };
  coresCfg.forEach(({ id, def }) => {
    const input = document.getElementById(id);
    estilos[id] = input ? input.value : def;
  });
  const radiusEl       = document.getElementById("cards-radius");
  const sombraEl       = document.getElementById("cards-sombra");
  const espacamentoEl  = document.getElementById("espacamento-secoes");
  const tamanhoEl      = document.getElementById("tamanho-titulos");
  const alinhamentoEl  = document.getElementById("hero-alinhamento");
  const animacaoEl     = document.getElementById("cards-animacao");
  if (radiusEl)      estilos["cards-radius"]       = Number(radiusEl.value);
  if (sombraEl)      estilos["cards-sombra"]        = sombraEl.value;
  if (espacamentoEl) estilos["espacamento-secoes"]  = espacamentoEl.value;
  if (tamanhoEl)     estilos["tamanho-titulos"]     = tamanhoEl.value;
  if (alinhamentoEl) estilos["hero-alinhamento"]    = alinhamentoEl.value;
  if (animacaoEl)    estilos["cards-animacao"]      = animacaoEl.checked;
  return estilos;
}

async function carregarDadosIniciais() {
  try {
    const ref = doc(db, "portfolios", "principal");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      preencherFormulario(data);
      if (data.estilos) preencherEstilos(data.estilos);
    }
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao carregar dados. Veja o console.", "erro");
  }
}

// Login com e-mail/senha
loginButton.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro no login. Confira e-mail e senha.", "erro");
  }
});

// Logout
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      mostrarMensagem("Erro ao sair.", "erro");
    }
  });
}

// Observa estado de autenticação
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // logado: mostra app, esconde login
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    if (logoutButton) logoutButton.classList.remove("hidden");

    // Garante que preview está configurado
    setupPreviewEditing();

    // Configura botão de upload da foto
    if (btnUploadFoto && inputFoto) {
      btnUploadFoto.addEventListener("click", () => inputFoto.click());
      inputFoto.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          await validarFoto(file);
          uploadFoto(file);
        } catch (msg) {
          mostrarMensagem(msg, "erro");
          inputFoto.value = "";
        }
      });
    }

    // Slider de opacidade da foto de perfil
    if (sliderOpacidadeFoto) {
      sliderOpacidadeFoto.addEventListener("input", () => {
        const val = Number(sliderOpacidadeFoto.value);
        if (labelOpacidadeFoto) labelOpacidadeFoto.textContent = `${val}%`;
        aplicarOpacidadeFoto(val);
      });

      sliderOpacidadeFoto.addEventListener("change", async () => {
        const val = Number(sliderOpacidadeFoto.value);
        const ref = doc(db, "portfolios", "principal");
        await setDoc(ref, { fotoOpacidade: val }, { merge: true });
      });
    }

    // Mapeamento: qual seção mostra quais cards do modal
    const TODOS_CARDS = [
      "modal-hero","modal-tipografia","modal-cores","modal-botoes","modal-nav",
      "modal-fundos","modal-contato","modal-sobre","modal-cards","modal-footer",
      "modal-layout","modal-efeitos","modal-preview",
    ];
    const SECAO_MAP = {
      "modal-nav":        { titulo: "Barra de navegação",
                            cards: ["modal-nav", "modal-tipografia", "modal-layout", "modal-cores"] },
      "modal-hero":       { titulo: "Hero / Banner",
                            cards: ["modal-hero", "modal-tipografia", "modal-layout", "modal-cores"] },
      "modal-sobre":      { titulo: "Seção Sobre mim",
                            cards: ["modal-sobre", "modal-efeitos", "modal-tipografia", "modal-layout", "modal-cores"] },
      "modal-cards":      { titulo: "Cards das sessões",
                            cards: ["modal-cards", "modal-fundos", "modal-tipografia", "modal-layout", "modal-cores"] },
      "modal-cores":      { titulo: "Seção Públicos",
                            cards: ["modal-tipografia", "modal-layout", "modal-cores"] },
      "modal-fundos":     { titulo: "Seção Contato",
                            cards: ["modal-contato", "modal-fundos", "modal-botoes", "modal-tipografia", "modal-layout", "modal-cores"] },
      "modal-footer":     { titulo: "Rodapé",
                            cards: ["modal-footer", "modal-tipografia", "modal-cores"] },
      "modal-tipografia": { titulo: "Fontes",
                            cards: ["modal-tipografia", "modal-layout"] },
      "modal-botoes":     { titulo: "Botões",
                            cards: ["modal-botoes", "modal-tipografia", "modal-cores"] },
      "modal-layout":     { titulo: "Layout",
                            cards: ["modal-layout", "modal-tipografia"] },
      "modal-efeitos":    { titulo: "Efeitos",
                            cards: ["modal-efeitos"] },
    };
    const modalTitulo  = document.getElementById("modal-titulo");
    const btnVerTudo   = document.getElementById("btn-ver-tudo");

    function abrirModalEstilos(alvoId) {
      if (!modalEstilos) return;
      modalEstilos.classList.remove("hidden");
      const config = SECAO_MAP[alvoId];
      const esTudo = !config;

      // Título
      if (modalTitulo) modalTitulo.textContent = esTudo ? "Fontes e Cores" : config.titulo;

      // Mostrar/esconder cards
      TODOS_CARDS.forEach(id => {
        const card = document.getElementById(id);
        if (!card) return;
        if (esTudo || id === "modal-preview") {
          card.classList.remove("hidden");
        } else {
          card.classList.toggle("hidden", !config.cards.includes(id));
        }
      });

      // Botão "Ver tudo"
      if (btnVerTudo) {
        if (esTudo) {
          btnVerTudo.classList.add("hidden");
        } else {
          btnVerTudo.classList.remove("hidden");
          btnVerTudo.onclick = () => abrirModalEstilos(null);
        }
      }

      // Scroll ao topo do modal
      const scroll = modalEstilos.querySelector(".overflow-y-auto");
      if (scroll) scroll.scrollTop = 0;
    }

    // Abre / fecha modal de estilos
    if (toggleEstilos) {
      toggleEstilos.classList.remove("hidden");
      toggleEstilos.addEventListener("click", () => abrirModalEstilos(null));
    }
    if (fecharEstilos)  fecharEstilos.addEventListener("click",  () => modalEstilos.classList.add("hidden"));
    if (modalOverlay)   modalOverlay.addEventListener("click",   () => modalEstilos.classList.add("hidden"));

    // Botões "Editar" no hover das seções — abre modal contextual
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-abrir-estilo]");
      if (!btn) return;
      abrirModalEstilos(btn.dataset.abrirEstilo);
    });

    // Preview em tempo real: color pickers
    coresCfg.forEach(({ id, hex }) => {
      const input = document.getElementById(id);
      const label = document.getElementById(hex);
      if (!input) return;
      input.addEventListener("input", () => {
        if (label) label.textContent = input.value;
        aplicarEstilos(lerEstilosDoModal());
      });
    });

    // Preview em tempo real: fontes
    [fonteTitulos, fonteTexto].forEach(sel => {
      if (!sel) return;
      sel.addEventListener("change", () => aplicarEstilos(lerEstilosDoModal()));
    });

    // Logo upload
    if (areaLogo && inputLogo) {
      areaLogo.addEventListener("click", () => inputLogo.click());
      inputLogo.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
          mostrarMensagem("Logo muito grande. Máx. 3 MB.", "erro");
          return;
        }
        await uploadLogo(file);
        inputLogo.value = "";
      });
    }

    // Carrega logo do Firestore (se existir)
    if (previewLogo && typeof carregarDadosIniciais !== "undefined") {
      // será feito dentro de preencherFormulario via carregarDadosIniciais
    }

    // Preview em tempo real: selects de layout e efeitos
    ["espacamento-secoes", "tamanho-titulos", "hero-alinhamento"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => aplicarEstilos(lerEstilosDoModal()));
    });
    const animacaoEl2 = document.getElementById("cards-animacao");
    if (animacaoEl2) animacaoEl2.addEventListener("change", () => aplicarEstilos(lerEstilosDoModal()));

    // Preview em tempo real: slider radius
    const radiusEl = document.getElementById("cards-radius");
    const radiusLabel = document.getElementById("cards-radius-val");
    if (radiusEl) {
      radiusEl.addEventListener("input", () => {
        if (radiusLabel) radiusLabel.textContent = `${radiusEl.value}px`;
        aplicarEstilos(lerEstilosDoModal());
      });
    }

    // Preview em tempo real: select sombra
    const sombraEl = document.getElementById("cards-sombra");
    if (sombraEl) {
      sombraEl.addEventListener("change", () => aplicarEstilos(lerEstilosDoModal()));
    }

    // Salvar estilos
    if (salvarEstilos) {
      salvarEstilos.addEventListener("click", async () => {
        try {
          const estilos = lerEstilosDoModal();
          const ref = doc(db, "portfolios", "principal");
          await setDoc(ref, { estilos }, { merge: true });
          mostrarMensagem("Estilos salvos com sucesso!");
          modalEstilos.classList.add("hidden");
        } catch (err) {
          console.error(err);
          mostrarMensagem("Erro ao salvar estilos.", "erro");
        }
      });
    }

    // Slider de opacidade do banner
    if (sliderOpacidade) {
      sliderOpacidade.addEventListener("input", () => {
        const val = Number(sliderOpacidade.value);
        if (labelOpacidade) labelOpacidade.textContent = `${val}%`;
        aplicarOpacidadeBanner(val);
      });

      sliderOpacidade.addEventListener("change", async () => {
        const val = Number(sliderOpacidade.value);
        const ref = doc(db, "portfolios", "principal");
        await setDoc(ref, { bannerOpacidade: val }, { merge: true });
      });
    }

    // Configura botão de upload do banner (preview e modal)
    if (btnUploadBannerModal && inputBanner) {
      btnUploadBannerModal.addEventListener("click", () => inputBanner.click());
    }
    if (btnUploadBanner && inputBanner) {
      btnUploadBanner.addEventListener("click", () => inputBanner.click());
      inputBanner.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          mostrarMensagem("O banner é muito grande. Use uma imagem de até 5 MB.", "erro");
          inputBanner.value = "";
          return;
        }
        uploadBanner(file);
      });
    }

    await carregarDadosIniciais();
  } else {
    // deslogado: mostra login, esconde app
    appSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    if (logoutButton) logoutButton.classList.add("hidden");
    form.reset();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const data = formToData(form);
    const ref = doc(db, "portfolios", "principal");
    await setDoc(ref, data, { merge: true });
    mostrarMensagem("Alterações salvas com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao salvar. Veja o console.", "erro");
  }
});
