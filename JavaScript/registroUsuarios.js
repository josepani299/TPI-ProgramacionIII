
const API_USERS = "https://6911e0a752a60f10c81fa459.mockapi.io/users";
const API_TURNOS = "https://691b22ae2d8d78557571ac41.mockapi.io/appointments";
const API_MEDICOS = "https://6911e0a752a60f10c81fa459.mockapi.io/docts";

function validarRegistroCompleto() {
  const formulario = document.querySelector("#crear-usuario-form");
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const email = document.getElementById("nuevo-email").value.trim();
    const clave = document.getElementById("nuevo-password").value.trim();
    const role = document.getElementById("nuevo-role").value;

    if (!nombre || !email || !clave || !role) {
      mensajeError.textContent = "Todos los campos son obligatorios.";
      return;
    }

    const nuevoUsuario = { name: nombre, email: email, password: clave, role: role };

    try {
      const response = await fetch(API_USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        mensajeError.textContent = "";
        alert("Usuario registrado con éxito!");
        limpiarCampos();
      } else {
        mensajeError.textContent = "Error al crear la cuenta.";
      }
    } catch (error) {
      mensajeError.textContent = "Error de conexión.";
      console.error(error);
    }
  });

  function limpiarCampos() {
    document.getElementById("nuevo-nombre").value = "";
    document.getElementById("nuevo-email").value = "";
    document.getElementById("nuevo-password").value = "";
  }
}


async function mostrarUsuariosAdmin() {
  const cont = document.getElementById("usuarios-container");
  cont.innerHTML = "Listas de Administradores: ";

  try {
    const res = await fetch(API_USERS);
    const usuarios = await res.json();
    const admins = usuarios.filter(u => u.role === "ADMIN");

    if (admins.length === 0) {
      cont.textContent = "No hay usuarios administradores registrados.";
      return;
    }

    const ul = document.createElement("ul");
    admins.forEach(u => {
      const li = document.createElement("li");
      li.textContent = `Nombre: ${u.name}, Email: ${u.email}`;
      ul.appendChild(li);
    });

    cont.appendChild(ul);
  } catch {
    cont.textContent = "Error al obtener la lista de usuarios.";
  }
}


async function mostrarPacientes() {
  const cont = document.getElementById("pacientes-container");
  cont.innerHTML = "Listas de Pacientes: ";

  try {
    const res = await fetch(API_USERS);
    const usuarios = await res.json();
    const pacientes = usuarios.filter(u => u.role === "USUARIO");

    if (pacientes.length === 0) {
      cont.textContent = "No hay pacientes registrados.";
      return;
    }

    const ul = document.createElement("ul");
    pacientes.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `Nombre: ${p.name}, Email: ${p.email}`;
      ul.appendChild(li);
    });

    cont.appendChild(ul);
  } catch {
    cont.textContent = "Error al obtener la lista de pacientes.";
  }
}


function crearMedico() {
  const form = document.getElementById("crear-medico-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("medico-nombre").value.trim();
    const especialidad = document.getElementById("medico-especialidad").value.trim();
    const horarios = document.getElementById("medico-horarios").value.trim();

    const fecha = $("#medico-dias").datepicker("getDate");
    const dias = fecha ? $.datepicker.formatDate("yy-mm-dd", fecha) : "";

    if (!nombre || !especialidad || !dias || !horarios) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const medico = {
      name: nombre,
      especialidad,
      diasDisponibles: dias,
      horariosDisponibles: horarios
    };

    try {
      const res = await fetch(API_MEDICOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medico)
      });

      if (res.ok) {
        alert("Médico creado con éxito!");
        form.reset();
        mostrarMedicos();
      } else {
        alert("Error al crear el médico.");
      }
    } catch {
      alert("Error de conexión.");
    }
  });
}


async function mostrarMedicos() {
  const cont = document.getElementById("medicos-container");
  cont.innerHTML = "Lista de Médicos: ";

  try {
    const res = await fetch(API_MEDICOS);
    const medicos = await res.json();

    if (medicos.length === 0) {
      cont.textContent = "No hay médicos registrados.";
      return;
    }

    const ul = document.createElement("ul");
    medicos.forEach(m => {
      const li = document.createElement("li");
      li.textContent = `Nombre: ${m.name}, Especialidad: ${m.especialidad}, Días: ${m.diasDisponibles}, Horarios: ${m.horariosDisponibles}`;
      ul.appendChild(li);
    });

    cont.appendChild(ul);
  } catch {
    cont.textContent = "Error al obtener la lista de médicos.";
  }
}

