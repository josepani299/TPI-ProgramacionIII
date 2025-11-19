document.addEventListener("DOMContentLoaded", function () {
  const lista = document.getElementById("lista-turnos");

  // Simulación de turnos guardados
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [
    {
      especialidad: "Cardiología",
      profesional: "Dra. Laura Sánchez",
      fecha: "2025-11-25",
      hora: "10:00",
    },
    {
      especialidad: "Dermatología",
      profesional: "Dra. Sofía Morales",
      fecha: "2025-11-28",
      hora: "15:30",
    },
  ];

  if (turnos.length === 0) {
    lista.innerHTML = "<p>No tenés turnos activos.</p>";
    return;
  }

  turnos.forEach((turno, index) => {
    const div = document.createElement("div");
    div.className = "especialidad";
    div.innerHTML = `
      <h3>${turno.especialidad}</h3>
      <p><strong>Profesional:</strong> ${turno.profesional}</p>
      <p><strong>Fecha:</strong> ${turno.fecha}</p>
      <p><strong>Hora:</strong> ${turno.hora}</p>
      <button onclick="cancelarTurno(${index})">Cancelar turno</button>
    `;
    lista.appendChild(div);
  });
});

function cancelarTurno(index) {
  const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
  const turnoCancelado = turnos.splice(index, 1)[0];
  localStorage.setItem("turnos", JSON.stringify(turnos));
  alert(`Turno con ${turnoCancelado.profesional} cancelado correctamente.`);
  location.reload();
}