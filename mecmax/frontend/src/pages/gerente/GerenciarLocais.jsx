import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function GerenciarLocais() {
  const navigate = useNavigate();
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/localizacoes");
        setLocais(resp.data?.data || []);
      } catch (e) { console.error(e); } finally { setCarregando(false); }
    }
    carregar();
  }, []);

  async function handleExcluir(id, nome) {
    if (!window.confirm(`Excluir "${nome}"?`)) return;
    try { await api.delete(`/localizacoes/${id}`); window.location.reload(); } 
    catch (e) { alert("Erro ao excluir."); }
  }

  return (
    <div className="pagina-mecanico">
      <div style={{ backgroundColor: "#1f2228", padding: "15px 20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#ffc400" }}>Gerenciar Locais</h2>
        <button className="btn-primario-mecanico" style={{ margin: 0, backgroundColor: "#444", color: "#fff" }} onClick={() => navigate("/gerente/painel")}>Voltar ao Painel</button>
      </div>
      <div className="container-mecanico">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <button className="btn-primario-mecanico" onClick={() => navigate("/gerente/novo-local")}>+ Novo Local</button>
        </div>
        <div className="tabela-container">
          {carregando ? <p>Carregando...</p> : (
            <table className="tabela">
              <thead><tr><th>Código</th><th>Tipo</th><th>Nome</th><th>Ações</th></tr></thead>
              <tbody>
                {locais.map((L) => (
                  <tr key={L.id_localizacao}>
                    <td style={{fontWeight:'bold', color:'#fff'}}>{L.codigo_local || '-'}</td>
                    <td><span style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem', color: '#aaa' }}>{L.tipo_local}</span></td>
                    <td>{L.nome_local}</td>
                    <td className="acoes">
                      <button className="btn editar" onClick={() => navigate(`/gerente/editar-local/${L.id_localizacao}`)}>Editar</button>
                      <button className="btn devolver" style={{backgroundColor: '#d32f2f', color: '#fff'}} onClick={() => handleExcluir(L.id_localizacao, L.nome_local)}>Excluir</button>
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
export default GerenciarLocais;