document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formAlterar");
    const mensagem = document.getElementById("mensagem");

    let usuarioAtualEmail = null; 

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

    usuarioAtualEmail = payload.userId;

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioNoBanco = listaUsuarios.find(u => u.email === usuarioAtualEmail);

    if (!usuarioNoBanco) {
        mensagem.textContent = 'Erro de usuário: Usuário não encontrado no banco.';
        localStorage.removeItem('authToken');
        setTimeout(() => { window.location.href = "proj_sistemas_web_login.html"; }, 1500);
        return;
    }

    document.getElementById("nome").value = usuarioNoBanco.nome;
    document.getElementById("email").value = usuarioNoBanco.email;
    document.getElementById("senha").value = ""; 

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const listaUsuariosAtualizada = JSON.parse(localStorage.getItem("usuarios")) || [];

        const novoNome = document.getElementById("nome").value.trim();
        const novoEmail = document.getElementById("email").value.trim();
        const novaSenha = document.getElementById("senha").value.trim(); 

        mensagem.textContent = ""; 

        if (!novoNome || !novoEmail) {
            mensagem.textContent = "Nome e E-mail devem ser preenchidos.";
            return;
        }
        
        if (novaSenha.length > 0 && novaSenha.length < 8) { 
        mensagem.textContent = "A nova senha deve ter pelo menos 8 caracteres.";
        return;
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail);
        if (!emailValido) {
            mensagem.textContent = "Formato de email inválido.";
            return;
        }

        const dominiosValidos = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
        const dominioValido = dominiosValidos.some(d => novoEmail.endsWith(d));
        if (!dominioValido) {
            mensagem.textContent = "O email deve conter um domínio válido.";
            return;
        }

        const emailDuplicado = listaUsuariosAtualizada.some(u => u.email === novoEmail && u.email !== usuarioAtualEmail);
        if (emailDuplicado) {
            mensagem.textContent = "Este email já está em uso por outro usuário.";
            return;
        }
        
        const indice = listaUsuariosAtualizada.findIndex(u => u.email === usuarioAtualEmail);
        
        if (indice !== -1) {
            let senhaParaSalvar = listaUsuariosAtualizada[indice].senha;
            
            if (novaSenha.length >= 8) {
                 senhaParaSalvar = CryptoJS.SHA256(novaSenha).toString(CryptoJS.enc.Hex);
            }
            
            const usuarioAtualizado = {
                ...listaUsuariosAtualizada[indice],
                nome: novoNome,
                email: novoEmail,
                senha: senhaParaSalvar 
            };
            
            listaUsuariosAtualizada[indice] = usuarioAtualizado;

            localStorage.setItem("usuarios", JSON.stringify(listaUsuariosAtualizada));
            
            localStorage.removeItem("authToken"); 
            
            mensagem.textContent = "Dados atualizados com sucesso! Por segurança, faça login novamente.";
            
            setTimeout(() => {
                window.location.href = "proj_sistemas_web_login.html";
            }, 2000);
            
        } else {
            mensagem.textContent = "Erro grave: Usuário não encontrado na lista.";
            localStorage.removeItem("authToken"); 
            setTimeout(() => {
                window.location.href = "proj_sistemas_web_login.html";
            }, 2000);
        }
    });
});