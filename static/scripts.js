const reservaForm = document.getElementById('reservacionForm');  
const buscarBtn = document.getElementById('buscarBtn');

// Función que carga la lista de reservas y manejo de inputs dinamicos
const cargarInterfaz = () => {
  document.addEventListener('DOMContentLoaded', () => {

    cargarListaReservas();
    manejoInputs();
  });
};
cargarInterfaz();



// Enviar una solicitud POST al servidor para crear una nueva reserva
const nuevaReserva = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const response = await fetch('/reservas', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    });
  
  const data = await response.json();  
  const datosReserva = Object.fromEntries(formData);

  // Crear un modal para mostrar el detalle de la reserva craeada
  const modal = document.createElement('div');
   modal.id = 'reservaModal';
   modal.className = 'modal';   

  // Crear un background para el efecto de vidrio
  const modalBackground = document.createElement('div');
  modalBackground.id = 'modalBackground';
  modalBackground.className = 'modal-background';

  // Crear un header para el modal que contiene el ID de la reserva
   const modalHeader = document.createElement('div');
   modalHeader.className = 'modal-h1';
   modalHeader.innerHTML = `<h1>Reserva Creada <br><strong>ID:</strong> ${data.id}</h1>`;
  
   // Crear un body para el modal que contiene los datos de la reserva
   const modalBody = document.createElement('div');
   modalBody.className = 'modal-body';

  // Crear un div con los datos del formulario de reserva
  const datosForm = document.createElement('div');
  datosForm.className = 'datosForm';
  datosForm.innerHTML = `
  <p><strong>Hotel</strong>: ${datosReserva.hotel}</p>
  <p><strong>Fecha Inicio</strong>: ${datosReserva.fecha_inicio}</p>
  <p><strong>Fecha Fin</strong>: ${datosReserva.fecha_fin}</p>
  <p><strong>Tipo de Habitacion</strong>: ${datosReserva.tipo_habitacion}</p>
  <p><strong>Estado</strong>: ${datosReserva.estado}</p>
  <p><strong>Numero de Huespedes</strong>: ${datosReserva.num_huespedes}</p>
  `; 
  modalBody.appendChild(datosForm);

  // Crear un footer que contiene un botón para cerrar el modal
   const modalFooter = document.createElement('div');
   modalFooter.className = 'modal-footer';

   // Crear un botón para cerrar el modal 
   const closeButton = document.createElement('button');
   closeButton.textContent = 'Cerrar';
   closeButton.onclick = function() {
     document.getElementById('modalBackground').remove();
   };

  //Armar el modal
   modalFooter.appendChild(closeButton);
   modal.appendChild(modalHeader);
   modal.appendChild(modalBody);
   modal.appendChild(modalFooter);
   modalBackground.appendChild(modal);  
   document.body.appendChild(modalBackground);
  
   //Mostrar mensaje del servidor en consola
   console.log(data.message);

    // Actualizar la lista de reservas para incluir la nueva reserva
   cargarListaReservas();
  };
  
// Manejar el evento submit del formulario de reserva
reservaForm.addEventListener('submit', nuevaReserva) ;

