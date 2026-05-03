const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { uploadToR2 } = require('../../utils/r2Upload');

// Endpoint para upload de PDF do acompanhamento SCM
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
    const { buffer, mimetype } = req.file;
    // Permite que o frontend envie o nome do arquivo desejado via campo 'key' no FormData
    const key = req.body.key || `scm/${Date.now()}_${req.file.originalname}`;
    const url = await uploadToR2(buffer, key, mimetype);
    // Aqui você pode salvar a URL no banco, se desejar
    res.json({ success: true, url });
  } catch (e) {
    res.status(500).json({ error: 'Falha ao enviar PDF para o R2', details: e.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { uploadToR2 } = require('../../utils/r2Upload');

// Endpoint para upload de PDF do acompanhamento SCM
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
    const { buffer, mimetype } = req.file;
    // Permite que o frontend envie o nome do arquivo desejado via campo 'key' no FormData
    const key = req.body.key || `scm/${Date.now()}_${req.file.originalname}`;
    const url = await uploadToR2(buffer, key, mimetype);
    // Aqui você pode salvar a URL no banco, se desejar
    res.json({ success: true, url });
  } catch (e) {
    res.status(500).json({ error: 'Falha ao enviar PDF para o R2', details: e.message });
  }
});

module.exports = router;
