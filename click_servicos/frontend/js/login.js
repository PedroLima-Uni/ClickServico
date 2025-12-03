// ==========================
//   MOSTRAR / ESCONDER SENHA NO LOGIN
// ==========================
const senhaInput = document.getElementById("password");
const toggleIcon = document.getElementById("toggleSenhaLogin");

senhaInput.addEventListener("input", () => {
  if (senhaInput.value.length > 0) {
    toggleIcon.style.display = "block";
    toggleIcon.style.pointerEvents = "auto";
  } else {
    toggleIcon.style.opacity = "0";
    toggleIcon.style.pointerEvents = "none";
    setTimeout(() => (toggleIcon.style.display = "none"), 200);

    senhaInput.type = "password";
    toggleIcon.src = "img/olho_fechado.png";
  }
});

// Alternar visualização
toggleIcon.addEventListener("click", () => {
  const isHidden = senhaInput.type === "password";
  senhaInput.type = isHidden ? "text" : "password";
  toggleIcon.src = isHidden ? "img/olho_aberto.png" : "img/olho_fechado.png";
});


// ==========================
//   LOGIN - ENVIO PARA BACKEND
// ==========================
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("password").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await resposta.json();

    if (!resposta.ok) {
      alert(data.erro || "Usuário ou senha incorretos.");
      return;
    }

    alert("Login realizado com sucesso!");

    // ===== SALVA O USUÁRIO NO LOCALSTORAGE =====
    // Aqui assumimos que backend retorna:
    // { usuario: { id_usuario, nome, email, tipo, celular } }
    
    if (!data.usuario) {
      console.warn("⚠ Backend não retornou 'usuario'. Objeto recebido:", data);
    }

    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    // ===== REDIRECIONA PARA A PÁGINA INICIAL =====
    window.location.href = "inicial.html";

  } catch (erro) {
    console.error("Erro na requisição:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});
