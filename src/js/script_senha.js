document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");
  const mensagem = document.getElementById("mensagem");

  formulario.addEventListener("submit", function (event) {
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
      mensagem.textContent = `Sua senha é: ${usuarioEncontrado.senha}`;
    } else {
      mensagem.textContent = "Email não encontrado. Verifique e tente novamente.";
    }
  });
});