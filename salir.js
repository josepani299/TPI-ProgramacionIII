function confirmarSalida() {
  const contenido = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Confirmar salida</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f0f8ff;
          padding: 2rem;
          color: #023e8a;
          text-align: center;
        }
        h2 {
          color: #0077b6;
          margin-bottom: 1rem;
        }
        button {
          margin: 1rem;
          padding: 0.8rem 1.5rem;
          background-color: #0077b6;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #48bfe3;
        }
      </style>
    </head>
    <body>
      <h2>¿Deseás cerrar tu sesión?</h2>
      <button onclick="confirmar()">Sí, cerrar sesión</button>
      <button onclick="window.close()">Cancelar</button>

      <script>
        function confirmar() {
          alert("Sesión cerrada correctamente.");
          window.close();
        }
      </script>
    </body>
    </html>
  `;

  const ventana = window.open('', 'Confirmar salida', 'width=400,height=300');

  if (ventana) {
    ventana.document.open();
    ventana.document.write(contenido);
    ventana.document.close();
  } else {
    alert("Tu navegador bloqueó la ventana emergente. Permitila para continuar.");
  }
}