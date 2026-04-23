const fs = require('fs');
const path = require('path');
const dbLogPath = path.join(__dirname, '../db_logs.json');

function lerLogs() {
  try {
    const data = fs.readFileSync(dbLogPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}
function salvarLogs(logs) {
  fs.writeFileSync(dbLogPath, JSON.stringify(logs, null, 2));
}

exports.registrarLog = (acao, usuario, detalhes) => {
  const logs = lerLogs();
  logs.unshift({
    acao,
    usuario: usuario || 'sistema',
    detalhes,
    data: new Date().toISOString()
  });
  salvarLogs(logs.slice(0, 100)); // Limita a 100 logs
};

exports.listarLogs = (req, res) => {
  res.json(lerLogs());
};
