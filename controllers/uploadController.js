const { GridFSBucket, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Validação simples de MIME permitido (imagem)
const TIPOS_PERMITIDOS = new Set(['image/jpeg', 'image/png', 'image/webp']);

exports.enviar = async (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  if (!TIPOS_PERMITIDOS.has(req.file.mimetype)) {
    return res.status(415).json({ erro: 'Tipo de arquivo não suportado' });
  }

  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'imagens' });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { usuarioId: req.usuarioId }
    });

    uploadStream.end(req.file.buffer, () => {
      res.status(201).json({
        fileId: uploadStream.id.toString(),
        filename: uploadStream.filename,
        contentType: req.file.mimetype
      });
    });
  } catch (err) {
    res.status(500).json({ erro: 'Falha no upload', detalhe: err.message });
  }
};

exports.baixar = async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'imagens' });
    const fileId = new ObjectId(req.params.id);

    const files = await mongoose.connection.db.collection('imagens.files').find({ _id: fileId }).toArray();
    if (!files.length) return res.status(404).send('Arquivo não encontrado');

    res.setHeader('Content-Type', files[0].contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${files[0].filename}"`);

    bucket.openDownloadStream(fileId)
      .on('error', () => res.status(404).end())
      .pipe(res);
  } catch (err) {
    res.status(400).send('ID inválido');
  }
};
