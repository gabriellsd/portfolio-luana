import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ── Elementos ────────────────────────────────────────────────
const loginSection  = document.getElementById("login-section");
const appSection    = document.getElementById("app-section");
const loginEmail    = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton   = document.getElementById("login-button");
const loginError    = document.getElementById("login-error");
const logoutButton  = document.getElementById("logout-button");
const msgEl         = document.getElementById("mensagem");
const btnSalvar     = document.getElementById("btn-salvar");

// Painel de configurações
const btnSettings      = document.getElementById("btn-settings");
const settingsPanel    = document.getElementById("settings-panel");
const settingsOverlay  = document.getElementById("settings-overlay");
const btnCloseSettings = document.getElementById("btn-close-settings");

// Imagens inline
const previewLogo    = document.getElementById("site-logo");
const btnLogoNav     = document.getElementById("btn-upload-logo");
const inputLogoNav   = document.getElementById("input-logo");
const fotoImg        = document.getElementById("foto-perfil");
const btnFoto        = document.getElementById("btn-upload-foto");
const inputFoto      = document.getElementById("input-foto");
const btnBannerHero  = document.getElementById("btn-upload-banner");
const inputBannerHero= document.getElementById("input-banner");

// Painel de configs
const cfgLogoPreview  = document.getElementById("cfg-logo-preview");
const btnCfgLogo      = document.getElementById("btn-cfg-logo");
const inputCfgLogo    = document.getElementById("input-cfg-logo");
const cfgPageTitle    = document.getElementById("cfg-page-title");
const cfgNavBtnLink   = document.getElementById("cfg-nav-btn-link");
const btnCfgBanner    = document.getElementById("btn-cfg-banner");
const inputCfgBanner  = document.getElementById("input-cfg-banner");
const cfgBannerOpacity= document.getElementById("cfg-banner-opacity");
const cfgBannerVal    = document.getElementById("cfg-banner-val");
const cfgFotoOpacity  = document.getElementById("cfg-foto-opacity");
const cfgFotoVal      = document.getElementById("cfg-foto-val");
const cfgWhatsapp     = document.getElementById("cfg-whatsapp");
const cfgEmail        = document.getElementById("cfg-email");
const cfgInstagram    = document.getElementById("cfg-instagram");
const cfgLinkedin     = document.getElementById("cfg-linkedin");
const btnSalvarCfg    = document.getElementById("btn-salvar-cfg");

const CLOUDINARY_CLOUD  = "gabriellsd";
const CLOUDINARY_PRESET = "portfolio-luana";

// ── Auth ─────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    document.body.classList.add("admin-mode");
    carregarDados();
  } else {
    loginSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    document.body.classList.remove("admin-mode");
  }
});

loginButton.addEventListener("click", async () => {
  loginError.classList.add("hidden");
  loginButton.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value);
  } catch {
    loginError.classList.remove("hidden");
  } finally {
    loginButton.disabled = false;
  }
});
loginPassword.addEventListener("keydown", (e) => { if (e.key === "Enter") loginButton.click(); });
logoutButton.addEventListener("click", () => signOut(auth));

// ── Feedback ─────────────────────────────────────────────────
function mostrarMsg(texto, tipo = "ok") {
  msgEl.textContent = texto;
  msgEl.className = tipo === "erro"
    ? "text-xs font-medium px-3 py-1 rounded-full bg-red-900/60 text-red-200"
    : "text-xs font-medium px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200";
  clearTimeout(mostrarMsg._t);
  mostrarMsg._t = setTimeout(() => { msgEl.className = "hidden"; }, 4000);
}

// ── Painel de configurações ───────────────────────────────────
function abrirSettings() {
  settingsPanel.classList.add("open");
  settingsOverlay.classList.add("open");
}
function fecharSettings() {
  settingsPanel.classList.remove("open");
  settingsOverlay.classList.remove("open");
}
btnSettings.addEventListener("click", abrirSettings);
btnCloseSettings.addEventListener("click", fecharSettings);
settingsOverlay.addEventListener("click", fecharSettings);

