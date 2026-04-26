import API_URL from '../services/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const cores = {
  NOVO: '#1976d2',     // Azul
  ATIVO: '#388e3c',    // Verde
  CORRIGIR: '#fbc02d', // Amarelo
  SUSPENSO: '#d32f2f'  // Vermelho
};

const nomes = {
  NOVO: 'Novos',
  ATIVO: 'Ativos',
  CORRIGIR: 'Corrigir',
  SUSPENSO: 'Suspensos'
};

function agruparPorStatus(clientes) {
  return clientes.reduce((acc, cliente) => {
    acc[cliente.status] = acc[cliente.status] || [];
    acc[cliente.status].push(cliente);
    return acc;
  }, {});
}

function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const ListaClientes = ({ atualizar, consultoriaFiltro, pesquisa }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submenuAbertoId, setSubmenuAbertoId] = useState(null);

  // Carregar do localStorage ou usar padrão
  const getInitialStatusVisiveis = () => {
    const saved = localStorage.getItem('statusVisiveis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return { NOVO: true, ATIVO: true, CORRIGIR: true, SUSPENSO: true };
      }
    }
    return { NOVO: true, ATIVO: true, CORRIGIR: true, SUSPENSO: true };
  };
  const [statusVisiveis, setStatusVisiveis] = useState(getInitialStatusVisiveis);

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      const resp = await fetch(`${API_URL}/api/clientes`);
      const data = await resp.json();
      setClientes(data);
      setLoading(false);
    };
    fetchClientes();
    // eslint-disable-next-line
  }, [atualizar]);

  const handleStatus = async (id, status) => {
    await fetch(`${API_URL}/api/clientes/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setLoading(true);
    const resp = await fetch(`${API_URL}/api/clientes`);
    const data = await resp.json();
    setClientes(data);
    setLoading(false);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await fetch(`${API_URL}/api/clientes/${id}`, {
        method: 'DELETE'
      });
      setLoading(true);
      const resp = await fetch(`${API_URL}/api/clientes`);
      const data = await resp.json();
      setClientes(data);
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando clientes...</p>;

  // Filtrar por consultoria se filtro estiver ativo
  let clientesFiltrados = consultoriaFiltro
    ? clientes.filter(c => c.consultoria === consultoriaFiltro)
    : clientes;

  // Filtrar por pesquisa (CNPJ ou Razão Social)
  if (pesquisa && pesquisa.trim() !== '') {
    const termo = pesquisa.trim();
    const termoNumeros = termo.replace(/\D/g, '');
    const termoTexto = removerAcentos(termo.toLowerCase());
    clientesFiltrados = clientesFiltrados.filter(c => {
      const cnpjNumeros = (c.cnpj || '').replace(/\D/g, '');
      const razao = removerAcentos((c.razaoSocial || '').toLowerCase());
      return (termoNumeros && cnpjNumeros.includes(termoNumeros)) || (termoTexto && razao.includes(termoTexto));
    });
  }

  // Ordenar alfabeticamente por razão social dentro de cada status
  const agrupados = agruparPorStatus(clientesFiltrados);
  Object.keys(agrupados).forEach(status => {
    agrupados[status].sort((a, b) => {
      const razA = (a.razaoSocial || '').toLowerCase();
      const razB = (b.razaoSocial || '').toLowerCase();
      return razA.localeCompare(razB, 'pt-BR');
    });
  });

  const alternarStatus = (status) => {
    setStatusVisiveis(v => {
      const novo = { ...v, [status]: !v[status] };
      return novo;
    });
  };

  useEffect(() => {
    localStorage.setItem('statusVisiveis', JSON.stringify(statusVisiveis));
  }, [statusVisiveis]);

  return (
    <div>
      {['NOVO', 'ATIVO', 'CORRIGIR', 'SUSPENSO'].map(status => (
        <div key={status} style={{ marginBottom: '2rem' }}>
          <h3
            style={{
              color: cores[status],
              cursor: 'pointer',
              userSelect: 'none',
              display: 'inline',
            }}
            onClick={() => alternarStatus(status)}
            title={statusVisiveis[status] ? 'Clique para ocultar' : 'Clique para exibir'}
          >
            {nomes[status]}
          </h3>
          {statusVisiveis[status] && (
            <>
              {(agrupados[status] || []).length === 0 && <p style={{ color: '#888' }}>Nenhum cliente.</p>}
              {(agrupados[status] || []).map(cliente => (
                <div key={cliente.id} style={{ background: cores[status], color: '#fff', padding: '1rem', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{cliente.cnpj} - {cliente.razaoSocial}</strong><br />
                    <span>Consultoria: {cliente.consultoria}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', position: 'relative' }}>
                      <select value={cliente.status} onChange={e => {
                        if (e.target.value === 'EXCLUIR') {
                          handleExcluir(cliente.id);
                        } else {
                          handleStatus(cliente.id, e.target.value);
                        }
                      }} style={{ marginRight: '0.3rem', borderRadius: '4px', border: 'none', padding: '0.3rem 1rem', background: '#fff', color: cores[status], fontWeight: 'bold' }}>
                        <option value="NOVO">Novo</option>
                        <option value="ATIVO">Ativo</option>
                        <option value="CORRIGIR">Corrigir</option>
                        <option value="SUSPENSO">Suspenso</option>
                        <option value="EXCLUIR">Excluir</option>
                      </select>
                    </div>
                    <Link to={`/cliente/${cliente.id}`} style={{ background: 'none', color: '#fff', padding: '0.3rem 1rem', border: 'none', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ver detalhes">→</Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaClientes;
