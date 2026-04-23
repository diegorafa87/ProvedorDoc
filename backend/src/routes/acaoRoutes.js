const express = require('express');
const router = express.Router();
const acaoController = require('../controllers/acaoController');

router.post('/acao', acaoController.registrarAcao);

module.exports = router;
