import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MenuLateral from '../components/MenuLateral';
import AcompanhamentoInfra from '../components/AcompanhamentoInfra';

export default function PaginaAcompanhamentoInfra(props) {
  const [cliente, setCliente] = useState({ razaoSocial: '', cnpj: '' });
  useEffect(() => {
    try {
      const salvo = localStorage.getItem('clienteSelecionado');
      if (salvo) {
        const obj = JSON.parse(salvo);
        setCliente({
          razaoSocial: obj.razaoSocial || '',
          cnpj: obj.cnpj || ''
        });
      }
    } catch {}
  }, []);
  return (
    <div style={{ display: 'flex' }}>
      <MenuLateral
        voltarLink={<Link to="/" style={{textDecoration:'none',color:'#1976d2',fontWeight:'bold',fontSize:'1.1rem',display:'block',marginBottom:'1.5rem',marginTop:'1rem'}}>&larr; Voltar</Link>}
        clienteInfo={
          <div style={{marginBottom: 16, textAlign: 'center'}}>
            <div style={{fontWeight:700, fontSize: '1.1rem', color: '#fff'}}>{cliente.razaoSocial}</div>
            <div style={{fontWeight:500, fontSize: '0.95rem', color: '#fff'}}>CNPJ: {cliente.cnpj}</div>
          </div>
        }
      />
      <div style={{maxWidth:'1100px',margin:'2rem auto',marginLeft:200,flex:1}}>
        <AcompanhamentoInfra {...props} razaoSocial={cliente.razaoSocial} cnpj={cliente.cnpj} />
      </div>
    </div>
  );
}
