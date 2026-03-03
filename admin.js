import { initializeApp }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore }          from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
                                 from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig }        from "./firebase-config.js";

const app    = initializeApp(firebaseConfig);
const db     = getFirestore(app);
const auth   = getAuth(app);

// Elementos
const telaLogin  = document.getElementById("tela-login");
const painel     = document.getElementById("painel");
const formLogin  = document.getElementById("form-login");
const erroLogin  = document.getElementById("erro-login");
const btnLogout  = document.getElementById("btn-logout");

// Login
formLogin?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  erroLogin.classList.add("hidden");
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch {
    erroLogin.textContent = "E-mail ou senha incorretos.";
    erroLogin.classList.remove("hidden");
  }
});

// Logout
btnLogout?.addEventListener("click", () => signOut(auth));

// Estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    telaLogin.classList.add("hidden");
    painel.classList.remove("hidden");
  } else {
    telaLogin.classList.remove("hidden");
    painel.classList.add("hidden");
  }
});
