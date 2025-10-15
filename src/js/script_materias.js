function favoritarMateria(materia, botao) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const mensagemDiv = document.getElementById("mensagemFavorito");

  if (!usuarioLogado) {
    mensagemDiv.textContent = "Você precisa estar logado para favoritar matérias.";
    mensagemDiv.style.color = "red";
    return;
  }

  if (!usuarioLogado.favoritas) {
    usuarioLogado.favoritas = [];
  }

  const jaFavoritada = usuarioLogado.favoritas.includes(materia);

  if (!jaFavoritada) {
    usuarioLogado.favoritas.push(materia);
    botao.classList.add("favorita");
    mensagemDiv.textContent = `"${materia}" adicionada aos favoritos!`;
    mensagemDiv.style.color = "green";
  } else {
    usuarioLogado.favoritas = usuarioLogado.favoritas.filter(m => m !== materia);
    botao.classList.remove("favorita");
    mensagemDiv.textContent = `"${materia}" removida dos favoritos.`;
    mensagemDiv.style.color = "orange";
  }

  const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const indice = listaUsuarios.findIndex(u => u.email === usuarioLogado.email);
  if (indice !== -1) {
    listaUsuarios[indice] = usuarioLogado;
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
}

document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado || !usuarioLogado.favoritas) return;

  document.querySelectorAll(".estrela").forEach(botao => {
    const materia = botao.getAttribute("onclick").match(/'([^']+)'/)[1];
    if (usuarioLogado.favoritas.includes(materia)) {
      botao.classList.add("favorita");
    }
  });
});