// Sliders do painel
cfgBannerOpacity.addEventListener("input", () => {
  cfgBannerVal.textContent = `${cfgBannerOpacity.value}%`;
  aplicarOpacidadeBanner(cfgBannerOpacity.value);
});
cfgBannerOpacity.addEventListener("change", async () => {
  await setDoc(doc(db, "portfolios", "principal"), { bannerOpacidade: Number(cfgBannerOpacity.value) }, { merge: true });
});

cfgFotoOpacity.addEventListener("input", () => {
  cfgFotoVal.textContent = `${cfgFotoOpacity.value}%`;
  if (fotoImg) fotoImg.style.opacity = cfgFotoOpacity.value / 100;
});
cfgFotoOpacity.addEventListener("change", async () => {
  await setDoc(doc(db, "portfolios", "principal"), { fotoOpacidade: Number(cfgFotoOpacity.value) }, { merge: true });
});

function aplicarOpacidadeBanner(valor) {
  const hero = document.getElementById("hero-section");
  if (!hero) return;
  const op = valor / 100;
  const bgUrl = hero.dataset.bannerUrl ||
    "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=2070";
  hero.style.backgroundImage =
    `linear-gradient(rgba(249,247,242,${op}), rgba(249,247,242,${op})), url('${bgUrl}')`;
  hero.style.backgroundSize = "cover";
  hero.style.backgroundPosition = "center";
}

// ── Cloudinary ────────────────────────────────────────────────
async function uploadParaCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!res.ok) throw new Error("Falha no upload");
  return (await res.json()).secure_url;
}

// ── Carregar dados ────────────────────────────────────────────
async function carregarDados() {
  try {
    const snap = await getDoc(doc(db, "portfolios", "principal"));
    if (!snap.exists()) return;
    const data = snap.data();

    // Textos editáveis inline
    document.querySelectorAll("[data-field][contenteditable]").forEach((el) => {
      const key = el.dataset.field;
      if (data[key] !== undefined) el.textContent = data[key];
    });

    // Logo
    if (data.logoUrl) {
      previewLogo.src = data.logoUrl;
      previewLogo.classList.remove("hidden");
      cfgLogoPreview.src = data.logoUrl;
      cfgLogoPreview.classList.remove("hidden");
      document.getElementById("btn-upload-logo").textContent = "Trocar logo";
    }

    // Foto
    if (data.fotoUrl) fotoImg.src = data.fotoUrl;
    const opFoto = data.fotoOpacidade ?? 100;
    fotoImg.style.opacity = opFoto / 100;
    cfgFotoOpacity.value = opFoto;
    cfgFotoVal.textContent = `${opFoto}%`;

    // Banner
    const hero = document.getElementById("hero-section");
    const opBanner = data.bannerOpacidade ?? 85;
    if (data.bannerUrl) hero.dataset.bannerUrl = data.bannerUrl;
    cfgBannerOpacity.value = opBanner;
    cfgBannerVal.textContent = `${opBanner}%`;
    aplicarOpacidadeBanner(opBanner);

    // Painel: configs
    if (data.pageTitle) cfgPageTitle.value = data.pageTitle;
    if (data.links?.navBtn) cfgNavBtnLink.value = data.links.navBtn;
    if (data.links?.whatsapp) cfgWhatsapp.value = data.links.whatsapp;
    if (data.links?.email) cfgEmail.value = data.links.email;
    if (data.links?.instagram) cfgInstagram.value = data.links.instagram;
    if (data.links?.linkedin) cfgLinkedin.value = data.links.linkedin;

  } catch (err) {
    console.error(err);
    mostrarMsg("Erro ao carregar dados.", "erro");
  }
}

