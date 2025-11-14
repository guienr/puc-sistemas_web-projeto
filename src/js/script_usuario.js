document.addEventListener("DOMContentLoaded", function () {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

      if (!usuarioLogado) {
        window.location.href = "proj_sistemas_web_login.html";
        return;
      }

      document.getElementById("nomeUsuario").textContent = usuarioLogado.nome || "Não informado";
      document.getElementById("emailUsuario").textContent = usuarioLogado.email || "Não informado";

      const listaFavoritas = document.getElementById("listaFavoritas");
      listaFavoritas.innerHTML = "";

      if (Array.isArray(usuarioLogado.favoritas) && usuarioLogado.favoritas.length > 0) {
        usuarioLogado.favoritas.forEach(materia => {
          const item = document.createElement("li");
          item.textContent = materia;
          listaFavoritas.appendChild(item);
        });
      } else {
        const item = document.createElement("li");
        item.textContent = "Nenhuma matéria favoritada ainda.";
        listaFavoritas.appendChild(item);
      }

      document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "proj_sistemas_web_login.html";
      });
    });