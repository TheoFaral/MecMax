import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function NovaReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const mecanico = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");

  // Se vier da tabela de ferramentas, pega o código
  const ferramentaPreSelecionada = location.state?.codigo_ferramenta || "";

  const [codigoFerramenta, setCodigoFerramenta] = useState(ferramentaPreSelecionada);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Formata data para MySQL (YYYY-MM-DD HH:MM:SS)
  function formatarParaMysql(valor) {
    if (!valor) return "";
    return valor.replace("T", " ") + ":00";
  }

  async function handleSalvar() {
    // 1. Validações Iniciais
    if (!mecanico) {
      alert("Erro: Nenhum mecânico logado.");
      navigate("/");
      return;
    }
    if (!codigoFerramenta || !dataInicio || !dataFim) {
      alert("Preencha o código da ferramenta, data de início e fim.");
      return;
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const agora = new Date();

    if (inicio < agora) {
      alert("A data de início não pode ser no passado.");
      return;
    }
    if (fim <= inicio) {
      alert("A data de fim deve ser posterior à data de início.");
      return;
    }

    try {
      setSalvando(true);

      let idFerramentaParaEnviar = null;
      try {
         const respFerramenta = await api.get(`/ferramentas?busca=${codigoFerramenta}`);
         const lista = respFerramenta.data?.data || [];
         const ferramentaEncontrada = lista.find(f => f.codigo_ferramenta === codigoFerramenta);
         
         if (ferramentaEncontrada) {
            idFerramentaParaEnviar = ferramentaEncontrada.id_ferramenta;
         }
      } catch (err) {
         console.warn("Não foi possível buscar o ID da ferramenta, enviando apenas código.");
      }

      const payload = {
        id_mecanico: mecanico.id_mecanico,
        codigo_ferramenta: codigoFerramenta,
        id_ferramenta: idFerramentaParaEnviar, 
        
        data_reserva_inicio: formatarParaMysql(dataInicio),
        data_reserva_fim: formatarParaMysql(dataFim),
        data_inicio: formatarParaMysql(dataInicio),
        data_fim: formatarParaMysql(dataFim)
      };

      const resp = await api.post("/reservas", payload);

      if (resp.data?.success) {
        alert("Reserva realizada com sucesso!");
        navigate("/reservas"); 
      } else {
        alert(resp.data?.message || "Erro ao criar reserva.");
      }
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || "Erro de conexão ao criar reserva.";
      alert(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2 className="titulo-form-mecanico">Criar Nova Reserva</h2>

          <div className="grupo-campo-mecanico">
            <label>Código da Ferramenta</label>
            <input
              type="text"
              className="input-mecanico"
              value={codigoFerramenta}
              onChange={(e) => setCodigoFerramenta(e.target.value)}
              disabled={!!ferramentaPreSelecionada}
            />
          </div>

          <div className="grupo-campo-mecanico">
            <label>Data/Hora Início</label>
            <input
              type="datetime-local"
              className="input-mecanico input-data-mecanico"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div className="grupo-campo-mecanico">
            <label>Data/Hora Fim</label>
            <input
              type="datetime-local"
              className="input-mecanico input-data-mecanico"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          {/* Apenas Botão de Salvar (Width 100%) */}
          <button
            className="btn-primario-mecanico"
            onClick={handleSalvar}
            disabled={salvando}
            style={{ width: '100%' }}
          >
            {salvando ? "Salvando..." : "Confirmar Reserva"}
          </button>

          <button 
            className="btn-primario-mecanico"
            onClick={() => navigate("/reservas")}
            style={{ width: "100%", marginTop: "10px", backgroundColor: "#444", color: "#fff" }}
          >
            Cancelar
          </button>

        </div>
      </div>
    </div>
  );
}

export default NovaReserva;