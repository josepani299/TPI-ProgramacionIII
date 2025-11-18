function validarSesion() {
  const formulario = document.querySelector("form");
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value;

    const usuarioValido = "admin@vitalis.com";
    const claveValida = "1234";

    if (usuario === usuarioValido && clave === claveValida) {
      mensajeError.textContent = ""; // limpia el mensaje
      alert("Inicio de sesión exitoso. ¡Bienvenido!");
      window.location.href = "index.html";
    } else {
      mensajeError.textContent = "Usuario o contraseña incorrectos.";
    }
  });
}