// funciones 
async function buscarPaciente() {
  try {
    const res = await fetch(API_USERS);
    const usuarios = await res.json();

    const dni = document.getElementById("buscar-dni").value.trim();
    if (!dni) return alert("Ingrese un DNI");

    const usuario = usuarios.find(u => u.role === "USUARIO" && u.dni == dni);

    const contenedor = document.getElementById("resultado-busqueda");

    if (!usuario) {
      contenedor.innerHTML = `<p style="color:red;">No se encontró ningún paciente.</p>`;
      return;
    }

    // Crear el select con el paciente encontrado
    contenedor.innerHTML = `
      <label>Paciente encontrado:</label>
      <select id="select-paciente">
          <option value="${usuario.id}">
              ${usuario.name}
          </option>
      </select>
    `;

    alert("Paciente encontrado: " + usuario.name);
    return usuario;

  } catch (e) {
    console.error(e);
    alert("Error al buscar.");
    return null;
  }
}


async function cargarDoctoresPorEspecialidad() {
  const esp = document.getElementById("select-especialidad").value;
  const selectMed = document.getElementById("select-medico");

  selectMed.innerHTML = "<option value=''>Seleccione un médico</option>";
  document.getElementById("select-fecha").innerHTML = "<option value=''>Seleccione una fecha</option>";
  document.getElementById("select-hora").innerHTML = "<option value=''>Seleccione un horario</option>";

  if (!esp) return;

  try {
    const res = await fetch(API_MEDICOS);
    const doctores = await res.json();
    const filtrados = doctores.filter(d => d.especialidad.toLowerCase() === esp.toLowerCase());

    filtrados.forEach(doc => {
      const op = document.createElement("option");
      op.value = doc.id;
      op.textContent = doc.name;
      op.dataset.dias = doc.diasDisponibles;
      op.dataset.horas = doc.horariosDisponibles;
      selectMed.appendChild(op);
    });

    if (filtrados.length === 0) alert("No se encontraron médicos con esa especialidad");
  } catch {
    alert("Error al buscar doctores");
  }
}


function cargarDiasYHorarios() {
  const selectMed = document.getElementById("select-medico");
  const opt = selectMed.options[selectMed.selectedIndex];

  const dias = opt.dataset.dias;
  const horas = opt.dataset.horas;

  const selFecha = document.getElementById("select-fecha");
  const selHora = document.getElementById("select-hora");

  selFecha.innerHTML = "<option value=''>Seleccione una fecha</option>";
  selHora.innerHTML = "<option value=''>Seleccione una hora</option>";

  if (dias) {
    dias.split(",").forEach(d => {
      const o = document.createElement("option");
      o.value = d.trim();
      o.textContent = d.trim();
      selFecha.appendChild(o);
    });
  }

  if (horas) {
    horas.split("-").forEach(h => {
      const o = document.createElement("option");
      o.value = h.trim();
      o.textContent = `${h.trim()}:00`;
      selHora.appendChild(o);
    });
  }
}


async function crearTurno() {
    const idPaciente = document.getElementById("select-paciente").value;
    const idDoctor = document.getElementById("select-medico").value;
    const fecha = document.getElementById("select-fecha").value;
    const hora = document.getElementById("select-hora").value;
    const estado = document.getElementById("select-estado").value;

    if (!idPaciente || !idDoctor || !fecha || !hora) {
        alert("Complete todos los campos antes de crear el turno.");
        return;
    }

    const nuevoTurno = {
        pacienteId: idPaciente,
        doctorId: idDoctor,
        fecha: fecha,
        hora: hora,
        estado: estado
    };

    try {
        const res = await fetch(API_TURNOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoTurno)
        });

        if (!res.ok) throw new Error("Error al crear turno");

        alert("Turno creado exitosamente 🎉");

    } catch (err) {
        console.error(err);
        alert("Error al crear turno");
    }
}



document.getElementById("btn-crear-turno").addEventListener("click", crearTurno);
document.getElementById("select-medico").addEventListener("change", cargarDiasYHorarios);
document.getElementById("select-especialidad").addEventListener("change", cargarDoctoresPorEspecialidad);
document.getElementById("btn-buscar-dni").addEventListener("click", buscarPaciente);
document.addEventListener("DOMContentLoaded", function () {
  validarRegistroCompleto();
  mostrarUsuariosAdmin();
  mostrarPacientes();
  crearMedico();
  mostrarMedicos();

  $("#medico-dias").datepicker({ dateFormat: "yy-mm-dd" });
});
