document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Acesso negado. Por favor, faça login.");
        window.location.href = "../../proj_sistemas_web_login.html";
        return;
    }

    const payload = jwt_decode(token); 

    const tempoAtualEmSegundos = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < tempoAtualEmSegundos) {
        alert("Sessão expirada. Por favor, faça login novamente."); 
    
        localStorage.removeItem("authToken");
        window.location.href = "../../proj_sistemas_web_login.html";

        return;
    }
})