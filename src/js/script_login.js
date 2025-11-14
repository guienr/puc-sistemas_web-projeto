function base64UrlEncode(str) {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const formulario = document.getElementById("formulario");
    const mensagem = document.getElementById("mensagem");

    const emailDigitado = document.getElementById("email").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();
    mensagem.textContent = "";

    if (!emailDigitado || !senhaDigitada) {
        mensagem.textContent = "Por favor, preencha todos os campos.";
        return;
    }

    if (senhaDigitada.length < 8) {
        mensagem.textContent = "A senha precisa ter no mínimo 8 caracteres.";
        return;
    }

    const senhaHashedDigitada = CryptoJS.SHA256(senhaDigitada).toString(CryptoJS.enc.Hex);
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = listaUsuarios.find(u => u.email === emailDigitado);

    const SECRET_KEY = "SuaChaveSecretaForteeUnicaAqui123!"

    if (usuarioEncontrado && usuarioEncontrado.senha === senhaHashedDigitada) {

        const payload = {
            userId: usuarioEncontrado.email,
            userName: usuarioEncontrado.nome,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        };
        const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
        
        const header = { alg: "HS256", typ: "JWT" };
        const headerBase64 = base64UrlEncode(JSON.stringify(header)); 

        const dataToSign = `${headerBase64}.${payloadBase64}`; 

        const signatureHash = CryptoJS.HmacSHA256(dataToSign, SECRET_KEY); 

        const signatureBase64Url = signatureHash.toString(CryptoJS.enc.Base64)
                                                 .replace(/\+/g, '-')
                                                 .replace(/\//g, '_')
                                                 .replace(/=+$/, '');

        const token = `${dataToSign}.${signatureBase64Url}`;

        localStorage.setItem("authToken", token);
        mensagem.textContent = "Login bem-sucedido! Gerando Token...";

        setTimeout(() => {
            window.location.href = "proj_sistemas_web_usuario.html";
        }, 1500);
    } else {
        mensagem.textContent = "Email ou senha incorretos.";
    }
});