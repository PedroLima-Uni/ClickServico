// Script base — pronto para receber funções futuras
console.log("Página carregada com sucesso!");

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".btn-orcamento");

  if (btn) {
    btn.addEventListener("click", function () {
      window.location.href = "/frontend/orcamento.html";
    });
  }
});
