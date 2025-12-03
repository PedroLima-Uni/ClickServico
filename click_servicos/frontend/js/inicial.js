// ================================
//        CARROSSEL
// ================================
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
const totalSlides = dots.length;
let autoSlide;

function showSlide(index) {
  currentIndex = index;
  slides.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoSlide);
    showSlide(parseInt(dot.dataset.index));
    startAutoSlide();
  });
});

prevBtn.addEventListener('click', () => {
  clearInterval(autoSlide);
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  showSlide(currentIndex);
  startAutoSlide();
});

nextBtn.addEventListener('click', () => {
  clearInterval(autoSlide);
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
  startAutoSlide();
});

function startAutoSlide() {
  autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
  }, 5000);
}

showSlide(0);
startAutoSlide();


// ================================
//   GERENCIAMENTO DO USUÁRIO NO HEADER
// ================================
const usuario = JSON.parse(localStorage.getItem("usuario"));

const btnEntrar = document.getElementById("btnEntrar");
const userMenu = document.getElementById("userMenu");
const logoutBtn = document.getElementById("logoutBtn");
const userGreeting = document.getElementById("userGreeting");
const btnSejaProf = document.querySelector(".btn-profissional");
const linkPedidos = document.querySelector(".link");

// --- Exibir ou ocultar botão "Seja um profissional"
if (usuario?.tipo === "profissional" && btnSejaProf) {
  btnSejaProf.style.display = "none";
}

// -------------------------------
//  BOTÃO MEUS PEDIDOS
// -------------------------------
if (linkPedidos) {
  linkPedidos.addEventListener("click", (e) => {
    e.preventDefault();

    if (!usuario) {
      window.location.href = "login.html";
      return;
    }

    if (usuario.tipo === "cliente") {
      window.location.href = "pedidos_c.html";
    } else if (usuario.tipo === "profissional") {
      window.location.href = "pedidos_p.html";
    }
  });
}

// --- Se o usuário estiver logado
if (usuario) {
  if (btnEntrar) {
    btnEntrar.innerHTML = '<img src="img/user.png" alt="Perfil" class="user-avatar" />';
    btnEntrar.classList.remove("btn-login");
    btnEntrar.classList.add("btn-login-icon");
    btnEntrar.href = "#";
  }

  const primeiroNome = usuario.nome.split(" ")[0];
  if (userGreeting) {
    userGreeting.innerHTML = `Olá, <strong>${primeiroNome}</strong>`;
  }

  btnEntrar.addEventListener("click", (e) => {
    e.preventDefault();
    if (userMenu) {
      userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
    }
  });
}

// --- Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.reload();
  });
}

// --- Fechar dropdown ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-area") && userMenu) {
    userMenu.style.display = "none";
  }
});


// =======================================================================
//  ⚡ LÓGICA DE SUBCATEGORIAS (BALÃO + SETA DINÂMICA)
// =======================================================================

const subcatContainer = document.getElementById("subcategorias");
const subcatTitulo = document.getElementById("subcat-titulo");
const subcatGrid = document.getElementById("subcat-grid");

