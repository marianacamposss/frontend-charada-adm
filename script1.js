// Configuração inicial e constantes globais

// URL's da nossa API (Backend)

const ENDPOINT_CHARADAS = 'http://127.0.0.1:5000/charadas';
const ENDPOINT_LISTA_TODAS = "http://127.0.0.1:5000/charadas/lista"

// Ligando com os elementos HTML

// Ligando os formulários

// Formulário de criação
let formularioCriacao = document.getElementById('create-form');
let inputPerguntaCriacao = document.getElementById('create-name');
let inputRespostaCriacao = document.getElementById('create-description');

// Formulário de Atualização (edição)
let formularioAtualizacao = document.getElementById('update-form');
let inputAtualiazacaoId = document.getElementById('update-id');
let inputPerguntaAtualizacao = document.getElementById('update-name');
let inputRespostaAtualizacao = document.getElementById('update-description');

// Lista (elementos <div>) onde as charadas serão exibidas
let listaCharadasElemento = document.getElementById('item-list');

// ===========================================================
// FUNÇÕES PARA INTERAGIR COM API 
// ===========================================================

// READ (Listar as charadas no elemento lista)

async function buscarListarCharadas() {
    console.log("Buscando charadas na API....");
    listaCharadasElemento.innerHTML = '<p>Carregando charadas...</p>';

    try {
        const respostaHttp = await fetch(ENDPOINT_LISTA_TODAS);

        if(!respostaHttp){
            throw new Error(`Erro na API: ${respostaHttp.status} ${respostaHttp.statusText}`);
        }

        const charadas = await respostaHttp.json();

        console.log("Charadas recebidas: ",charadas)
        
        exibirCharadasNaTela(charadas);

    } catch (erro) {
        console.error(`Falha ao buscar charadas: ${erro}`);
        listaCharadasElemento.innerHTML = `
        <p style="color: red;">Erro ao carregar charadas: ${erro.message}</p>`
    }
}

// --- CREATE (Criar uma nova charada) ---
async function criarCharada(evento) {
    evento.preventDefault(); // Previne o comportamento padrão do formulário (que é recarregar a página)
    console.log("Tentando criar nova charada...");

    const pergunta = inputPerguntaCriacao.value;
    const respostaCharada = inputRespostaCriacao.value;

    if (!pergunta || !respostaCharada) {
        alert("Por favor, preencha a pergunta e a resposta.");
        return;
    }

    const novaCharada = {
        pergunta: pergunta,
        resposta: respostaCharada
    };

    try {
        const respostaHttp = await fetch(ENDPOINT_CHARADAS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaCharada)
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao criar charada: ${respostaHttp.status}`);
        }

        console.log("Charada criada com sucesso!", resultadoApi);
        alert(resultadoApi.mensagem);

        inputPerguntaCriacao.value = '';
        inputRespostaCriacao.value = '';

        await buscarListarCharadas();

    } catch (erro) {
        console.error("Falha ao criar charada:", erro);
        alert(`Erro ao criar charada: ${erro.message}`);
    }
}


// ============================================================
// FUNÇÕES PARA MANIPULAR O HTML (Atualizar a Página)
// ============================================================

// --- Mostrar as charadas na lista ---
function exibirCharadasNaTela(charadas) {
    console.log("Atualizando a lista de charadas na tela...");
    listaCharadasElemento.innerHTML = '';

    if (!charadas || charadas.length === 0) {
        listaCharadasElemento.innerHTML = '<p>Nenhuma charada cadastrada ainda.</p>';
        return;
    }

    for (const charada of charadas) {
        const elementoCharadaDiv = document.createElement('div');
        elementoCharadaDiv.classList.add('border', 'border-gray-300', 'p-2', 'mb-3', 'rounded', 'flex', 'justify-between', 'items-center');
        elementoCharadaDiv.id = `charada-${charada.id}`;
    
        elementoCharadaDiv.innerHTML = `
            <div class="flex-grow mr-3">
                <strong>${charada.pergunta}</strong>
                <p><small>Resposta: ${charada.resposta || 'Não definida'}</small></p>
                <p><small>ID: ${charada.id}</small></p>
            </div>
            <div>
                <button class="edit-btn bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-2 rounded text-sm ml-1">Editar</button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm ml-1">Excluir</button>
            </div>
        `;
    
        const botaoEditar = elementoCharadaDiv.querySelector('.edit-btn');
        botaoEditar.addEventListener('click', function() {
            console.log(`Botão Editar clicado para a charada ID: ${charada.id}`);
            exibirFormularioAtualizacao(charada.id, charada.pergunta, charada.resposta);
        });
    
        const botaoExcluir = elementoCharadaDiv.querySelector('.delete-btn');
        botaoExcluir.addEventListener('click', function() {
            console.log(`Botão Excluir clicado para a charada ID: ${charada.id}`);
            excluirCharada(charada.id);
        });
    
        listaCharadasElemento.appendChild(elementoCharadaDiv);
    }
}

// INICIALIZAÇÃO DA PÁGINA

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente carregado. Iniciando busca de charadas...");
    buscarListarCharadas();
});