import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function GerenciarMecanicos() {
  const navigate = useNavigate();
  const [mecanicos, setMecanicos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/mecanicos");
        setMecanicos(resp.data?.data || []);
      } catch (e) { console.error(e); } finally { setCarregando(false); }
    }
    carregar();
  }, []);

  async function handleExcluir(id, nome) {
    if (!window.confirm(`EXCLUIR "${nome}"?`)) return;
    try { await api.delete(`/mecanicos/${id}`); window.location.reload(); } catch (e) { alert("Erro."); }
  }

  return (
    <div className="pagina-mecanico">
      <div style={{ backgroundColor: "#1f2228", padding: "15px 20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#ffc400" }}>Gerenciar Mecânicos</h2>
        <button className="btn-primario-mecanico" style={{ margin: 0, backgroundColor: "#444", color: "#fff" }} onClick={() => navigate("/gerente/painel")}>Voltar ao Painel</button>
      </div>
      <div className="container-mecanico">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <button className="btn-primario-mecanico" onClick={() => navigate("/gerente/novo-mecanico")}>+ Novo Mecânico</button>
        </div>
        <div className="tabela-container">
          {carregando ? <p>Carregando...</p> : (
            <table className="tabela">
              <thead><tr><th>Matrícula</th><th>Nome Completo</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {mecanicos.map((m) => (
                  <tr key={m.id_mecanico}>
                    <td style={{ fontWeight: 'bold' }}>{m.matricula}</td>
                    <td>{m.nome_completo}</td>
                    <td><span style={{ color: '#4caf50', fontWeight: 'bold' }}>ATIVO</span></td>
                    <td className="acoes">
                      <button className="btn editar" onClick={() => navigate(`/gerente/editar-mecanico/${m.id_mecanico}`)}>Editar</button>
                      <button className="btn devolver" style={{backgroundColor: '#d32f2f', color: '#fff'}} onClick={() => handleExcluir(m.id_mecanico, m.nome_completo)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
export default GerenciarMecanicos;