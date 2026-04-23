import React from 'react';
import MenuLateral from '../components/MenuLateral';
import EstacoesInfra from '../components/EstacoesInfra';

export default function EstacoesPage({ clienteInfo }) {
  return (
    <div style={{display:'flex'}}>
      <MenuLateral 
        voltarLink={<a href="/" style={{textDecoration:'none',color:'#1976d2',fontWeight:'bold',fontSize:'1.1rem',display:'block',marginBottom:'1.5rem',marginTop:'1rem'}}>&larr; Voltar</a>} 
        clienteInfo={clienteInfo}
      />
      <div style={{marginLeft:200, flex:1, minHeight:'100vh', background:'#f8f9fb', padding:'2rem'}}>
        <div style={{marginTop:'40px'}}>
          <EstacoesInfra />
        </div>
      </div>
    </div>
  );
}
