//controller/controller.js
const fs = require('fs');
const dataPath = './data/data.json'; // Ruta del archivo JSON
const Joi = require('joi');

// Definir el esquema de validación para una reserva
const reservaSchema = Joi.object({
  id: Joi.number(),
  hotel: Joi.string().required(),
  fecha_inicio: Joi.date().required(),
  fecha_fin: Joi.date().required(),
  tipo_habitacion: Joi.string().required(),
  estado: Joi.string().required(),
  num_huespedes: Joi.number().integer().min(1).required(), 
});

 
// Función para leer el archivo JSON con manejo de errores
const leerDatos = () => {
  try {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData) || { reservas: [] };
  } catch (error) {
    console.error('Error leyendo el archivo:', error);
    return { reservas: [] };
  }
};

// Función para escribir en el archivo JSON con manejo de errores
const guardarDatos = (data) => {
    try {
      const stringifyData = JSON.stringify(data, null, 2);
      fs.writeFileSync(dataPath, stringifyData);
    } catch (error) {
      console.error('Error escribiendo en el archivo:', error);
    }
  };

// Agregar un contador global para las reservas
let contadorReservas = leerDatos().contadorReservas || 0;

// Crear una nueva reserva
exports.crearReserva = (req, res) => {
  console.log(req.body);
  const { error } = reservaSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: 'Datos inválidos', details: error.details });
  }
  let data = leerDatos(); 
  contadorReservas++; // Incrementar el contador para generar un nuevo ID

  const nuevaReserva = { id: contadorReservas, ...req.body };
  data.reservas.push(nuevaReserva);
  guardarDatos({ ...data, contadorReservas }); // Guardar el contador actualizado
  res.send({ message: 'Reserva Creada', id: nuevaReserva.id });
};


// Listar y filtrar reservas
exports.listarYFiltrarReservas = (req, res) => {

  let data = leerDatos(); 
  let reservasFiltradas = data.reservas;

  if (req.query.fecha_inicio && req.query.fecha_fin) {
    const fechaInicio = Date.parse(req.query.fecha_inicio);
    const fechaFin = Date.parse(req.query.fecha_fin);
    reservasFiltradas = reservasFiltradas.filter(reserva => {
      const fechaReserva = Date.parse(reserva.fecha_inicio);
      return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
    });
  }

  if (req.query.hotel) {
    reservasFiltradas = reservasFiltradas.filter(reserva => reserva.hotel === req.query.hotel);
  }

  if (req.query.id) {
    reservasFiltradas = reservasFiltradas.filter(reserva => reserva.id == req.query.id);
  }

  if (req.query.tipo_habitacion) {
    reservasFiltradas = reservasFiltradas.filter(reserva => reserva.tipo_habitacion === req.query.tipo_habitacion);
}

  if (req.query.estado) {
    reservasFiltradas = reservasFiltradas.filter(reserva => reserva.estado === req.query.estado);
  }

  if (req.query.num_huespedes) {
    reservasFiltradas = reservasFiltradas.filter(reserva => reserva.num_huespedes >= +req.query.num_huespedes);
  }

  res.send(reservasFiltradas);
};


// Obtener reserva
exports.obtenerReservaPorId = (req, res) => {
  console.log(req.body);
  let data = leerDatos(); 
  const id = Number(req.params.id); // Convertir a número
  const reserva = data.reservas.find(u => u.id === id);
  res.send(reserva || { message: 'Reserva No Encontrada' });
};

// Actualizar reserva
exports.actualizarReserva = (req, res) => {
  console.log(req.body);
  let data = leerDatos();
  const id = Number(req.params.id);
  const index = data.reservas.findIndex(u => Number(u.id) === id); // Convertir u.id a número
  if (index !== -1) {
    // Solo actualizar los campos que se incluyen en req.body
    for (let field in req.body) {
      data.reservas[index][field] = req.body[field];
    }
    guardarDatos(data);
    res.send({ message: 'Reserva Actualizada' });
  } else {
    res.send({ message: 'Reserva No Encontrada' });
  }
};


// Eliminar reserva 
exports.eliminarReserva = (req, res) => {
  const id = Number(req.params.id); // Convertir a número
  let data = leerDatos();
  data.reservas = data.reservas.filter(u => Number(u.id) !== id); // Convertir u.id a número
  guardarDatos(data);
  res.send({ message: 'Reserva Eliminada' });
};











