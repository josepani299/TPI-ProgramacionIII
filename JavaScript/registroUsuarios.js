const API_USERS = 'https://6911e0a752a60f10c81fa459.mockapi.io/users'; 

// Endpoint de MockAPI para usuarios

const API_TURNOS = 'https://691b22ae2d8d78557571ac41.mockapi.io/appointments';

function validarRegistroCompleto() {
  const formulario = document.querySelector("#crear-usuario-form"); // ID del formulario
  const mensajeError = document.getElementById("mensaje-error");

  formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const email = document.getElementById("nuevo-email").value.trim();
    const clave = document.getElementById("nuevo-password").value.trim();
    const role = document.getElementById("nuevo-role").value;

    console.log("Nombre:", nombre);
    console.log("Email:", email);
    console.log("Clave:", clave);
    console.log("Rol:", role);

    if (!nombre || !email || !clave || !role) {
      mensajeError.textContent = "Todos los campos son obligatorios.";
      return;
    }

    // Crear objeto con los datos del usuario
    const nuevoUsuario = {
      name: nombre,
      email: email,
      password: clave,
      role: role
    };

    console.log("Objeto nuevoUsuario:", nuevoUsuario);

    try {
      // Enviar datos a MockAPI
      const response = await fetch(API_USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
      });

      console.log("Respuesta de la API:", response);
      console.log("Estado de la respuesta:", response.status);
      console.log("Texto de la respuesta:", response.statusText);

      if (response.ok) {
        mensajeError.textContent = "";
        alert("Usuario registrado con éxito!"); // Mensaje de éxito
        limpiarCampos(); // Limpiar los campos del formulario
      } else {
        mensajeError.textContent = "Error al crear la cuenta. Intenta nuevamente.";
        console.error("Error al crear usuario:", response.statusText);
      }
    } catch (error) {
      mensajeError.textContent = "Error de conexión. Intenta nuevamente más tarde.";
      console.error("Error de conexión:", error);
    }
  });

  function limpiarCampos() {
    document.getElementById("nuevo-nombre").value = "";
    document.getElementById("nuevo-email").value = "";
    document.getElementById("nuevo-password").value = "";
  }
}

async function mostrarUsuariosAdmin() {
  const usuariosContainer = document.getElementById("usuarios-container");
  usuariosContainer.innerHTML = "Listas de Administradores: "; // Limpiar el contenedor

  try {
    const response = await fetch(API_USERS);
    const usuarios = await response.json();

    // Filtrar usuarios con rol "ADMIN"
    const usuariosAdmin = usuarios.filter(usuario => usuario.role === "ADMIN");

    if (usuariosAdmin.length > 0) {
      const listaUsuarios = document.createElement("ul");

      usuariosAdmin.forEach(usuario => {
        const listItem = document.createElement("li");
        listItem.textContent = `Nombre: ${usuario.name}  ,
          Email: ${usuario.email}
         `; // Mostrar la información del usuario

        listaUsuarios.appendChild(listItem);
      });

      usuariosContainer.appendChild(listaUsuarios);
    } else {
      usuariosContainer.textContent = "No hay usuarios administradores registrados.";
    }

  } catch (error) {
    usuariosContainer.textContent = "Error al obtener la lista de usuarios.";
    console.error("Error al obtener usuarios:", error);
  }
}
async function mostrarPacientes() {
  const pacientesContainer = document.getElementById("pacientes-container");
  pacientesContainer.innerHTML = "Listas de Pacientes: "; // Limpiar el contenedor

  try {
    const response = await fetch(API_USERS);
    const usuarios = await response.json();

    // Filtrar usuarios con rol "USUARIO"
    const pacientes = usuarios.filter(usuario => usuario.role === "USUARIO");

    if (pacientes.length > 0) {
      const listaPacientes = document.createElement("ul");

      pacientes.forEach(paciente => {
        const listItem = document.createElement("li");
        listItem.textContent = `Nombre: ${paciente.name}  ,
          Email: ${paciente.email}
         `; // Mostrar la información del usuario

        listaPacientes.appendChild(listItem);
      });

      pacientesContainer.appendChild(listaPacientes);
    } else {
      pacientesContainer.textContent = "No hay pacientes registrados.";
    }

  } catch (error) {
    pacientesContainer.textContent = "Error al obtener la lista de pacientes.";
    console.error("Error al obtener pacientes:", error);
  }
}

