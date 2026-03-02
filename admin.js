import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("portfolio-form");
const msgEl = document.getElementById("mensagem");

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

carregarDadosIniciais();

