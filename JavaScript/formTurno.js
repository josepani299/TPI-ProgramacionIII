const API_MEDICOS = 'https://6911e0a752a60f10c81fa459.mockapi.io/docts';
const API_TURNOS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments';

document.addEventListener("DOMContentLoaded", () => {
  const logueado = localStorage.getItem("usuarioLogueado");

  if (logueado !== "true") {
    alert("⚠️ Debes iniciar sesión para agendar un turno.");
    window.location.href = "iniciarSesion.html";
  } else {
    // Mostrar quién está logueado (opcional)
    const usuarioEmail = localStorage.getItem("usuarioEmail");
    if (usuarioEmail) {
      document.getElementById("usuarioActivo").textContent =
        "Sesión iniciada: " + usuarioEmail;
    }
  }
});

const especialidadSelect = document.getElementById('especialidad');
const doctorSelect = document.getElementById('doctor');
const fechaSelect = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');

let medicos = []; // guardamos todos los médicos

// Cargar médicos desde la API
async function cargarDoctores() {
  try {
    const response = await fetch(API_MEDICOS);
    medicos = await response.json();

    console.log("Médicos cargados:", medicos);

    // Evento: cambio de especialidad
    especialidadSelect.addEventListener('change', () => {
      const especialidadSeleccionada = especialidadSelect.value.toLowerCase();
      doctorSelect.innerHTML = '<option value="">Seleccionar</option>';
      fechaSelect.innerHTML = '<option value="">Seleccionar doctor primero</option>';
      horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

      const medicosFiltrados = medicos.filter(medico =>
        medico.especialidad?.toLowerCase().includes(especialidadSeleccionada)
      );
      const doctoresPorEspecialidad = {};
      medicosFiltrados.forEach(medico => {
        const option = document.createElement('option');
        option.value = medico.id;
        option.textContent = medico.name;
        doctorSelect.appendChild(option);
      });
    });

    //  cambio de doctor
    doctorSelect.addEventListener('change', () => {
      const medicoId = doctorSelect.value;
      const medico = medicos.find(m => m.id === medicoId);

      fechaSelect.innerHTML = '<option value="">Seleccionar</option>';
      horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

      if (medico?.diasDisponibles) {
        medico.diasDisponibles.split(',').forEach(fecha => {
          const option = document.createElement('option');
          option.value = fecha;
          option.textContent = fecha;
          fechaSelect.appendChild(option);
        });
      }

      fechaSelect.addEventListener('change', () => {
        horaSelect.innerHTML = '<option value="">Seleccionar</option>';
        if (medico?.horariosDisponibles) {
          medico.horariosDisponibles.split('-').forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
          });
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar médicos:", error);
    alert("No se pudieron cargar los médicos.");
  }
}

//  cambio de especialidad
especialidadSelect.addEventListener('change', () => {
  const especialidad = especialidadSelect.value.toLowerCase();
  doctorSelect.innerHTML = '<option value="">Seleccionar</option>';
  fechaSelect.innerHTML = '<option value="">Seleccionar doctor primero</option>';
  horaSelect.innerHTML = '<option value="">Seleccionar fecha primero</option>';

  if (doctoresPorEspecialidad[especialidad]) {
    doctoresPorEspecialidad[especialidad].forEach(medico => {
      const option = document.createElement('option');
      option.value = medico.id;
      option.textContent = medico.name; 
      doctorSelect.appendChild(option);
    });
  }
});
 

// Guardar turno en la API
async function confirmarTurno() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const dni = document.getElementById('dni').value;
  const genero = document.getElementById('genero').value;
  const email = document.getElementById('email').value;
  const especialidad = especialidadSelect.value;
  const doctorId = doctorSelect.value;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.text;
  const fecha = fechaSelect.value;
  const hora = horaSelect.value;
  const nota = document.getElementById('nota').value;

  if (!nombre || !apellido || !dni || !genero || !email || !especialidad || !doctorId || !fecha || !hora) {
    alert("Por favor completá todos los campos obligatorios.");
    return;
  }

  try {
    const response = await fetch(API_TURNOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        apellido,
        dni,
        genero,
        email,
        especialidad,
        doctorId,
        doctorName,
        fecha,
        hora,
        nota,
        estado: "pendiente"
      })
    });

    const data = await response.json();
    alert("✅ Turno guardado correctamente.");
    console.log("Turno registrado:", data);

  } catch (error) {
    console.error("Error al guardar el turno:", error);
    alert("No se pudo guardar el turno. Intenta más tarde.");
  }
}

document.addEventListener('DOMContentLoaded', cargarDoctores);

async function confirmarTurno() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const dni = document.getElementById('dni').value;
  const genero = document.getElementById('genero').value;
  const email = document.getElementById('email').value;
  const especialidad = especialidadSelect.value;
  const doctorId = doctorSelect.value;
  const doctorName = doctorSelect.options[doctorSelect.selectedIndex]?.text;
  const fecha = fechaSelect.value;
  const hora = horaSelect.value;
  const nota = document.getElementById('nota').value;

  if (!nombre || !apellido || !dni || !genero || !email || !especialidad || !doctorId || !fecha || !hora) {
    alert("Por favor completá todos los campos obligatorios.");
    return;
  }

  try {
    const response = await fetch(API_TURNOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        apellido,
        dni,
        genero,
        email,
        especialidad,
        doctorId,
        doctorName,
        fecha,
        hora,
        nota,
        estado: "pendiente"
      })
    });

    const data = await response.json();
    alert("✅ Turno guardado correctamente.");

    // ventana emergente
    const contenido = `
      <html>
      <head>
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
        <h2>¡Turno confirmado!</h2>
        <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
        <p><strong>DNI:</strong> ${dni}</p>
        <p><strong>Género:</strong> ${genero}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Especialidad:</strong> ${especialidad}</p>
        <p><strong>Doctor:</strong> ${doctorName}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Hora:</strong> ${hora}</p>
        <p><strong>Nota:</strong> ${nota || 'Sin nota adicional'}</p>
        <button onclick="window.print()">Descargar PDF</button>
      </body>
      </html>
    `;

    //Abrir ventana emergente
    const ventana = window.open('', 'Confirmación', 'width=500,height=600');
    ventana.document.write(contenido);
    ventana.document.close();

  } catch (error) {
    console.error("Error al guardar el turno:", error);
    alert("No se pudo guardar el turno. Intenta más tarde.");
  }
}