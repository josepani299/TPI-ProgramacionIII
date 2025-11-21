const API_USERS = 'https://6911e0a752a60f10c81fa459.mockapi.io/users'; // Endpoint de MockAPI para usuarios

async function validarSesion() {
  const formulario = document.querySelector("form");
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value;

    try {
      // Obtener todos los usuarios desde MockAPI
      const response = await fetch(API_USERS);
      const usuarios = await response.json();

      // Buscar el usuario que coincida con el email y la contraseña
      const usuarioEncontrado = usuarios.find(user => user.email === usuario && user.password === clave);

      if (usuarioEncontrado) {
        mensajeError.textContent = ""; // limpia el mensaje
        alert("Inicio de sesión exitoso. ¡Bienvenido!");
        // Guardar la información del usuario en localStorage (opcional)
        localStorage.setItem('user', JSON.stringify(usuarioEncontrado));

        // Redirigir según el rol
        if (usuarioEncontrado.role === 'ADMIN') {
          window.location.href = "administrador.html";
        } else {
          window.location.href = "index.html"; // Redirigir a la página principal para usuarios normales
        }
      } else {
        mensajeError.textContent = "Usuario o contraseña incorrectos.";
      }
    } catch (error) {
      mensajeError.textContent = "Error de conexión. Intenta nuevamente más tarde.";
      console.error("Error de conexión:", error);
    }
  });
}