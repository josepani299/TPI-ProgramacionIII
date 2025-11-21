const API_USERS = 'https://6911e0a752a60f10c81fa459.mockapi.io/users'; // Endpoint de MockAPI para usuarios

function validarRegistroCompleto() {
  const formulario = document.querySelector("form");
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const clave = document.getElementById("clave").value;

    if (!nombre || !email || !clave) {
      mensajeError.textContent = "Todos los campos son obligatorios.";
      return;
    }

    // Crear objeto con los datos del usuario
    const nuevoUsuario = {
      name: nombre, 
      email: email,
      password: clave,
      role: "USUARIO" 
    };

    try {
      // Enviar datos a MockAPI
      const response = await fetch(API_USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        mensajeError.textContent = "";
        alert("Cuenta creada exitosamente. Ahora podés iniciar sesión.");
        window.location.href = "iniciarSesion.html";
      } else {
        mensajeError.textContent = "Error al crear la cuenta. Intenta nuevamente.";
        console.error("Error al crear usuario:", response.statusText);
      }
    } catch (error) {
      mensajeError.textContent = "Error de conexión. Intenta nuevamente más tarde.";
      console.error("Error de conexión:", error);
    }
  });
}