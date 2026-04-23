// Utilitário para persistir o histórico de arquivos de postes no localStorage

// Agora cada cliente tem sua própria chave de histórico, baseada no CNPJ
function getStorageKey(cnpj) {
  return `historicoArquivosCompartilhamentoPostes_${cnpj || 'semcnpj'}`;
}

export function salvarHistoricoPostesNoStorage(historico, cnpj) {
  try {
    localStorage.setItem(getStorageKey(cnpj), JSON.stringify(historico));
  } catch (e) {}
}

export function carregarHistoricoPostesDoStorage(cnpj) {
  try {
    const data = localStorage.getItem(getStorageKey(cnpj));
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}
