let emailParaRedefinir = null;

document.addEventListener("DOMContentLoaded", function () {
    const formularioEmail = document.getElementById("formulario");
    const formularioRedefinir = document.getElementById("formularioRedefinir");
    const areaRedefinicao = document.getElementById("areaRedefinicao");
    const mensagem = document.getElementById("mensagem");

    formularioEmail.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailDigitado = document.getElementById("email").value.trim();
        mensagem.textContent = "";

        if (!emailDigitado) {
            mensagem.textContent = "Por favor, digite seu e-mail.";
            return;
        }

        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioEncontrado = listaUsuarios.find(u => u.email === emailDigitado);

        if (usuarioEncontrado) {
            
            emailParaRedefinir = emailDigitado;
            
            mensagem.textContent = "Email verificado. Por favor, insira sua nova senha.";
            
            formularioEmail.style.display = 'none';
            areaRedefinicao.style.display = 'block';

        } else {
            mensagem.textContent = "Email não encontrado. Verifique e tente novamente.";
        }
    });

    formularioRedefinir.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const novaSenha = document.getElementById("novaSenha").value.trim();
        const confirmaSenha = document.getElementById("confirmaSenha").value.trim();

        mensagem.textContent = "";

        if (novaSenha.length < 8) {
            mensagem.textContent = "A nova senha deve ter pelo menos 8 caracteres.";
            return;
        }

        if (novaSenha !== confirmaSenha) {
            mensagem.textContent = "A nova senha e a confirmação não coincidem.";
            return;
        }

        const novaSenhaHashed = CryptoJS.SHA256(novaSenha).toString(CryptoJS.enc.Hex);
        
        const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const indiceUsuario = listaUsuarios.findIndex(u => u.email === emailParaRedefinir);

        if (indiceUsuario !== -1) {
    
            listaUsuarios[indiceUsuario].senha = novaSenhaHashed;
            
            localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
            
            mensagem.textContent = "Senha redefinida com sucesso! Redirecionando para o login...";
            
            setTimeout(() => {
                window.location.href = "proj_sistemas_web_login.html";
            }, 1500);

        } else {
             mensagem.textContent = "Erro na redefinição. Tente novamente.";
        }
    });
});