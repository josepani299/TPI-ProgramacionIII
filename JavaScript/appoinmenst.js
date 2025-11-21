// appointments.js
// appointments.js

const API_USERS = 'https://6911e0a752a60f10c81fa459.mockapi.io/users'; // Endpoint de MockAPI para usuarios
const API_MEDICOS = 'https://6911e0a752a60f10c81fa459.mockapi.io/medicos'; // Endpoint de MockAPI para médicos
const API_APPOINTMENTS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments'; // Endpoint de MockAPI para turnos

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
            option.textContent = paciente.name; // Display patient name
            pacienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al obtener la lista de pacientes:", error);
    }
}

async function populateMedicosDropdown() {
    const medicoSelect = document.getElementById("appointment-medicoId");
    medicoSelect.innerHTML = "<option value=''>Seleccionar Médico</option>";

    try {
        const response = await fetch(API_MEDICOS);
        const medicos = await response.json();

        medicos.forEach(medico => {
            const option = document.createElement("option");
            option.value = medico.id;
            option.textContent = medico.name; // Display doctor name
            medicoSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al obtener la lista de médicos:", error);
    }
}

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
                option.value = fecha;
                option.textContent = fecha; // Display date
                fechaSelect.appendChild(option);
            });
        }

        if (medico.horariosDisponibles) {
            const horarios = medico.horariosDisponibles.split(',');
            horarios.forEach(hora => {
                const option = document.createElement("option");
                option.value = hora;
                option.textContent = hora; // Display time
                horaSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al obtener la disponibilidad del médico:", error);
    }
}

async function crearAppointment() {
    const formularioAppointment = document.getElementById("crear-appointment-form");

    formularioAppointment.addEventListener("submit", async function (e) {
        e.preventDefault();

        const pacienteId = document.getElementById("appointment-pacienteId").value;
        const medicoId = document.getElementById("appointment-medicoId").value;
        const fecha = document.getElementById("appointment-fecha").value;
        const hora = document.getElementById("appointment-hora").value;
        const estado = document.getElementById("appointment-estado").value;

        if (!pacienteId || !medicoId || !fecha || !hora || !estado) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const nuevoAppointment = {
            pacienteId: pacienteId,
            medicoId: medicoId,
            fecha: fecha,
            hora: hora,
            estado: estado
        };

        try {
            const response = await fetch(API_APPOINTMENTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoAppointment)
            });

            if (response.ok) {
                alert("Turno creado con éxito!");
                formularioAppointment.reset(); // Limpiar el formulario
                mostrarAppointments(); // Refresh the list of appointments
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

async function mostrarAppointments() {
    const appointmentsContainer = document.getElementById("appointments-container");
    appointmentsContainer.innerHTML = "Lista de Turnos: ";

    try {
        const response = await fetch(API_APPOINTMENTS);
        const appointments = await response.json();

        if (appointments.length > 0) {
            const listaAppointments = document.createElement("ul");

            appointments.forEach(appointment => {
                const listItem = document.createElement("li");
                listItem.textContent = `Paciente ID: ${appointment.pacienteId}, Médico ID: ${appointment.medicoId}, Fecha: ${appointment.fecha}, Hora: ${appointment.hora}, Estado: ${appointment.estado}`;
                listaAppointments.appendChild(listItem);
            });

            appointmentsContainer.appendChild(listaAppointments);
        } else {
            appointmentsContainer.textContent = "No hay turnos registrados.";
        }
    } catch (error) {
        appointmentsContainer.textContent = "Error al obtener la lista de turnos.";
        console.error("Error al obtener turnos:", error);
    }
}

function initializeAppointments() {
    populatePacientesDropdown();
    populateMedicosDropdown();
    crearAppointment();
    mostrarAppointments();

    const medicoSelect = document.getElementById("appointment-medicoId");
    medicoSelect.addEventListener("change", function () {
        const medicoId = medicoSelect.value;
        populateFechasHorarios(medicoId);
    });
}
initializeAppointments();