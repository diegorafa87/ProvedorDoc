import API_URL from '../services/api';
import React, { useState, useEffect } from 'react';
import { IconEye, IconEyeOff, IconPower, IconPowerOn } from './IconsAcompanhamento';

const ANOS = [2026, 2025, 2024];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const initialData = () => {
  const data = {};
  ANOS.forEach(ano => {
    data[ano] = {};
    MESES.forEach(mes => {
      data[ano][mes] = {
        checked: false,
        file: null,
        fileUrl: '',
      };
    });
  });
  return data;
};

export default function AcompanhamentoSCM({ razaoSocial, cnpj }) {
  const [dados, setDados] = useState(initialData());

  const chaveDesligados = cnpj ? `anosDesligados_SCM_${cnpj}` : 'anosDesligados_SCM';
  const chaveOcultos = cnpj ? `anosOcultos_SCM_${cnpj}` : 'anosOcultos_SCM';

  const [anosDesligados, setAnosDesligados] = useState(() => {
    const salvo = localStorage.getItem(chaveDesligados);
    return salvo ? JSON.parse(salvo) : {};
  });

  const [anosOcultos, setAnosOcultos] = useState(() => {
    const salvo = localStorage.getItem(chaveOcultos);
    return salvo ? JSON.parse(salvo) : {};
  });

  // 🔹 Salvar no backend ou fallback local
  useEffect(() => {
    if (!cnpj) return;

    fetch(`${API_URL}/api/acompanhamento-scm/${cnpj}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anosDesligados, anosOcultos })
    }).catch(() => {
      localStorage.setItem(chaveDesligados, JSON.stringify(anosDesligados));
      localStorage.setItem(chaveOcultos, JSON.stringify(anosOcultos));
    });
  }, [anosDesligados, anosOcultos, cnpj]);

  // 🔹 Carregar dados
  useEffect(() => {
    if (!cnpj) return;

    fetch(`${API_URL}/api/acompanhamento-scm/${cnpj}`)
      .then(res => res.json())
      .then(data => {
        if (data.anosDesligados) setAnosDesligados(data.anosDesligados);
        if (data.anosOcultos) setAnosOcultos(data.anosOcultos);
      })
      .catch(() => {
        const salvoDesligados = localStorage.getItem(chaveDesligados);
        if (salvoDesligados) setAnosDesligados(JSON.parse(salvoDesligados));

        const salvoOcultos = localStorage.getItem(chaveOcultos);
        if (salvoOcultos) setAnosOcultos(JSON.parse(salvoOcultos));
      });
  }, [cnpj]);

  const handleCheck = (ano, mes) => {
    setDados(prev => ({
      ...prev,
      [ano]: {
        ...prev[ano],
        [mes]: {
          ...prev[ano][mes],
          checked: !prev[ano][mes].checked
        }
      }
    }));
  };

  const handleFileChange = (ano, mes, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const nomeLimpo = (razaoSocial || "")
      .normalize('NFD')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .toUpperCase();

    const nomeArquivo = `COMP_SCM_${nomeLimpo}_${ano}_${mes.toUpperCase()}.pdf`;
    const novoFile = new File([file], nomeArquivo, { type: file.type });
    const url = URL.createObjectURL(novoFile);

    setDados(prev => ({
      ...prev,
      [ano]: {
        ...prev[ano],
        [mes]: {
          ...prev[ano][mes],
          file: novoFile,
          fileUrl: url
        }
      }
    }));

    fetch(`${API_URL}/api/acao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        acao: 'UPLOAD_PDF_SCM',
        usuario: razaoSocial || 'desconhecido',
        detalhes: { nomeArquivo, ano, mes }
      })
    });
  };

  const handleDownload = (ano, mes) => {
    const { file, fileUrl } = dados[ano][mes];
    if (!file || !fileUrl) return;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    link.click();

    fetch(`${API_URL}/api/acao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        acao: 'DOWNLOAD_PDF_SCM',
        usuario: razaoSocial || 'desconhecido',
        detalhes: { nomeArquivo: file.name, ano, mes }
      })
    });
  };

  if (!razaoSocial) {
    return (
      <div style={{ padding: 24, color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
        Cliente não selecionado ou parâmetro razaoSocial ausente na URL.
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Acompanhamento SCM</h2>

      {ANOS.map(ano => {
        const todosMesesMarcados = MESES.every(mes => dados[ano][mes].checked);
        const desligado = anosDesligados[ano];
        const oculto = anosOcultos[ano];

        if (oculto) {
          return (
            <div key={ano} style={{ marginBottom: 8 }}>
              <span>{ano} (oculto)</span>
              <button onClick={() => {
                const novo = { ...anosOcultos, [ano]: false };
                setAnosOcultos(novo);
                localStorage.setItem(chaveOcultos, JSON.stringify(novo));
              }}>
                <IconEyeOff />
              </button>
            </div>
          );
        }

        return (
          <div key={ano} style={{
            background: desligado ? '#ffebee' : (todosMesesMarcados ? '#e8f5e9' : '#f4f8ff'),
            padding: 16,
            marginBottom: 16,
            opacity: desligado ? 0.6 : 1
          }}>
            <div>
              <strong>{ano}</strong>

              <button onClick={() => {
                const novo = { ...anosDesligados, [ano]: !desligado };
                setAnosDesligados(novo);
                localStorage.setItem(chaveDesligados, JSON.stringify(novo));
              }}>
                {desligado ? <IconPowerOn /> : <IconPower />}
              </button>

              <button onClick={() => {
                const novo = { ...anosOcultos, [ano]: true };
                setAnosOcultos(novo);
                localStorage.setItem(chaveOcultos, JSON.stringify(novo));
              }}>
                <IconEye />
              </button>
            </div>

            {MESES.map(mes => (
              <div key={mes} style={{ marginTop: 8 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={dados[ano][mes].checked}
                    onChange={() => handleCheck(ano, mes)}
                    disabled={desligado}
                  />
                  {mes}
                </label>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => handleFileChange(ano, mes, e)}
                  disabled={desligado}
                />

                {dados[ano][mes].file && (
                  <button onClick={() => handleDownload(ano, mes)}>
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}