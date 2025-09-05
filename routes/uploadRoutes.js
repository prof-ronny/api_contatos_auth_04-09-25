const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/uploadController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, upload.single('foto'), controller.enviar);
router.get('/:id', controller.baixar);

module.exports = router;
