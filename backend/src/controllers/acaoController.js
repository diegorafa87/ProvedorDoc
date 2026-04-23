const { registrarLog } = require('./logController');

exports.registrarAcao = (req, res) => {
  const { acao, usuario, detalhes } = req.body;
  if (!acao) return res.status(400).json({ error: 'Ação obrigatória' });
  registrarLog(acao, usuario, detalhes);
  res.json({ success: true });
};
