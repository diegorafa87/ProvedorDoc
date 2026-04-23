
import React from 'react';
import CadastroTVpA from '../components/CadastroTVpA';
import { useLocation } from 'react-router-dom';


const NovoRelatorioTVpA = () => {
	const location = useLocation();
	let cnpj = '';
	// Prioriza localStorage
	try {
		const salvo = localStorage.getItem('clienteSelecionado');
		if (salvo) {
			const obj = JSON.parse(salvo);
			cnpj = obj.cnpj || '';
		}
	} catch {}
	// Se não houver no localStorage, tenta pegar da URL
	if (!cnpj) {
		const params = new URLSearchParams(location.search);
		cnpj = params.get('cnpj') || '';
	}
	return <CadastroTVpA cnpj={cnpj} />;
};

export default NovoRelatorioTVpA;