// Función para cargar y mostrar todos las reservas
const cargarListaReservas = async () => {
  try {
    const response = await fetch('/reservas'); 
    if (!response.ok) {
      throw new Error('Error al cargar los datos de los reservas');
    }
    const reservas = await response.json();
    console.log(reservas)
    if (!reservas) {
      throw new Error('No se encontraron reservas en la respuesta');
    }

    const listaReservas = document.getElementById('listaReservas');
    listaReservas.innerHTML = '';
    reservas.forEach(reserva => {
      const reservaDiv = document.createElement('div');  
      reservaDiv.innerHTML = `
        <p><strong>ID:</strong> ${reserva.id}</p>
        <p><strong>Hotel:</strong> ${reserva.hotel}</p>
        <p><strong>Fecha Llegada:</strong> ${reserva.fecha_inicio}</p>
        <p><strong>Fecha Salida:</strong> ${reserva.fecha_fin}</p>
        <p><strong>Tipo de Habitacion:</strong> ${reserva.tipo_habitacion}</p>
        <p><strong>Estado:</strong> ${reserva.estado}</p> 
        <p><strong>Numero de Huespedes:</strong> ${reserva.num_huespedes}</p> 
      `;
      
      const wrapperRes = document.createElement('div');
      wrapperRes.className = 'wrapperRes';
  
      const groupBtn = document.createElement('div');
      groupBtn.className = 'groupBtn';
  
      const editarBtn = document.createElement('button');
      editarBtn.textContent = 'Editar';
      editarBtn.id = 'editarBtn';
      editarBtn.className = 'editarBtn';
      editarBtn.addEventListener('click', () => editarReserva(reserva.id));
  
      const eliminarBtn = document.createElement('button');
      eliminarBtn.textContent = 'Eliminar';
      eliminarBtn.id = 'eliminarBtn';
      eliminarBtn.className = 'eliminarBtn';
      eliminarBtn.addEventListener('click', () => eliminarReserva(reserva.id));  
  
      groupBtn.appendChild(editarBtn);
      groupBtn.appendChild(eliminarBtn);
      wrapperRes.appendChild(reservaDiv);
      wrapperRes.appendChild(groupBtn);
      listaReservas.appendChild(wrapperRes);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

//Funcion para manejo de inputs dinamicos
const manejoInputs = () => {
document.getElementById('menu-principal').addEventListener('change', function() {
  let inputs = document.querySelectorAll('.input-dinamico');
  inputs.forEach(function(input) {
    input.style.display = 'none';
  });

  let opcionSeleccionada = this.value;
  if(opcionSeleccionada) {
    if(opcionSeleccionada === 'rango_fecha') {
      document.getElementById('contenedor-rango_fecha').style.display = '';
    } 
    if(opcionSeleccionada === 'num_huespedes') {
      document.getElementById('contenedor-num_huespedes').style.display = '';   
    } else {
      let menuSeleccion = document.getElementById('menu-' + opcionSeleccionada);
      if(menuSeleccion) {
        menuSeleccion.style.display = 'block';
      } if (opcionSeleccionada === 'id') {
        document.getElementById('input-id').style.display = 'block';
      } 
    }
  } 
});
}

const buscarReservas = async (event) => {
  if (event) event.preventDefault();
  const menu = document.getElementById('menu-principal');
  const filtro = menu.value;
  let url = '/reservas';
  const response = await fetch(url);

  const data = await response.json();
  let resultados = [];
  let valor; 

  if (filtro === 'rango_fecha') {
    const fechaInicio = document.getElementById('input-fecha_inicio').value;
    const fechaFin = document.getElementById('input-fecha_fin').value;
    url += `?fecha_inicio=${fechaInicio}&&fecha_fin=${fechaFin}`;

    resultados = data.filter(reserva => {
      const fechaReserva = Date.parse(reserva.fecha_inicio);
      return fechaReserva >= Date.parse(fechaInicio) && fechaReserva <= Date.parse(fechaFin);
    });

    if (resultados.length === 0) {
alert('No se encontraron reservas en el rango seleccionado');
    }
  }

  if (filtro === 'num_huespedes') {
   let valorMin = parseInt(document.getElementById('num_huespedes_min').value);
    let valorMax = parseInt(document.getElementById('num_huespedes_max').value);
    url += `?num_huespedes=${valorMin}&&num_huespedes=${valorMax}`;
    resultados = data.filter(reserva => {
      return reserva.num_huespedes >= valorMin && reserva.num_huespedes <= valorMax;
    });

    if (resultados.length === 0) {
      alert('No se encontraron reservas en el rango seleccionado');
    }
   
  }


  else {
    if (filtro === 'hotel') {
      valor = document.getElementById('menu-hotel').value;
      resultados = data.filter(reserva => reserva[filtro] == valor );
    }
    else if (filtro === 'tipo_habitacion') {
      valor = document.getElementById('menu-tipo_habitacion').value;
      resultados = data.filter(reserva => reserva[filtro] == valor );
    }
    else if (filtro === 'estado') {
      valor = document.getElementById('menu-estado').value;
      resultados = data.filter(reserva => reserva[filtro] == valor );
    }
    else if (filtro === 'id') {
      valor = parseInt(document.getElementById('input-' + filtro).value);
      resultados = data.filter(reserva => reserva[filtro] == valor );

      if (resultados.length === 0) {
        alert('No se encontraron reservas con el ID seleccionado');
      }
    }

    url += `?${filtro}=${valor}`;

  }

  

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al cargar los datos de las reservas');
    }

    mostrarResultadosBusqueda(resultados, filtro, valor); 
  }
  catch (error) {
    console.error('Error:', error);
  }
}
buscarBtn.addEventListener('click', buscarReservas);

const mostrarResultadosBusqueda = (resultados, filtro, valorBusqueda) => {
  const resultadosBusqueda = document.getElementById('resultadosBusqueda');
  resultadosBusqueda.innerHTML = ''; 

  resultados.forEach(reserva => {
    const reservaDiv = document.createElement('div'); 
    reservaDiv.className = 'reservaDiv'; 

    let valorFiltro = reserva[filtro];
  if (valorFiltro) {
    valorFiltro = `<span style="color: #d9ff00;">${valorFiltro}</span>`;
  }

  reservaDiv.innerHTML = `
  <p><strong>ID:</strong> ${reserva.id}</p>
  <p><strong>Hotel:</strong> ${reserva.hotel === valorBusqueda ? valorFiltro : reserva.hotel}</p>   
  <p><strong>Fecha Llegada:</strong> ${reserva.fecha_inicio}</p>
  <p><strong>Fecha Salida:</strong> ${reserva.fecha_fin}</p>
  <p><strong>Tipo de Habitacion:</strong> ${reserva.tipo_habitacion === valorBusqueda ? valorFiltro : reserva.tipo_habitacion}</p>
  <p><strong>Estado:</strong> ${reserva.estado === valorBusqueda ? valorFiltro : reserva.estado}</p>
  <p><strong>Numero de Huespedes:</strong> ${reserva.num_huespedes}</p>
`;



    const wrapperRes = document.createElement('div');
    wrapperRes.className = 'wrapperRes';

    const groupBtn = document.createElement('div');
    groupBtn.className = 'groupBtn';

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.id = 'editarBtn';
    editarBtn.className = 'editarBtn';
    editarBtn.addEventListener('click', () => editarReserva(reserva.id));

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.id = 'eliminarBtn';
    eliminarBtn.className = 'eliminarBtn';
    eliminarBtn.addEventListener('click', () => eliminarReserva(reserva.id));  

    groupBtn.appendChild(editarBtn);
    groupBtn.appendChild(eliminarBtn);
    wrapperRes.appendChild(reservaDiv);
    wrapperRes.appendChild(groupBtn);
    resultadosBusqueda.appendChild(wrapperRes);
 
  });
}

const editarReserva = async (id) => {
  if (!id) {
    console.error('Nombre de reserva no proporcionado');
    return;
  }

  //Enviar solicitud GET al servidor para obtener los datos de la reserva
  const response = await fetch(`/reservas/${id}`);

  if (!response.ok) {
    console.error('No se pudo obtener la reserva:', response.statusText);
    return;
  }

  let reserva;
  try {
    reserva = await response.json();
  } catch (error) {
    console.error('La respuesta no es JSON:', error);
    return;
  }

  // Crear un formulario de edición y rellenarlo con los datos del reserva
  const form = document.createElement('form');
  form.id = 'editarForm';
  form.className = 'editarForm';
  form.innerHTML = `
    <h1>Reserva ID: ${reserva.id}</h1>

    <label for="hotel">Hotel:</label>
    <select name="hotel" id="hotel" required>
      <option value="${reserva.hotel}">${reserva.hotel}</option>
      <option value="Hotel Primavera">Hotel Primavera</option>
      <option value="Hotel Verano">Hotel Verano</option>
      <option value="Hotel Invierno">Hotel Invierno</option>
      <option value="Hotel Otono">Hotel Otoño</option>
    </select> 

    <label for="fecha_inicio">Fecha Inicio:</label>
    <input type="date" name="fecha_inicio" value="${reserva.fecha_inicio}" required>

    <label for="fecha_fin">Fecha Fin:</label>
    <input type="date" name="fecha_fin" value="${reserva.fecha_fin}" required>

    <label for="tipo_habitacion">Tipo de Habitacion:</label>
    <select name="tipo_habitacion" id="tipo_habitacion" required>
      <option value="${reserva.tipo_habitacion}">${reserva.tipo_habitacion}</option>
      <option value="Simple">Simple</option>
      <option value="Doble">Doble</option>
      <option value="Suite">Suite</option>
    </select>

    <label for="estado">Estado:</label>
    <select name="estado" id="estado" required>
      <option value="${reserva.estado}">${reserva.estado}</option>
      <option value="Reservado">Reservado</option>
      <option value="Pendiente">Pendiente</option>
      <option value="Confirmado">Confirmado</option>
    </select>

    <label for="num_huespedes">Numero de Huespedes:</label>
    <input type="number" name="num_huespedes" value="${reserva.num_huespedes}" required>

    <button type="submit" id="actualizarBtn">Actualizar</button>
    <button type="button" id="cerrarModalBtn">Cerrar</button>

  `;

  // Cerrar el modal de edicion al hacer clic en el botón de cerrar
  form.querySelector('#cerrarModalBtn').addEventListener('click', cerrarModal);

  // Función para cerrar el modal de edición
  function cerrarModal() {
    document.getElementById('modal').remove();
  }

  // Enviar una solicitud PUT al servidor para actualizar la reserva
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const actualizacion = await fetch(`/reservas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' }
    });
    const resultado = await actualizacion.json();
    console.log(resultado.message); // Mensaje del servidor
    cerrarModal();
    cargarListaReservas(); // Actualizar la lista de reservas
    buscarReservas(); // Actualizar la lista en busqueda
    
  });

  // Crear y mostrar el modal de edicion
  const editModal = document.createElement('div');
  editModal.id = 'modal';
  editModal.className = 'editModal';

  const containerEditModal = document.createElement('div');
  containerEditModal.className = 'containerEditModal';

  editModal.appendChild(form);
  containerEditModal.appendChild(editModal);
  document.body.appendChild(containerEditModal);
}


//Funcion que envia una solicitud DELETE al servidor para eliminar una reserva
const eliminarReserva = async (id) => {
  // Confirmar eliminación
  if (!confirm(`¿Estás seguro de que deseas eliminar la reserva ${id}?`)) {
    return;
  }

  let eliminacion; 

  try {
    eliminacion = await fetch(`/reservas/${id}`, {
      method: 'DELETE'
    });
    console.log(eliminacion);
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
  }

  if (eliminacion && eliminacion.headers.get('Content-Type').includes('application/json')) {
    const resultado = await eliminacion.json();
    console.log(resultado.message); // Mensaje del servidor  

  }
      // Actualizar la lista de reservas
      cargarListaReservas();
      // Actualizar la lista en busqueda
      buscarReservas();
}