// ── Salvar textos editáveis ───────────────────────────────────
async function salvarTextos() {
  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando…";
  try {
    const data = {};
    document.querySelectorAll("[data-field][contenteditable]").forEach((el) => {
      const key = el.dataset.field;
      const val = el.textContent.trim();
      if (val) data[key] = val;
    });
    await setDoc(doc(db, "portfolios", "principal"), data, { merge: true });
    mostrarMsg("Salvo com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMsg("Erro ao salvar.", "erro");
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Salvar`;
  }
}
btnSalvar.addEventListener("click", salvarTextos);

// ── Salvar configurações (painel) ─────────────────────────────
btnSalvarCfg.addEventListener("click", async () => {
  btnSalvarCfg.disabled = true;
  try {
    const data = {
      links: {
        navBtn:    cfgNavBtnLink.value.trim()  || null,
        whatsapp:  cfgWhatsapp.value.trim()    || null,
        email:     cfgEmail.value.trim()       || null,
        instagram: cfgInstagram.value.trim()   || null,
        linkedin:  cfgLinkedin.value.trim()    || null,
      },
    };
    if (cfgPageTitle.value.trim()) data.pageTitle = cfgPageTitle.value.trim();
    await setDoc(doc(db, "portfolios", "principal"), data, { merge: true });
    mostrarMsg("Configurações salvas!");
    fecharSettings();
  } catch (err) {
    console.error(err);
    mostrarMsg("Erro ao salvar configurações.", "erro");
  } finally {
    btnSalvarCfg.disabled = false;
  }
});

// ── Uploads de imagem ─────────────────────────────────────────
async function handleUpload({ inputEl, firestoreKey, onSuccess, label }) {
  const file = inputEl.files[0];
  if (!file) return;
  mostrarMsg(`Enviando ${label}…`);
  try {
    const url = await uploadParaCloudinary(file);
    await setDoc(doc(db, "portfolios", "principal"), { [firestoreKey]: url }, { merge: true });
    onSuccess(url);
    mostrarMsg(`${label} atualizada!`);
  } catch {
    mostrarMsg(`Erro ao enviar ${label.toLowerCase()}.`, "erro");
  } finally {
    inputEl.value = "";
  }
}

// Logo (na nav)
btnLogoNav.addEventListener("click", () => inputLogoNav.click());
inputLogoNav.addEventListener("change", () =>
  handleUpload({
    inputEl: inputLogoNav,
    firestoreKey: "logoUrl",
    label: "Logo",
    onSuccess: (url) => {
      previewLogo.src = url;
      previewLogo.classList.remove("hidden");
      cfgLogoPreview.src = url;
      cfgLogoPreview.classList.remove("hidden");
      btnLogoNav.textContent = "Trocar logo";
    },
  })
);

// Logo (painel)
btnCfgLogo.addEventListener("click", () => inputCfgLogo.click());
inputCfgLogo.addEventListener("change", () =>
  handleUpload({
    inputEl: inputCfgLogo,
    firestoreKey: "logoUrl",
    label: "Logo",
    onSuccess: (url) => {
      previewLogo.src = url;
      previewLogo.classList.remove("hidden");
      cfgLogoPreview.src = url;
      cfgLogoPreview.classList.remove("hidden");
      btnLogoNav.textContent = "Trocar logo";
    },
  })
);

// Foto
btnFoto.addEventListener("click", () => inputFoto.click());
inputFoto.addEventListener("change", () =>
  handleUpload({
    inputEl: inputFoto,
    firestoreKey: "fotoUrl",
    label: "Foto",
    onSuccess: (url) => { fotoImg.src = url; },
  })
);

// Banner (hero)
btnBannerHero.addEventListener("click", () => inputBannerHero.click());
inputBannerHero.addEventListener("change", () =>
  handleUpload({
    inputEl: inputBannerHero,
    firestoreKey: "bannerUrl",
    label: "Banner",
    onSuccess: (url) => {
      const hero = document.getElementById("hero-section");
      hero.dataset.bannerUrl = url;
      aplicarOpacidadeBanner(cfgBannerOpacity.value);
    },
  })
);

// Banner (painel)
btnCfgBanner.addEventListener("click", () => inputCfgBanner.click());
inputCfgBanner.addEventListener("change", () =>
  handleUpload({
    inputEl: inputCfgBanner,
    firestoreKey: "bannerUrl",
    label: "Banner",
    onSuccess: (url) => {
      const hero = document.getElementById("hero-section");
      hero.dataset.bannerUrl = url;
      aplicarOpacidadeBanner(cfgBannerOpacity.value);
    },
  })
);

// ── Prevenir navegação dos links no admin ─────────────────────
document.querySelectorAll("a[href]").forEach((a) => {
  if (!a.dataset.linkField) {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && !href.startsWith("#")) e.preventDefault();
    });
  } else {
    a.addEventListener("click", (e) => e.preventDefault());
  }
});
