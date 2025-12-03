/* =================================================================
     CONTROLE DE LOGIN + INTERFACE PERSONALIZADA PARA CLIENTES
================================================================= */

const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

// 1. Verificar login
if (!usuarioLogado) {
  alert("Você precisa entrar primeiro.");
  window.location.href = "login.html";
}

// 2. Impedir que profissionais acessem pedidos de cliente
if (usuarioLogado.tipo === "profissional") {
  alert("Apenas clientes podem acessar seus pedidos. Redirecionando...");
  window.location.href = "pedidos_p.html";
}

// 3. Customizar interface (Ícone + Menu)
document.addEventListener("DOMContentLoaded", () => {
  const btnProf = document.querySelector(".btn-profissional");
  const btnEntrar = document.getElementById("btnEntrar");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const userGreeting = document.getElementById("userGreeting");

  // Se já for cliente, pode esconder o "Seja um profissional" se desejar
  // btnProf.style.display = "none";

  // --- LÓGICA DO MENU DE USUÁRIO ---
  if (usuarioLogado) {
    // 1. Alterar o botão "Entrar" para o ÍCONE
    btnEntrar.innerHTML = '<img src="img/user.png" alt="Perfil" class="user-avatar" />';
    
    // Ajusta o estilo do link para acomodar o ícone
    btnEntrar.classList.remove("link"); // Remove estilo de texto
    btnEntrar.classList.add("btn-login-icon");
    btnEntrar.href = "#";

    // 2. Colocar o nome do usuário dentro da caixinha (menu)
    const primeiroNome = usuarioLogado.nome.split(' ')[0];
    userGreeting.innerHTML = `Olá, <strong>${primeiroNome}</strong>`;

    // 3. Funcionalidade de abrir/fechar menu
    btnEntrar.addEventListener("click", (e) => {
      e.preventDefault();
      // Alterna o display
      userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
    });

    // 4. Logout
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });

    // 5. Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".user-area")) {
        userMenu.style.display = "none";
      }
    });
  }
});


/* =================================================================
     PEDIDOS DO CLIENTE (mock local)
================================================================= */

const pedidos = [
  {
    id: 1,
    status: "aguardando",
    categoria: "Eletricista",
    titulo: "Trocar tomada da cozinha",
    data: "12/01/2025",
    horario: "14:00",
    profissional: null,
    valor: "R$ 80,00 (estimado)",
    cor: "amarelo"
  },
  {
    id: 2,
    status: "andamento",
    categoria: "Designer",
    titulo: "Criar logotipo",
    data: "10/01/2025",
    horario: "09:00",
    profissional: { nome: "Marcos Silva", foto: "https://i.imgur.com/1Xqp8.jpg" },
    valor: "R$ 150,00 (estimado)",
    cor: "azul"
  },
  {
    id: 3,
    status: "concluido",
    categoria: "Manicure",
    titulo: "Unhas em gel",
    data: "05/01/2025",
    horario: "16:30",
    profissional: { nome: "Ana Paula", foto: "https://i.imgur.com/3QG8B.jpg" },
    valor: "R$ 65,00",
    cor: "verde"
  },
  {
    id: 4,
    status: "cancelado",
    categoria: "Pedreiro",
    titulo: "Reparo no muro",
    data: "08/01/2025",
    horario: "11:00",
    profissional: null,
    valor: "--",
    cor: "vermelho"
  }
];


/* =================================================================
     FUNÇÃO DE RENDERIZAÇÃO
================================================================= */

function carregarPedidos(statusSelecionado) {
  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = "";

  pedidos
    .filter(p => p.status === statusSelecionado)
    .forEach(p => {
      const card = document.createElement("div");
      card.classList.add("card");

      const profissionalHTML = p.profissional
        ? `
            <div class="profissional">
              <img src="${p.profissional.foto}">
              <span><strong>${p.profissional.nome}</strong></span>
            </div>
          `
        : `<p class="aguardando"><em>Aguardando profissional aceitar</em></p>`;

      const btnCancelar =
        p.status === "aguardando" || p.status === "andamento"
          ? `<button class="btn-cancelar">Cancelar pedido</button>`
          : "";

      const btnChat =
        p.status !== "cancelado"
          ? `<button class="btn-chat">Chat</button>`
          : "";

      const btnAvaliar =
        p.status === "concluido"
          ? `<button class="btn-avaliar">Avaliar profissional</button>`
          : "";

      card.innerHTML = `
        <div class="card-header">
          <h3>${p.titulo}</h3>
          <span class="status ${p.cor}">${p.status.toUpperCase()}</span>
        </div>

        <div class="info">
          <p><strong>Categoria:</strong> ${p.categoria}</p>
          <p><strong>Data:</strong> ${p.data} às ${p.horario}</p>
          <p><strong>Valor:</strong> ${p.valor}</p>
        </div>

        ${profissionalHTML}

        <div class="acoes">
          <button class="btn-ver">Ver detalhes</button>
          ${btnCancelar}
          ${btnChat}
          ${btnAvaliar}
        </div>
      `;

      lista.appendChild(card);
    });
}


/* =================================================================
     CONTROLE DAS ABAS
================================================================= */

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    btn.classList.add("active");
    carregarPedidos(btn.dataset.status);
  });
});

// Carrega a aba inicial
carregarPedidos("aguardando");