import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function formatarData(dataISO) {
  if (!dataISO) return "-";
  const d = new Date(dataISO);
  return d.toLocaleString('pt-BR');
}

function Relatorios() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/emprestimos/relatorio");
        setHistorico(resp.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const dadosFiltrados = historico.filter(item => {
    if (filtroStatus === "TODOS") return true;
    return item.status_emprestimo === filtroStatus;
  });

  return (
    <div className="pagina-mecanico">
      {/* Cabeçalho */}
      <div style={{ 
        backgroundColor: "#1f2228", 
        padding: "15px 20px", 
        borderBottom: "1px solid #333",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#ffc400" }}>
          Relatórios de Uso
        </h2>
        <button 
          className="btn-primario-mecanico" 
          style={{ margin: 0, backgroundColor: "#444", color: "#fff" }}
          onClick={() => navigate("/gerente/painel")}
        >
          Voltar ao Painel
        </button>
      </div>

      <div className="container-mecanico">
        
        {/* Filtros */}
        <div className="card-form-mecanico" style={{ marginBottom: '20px', maxWidth: '100%' }}>
          <label style={{ marginRight: '10px' }}>Filtrar por Status:</label>
          <select 
            className="input-mecanico" 
            style={{ width: '200px', display: 'inline-block' }}
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ATIVO">Emprestados (Ativo)</option>
            <option value="FINALIZADO">Devolvidos</option>
            <option value="ATRASADO">Atrasados</option>
          </select>
        </div>

        <div className="tabela-container">
          {carregando ? <p>Gerando relatório...</p> : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Data Retirada</th>
                  <th>Ferramenta</th>
                  <th>Mecânico</th>
                  <th>Local Uso</th>
                  <th>Devolução</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign:'center'}}>Nenhum registro encontrado.</td></tr>
                ) : (
                  dadosFiltrados.map((h) => (
                    <tr key={h.id_emprestimo}>
                      <td>{formatarData(h.data_retirada)}</td>
                      <td>
                        <strong>{h.codigo_ferramenta}</strong> <br/>
                        <span style={{ fontSize: '0.85em', color: '#ccc' }}>{h.nome_ferramenta}</span>
                      </td>
                      <td>{h.mecanico}</td>
                      <td>{h.local_uso}</td>
                      <td>{h.data_devolucao ? formatarData(h.data_devolucao) : '-'}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          backgroundColor: h.status_emprestimo === 'ATIVO' ? '#ff9800' :
                                           h.status_emprestimo === 'FINALIZADO' ? '#4caf50' : '#f44336',
                          color: '#000'
                        }}>
                          {h.status_emprestimo}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Relatorios;