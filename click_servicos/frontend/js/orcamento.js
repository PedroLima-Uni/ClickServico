document.getElementById('formOrcamento').addEventListener('submit', function(e) {
  e.preventDefault();

  const msg = document.getElementById('sucesso');
  msg.style.display = 'block';

  setTimeout(() => {
    msg.style.display = 'none';
  }, 4000);
});

const selectHora = document.getElementById("hora");

function gerarHorarios() {
  for (let h = 0; h < 24; h++) {
    for (let m of ["00", "30"]) {
      const hora = `${String(h).padStart(2, "0")}:${m}`;
      const opt = document.createElement("option");
      opt.value = hora;
      opt.textContent = hora;
      selectHora.appendChild(opt);
    }
  }
}

gerarHorarios();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obter referências aos elementos do DOM
    const inputCep = document.getElementById('cep');
    const inputLogradouro = document.getElementById('logradouro');
    const inputBairro = document.getElementById('bairro');
    const inputCidade = document.getElementById('cidade');

    // 2. Adicionar um "ouvinte de evento" (event listener) ao campo CEP
    // O evento 'blur' dispara quando o usuário sai do campo.
    inputCep.addEventListener('blur', () => {
        // Limpar o valor do CEP, removendo hífens e pontos
        const cep = inputCep.value.replace(/\D/g, '');

        // 3. Verificar se o CEP possui o formato correto (8 dígitos)
        if (cep.length !== 8) {
            // Se o CEP for inválido, limpa os campos de endereço
            inputLogradouro.value = '';
            inputBairro.value = '';
            inputCidade.value = '';
            return;
        }

        // 4. Montar a URL da API ViaCEP
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        // 5. Fazer a requisição HTTP (usando fetch)
        fetch(url)
            .then(response => response.json()) // Converte a resposta para JSON
            .then(data => {
                // 6. Verificar se a API retornou um erro (ex: CEP não encontrado)
                if (data.erro) {
                    alert('CEP não encontrado. Por favor, digite o endereço manualmente.');
                    // Limpa os campos
                    inputLogradouro.value = '';
                    inputBairro.value = '';
                    inputCidade.value = '';
                    return;
                }

                // 7. Preencher os campos do formulário com os dados recebidos
                inputLogradouro.value = data.logradouro || '';
                inputBairro.value = data.bairro || '';
                inputCidade.value = data.localidade || '';

                // O campo 'numero' não é preenchido, pois é específico do endereço do usuário

            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.');
            });
    });
});