const todasSubcategorias = {
  "Assistência Técnica": [
    "Técnico de Informática","Técnico de Celulares / Smartphones","Técnico em Redes",
    "Técnico em Eletrodomésticos","Técnico em TV / Áudio e Vídeo","Técnico em Ar-Condicionado",
    "Técnico em Refrigeração","Técnico em Impressoras","Técnico em Notebooks",
    "Manutenção de Consoles","Suporte Técnico Remoto","Recuperação de Dados",
    "Manutenção de Portões Eletrônicos","Instalador de Alarmes","Instalador de CFTV",
    "Técnico em Energia Solar","Conserto de Bicicletas","Conserto de Patinetes Elétricos"
  ],
  "Aulas e Consultoria": [
    "Professor Particular","Professor de Inglês","Professor de Espanhol","Professor de Matemática",
    "Professor de Música","Professor de Dança","Professor de Informática",
    "Consultor Financeiro","Consultor de Carreira","Consultor de Marketing","Consultor de TI",
    "Consultor de RH","Personal Trainer","Coach de Produtividade","Consultor Jurídico",
    "Aulas de Reforço Escolar","Aulas de Programação","Preparador para Concursos",
    "Consultor de Negócios"
  ],
  "Autos": [
    "Mecânico","Eletricista Automotivo","Funilaria e Pintura","Chaveiro Automotivo",
    "Instalador de Acessórios","Martelinho de Ouro","Limpador Automotivo (Detailing)",
    "Estética Automotiva","Guincho","Lavagem de Carros a Domicílio",
    "Troca de Óleo a Domicílio","Instalador de Película","Inspeção Automotiva",
    "Conserto de Moto","Conserto de Caminhão"
  ],
  "Design e Tecnologia": [
    "Designer Gráfico","Designer de Logotipos","Designer de Interfaces (UI/UX)",
    "Criação de Sites","Desenvolvedor Front-End","Desenvolvedor Back-End",
    "Desenvolvedor Mobile","Editor de Vídeo","Social Media","Fotógrafo","Ilustrador",
    "Criador de Conteúdo","Gestor de Tráfego Pago","Animador 2D / Motion",
    "Modelador 3D","Técnico em Impressão 3D"
  ],
  "Eventos": [
    "Fotógrafo para Eventos","Filmaker / Cinegrafista","DJ","Bartender","Garçom / Copeira",
    "Buffet","Decorador de Eventos","Cerimonialista","Locutor / MC","Organizador de Casamentos",
    "Banda para Eventos","Som e Iluminação","Monitor Infantil","Recreador",
    "Segurança para Eventos","Aluguel de Mesas e Cadeiras"
  ],
  "Moda e Beleza": [
    "Cabeleireiro","Barbeiro","Manicure / Pedicure","Maquiador(a)",
    "Designer de Sobrancelhas","Esteticista","Depiladora","Especialista em Cílios",
    "Massoterapeuta","Consultor de Moda","Personal Stylist","Bronzeamento",
    "Podóloga","Técnico em Unhas de Gel"
  ],
  "Casa e Reformas": [
    "Pedreiro","Eletricista","Encanador","Pintor","Gesseiro","Marceneiro",
    "Serralheiro","Vidraceiro","Paisagista","Jardineiro","Diarista / Faxineira",
    "Montador de Móveis","Arquiteto","Engenheiro Civil","Instalador de Gesso",
    "Instalador de Pisos","Técnico de Energia Solar","Dedetizador",
    "Bombeiro Hidráulico","Técnico de Segurança Residencial"
  ],
  "Saúde": [
    "Massoterapeuta","Fisioterapeuta","Psicólogo (online)","Nutricionista",
    "Terapeuta Holístico","Quiropraxista","Enfermeiro(a) domiciliar",
    "Cuidadores de Idosos","Acompanhante Terapêutico","Instrutor de Yoga",
    "Instrutor de Pilates","Educador Físico","Consultor de Bem-Estar"
  ]
};

const itensCategoria = document.querySelectorAll(".categoria-item");

function fecharSubcategorias() {
  if (subcatContainer) {
    subcatContainer.style.display = "none";
  }
  itensCategoria.forEach(i => i.classList.remove("active"));
}

itensCategoria.forEach(item => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();

    if (item.classList.contains("active")) {
      fecharSubcategorias();
      return;
    }

    itensCategoria.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const nomeCategoria = item.querySelector("span").textContent.trim();
    const lista = todasSubcategorias[nomeCategoria];

    if (!lista) return;

    subcatTitulo.textContent = nomeCategoria;
    subcatGrid.innerHTML = "";

    lista.forEach(sub => {
      const div = document.createElement("div");
      div.classList.add("subcategoria-item");
      div.textContent = sub;
      subcatGrid.appendChild(div);
    });

    subcatContainer.style.display = "block";

    const rectItem = item.getBoundingClientRect();
    const centroItem = rectItem.left + rectItem.width / 2;
    const posicaoSeta = centroItem - subcatContainer.offsetLeft;
    subcatContainer.style.setProperty("--arrow-x", `${posicaoSeta}px`);
  });
});

document.addEventListener("click", (e) => {
  if (!subcatContainer.contains(e.target) && !e.target.closest(".categoria-item")) {
    fecharSubcategorias();
  }
});
