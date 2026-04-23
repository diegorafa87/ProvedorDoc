// Utilitário para extrair campos de contrato de postes (PDF)
// Dependência: pdf-parse
const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extrairCamposContratoPostes(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  const texto = data.text;
  // Regex para todos os campos solicitados
  const campos = {
    numeroHomologacao: (texto.match(/(Número de homologação|Número do processo de homologação).*?(\d{6,}\/\d{4})/i) || [])[2] || '',
    cnpjDetentoraInfra: (texto.match(/CNPJ da detentora.*?([\d\.\/-]{14,18})/i) || [])[1] || (texto.match(/CNPJ da distribuidora.*?([\d\.\/-]{14,18})/i) || [])[1] || '',
    coDescritivoContratoInfra: (texto.match(/Descritivo do contrato.*?(\S+)/i) || [])[1] || (texto.match(/Contrato nº\s*([\w\d\/-]+)/i) || [])[1] || '',
    dataAssinatura: (texto.match(/Data de assinatura.*?(\d{2}\/\d{2}\/\d{4})/i) || [])[1] || '',
    dataValidade: (texto.match(/Data de validade.*?(\d{2}\/\d{2}\/\d{4})/i) || [])[1] || '',
    quantidadePontos: (texto.match(/Quantidade de pontos.*?(\d+)/i) || [])[1] || (texto.match(/Quantidade de Postes:\s*(\d+)/i) || [])[1] || '',
    valorPorPonto: (texto.match(/Valor por ponto.*?R\$\s*([\d\.,]+)/i) || [])[1] || (texto.match(/Valor:\s*R\$\s*([\d\.,]+)/i) || [])[1] || '',
    indiceReajuste: (texto.match(/Índice de reajuste.*?(IGP-M|IPCA)/i) || [])[1] || '',
    dataBaseReajuste: (texto.match(/Data base de reajuste.*?(\d{2}\/\d{2}\/\d{4})/i) || [])[1] || '',
    controversiaJudicial: (texto.match(/Há controvérsia judicial.*?(Sim|Não|NÃO|SIM)/i) || [])[1] || '',
  };
  return campos;
}

module.exports = { extrairCamposContratoPostes };
