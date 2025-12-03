/* ======================================================
     CONTROLE DE ACESSO + INTERFACE PARA PROFISSIONAIS
====================================================== */

// 1. Verificar se o usuário está logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

if (!usuarioLogado) {
  alert("Você precisa entrar primeiro.");
  window.location.href = "login.html";
}

// 2. Impedir clientes de acessar pedidos_p.html
if (usuarioLogado.tipo === "cliente") {
  alert("Clientes não podem acessar esta área. Redirecionando...");
  window.location.href = "pedidos_c.html"; 
}

// 3. Ajustar interface do topo (Ícone + Dropdown)
document.addEventListener("DOMContentLoaded", () => {
  const btnProf = document.querySelector(".btn-profissional");
  const btnEntrar = document.getElementById("btnEntrar");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const userGreeting = document.getElementById("userGreeting");

  // Ocultar "Seja um profissional" se o usuário já for profissional
  if (usuarioLogado.tipo === "profissional") {
    if(btnProf) btnProf.style.display = "none";
  }

  // --- LÓGICA DO MENU DE USUÁRIO ---
  if (usuarioLogado) {
    // 1. Alterar o botão "Entrar" para o ÍCONE
    btnEntrar.innerHTML = '<img src="img/user.png" alt="Perfil" class="user-avatar" />';
    
    // Ajusta o estilo do link para acomodar o ícone
    btnEntrar.classList.remove("link"); // Remove estilo de link texto
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

/* ======================================================
     LISTAGEM DE PEDIDOS (mock local)
====================================================== */

const lista = document.getElementById("listaPedidos");

const pedidos = {
  novos: {
    titulo: "Trocar resistência do chuveiro",
    status: "Aguardando",
    cor: "amarelo",
    cliente: "Lucas Andrade",
    endereco: "Av. Brasil 400",
    servico: "Eletricista",
    valor: "R$ 70,00",
    data: "14/02/2025 às 16:00",
    descricao: "Chuveiro não esquenta."
  },

  aceitos: {
    titulo: "Consertar vazamento na pia",
    status: "Aceito",
    cor: "azul",
    cliente: "Mariana Silva",
    endereco: "Rua das Flores 88",
    servico: "Encanador",
    valor: "R$ 120,00",
    data: "13/02/2025 às 09:00",
    descricao: "Água pingando constantemente."
  },

  execucao: {
    titulo: "Limpeza de ar-condicionado",
    status: "Finalizado",
    cor: "verde",
    cliente: "Carlos Pereira",
    endereco: "Rua Verde 55",
    servico: "Refrigeração",
    valor: "R$ 150,00",
    data: "12/02/2025 às 14:30",
    descricao: "Limpeza completa e troca de filtro."
  },

  recusados: {
    titulo: "Troca de fechadura",
    status: "Recusado",
    cor: "cinza",
    cliente: "Ana Luiza",
    endereco: "Rua Azul 101",
    servico: "Chaveiro",
    valor: "R$ 90,00",
    data: "10/02/2025",
    descricao: "Fechadura antiga estava travando."
  }
};

function render(tipo) {
  const p = pedidos[tipo];

  const botoes = {
    novos: `
      <button class="btn-aceitar" onclick="aceitar()">Aceitar pedido</button>
      <button class="btn-recusar" onclick="recusar()">Recusar</button>
      <button class="btn-chat" onclick="mensagem()">Enviar mensagem</button>
    `,
    aceitos: `
      <button class="btn-chat" onclick="mensagem()">Enviar mensagem</button>
      <button class="btn-atualizar" onclick="atualizar()">Atualizar status</button>
      <button class="btn-finalizar" onclick="finalizar()">Finalizar com foto</button>
    `,
    execucao: ``,
    recusados: ``
  };

  lista.innerHTML = `
    <div class="card ${tipo === "recusados" ? "recusado" : ""}">

      <div class="card-header">
        <h3>${p.titulo}</h3>
        <span class="status ${p.cor}">${p.status}</span>
      </div>

      <div class="info">
        <p><strong>Cliente:</strong> ${p.cliente}</p>
        <p><strong>Endereço:</strong> ${p.endereco}</p>
        <p><strong>Serviço:</strong> ${p.servico}</p>
        <p><strong>Valor sugerido:</strong> ${p.valor}</p>
        <p><strong>Data:</strong> ${p.data}</p>
        <p><strong>Descrição:</strong> ${p.descricao}</p>
      </div>

      <div class="acoes">
        ${botoes[tipo]}
      </div>

    </div>
  `;
}

render("novos");

/* ========== Funções ========== */

function aceitar() {
  alert("Pedido aceito!");
}

function recusar() {
  alert("Pedido recusado.");
}

function mensagem() {
  alert("Abrindo chat...");
}

function atualizar() {
  alert("Atualizar status...");
}

function finalizar() {
  alert("Abrir câmera / upload de foto...");
}

/* ========== Tabs ========== */
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    render(t.dataset.tab);
  });
});