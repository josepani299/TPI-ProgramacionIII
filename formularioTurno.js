// función para confirmar el turno. Cuando se presiona el botón se muestra una ventana emergente con toda la información del turno. Tiene que permitir descargar la información en PDF (todavía en proceso) 

const doctoresPorEspecialidad = {
    cardiologia: ['Laura Sánchez', 'Martín López'],
    dermatologia: ['Sofía Morales', 'Jimena Pérez'],
    clinica: ['Enrique López']
};
//tenemos que vincular esta parte con la base de datos 
const disponibilidad = {
    'Laura Sánchez': {
        fechas: ['2025-11-15', '2025-11-17'],
        horarios: ['09:00', '10:30', '14:00']
    },
    'Martín López': {
        fechas: ['2025-11-16', '2025-11-18'],
        horarios: ['08:30', '11:00', '15:00']
    },
    'Sofía Morales': {
        fechas: ['2025-11-19'],
        horarios: ['10:00', '12:00']
    },
    'Jimena Pérez': {
        fechas: ['2025-11-20'],
        horarios: ['09:00', '13:00']
    },
    'Enrique López': {
        fechas: ['2025-11-21'],
        horarios: ['08:00', '11:30']
    }
};

const especialidadSelect = document.getElementById('especialidad');
const doctorSelect = document.getElementById('doctor');
const fechaSelect = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');

especialidadSelect.addEventListener('change', () => {
    const especialidad = especialidadSelect.value;
    doctorSelect.innerHTML = '<option value="">Seleccionar</option>';
    fechaSelect.innerHTML = '<option value="">Seleccionar doctor primero</option>';
    horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

    if (doctoresPorEspecialidad[especialidad]) {
        doctoresPorEspecialidad[especialidad].forEach(doc => {
            const option = document.createElement('option');
            option.value = doc;
            option.textContent = doc;
            doctorSelect.appendChild(option);
        });
    }
});

doctorSelect.addEventListener('change', () => {
    const doctor = doctorSelect.value;
    fechaSelect.innerHTML = '<option value="">Seleccionar</option>';
    horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

    if (disponibilidad[doctor]) {
        disponibilidad[doctor].fechas.forEach(fecha => {
            const option = document.createElement('option');
            option.value = fecha;
            option.textContent = fecha;
            fechaSelect.appendChild(option);
        });
    }
});

fechaSelect.addEventListener('change', () => {
    const doctor = doctorSelect.value;
    horaSelect.innerHTML = '<option value="">Seleccionar</option>';

    if (disponibilidad[doctor]) {
        disponibilidad[doctor].horarios.forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
        });
    }
});
// funcion para confirmar el turno y mostrar la ventana emergente. Todavia no funciona.
// también tiene que permitir descargar la información en PDF (en proceso)
function confirmarTurno() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const especialidad = document.getElementById('especialidad').value;
    const doctor = document.getElementById('doctor').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const nota = document.getElementById('nota').value;

    if (!nombre || !email || !especialidad || !doctor || !fecha || !hora) {
        alert("Por favor completá todos los campos obligatorios.");
        return;
    }

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
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Especialidad:</strong> ${especialidad}</p>
        <p><strong>Doctor:</strong> ${doctor}</p>
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