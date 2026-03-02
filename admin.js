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

  // Sincroniza inputs com o preview visual (Sobre mim)
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
