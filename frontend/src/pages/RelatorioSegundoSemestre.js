
import React from 'react';
import TabelaRelatorioEconomico from '../components/TabelaRelatorioEconomico';
import MenuLateral from '../components/MenuLateral';

const anoAtual = new Date().getFullYear();
const dataLinhas = [
  `30/09/${anoAtual}`,
  `30/09/${anoAtual}`,
  `30/09/${anoAtual}`,
  `31/12/${anoAtual}`,
  `31/12/${anoAtual}`,
  `31/12/${anoAtual}`,
];

export default function RelatorioSegundoSemestre() {
  let razaoSocial = '';
  let cnpj = '';
  try {
    const salvo = localStorage.getItem('clienteSelecionado');
    if (salvo) {
      const obj = JSON.parse(salvo);
      if (obj.razaoSocial) razaoSocial = obj.razaoSocial;
      if (obj.cnpj) cnpj = obj.cnpj;
    }
  } catch {}
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
      <div style={{marginLeft:210, width:'100%'}}>
        <TabelaRelatorioEconomico datasPadrao={dataLinhas} razaoSocial={razaoSocial} semestre="SEM2" ano={anoAtual} />
      </div>
    </div>
  );
}
