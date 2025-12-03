// ==========================
//   VALIDAÇÃO DO FORM
// ==========================
document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const celular = document.getElementById("celular").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmar = document.getElementById("confirmarSenha").value.trim();
  const tipo = document.getElementById("tipoUsuario").value;

  if (!nome || !email || !celular || !senha || !confirmar || !tipo) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!/^\d{10,11}$/.test(celular)) {
    alert("Digite um número de celular válido (com DDD).");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  if (senha !== confirmar) {
    alert("As senhas não coincidem.");
    return;
  }

  // Dados para enviar ao backend
  const dados = { 
    nome, 
    email, 
    celular, 
    senha, 
    tipoUsuario: tipo   // ← O BACK-END ESPERA ESSE NOME
  };

  console.log("Enviando dados:", dados);

  try {
    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    const retorno = await resposta.json();

    if (!resposta.ok) {
      alert("Erro ao cadastrar: " + (retorno.erro || "Tente novamente."));
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    window.location.href = "login.html";  // redirecionar após cadastro

  } catch (erro) {
    console.error("❌ Erro na requisição:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});

// ==========================
//   MOSTRAR / ESCONDER SENHA
// ==========================
const toggleIcon = document.getElementById("toggleSenhaIcon");
const senhaInput = document.getElementById("senha");
const confirmarInput = document.getElementById("confirmarSenha");

function toggleEyeVisibility() {
  if (senhaInput.value.length > 0) {
    toggleIcon.style.display = "block";
    toggleIcon.style.pointerEvents = "auto";
  } else {
    toggleIcon.style.opacity = "0";
    toggleIcon.style.pointerEvents = "none";
    setTimeout(() => (toggleIcon.style.display = "none"), 200);

    senhaInput.type = "password";
    confirmarInput.type = "password";
    toggleIcon.src = "img/olho_fechado.png";
  }
}

senhaInput.addEventListener("input", toggleEyeVisibility);

toggleIcon.addEventListener("click", () => {
  const isHidden = senhaInput.type === "password";
  const novoTipo = isHidden ? "text" : "password";

  senhaInput.type = novoTipo;
  confirmarInput.type = novoTipo;

  toggleIcon.src = isHidden ? "img/olho_aberto.png" : "img/olho_fechado.png";
});

// ==========================
//   VERIFICAR SENHAS
// ==========================
const msg = document.getElementById("senhaMatchMsg");

function verificarSenhas() {
  if (!confirmarInput.value) {
    msg.textContent = "";
    confirmarInput.style.outline = "none";
    return;
  }

  if (senhaInput.value === confirmarInput.value) {
    msg.textContent = "✓ As senhas coincidem!";
    msg.style.color = "green";
  } else {
    msg.textContent = "✗ As senhas não coincidem";
    msg.style.color = "red";
  }
}

senhaInput.addEventListener("input", verificarSenhas);
confirmarInput.addEventListener("input", verificarSenhas);
