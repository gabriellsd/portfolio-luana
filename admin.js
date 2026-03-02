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
const btnUploadBanner = document.getElementById("btn-upload-banner");
const inputBanner = document.getElementById("input-banner");

const CLOUDINARY_CLOUD = "gabriellsd";
const CLOUDINARY_PRESET = "portfolio-luana";

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

  // Carrega foto de perfil salva
  if (previewFoto && data.fotoUrl) {
    previewFoto.src = data.fotoUrl;
  }

  // Carrega banner salvo
  if (previewHero && data.bannerUrl) {
    previewHero.style.backgroundImage = `linear-gradient(rgba(249,247,242,0.85), rgba(249,247,242,0.85)), url('${data.bannerUrl}')`;
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
    // Atualiza o preview do hero imediatamente
    previewHero.style.backgroundImage = `linear-gradient(rgba(249,247,242,0.85), rgba(249,247,242,0.85)), url('${url}')`;
    const ref = doc(db, "portfolios", "principal");
    await setDoc(ref, { bannerUrl: url }, { merge: true });
    mostrarMensagem("Banner atualizado com sucesso!");
  } catch (err) {
    console.error(err);
    mostrarMensagem("Erro ao enviar banner. Tente novamente.", "erro");
  }
}

async function carregarDadosIniciais() {
  try {
    const ref = doc(db, "portfolios", "principal");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      preencherFormulario(snap.data());
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

    // Configura botão de upload do banner
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
