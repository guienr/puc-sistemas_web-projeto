document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");

    const novoNome = document.getElementById("nome").value.trim();
    const novoEmail = document.getElementById("email").value.trim();
    const novaSenha = document.getElementById("senha").value.trim();

    mensagem.textContent = "";

    if (!novoNome || !novoEmail || !novaSenha) {
        mensagem.textContent = "Todos os campos devem ser preenchidos.";
        return;
    }

    if (novaSenha.length < 8) {
        mensagem.textContent = "A senha deve ter pelo menos 8 caracteres.";
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
        mensagem.textContent = "O email deve conter um domínio válido como '@gmail.com', '@yahoo.com', '@outlook.com' ou '@hotmail.com'.";
        return;
    }

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    
    const emailDuplicado = listaUsuarios.some(u => u.email === novoEmail);
    if (emailDuplicado) {
        mensagem.textContent = "Este email já está em uso.";
        return;
    }

    const senhaHashed = CryptoJS.SHA256(novaSenha).toString(CryptoJS.enc.Hex); 

    const novoUsuario = {
        nome: novoNome,
        email: novoEmail,
        senha: senhaHashed 
    };

    listaUsuarios.push(novoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

    mensagem.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";
    
    setTimeout(() => {
        window.location.href = "proj_sistemas_web_login.html";
    }, 1500);
});