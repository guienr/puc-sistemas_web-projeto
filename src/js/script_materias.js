document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Acesso negado. Por favor, faça login.");
        window.location.href = "proj_sistemas_web_login.html";
        return;
    }

    const payload = jwt_decode(token); 

    const tempoAtualEmSegundos = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < tempoAtualEmSegundos) {
        alert("Sessão expirada. Por favor, faça login novamente."); 
    
        localStorage.removeItem("authToken");
        window.location.href = "proj_sistemas_web_login.html";

        return;
    }
})

function favoritarMateria(materia, botao) {
    const mensagemDiv = document.getElementById("mensagemFavorito");
    const token = localStorage.getItem("authToken");


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
    
}

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    if (!token) return; 

    try {
        const payload = jwt_decode(token);
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        const usuario = listaUsuarios.find(u => u.email === payload.userId);

        if (!usuario || !usuario.favoritas) return;

        document.querySelectorAll(".estrela").forEach(botao => {
            const match = botao.getAttribute("onclick").match(/'([^']+)'/);
            
            if (match && match[1]) {
                const materia = match[1];
                
                if (usuario.favoritas.includes(materia)) {
                    botao.classList.add("favorita"); 
                }
            }
        });
        
    } catch (e) {
        console.error("Erro ao decodificar token ou carregar usuários:", e);
    }
    
});