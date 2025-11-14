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

    document.getElementById("nomeUsuario").textContent = payload.userName;
    document.getElementById("emailUsuario").textContent = payload.userId;

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioAtual = listaUsuarios.find(u => u.email === payload.userId);

    const listaFavoritas = document.getElementById("listaFavoritas");
    listaFavoritas.innerHTML = "";

    if (usuarioAtual && usuarioAtual.favoritas && usuarioAtual.favoritas.length > 0) {
        usuarioAtual.favoritas.forEach(materia => {
            const li = document.createElement("li");
            li.textContent = materia;
            listaFavoritas.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "Nenhuma matéria favorita cadastrada.";
        listaFavoritas.appendChild(li);
    }

    const botaoLogout = document.getElementById("logout");
    if (botaoLogout) {
        botaoLogout.addEventListener("click", function () {
            localStorage.removeItem("authToken");
            window.location.href = "proj_sistemas_web_login.html";
        });
    }
});
