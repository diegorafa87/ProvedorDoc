import React from 'react';
import AcompanhamentoTVpA from '../components/AcompanhamentoTVpA';
import MenuLateral from '../components/MenuLateral';
import { useLocation } from 'react-router-dom';

const PaginaAcompanhamentoTVpA = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  let razaoSocial = params.get('razaoSocial') || '';
  let cnpj = params.get('cnpj') || '';
  // fallback: tenta pegar do localStorage
  if (!razaoSocial || !cnpj) {
    try {
      const salvo = localStorage.getItem('clienteSelecionado');
      if (salvo) {
        const obj = JSON.parse(salvo);
        razaoSocial = razaoSocial || obj.razaoSocial;
        cnpj = cnpj || obj.cnpj;
      }
    } catch {}
  }
  return (
    <div style={{display:'flex'}}>
      <MenuLateral
        voltarLink={<a href="/" style={{textDecoration:'none',color:'#1976d2',fontWeight:'bold',fontSize:'1.1rem',display:'block',marginBottom:'1.5rem',marginTop:'1rem'}}>&larr; Voltar</a>}
        clienteInfo={razaoSocial && cnpj ? (
          <>
            <div style={{fontWeight:700, fontSize: '1.1rem', color: '#fff'}}>{razaoSocial}</div>
            <div style={{fontWeight:500, fontSize: '0.95rem', color: '#fff'}}>CNPJ: {cnpj}</div>
          </>
        ) : null}
      />
      <div style={{marginLeft:200, flex:1, minHeight:'100vh', background:'#f8f9fb', padding:'2rem'}}>
        <div style={{marginTop:'40px'}}>
          <AcompanhamentoTVpA razaoSocial={razaoSocial} cnpj={cnpj} />
        </div>
      </div>
    </div>
  );
};

export default PaginaAcompanhamentoTVpA;