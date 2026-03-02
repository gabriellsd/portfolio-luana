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
  } catch (err) {
    console.error("Erro ao carregar conteúdo:", err);
  }
}

carregarConteudo();

