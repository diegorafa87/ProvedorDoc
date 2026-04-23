const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../db.json');

function lerClientes() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    console.log('[DEBUG] Lendo clientes de', dbPath, 'Conteúdo:', data);
    return JSON.parse(data);
  } catch (e) {
    console.log('[DEBUG] Erro ao ler clientes:', e);
    return [];
  }
}
function salvarClientes(clientes) {
  fs.writeFileSync(dbPath, JSON.stringify(clientes, null, 2));
  console.log('[DEBUG] Salvando clientes em', dbPath, 'Conteúdo:', JSON.stringify(clientes, null, 2));
}


const Cliente = require('../models/Cliente');
const { registrarLog } = require('./logController');

exports.cadastrarCliente = (req, res) => {
  const { razaoSocial, cnpj, email, telefone, consultoria } = req.body;
  if (!razaoSocial || !cnpj || !email || !telefone || !consultoria) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }
  const clientes = lerClientes();
  const novoCliente = new Cliente({ razaoSocial, cnpj, email, telefone, consultoria });
  clientes.push(novoCliente);
  salvarClientes(clientes);
  registrarLog('CADASTRAR_CLIENTE', cnpj, { razaoSocial, email, telefone, consultoria });
  res.status(201).json(novoCliente);
};

exports.listarClientes = (req, res) => {
  const clientes = lerClientes();
  console.log('[DEBUG] IDs disponíveis:', clientes.map(c => c.id));
  res.json(clientes);
};

exports.atualizarStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const clientes = lerClientes();
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  if (!['NOVO','ATIVO','CORRIGIR','SUSPENSO'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }
  cliente.status = status;
  salvarClientes(clientes);
  registrarLog('ATUALIZAR_STATUS', cliente.cnpj, { id, status });
  res.json(cliente);
};

exports.detalharCliente = (req, res) => {
  const { id } = req.params;
  const clientes = lerClientes();
  console.log('[DEBUG] Buscando cliente ID:', id, '| IDs disponíveis:', clientes.map(c => c.id));
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(cliente);
};

exports.excluirCliente = (req, res) => {
  const { id } = req.params;
  let clientes = lerClientes();
  const clienteIndex = clientes.findIndex(c => c.id === id);
  if (clienteIndex === -1) return res.status(404).json({ error: 'Cliente não encontrado' });
  clientes.splice(clienteIndex, 1);
  salvarClientes(clientes);
  registrarLog('EXCLUIR_CLIENTE', id, {});
  res.json({ success: true });
};

exports.editarCliente = (req, res) => {
  const { id } = req.params;
  const { razaoSocial, cnpj, email, telefone, consultoria } = req.body;
  let clientes = lerClientes();
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
  if (!razaoSocial || !cnpj || !email || !telefone || !consultoria) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }
  cliente.razaoSocial = razaoSocial;
  cliente.cnpj = cnpj;
  cliente.email = email;
  cliente.telefone = telefone;
  cliente.consultoria = consultoria;
  salvarClientes(clientes);
  registrarLog('EDITAR_CLIENTE', cnpj, { id, razaoSocial, email, telefone, consultoria });
  res.json(cliente);
};
