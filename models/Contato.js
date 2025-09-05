const mongoose = require('mongoose');

const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: String,
  telefone: String,
  endereco: String,
  fotoId: { type: mongoose.Schema.Types.ObjectId }, // referência ao arquivo no GridFS
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Contato', contatoSchema);
