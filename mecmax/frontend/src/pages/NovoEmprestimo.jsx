import React, { useState } from "react";
import api from "../services/api";

function NovoEmprestimo() {
  const mecanico = JSON.parse(
    localStorage.getItem("mecanicoLogado") || "null"
  );

  const [codigoFerramenta, setCodigoFerramenta] = useState("");
  const [previsao, setPrevisao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (!mecanico) {
    return <p>Nenhum mecânico logado.</p>;
  }

  function formatarParaMysql(v) {
    return v.replace("T", " ") + ":00";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (!codigoFerramenta || !previsao) {
      setErro("Preencha todos os campos.");
      return;
    }

    const codigo = codigoFerramenta.trim().toUpperCase();

    // Validação simples: 3 letras + 3 números (ex: CHP001)
    const padraoCodigo = /^[A-Z]{3}\d{3}$/;
    if (!padraoCodigo.test(codigo)) {
      setErro("Use o formato ABC123 (3 letras + 3 números).");
      return;
    }

    try {
      setCarregando(true);

      const body = {
        id_mecanico: mecanico.id_mecanico,
        codigo_ferramenta: codigo,
        previsao_devolucao: formatarParaMysql(previsao),
      };

      const response = await api.post("/emprestimos", body);

      if (response.data.success) {
        setMensagem("Empréstimo criado com sucesso.");
        setCodigoFerramenta("");
        setPrevisao("");
      } else {
        setErro("Erro ao criar empréstimo.");
      }
    } catch (e) {
      setErro("Erro ao conectar com a API.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "20px auto" }}>
      <h2>Novo Empréstimo</h2>
      <p>
        Mecânico: <strong>{mecanico.nome_completo}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Código da Ferramenta (ABC123):</label>
          <input
            type="text"
            value={codigoFerramenta}
            onChange={(e) => setCodigoFerramenta(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Previsão Devolução:</label>
          <input
            type="datetime-local"
            value={previsao}
            onChange={(e) => setPrevisao(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Criar Empréstimo"}
        </button>
      </form>

      {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default NovoEmprestimo;
