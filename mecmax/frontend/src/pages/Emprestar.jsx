// frontend/src/pages/Emprestar.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function Emprestar() {
  const { codigo } = useParams(); 
  const navigate = useNavigate();
  const mecanico = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");

  const [previsao, setPrevisao] = useState("");
  const [localUso, setLocalUso] = useState("");
  const [locais, setLocais] = useState([]);
  const [carregandoLocais, setCarregandoLocais] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarLocais() {
      try {
        const r = await api.get("/localizacoes");
        const dados = Array.isArray(r.data?.data) ? r.data.data : [];
        setLocais(dados);
      } catch (err) {
        console.error("Erro ao carregar locais:", err);
      } finally {
        setCarregandoLocais(false);
      }
    }
    carregarLocais();
  }, []);

  function formatarParaMysql(valor) {
    if (!valor) return "";
    return valor.replace("T", " ") + ":00";
  }

  async function registrar() {
    if (!mecanico) { alert("Erro: Nenhum mecânico logado."); navigate("/"); return; }
    if (!previsao) return alert("Informe a previsão de devolução.");
    if (!localUso) return alert("Selecione o local de uso.");

    // --- VALIDAÇÃO DE DATA (NOVO) ---
    const dataPrev = new Date(previsao);
    const agora = new Date();
    if (dataPrev < agora) {
      return alert("A previsão de devolução não pode ser no passado.");
    }

    try {
      setSalvando(true);
      const body = {
        id_mecanico: mecanico.id_mecanico,
        codigo_ferramenta: codigo,
        previsao_devolucao: formatarParaMysql(previsao),
        local_uso: localUso,
      };

      const r = await api.post("/emprestimos", body);

      if (r.data?.success) {
        alert("Empréstimo registrado com sucesso!");
        navigate("/consulta-ferramentas");
      } else {
        alert(r.data?.message || "Erro ao registrar.");
      }
    } catch (e) {
      alert("Erro de conexão ao registrar empréstimo.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2 className="titulo-form-mecanico">Registrar Empréstimo</h2>

          <div className="grupo-campo-mecanico">
            <label>Código da Ferramenta</label>
            <input type="text" className="input-mecanico" value={codigo} disabled />
          </div>

          <div className="grupo-campo-mecanico">
            <label>Previsão de Devolução</label>
            <input
              type="datetime-local"
              className="input-mecanico input-data-mecanico"
              value={previsao}
              onChange={(e) => setPrevisao(e.target.value)}
            />
          </div>

          <div className="grupo-campo-mecanico">
            <label>Local de Uso</label>
            <select
              className="input-mecanico"
              value={localUso}
              onChange={(e) => setLocalUso(e.target.value)}
              disabled={carregandoLocais}
            >
              <option value="">Selecione o local...</option>
              {locais.map((loc) => (
                <option key={loc.id_localizacao} value={loc.nome_local}>
                  {loc.nome_local}
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn-primario-mecanico" 
            onClick={registrar}
            disabled={salvando}
            style={{ width: "100%" }}
          >
            {salvando ? "Registrando..." : "Confirmar Retirada"}
          </button>

          <button 
            className="btn-primario-mecanico" 
            onClick={() => navigate("/consulta-ferramentas")}
            style={{ width: "100%", marginTop: "10px", backgroundColor: "#444", color: "#fff" }}
          >
            Cancelar
          </button>

        </div>
      </div>
    </div>
  );
}

export default Emprestar;