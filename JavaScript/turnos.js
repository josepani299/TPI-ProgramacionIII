const API_TURNOS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments'; // Endpoint de MockAPI para turnos

async function mostrarTurnos() {
  const lista = document.getElementById("listaTurnos");
  lista.innerHTML = ""; // Limpiar la lista

  try {
    // Obtener el ID del usuario actual (simulado)
    const userId = 1; // Reemplazar con la lógica real para obtener el ID del usuario

    // Obtener los turnos del usuario desde MockAPI
    const response = await fetch(`${API_TURNOS}?pacienteId=${userId}`);
    const turnos = await response.json();

    if (turnos.length === 0) {
      lista.innerHTML = "<p>No tenés turnos activos.</p>"; // Display message if no appointments
      return;
    }

    turnos.forEach((turno) => {
      const div = document.createElement("div");
      div.className = "especialidad";
      div.innerHTML = `
        <h3>${turno.especialidad}</h3>
        <p><strong>Profesional:</strong> ${turno.profesional}</p>
        <p><strong>Fecha:</strong> ${turno.fecha}</p>
        <p><strong>Hora:</strong> ${turno.hora}</p>
        <button onclick="cancelarTurno('${turno.id}')">Cancelar turno</button>
      `;
      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    lista.innerHTML = "<p>Error al obtener la lista de turnos. Intenta nuevamente más tarde.</p>";
  }
}

async function cancelarTurno(turnoId) {
  try {
    // Eliminar el turno de MockAPI
    const response = await fetch(`${API_TURNOS}/${turnoId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert("Turno cancelado correctamente.");
      mostrarTurnos(); // Refrescar la lista de turnos
    } else {
      alert("Error al cancelar el turno.");
      console.error("Error al cancelar turno:", response.statusText);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error de conexión. Intenta nuevamente más tarde.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  mostrarTurnos();
});