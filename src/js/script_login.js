document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");
  const mensagem = document.getElementById("mensagem");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailDigitado = document.getElementById("email").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();

    mensagem.textContent = "";

    // Verificação de campos vazios
    if (!emailDigitado || !senhaDigitada) {
      mensagem.textContent = "Por favor, preencha todos os campos.";
      return;
    }

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioLogado = listaUsuarios.find(
      u => u.email === emailDigitado && u.senha === senhaDigitada
    );

    if (usuarioLogado) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      mensagem.textContent = "Login bem-sucedido!";
      setTimeout(() => {
        window.location.href = "proj_sistemas_web_usuario.html";
      }, 1500);
    } else {
      mensagem.textContent = "Email ou senha incorretos.";
    }
  });
});