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
const db  = getFirestore(app);
const auth = getAuth(app);

// ── Elementos de UI ───────────────────────────────────────────
const loginSection   = document.getElementById("login-section");
const appSection     = document.getElementById("app-section");
const loginEmail     = document.getElementById("login-email");
const loginPassword  = document.getElementById("login-password");
const loginButton    = document.getElementById("login-button");
const loginError     = document.getElementById("login-error");
const logoutButton   = document.getElementById("logout-button");
const form           = document.getElementById("portfolio-form");
const msgEl          = document.getElementById("mensagem");

// Imagens
const previewLogo    = document.getElementById("preview-logo");
const btnLogo        = document.getElementById("btn-upload-logo");
const inputLogo      = document.getElementById("input-logo");
const previewFoto    = document.getElementById("preview-foto");
const btnFoto        = document.getElementById("btn-upload-foto");
const inputFoto      = document.getElementById("input-foto");
const btnBanner      = document.getElementById("btn-upload-banner");
const inputBanner    = document.getElementById("input-banner");

// Sliders
const sliderBanner   = document.getElementById("banner-opacidade");
const labelBanner    = document.getElementById("banner-opacidade-valor");
const sliderFoto     = document.getElementById("foto-opacidade");
const labelFoto      = document.getElementById("foto-opacidade-valor");

const CLOUDINARY_CLOUD  = "gabriellsd";
const CLOUDINARY_PRESET = "portfolio-luana";

// ── Auth ──────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    carregarDados();
  } else {
    loginSection.classList.remove("hidden");
    appSection.classList.add("hidden");
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

loginPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginButton.click();
});

logoutButton.addEventListener("click", () => signOut(auth));

// ── Feedback ──────────────────────────────────────────────────
function mostrarMensagem(texto, tipo = "sucesso") {
  msgEl.textContent = texto;
  msgEl.className =
    "text-sm font-medium text-center px-4 py-3 rounded-xl " +
    (tipo === "erro"
      ? "bg-red-50 text-red-700 border border-red-200"
      : "bg-emerald-50 text-emerald-700 border border-emerald-200");
  clearTimeout(mostrarMensagem._t);
  mostrarMensagem._t = setTimeout(() => { msgEl.className = "hidden"; }, 4000);
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
  if (!res.ok) throw new Error("Falha no upload para o Cloudinary");
  return (await res.json()).secure_url;
}

// ── Carregar dados ────────────────────────────────────────────
async function carregarDados() {
  try {
    const snap = await getDoc(doc(db, "portfolios", "principal"));
    if (!snap.exists()) return;
    const data = snap.data();

    // Preenche todos os inputs do formulário
    Array.from(form.elements).forEach((el) => {
      if (!el.name) return;
      if (el.name.startsWith("links.")) {
        const key = el.name.split(".")[1];
        if (data.links?.[key]) el.value = data.links[key];
      } else if (data[el.name] !== undefined) {
        el.value = data[el.name];
      }
    });

    // Logo
    if (data.logoUrl) {
      previewLogo.src = data.logoUrl;
      previewLogo.classList.remove("hidden");
    }

    // Foto de perfil
    if (data.fotoUrl) {
      previewFoto.src = data.fotoUrl;
      previewFoto.classList.remove("hidden");
    }

    // Opacidade da foto
    const opFoto = data.fotoOpacidade ?? 100;
    sliderFoto.value = opFoto;
    labelFoto.textContent = `${opFoto}%`;

    // Opacidade do banner
    const opBanner = data.bannerOpacidade ?? 85;
    sliderBanner.value = opBanner;
    labelBanner.textContent = `${opBanner}%`;

  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao carregar dados.", "erro");
  }
}

// ── Salvar formulário ─────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector("[type=submit]");
  btn.disabled = true;
  btn.textContent = "Salvando…";

  try {
    const data = {};
    const fd = new FormData(form);
    for (const [name, value] of fd.entries()) {
      if (typeof value === "string" && !value.trim()) continue;
      if (name.startsWith("links.")) {
        const key = name.split(".")[1];
        if (!data.links) data.links = {};
        data.links[key] = value.trim();
      } else {
        data[name] = value;
      }
    }
    await setDoc(doc(db, "portfolios", "principal"), data, { merge: true });
    mostrarMensagem("Alterações salvas com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao salvar. Tente novamente.", "erro");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Salvar alterações`;
  }
});

// ── Sliders ───────────────────────────────────────────────────
sliderFoto.addEventListener("input", () => {
  labelFoto.textContent = `${sliderFoto.value}%`;
});
sliderFoto.addEventListener("change", async () => {
  await setDoc(doc(db, "portfolios", "principal"), { fotoOpacidade: Number(sliderFoto.value) }, { merge: true });
});

sliderBanner.addEventListener("input", () => {
  labelBanner.textContent = `${sliderBanner.value}%`;
});
sliderBanner.addEventListener("change", async () => {
  await setDoc(doc(db, "portfolios", "principal"), { bannerOpacidade: Number(sliderBanner.value) }, { merge: true });
});

// ── Upload de imagens ─────────────────────────────────────────
async function handleUpload({ inputEl, previewEl, firestoreKey, label }) {
  const file = inputEl.files[0];
  if (!file) return;
  try {
    mostrarMensagem(`Enviando ${label}…`);
    const url = await uploadParaCloudinary(file);
    if (previewEl) {
      previewEl.src = url;
      previewEl.classList.remove("hidden");
    }
    await setDoc(doc(db, "portfolios", "principal"), { [firestoreKey]: url }, { merge: true });
    mostrarMensagem(`${label} atualizada com sucesso!`);
  } catch (err) {
    console.error(err);
    mostrarMensagem(`Erro ao enviar ${label.toLowerCase()}. Tente novamente.`, "erro");
  } finally {
    inputEl.value = "";
  }
}

btnLogo.addEventListener("click", () => inputLogo.click());
inputLogo.addEventListener("change", () =>
  handleUpload({ inputEl: inputLogo, previewEl: previewLogo, firestoreKey: "logoUrl", label: "Logo" })
);

btnFoto.addEventListener("click", () => inputFoto.click());
inputFoto.addEventListener("change", () =>
  handleUpload({ inputEl: inputFoto, previewEl: previewFoto, firestoreKey: "fotoUrl", label: "Foto" })
);

btnBanner.addEventListener("click", () => inputBanner.click());
inputBanner.addEventListener("change", () =>
  handleUpload({ inputEl: inputBanner, previewEl: null, firestoreKey: "bannerUrl", label: "Banner" })
);
