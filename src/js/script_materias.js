let payload = null; 

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Acesso negado. Por favor, faça login.");
        window.location.href = "proj_sistemas_web_login.html";
        return;
    }

    try {
        payload = jwt_decode(token); 
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        alert("Token inválido. Por favor, faça login novamente.");
        localStorage.removeItem("authToken");
        window.location.href = "proj_sistemas_web_login.html";
        return;
    }

    const tempoAtualEmSegundos = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < tempoAtualEmSegundos) {
        alert("Sessão expirada. Por favor, faça login novamente."); 
        localStorage.removeItem("authToken");
        window.location.href = "proj_sistemas_web_login.html";
        return;
    }

    carregarEstadoFavoritos(); 
});


function favoritarMateria(materia, botao) {
    const mensagemDiv = document.getElementById("mensagemFavorito");

    if (!payload || !payload.userId) {
        alert("Erro de autenticação. Por favor, recarregue a página e faça login.");
        return;
    }

    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const indiceUsuario = listaUsuarios.findIndex(u => u.email === payload.userId); 

    if (indiceUsuario === -1) {
        alert("Usuário não encontrado. Faça login novamente.");
        localStorage.removeItem("authToken");
        window.location.href = "proj_sistemas_web_login.html";
        return;
    }

    const usuario = listaUsuarios[indiceUsuario];

    if (!usuario.favoritas) {
        usuario.favoritas = [];
    }

    const jaFavoritada = usuario.favoritas.includes(materia);

    if (!jaFavoritada) {
        usuario.favoritas.push(materia);
        botao.classList.add("favorita");
        mensagemDiv.textContent = `"${materia}" adicionada aos favoritos!`;
        mensagemDiv.style.color = "green";
    } else {
        usuario.favoritas = usuario.favoritas.filter(m => m !== materia);
        botao.classList.remove("favorita");
        mensagemDiv.textContent = `"${materia}" removida dos favoritos.`;
        mensagemDiv.style.color = "orange";
    }

    listaUsuarios[indiceUsuario] = usuario; 
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

    mensagemDiv.classList.add('backgroundMensagemAtiva');
    mensagemDiv.style.opacity = 1;

    setTimeout(() => {
        mensagemDiv.style.opacity = 0;
    }, 1500);
    setTimeout(() => {
         mensagemDiv.textContent = '';
         mensagemDiv.classList.remove('mensagem-ativa');
    }, 2500);
}


function carregarEstadoFavoritos() {

    if (!payload || !payload.userId) return; 

    try {
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        const usuario = listaUsuarios.find(u => u.email === payload.userId); 

        if (!usuario || !usuario.favoritas) return;

        document.querySelectorAll(".estrela").forEach(botao => {

            const onclickValue = botao.getAttribute("onclick");
            const match = onclickValue ? onclickValue.match(/'([^']+)'/) : null;
            
            if (match && match[1]) {
                const materia = match[1];
                
                if (usuario.favoritas.includes(materia)) {
                    botao.classList.add("favorita"); 
                }
            }
        });
        
    } catch (e) {
        console.error("Erro ao carregar estado dos favoritos:", e);
    }
}