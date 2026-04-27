const acompanhamentoPostesRoutes = require('./routes/acompanhamentoPostesRoutes');

// Entry point do backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// Rotas
const clienteRoutes = require('./routes/clienteRoutes');
const logRoutes = require('./routes/logRoutes');
const acaoRoutes = require('./routes/acaoRoutes');

const contratoRoutes = require('./routes/contratoRoutes');
const acompanhamentoSCMRoutes = require('./routes/acompanhamentoSCMRoutes');


app.use('/api', clienteRoutes);
app.use('/api', logRoutes);
app.use('/api', acaoRoutes);
app.use('/api', contratoRoutes);
app.use('/api/acompanhamento-scm', acompanhamentoSCMRoutes);
app.use('/api/acompanhamento-postes', acompanhamentoPostesRoutes);

// Rota raiz amigável
app.get('/', (req, res) => {
  res.send('API do ProvedorDoc está online!');
});


// Servir o build do React em produção
const path = require('path');
const buildPath = path.resolve(__dirname, '../../frontend/build');
app.use(express.static(buildPath));

// Rota coringa para SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Porta padrão
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
