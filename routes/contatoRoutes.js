const express = require('express');
const router = express.Router();
const controller = require('../controllers/contatoController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

module.exports = router;
