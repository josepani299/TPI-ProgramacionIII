const API_MEDICOS = 'https://6911e0a752a60f10c81fa459.mockapi.io/docts'; // Endpoint de MockAPI para médicos
const API_TURNOS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments'; // Endpoint de MockAPI para turnos

const especialidadSelect = document.getElementById('especialidad');
const doctorSelect = document.getElementById('doctor');
const fechaSelect = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');

async function cargarDoctoresPorEspecialidad() {
    try {
        const response = await fetch(API_MEDICOS);
        const medicos = await response.json();

        const doctoresPorEspecialidad = {};

        medicos.forEach(medico => {
            if (!doctoresPorEspecialidad[medico.especialidad]) {
                doctoresPorEspecialidad[medico.especialidad] = [];
            }
            doctoresPorEspecialidad[medico.especialidad].push(medico);
        });

        especialidadSelect.addEventListener('change', () => {
            const especialidad = especialidadSelect.value;
            doctorSelect.innerHTML = '<option value="">Seleccionar</option>';
            fechaSelect.innerHTML = '<option value="">Seleccionar doctor primero</option>';
            horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

            if (doctoresPorEspecialidad[especialidad]) {
                doctoresPorEspecialidad[especialidad].forEach(medico => {
                    const option = document.createElement('option');
                    option.value = medico.id; // Use medico.id as the value
                    option.textContent = medico.name;
                    doctorSelect.appendChild(option);
                });
            }
        });
    } catch (error) {
        console.error("Error al obtener la lista de médicos:", error);
        alert("Error al obtener la lista de médicos. Intenta nuevamente más tarde.");
    }
}

async function cargarDisponibilidad() {
    try {
        const response = await fetch(API_MEDICOS);
        const medicos = await response.json();

        const disponibilidad = {};

        medicos.forEach(medico => {
            disponibilidad[medico.id] = { // Use medico.id as the key
                fechas: medico.diasDisponibles ? medico.diasDisponibles.split(',') : [],
                horarios: medico.horariosDisponibles ? medico.horariosDisponibles.split(',') : []
            };
        });

        doctorSelect.addEventListener('change', () => {
            const medicoId = doctorSelect.value;
            fechaSelect.innerHTML = '<option value="">Seleccionar</option>';
            horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

            if (disponibilidad[medicoId]) {
                disponibilidad[medicoId].fechas.forEach(fecha => {
                    const option = document.createElement('option');
                    option.value = fecha;
                    option.textContent = fecha;
                    fechaSelect.appendChild(option);
                });
            }
        });

        fechaSelect.addEventListener('change', () => {
            const medicoId = doctorSelect.value;
            horaSelect.innerHTML = '<option value="">Seleccionar</option>';

            if (disponibilidad[medicoId]) {
                disponibilidad[medicoId].horarios.forEach(hora => {
                    const option = document.createElement('option');
                    option.value = hora;
                    option.textContent = hora;
                    horaSelect.appendChild(option);
                });
            }
        });
    } catch (error) {
        console.error("Error al obtener la disponibilidad de los médicos:", error);
        alert("Error al obtener la disponibilidad de los médicos. Intenta nuevamente más tarde.");
    }
}

// funcion para confirmar el turno y mostrar la ventana emergente. Todavia no funciona.
// también tiene que permitir descargar la información en PDF (en proceso)
function confirmarTurno() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const dni = document.getElementById('dni').value;
    const email = document.getElementById('email').value;
    const especialidad = document.getElementById('especialidad').value;
    const doctorId = document.getElementById('doctor').value; // Get doctor ID
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const nota = document.getElementById('nota').value;

    if (!nombre || !email || !especialidad || !doctorId || !fecha || !hora) {
        alert("Por favor completá todos los campos obligatorios.");
        return;
    }

    // Get doctor name from the selected option
    const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;

    const contenido = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Confirmación de Turno</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f0f8ff;
            padding: 2rem;
            color: #023e8a;
          }
          h2 {
            color: #0077b6;
            margin-bottom: 1rem;
          }
          p {
            margin: 0.5rem 0;
          }
          button {
            margin-top: 2rem;
            padding: 0.6rem 1.2rem;
            background-color: #0077b6;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h2>Confirmación de turno</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Apellido:</strong> ${apellido}</p>
        <p><strong>DNI:</strong> ${dni}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Especialidad:</strong> ${especialidad}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Nota:</strong> ${nota || 'Sin nota adicional'}</p>
        <button onclick="window.print()">Descargar PDF</button>
      </body>
      </html>
    `.replaceAll("\n", "");

    const ventana = window.open('', 'Confirmación', 'width=550,height=600');
    if (ventana) {
        ventana.document.open();
        ventana.document.write(contenido);
        ventana.document.close();
    } else {
        alert("Tu navegador bloqueó la ventana emergente. Permitila para ver la confirmación.");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    cargarDoctoresPorEspecialidad();
    cargarDisponibilidad();
});