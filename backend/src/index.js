// Entry point do backend
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const clienteRoutes = require('./routes/clienteRoutes');
const logRoutes = require('./routes/logRoutes');
const acaoRoutes = require('./routes/acaoRoutes');
const contratoRoutes = require('./routes/contratoRoutes');

app.use('/api', clienteRoutes);
app.use('/api', logRoutes);
app.use('/api', acaoRoutes);
app.use('/api', contratoRoutes);

// Porta padrão
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
