function validarRegistroCompleto() {
  const formulario = document.querySelector("form");
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const genero = document.getElementById("genero").value;
    const email = document.getElementById("email").value.trim();
    const clave = document.getElementById("clave").value;

    if (!nombre || !dni || !genero || !email || !clave) {
      mensajeError.textContent = "Todos los campos son obligatorios.";
      return;
    }

    mensajeError.textContent = "";
    alert("Cuenta creada exitosamente. Ahora podés iniciar sesión.");
    window.location.href = "iniciarSesion.html";
  });
}