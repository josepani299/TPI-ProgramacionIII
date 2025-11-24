// appointments.js

const API_USERS = 'https://6911e0a752a60f10c81fa459.mockapi.io/users'; 
const API_MEDICOS = 'https://6911e0a752a60f10c81fa459.mockapi.io/medicos'; 
const API_APPOINTMENTS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments'; 

// -------------------- Pacientes --------------------
async function populatePacientesDropdown() {
  const pacienteSelect = document.getElementById("appointment-pacienteId");
  pacienteSelect.innerHTML = "<option value=''>Seleccionar Paciente</option>";

  try {
    const response = await fetch(API_USERS);
    const usuarios = await response.json();

    const pacientes = usuarios.filter(usuario => usuario.role === "USUARIO");

    pacientes.forEach(paciente => {
      const option = document.createElement("option");
      option.value = paciente.id;
      option.textContent = paciente.name;
      pacienteSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener la lista de pacientes:", error);
  }
}

// -------------------- Médicos --------------------
async function populateMedicosDropdown() {
  const medicoSelect = document.getElementById("appointment-medicoId");
  medicoSelect.innerHTML = "<option value=''>Seleccionar Médico</option>";

  try {
    const response = await fetch(API_MEDICOS);
    const medicos = await response.json();

    medicos.forEach(medico => {
      const option = document.createElement("option");
      option.value = medico.id;
      option.textContent = medico.name;
      medicoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al obtener la lista de médicos:", error);
  }
}

// -------------------- Fechas y Horarios --------------------
async function populateFechasHorarios(medicoId) {
  const fechaSelect = document.getElementById("appointment-fecha");
  const horaSelect = document.getElementById("appointment-hora");
  fechaSelect.innerHTML = "<option value=''>Seleccionar Fecha</option>";
  horaSelect.innerHTML = "<option value=''>Seleccionar Hora</option>";

  try {
    const response = await fetch(`${API_MEDICOS}/${medicoId}`);
    const medico = await response.json();

    if (medico.diasDisponibles) {
      const fechas = medico.diasDisponibles.split(',');
      fechas.forEach(fecha => {
        const option = document.createElement("option");
        option.value = fecha.trim();
        option.textContent = fecha.trim();
        fechaSelect.appendChild(option);
      });
    }

    if (medico.horariosDisponibles) {
      const horarios = medico.horariosDisponibles.split(',');
      horarios.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora.trim();
        option.textContent = hora.trim();
        horaSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error al obtener la disponibilidad del médico:", error);
  }
}

// -------------------- Crear Turno --------------------
async function crearAppointment() {
  const formularioAppointment = document.getElementById("crear-appointment-form");

  formularioAppointment.addEventListener("submit", async function (e) {
    e.preventDefault();

    const pacienteId = document.getElementById("appointment-pacienteId").value;
    const medicoId = document.getElementById("appointment-medicoId").value;
    const fecha = document.getElementById("appointment-fecha").value;
    const hora = document.getElementById("appointment-hora").value;
    const estado = document.getElementById("appointment-estado").value;

    const patientId = localStorage.getItem("userId"); 

    if (!pacienteId || !medicoId || !fecha || !hora || !estado) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nuevoAppointment = {
      patientId,        
      doctorId: medicoId,
      fecha,
      hora,
      estado
    };

    try {
      const response = await fetch(API_APPOINTMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoAppointment)
      });

      if (response.ok) {
        alert("✅ Turno creado con éxito!");
        formularioAppointment.reset();
        mostrarAppointments(); 
      } else {
        alert("Error al crear el turno.");
        console.error("Error al crear turno:", response.statusText);
      }
    } catch (error) {
      alert("Error de conexión. Intenta nuevamente más tarde.");
      console.error("Error de conexión:", error);
    }
  });
}

// -------------------- Mostrar Turnos --------------------
async function mostrarAppointments() {
  const appointmentsContainer = document.getElementById("appointments-container");
  appointmentsContainer.innerHTML = "";

  const patientId = localStorage.getItem("userId"); // ✅ usar patientId

  try {
    const response = await fetch(`${API_APPOINTMENTS}?patientId=${patientId}`);
    const appointments = await response.json();

    if (appointments.length > 0) {
      const tabla = document.createElement("table");
      tabla.classList.add("tabla-turnos");

      tabla.innerHTML = `
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Especialidad</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = tabla.querySelector("tbody");

      appointments.forEach(appointment => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${appointment.doctorName || appointment.doctorId}</td>
          <td>${appointment.especialidad || "-"}</td>
          <td>${appointment.fecha}</td>
          <td>${appointment.hora}</td>
          <td>${appointment.estado}</td>
          <td><button onclick="cancelarAppointment(${appointment.id})">Cancelar</button></td>
        `;
        tbody.appendChild(fila);
      });

      appointmentsContainer.appendChild(tabla);
    } else {
      appointmentsContainer.textContent = "No tienes turnos registrados.";
    }
  } catch (error) {
    appointmentsContainer.textContent = "Error al obtener la lista de turnos.";
    console.error("Error al obtener turnos:", error);
  }
}

// -------------------- Cancelar Turno --------------------
async function cancelarAppointment(id) {
  if (!confirm("¿Seguro que deseas cancelar este turno?")) return;

  try {
    await fetch(`${API_APPOINTMENTS}/${id}`, { method: "DELETE" });
    alert("Turno cancelado correctamente.");
    mostrarAppointments(); // recargar lista
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    alert("No se pudo cancelar el turno.");
  }
}

// -------------------- Inicialización --------------------
function initializeAppointments() {
  populatePacientesDropdown();
  populateMedicosDropdown();
  crearAppointment();
  mostrarAppointments();

  const medicoSelect = document.getElementById("appointment-medicoId");
  medicoSelect.addEventListener("change", function () {
    const medicoId = medicoSelect.value;
    if (medicoId) populateFechasHorarios(medicoId);
  });
}

initializeAppointments();