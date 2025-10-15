document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");
  const mensagem = document.getElementById("mensagem");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    mensagem.textContent = "";

    if (!nome || !email || !senha) {
      mensagem.textContent = "Todos os campos devem ser preenchidos.";
      return;
    }

    if (
      !email.includes("@gmail.com") &&
      !email.includes("@yahoo.com") &&
      !email.includes("@outlook.com") &&
      !email.includes("@hotmail.com")
    ) {
      mensagem.textContent = "O email deve conter um domínio válido como '@gmail.com'.";
      return;
    }

    if (senha.length < 8) {
      mensagem.textContent = "A senha deve ter pelo menos 8 caracteres.";
      return;
    }

    const novoUsuario = { nome, email, senha };

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailExistente = listaUsuarios.some(u => u.email === email);
    if (emailExistente) {
      mensagem.textContent = "Este email já está cadastrado.";
      return;
    }

    listaUsuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));

    // Define o usuário como logado
    localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

    mensagem.textContent = "Cadastro realizado com sucesso!";
    setTimeout(() => {
      window.location.href = "proj_sistemas_web_login.html";
    }, 1500);
  });
});