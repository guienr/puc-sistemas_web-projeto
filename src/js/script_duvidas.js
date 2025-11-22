function jwt_decode(token) {
    return {
        userName: "Professor(a)",
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    };
}

(function() {
    
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Acesso negado. Por favor, faça login.");
        window.location.href = "../../proj_sistemas_web_login.html"; 
        return;
    }

    const payload = jwt_decode(token || "simulated_token"); 
    const tempoAtualEmSegundos = Math.floor(Date.now() / 1000);

    
    if (payload.exp && payload.exp < tempoAtualEmSegundos) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        localStorage.removeItem("authToken");
        window.location.href = "../../proj_sistemas_web_login.html";
        return;
    }

    const formDuvida = document.getElementById('formDuvida');

    const contentId = formDuvida.getAttribute('data-content-id');
    const listaDuvidas = document.getElementById('listaDuvidas');
    
    const nomeUsuarioLogado = payload.userName; 
    const nomeAlunoInput = document.getElementById('nomeAluno');
    

    function carregarDuvidasPorConteudo() {
        const todasDuvidas = JSON.parse(localStorage.getItem('todasDuvidas')) || [];
        return todasDuvidas.filter(duvida => duvida.contentId === contentId);
    }

    function salvarDuvidas(duvidasDoConteudo) {
        let todasDuvidas = JSON.parse(localStorage.getItem('todasDuvidas')) || [];
        
        todasDuvidas = todasDuvidas.filter(duvida => duvida.contentId !== contentId);
        todasDuvidas = todasDuvidas.concat(duvidasDoConteudo);

        localStorage.setItem('todasDuvidas', JSON.stringify(todasDuvidas));
    }

    function renderizarDuvidas() {
        const duvidas = carregarDuvidasPorConteudo();
        listaDuvidas.innerHTML = ''; 
        
        if (duvidas.length === 0) {
            listaDuvidas.innerHTML = '<p class="info-vazio">Nenhuma dúvida enviada ainda. Seja o primeiro!</p>';
            return;
        }

        duvidas.slice().reverse().forEach((duvida, indexReverso) => {
            const indexOriginal = duvidas.length - 1 - indexReverso; 

            const divDuvida = document.createElement('div');
            divDuvida.classList.add('duvida-item');
            
            let html = `
                <div class="duvida-header">
                    <p><strong>Aluno(a):</strong> ${duvida.nome}</p>
                </div>
                <p class="duvida-texto">${duvida.texto}</p>
            `;

            if (duvida.resposta) {
                html += `<div class="resposta-box">${duvida.resposta}</div>`; 
            } else {
                html += `
                    <form class="formResposta" data-index="${indexOriginal}">
                        <textarea placeholder="Responder como Professor(a) ${nomeUsuarioLogado}..." rows="2" required></textarea>
                        <button type="submit">Responder</button>
                    </form>
                `;
            }

            divDuvida.innerHTML = html;
            listaDuvidas.appendChild(divDuvida);
        });

        adicionarListenersResposta();
    }

    function adicionarListenersResposta() {
        document.querySelectorAll('.formResposta').forEach(formResposta => {
            formResposta.removeEventListener('submit', handleRespostaSubmit); 
            formResposta.addEventListener('submit', handleRespostaSubmit);
        });
    }

    /**
     * @description
     */
    function handleDuvidaSubmit(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nomeAluno').value.trim(); 
        const texto = document.getElementById('textoDuvida').value.trim();

        if (!nome && !texto) {
            alert("Por favor, preencha seu nome e o texto da dúvida."); 
            return;
        } else if (!nome) {
            alert("Por favor, preencha seu nome."); 
            return;
        } else if (!texto) {
            alert("Por favor, preencha o texto da dúvida."); 
            return;
        }
        
        const novaDuvida = {
            id: Date.now(), 
            contentId: contentId,
            nome: nome, 
            texto: texto,
            resposta: null 
        };
        
        const duvidas = carregarDuvidasPorConteudo();
        duvidas.push(novaDuvida);
        salvarDuvidas(duvidas);

        document.getElementById('textoDuvida').value = ''; 
        
        renderizarDuvidas();
    }

    /**
     * @description
     */
    function handleRespostaSubmit(e) {
        e.preventDefault();
        
        const formResposta = e.target;
        const index = parseInt(formResposta.getAttribute('data-index'), 10); 
        const respostaTexto = formResposta.querySelector('textarea').value.trim();

        if (!respostaTexto) {
            alert("A resposta não pode estar vazia.");
            return;
        }

        let duvidas = carregarDuvidasPorConteudo();
        
        if (duvidas[index]) {
            duvidas[index].resposta = `<strong> ${nomeUsuarioLogado}:</strong> ${respostaTexto}`; 
            salvarDuvidas(duvidas);
        } else {
            console.error("Índice de dúvida para resposta não encontrado:", index);
        }

        renderizarDuvidas();
    }

    function init() {
        formDuvida.addEventListener('submit', handleDuvidaSubmit);
        renderizarDuvidas(); 
    }

    init(); 
})();