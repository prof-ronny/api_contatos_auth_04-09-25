const Contato = require('../models/Contato');

exports.criar = async (req, res) => {
  const { nome, email, telefone, endereco, fotoId } = req.body;
  try {
    const contato = new Contato({ nome, email, telefone, endereco, fotoId, usuarioId: req.usuarioId });
    await contato.save();
    res.status(201).json({ mensagem: 'Contato criado', contato });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar', detalhe: err.message });
  }
};

exports.listar = async (req, res) => {
  const contatos = await Contato.find({ usuarioId: req.usuarioId }).lean();
  res.json(contatos);
};

exports.buscarPorId = async (req, res) => {
  const contato = await Contato.findOne({ _id: req.params.id, usuarioId: req.usuarioId }).lean();
  if (!contato) return res.status(404).json({ mensagem: 'Contato não encontrado' });
  res.json(contato);
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  const atualizado = await Contato.findOneAndUpdate(
    { _id: id, usuarioId: req.usuarioId },
    req.body,
    { new: true }
  ).lean();
  if (!atualizado) return res.status(404).json({ mensagem: 'Contato não encontrado' });
  res.json(atualizado);
};

exports.deletar = async (req, res) => {
  const excluido = await Contato.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuarioId });
  if (!excluido) return res.status(404).json({ mensagem: 'Contato não encontrado' });
  res.json({ mensagem: 'Contato deletado' });
};
