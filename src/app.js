require('dotenv').config();
const express = require ('express');
const app = express ();
const cors = require('cors');
const setoresRoutes = require ('./routes/setores-routes');
const usuarioRoutes = require ('./routes/usuario-routes');

app.use(cors());

app.use(express.json());
app.use('/', setoresRoutes);
app.use('/', usuarioRoutes);

module.exports = app;