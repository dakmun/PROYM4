//server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
const routes = require('./routes/routes');
app.use('/', routes);

// Servir archivos estáticos (para nuestro index.html)
app.use(express.static(__dirname + '/static'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
 