const API_MEDICOS = 'https://6911e0a752a60f10c81fa459.mockapi.io/docts'; // Endpoint de MockAPI para médicos

async function crearMedico() {
    const formularioMedico = document.getElementById("crear-medico-form");
    const medicosContainer = document.getElementById("medicos-container");

    formularioMedico.addEventListener("submit", async function (e) {
        e.preventDefault();

        const nombre = document.getElementById("medico-nombre").value.trim();
        const especialidad = document.getElementById("medico-especialidad").value.trim();
        const horariosDisponibles = document.getElementById("medico-horarios").value.trim();

        // Get the selected dates from the datepicker
        const selectedDates = $("#medico-dias").datepicker("getDate");
        const formattedDates = selectedDates ? $.datepicker.formatDate('yy-mm-dd', selectedDates) : "";

        if (!nombre || !especialidad || !formattedDates || !horariosDisponibles) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const nuevoMedico = {
            name: nombre,
            especialidad: especialidad,
            diasDisponibles: formattedDates,
            horariosDisponibles: horariosDisponibles
        };

        try {
            const response = await fetch(API_MEDICOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoMedico)
            });

            if (response.ok) {
                alert("Médico creado con éxito!");
                formularioMedico.reset(); // Limpiar el formulario
                mostrarMedicos(); // Refresh the list of medicos
            } else {
                alert("Error al crear el médico.");
                console.error("Error al crear médico:", response.statusText);
            }
        } catch (error) {
            alert("Error de conexión. Intenta nuevamente más tarde.");
            console.error("Error de conexión:", error);
        }
    });
}

async function mostrarMedicos() {
    const medicosContainer = document.getElementById("medicos-container");
    medicosContainer.innerHTML = "Lista de Médicos: ";

    try {
        const response = await fetch(API_MEDICOS);
        const medicos = await response.json();

        if (medicos.length > 0) {
            const listaMedicos = document.createElement("ul");

            medicos.forEach(medico => {
                const listItem = document.createElement("li");
                listItem.textContent = `Nombre: ${medico.name}, Especialidad: ${medico.especialidad}, Días: ${medico.diasDisponibles}, Horarios: ${medico.horariosDisponibles}`;
                listaMedicos.appendChild(listItem);
            });

            medicosContainer.appendChild(listaMedicos);
        } else {
            medicosContainer.textContent = "No hay médicos registrados.";
        }
    } catch (error) {
        medicosContainer.textContent = "Error al obtener la lista de médicos.";
        console.error("Error al obtener médicos:", error);
    }
}

// esta funcion me busca un paciente de la lista de ususario teniendo en cuenta su dni

async function buscarPacientes() {
    try {
        // Obtener los datos de la API
        const response = await fetch(API_USERS);
        const usuarios = await response.json();
        
        // Obtener el DNI ingresado
        const dni = document.getElementById("buscar-dni").value.trim();
        
        // Validar que se ingresó un DNI
        if (!dni) {
            alert("Por favor ingrese un DNI");
            return null;
        }
        
        // Buscar el usuario que coincida
        const usuarioEncontrado = usuarios.find(u => 
            u.role === "USUARIO" && u.dni === dni
        );
        
        // Mostrar resultado
        if (usuarioEncontrado) {
            document.getElementById("paciente").value = usuarioEncontrado.name;
            alert("Paciente encontrado: " + usuarioEncontrado.name);
            return usuarioEncontrado;
        } else {
            document.getElementById("paciente").value = "";
            alert("No se encontró ningún paciente con ese DNI");
            return null;
        }
        
    } catch (error) {
        console.error("Error al buscar pacientes:", error);
        alert("Error al buscar. Intenta nuevamente.");
        return null;
    }
}
var botonBuscarPaciente = document.getElementById("btn-buscar-dni").addEventListener("click",buscarPacientes);
async function CrearTurno() {
  // utilizo la funcion para encontrar a el paciente que busco
  const paciente = buscarPacientes;

  
}



document.addEventListener('DOMContentLoaded', function () {
    validarRegistroCompleto();
    mostrarUsuariosAdmin();
    mostrarPacientes();
    crearMedico(); 
    mostrarMedicos(); 
    initializeAppointments(); /// 

    
    $("#medico-dias").datepicker({
        dateFormat: 'yy-mm-dd' 
    });
});