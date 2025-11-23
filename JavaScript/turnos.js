const API_TURNOS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments'; // Endpoint de MockAPI para turnos

async function cargarMisTurnos() {
  const userId = localStorage.getItem("userId");
  const contenedor = document.getElementById("listaTurnos");

  contenedor.innerHTML = "<p>Cargando tus turnos...</p>";

  if (!userId) {
    contenedor.innerHTML = "<p style='color:red'>Error: no hay usuario logueado</p>";
    return;
  }

  try {
    const [resTurnos, resMedicos] = await Promise.all([
      fetch(API_TURNOS),
      fetch(API_MEDICOS)
    ]);

    const turnos = await resTurnos.json();
    const medicos = await resMedicos.json();

    const mapaMedicos = {};
    medicos.forEach(m => {
      mapaMedicos[m.id] = m.name || m.nombre || ("Médico " + m.id);
    });

    // FILTRAMOS SOLO LOS TURNOS DEL USUARIO
    const misTurnos = turnos.filter(t =>
      String(t.pacienteId) === String(userId)
    );

    if (misTurnos.length === 0) {
      contenedor.innerHTML = "<p>No tenés turnos activos.</p>";
      return;
    }

    // ARMAMOS LA LISTA
    contenedor.innerHTML = misTurnos.map(t => {
      return `
        <div class="turno-card">
          <p><strong>ID Turno:</strong> ${t.id}</p>
          <p><strong>Médico:</strong> ${mapaMedicos[t.doctorId] || "Desconocido"}</p>
          <p><strong>Fecha:</strong> ${t.fecha}</p>
          <p><strong>Hora:</strong> ${t.hora}</p>
          <p><strong>Estado:</strong> ${t.estado}</p>

          ${t.estado !== "Cancelado" ? `
          <button onclick="cancelarTurno('${t.id}')"
                  class="btn-cancelar">
            Cancelar turno
          </button>
          ` : `<p style="color:red;"><strong>Este turno está cancelado</strong></p>`}
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error(err);
    contenedor.innerHTML = "<p style='color:red'>Error al cargar los turnos</p>";
  }
}

async function cancelarTurno(idTurno) {
  try {
    // 1. Traer el turno
    const resGet = await fetch(`${API_TURNOS}/${idTurno}`);
    if (!resGet.ok) {
      alert("No se pudo obtener el turno.");
      return;
    }
    const turno = await resGet.json();

    // 2. Cambiar estado
    turno.estado = "Cancelado";

    // 3. Guardar (MockAPI necesita PUT del objeto entero)
    const resPut = await fetch(`${API_TURNOS}/${idTurno}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turno)
    });

    if (!resPut.ok) {
      alert("Error al cancelar turno");
      return;
    }

    alert("✔ Turno cancelado");
    cargarMisTurnos();

  } catch (error) {
    console.error(error);
    alert("Error al conectar con MockAPI");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  cargarMisTurnos();
});