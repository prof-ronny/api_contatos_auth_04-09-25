const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

// 1) Conexão com o Mongo: faça cedo para detectar erro já no boot
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// 2) Middlewares globais
app.use(cors());                   // em produção: configure a origem permitida
app.use(express.json({ limit: '1mb' })); // limita payload JSON (imagens não passam aqui, só multipart)

// 3) Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/contatos', contatoRoutes);
app.use('/upload', uploadRoutes);

module.exports = app;
