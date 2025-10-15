document.addEventListener("DOMContentLoaded", function () {
      const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
      const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      if (!usuarioLogado) {
        window.location.href = "proj_sistemas_web_login.html";
        return;
      }

      // Preenche os campos com os dados atuais
      document.getElementById("nome").value = usuarioLogado.nome;
      document.getElementById("email").value = usuarioLogado.email;
      document.getElementById("senha").value = usuarioLogado.senha;

      const form = document.getElementById("formAlterar");
      const mensagem = document.getElementById("mensagem");

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        const novoNome = document.getElementById("nome").value.trim();
        const novoEmail = document.getElementById("email").value.trim();
        const novaSenha = document.getElementById("senha").value.trim();

        if (!novoNome || !novoEmail || !novaSenha) {
          mensagem.textContent = "Todos os campos devem ser preenchidos.";
          return;
        }

        if (novaSenha.length < 8) {
          mensagem.textContent = "A senha deve ter pelo menos 8 caracteres.";
          return;
        }

        // Verifica se o novo email já existe em outro usuário
        const emailDuplicado = listaUsuarios.some(u => u.email === novoEmail && u.email !== usuarioLogado.email);
        if (emailDuplicado) {
          mensagem.textContent = "Este email já está em uso por outro usuário.";
          return;
        }

        // Atualiza os dados na lista
        const indice = listaUsuarios.findIndex(u => u.email === usuarioLogado.email && u.senha === usuarioLogado.senha);
        if (indice !== -1) {
          listaUsuarios[indice] = {
            nome: novoNome,
            email: novoEmail,
            senha: novaSenha
          };

          localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
          localStorage.setItem("usuarioLogado", JSON.stringify(listaUsuarios[indice]));

          mensagem.textContent = "Dados atualizados com sucesso!";
          setTimeout(() => {
            window.location.href = "proj_sistemas_web_usuario.html";
          }, 1500);
        } else {
          mensagem.textContent = "Erro ao localizar usuário.";
        }
      });
    });