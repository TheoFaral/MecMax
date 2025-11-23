import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function GerenciarFerramentas() {
  const navigate = useNavigate();
  const [ferramentas, setFerramentas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get("/ferramentas/completo");
        setFerramentas(resp.data?.data || []);
      } catch (e) { console.error(e); } finally { setCarregando(false); }
    }
    carregar();
  }, []);

  async function handleManutencao(id, nome) {
    if (!window.confirm(`Enviar "${nome}" para manutenção?`)) return;
    try { await api.put(`/ferramentas/${id}/manutencao`); window.location.reload(); } catch (e) { alert("Erro."); }
  }

  async function handleExcluir(id, nome) {
    if (!window.confirm(`EXCLUIR "${nome}"?`)) return;
    try { await api.put(`/ferramentas/${id}/excluir`); window.location.reload(); } catch (e) { alert("Erro."); }
  }

  return (
    <div className="pagina-mecanico">
      <div style={{ backgroundColor: "#1f2228", padding: "15px 20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#ffc400" }}>Gerenciar Ferramentas</h2>
        <button className="btn-primario-mecanico" style={{ margin: 0, backgroundColor: "#444", color: "#fff" }} onClick={() => navigate("/gerente/painel")}>Voltar ao Painel</button>
      </div>
      <div className="container-mecanico">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <button className="btn-primario-mecanico" onClick={() => navigate("/gerente/nova-ferramenta")}>+ Nova Ferramenta</button>
        </div>
        <div className="tabela-container">
          {carregando ? <p>Carregando...</p> : (
            <table className="tabela">
              <thead><tr><th>Cód</th><th>Nome</th><th>Obs</th><th>Status</th><th>Local</th><th>Mecânico</th><th>Ações</th></tr></thead>
              <tbody>
                {ferramentas.map((f) => (
                  <tr key={f.id_ferramenta}>
                    <td>{f.codigo_ferramenta}</td>
                    <td>{f.nome_ferramenta}</td>
                    <td style={{fontSize:'0.8rem', color:'#aaa', maxWidth:'150px', overflow:'hidden', whiteSpace:'nowrap'}} title={f.descricao}>{f.descricao || "-"}</td>
                    
                    {/* CORREÇÃO 1: Exibir texto amigável no Status */}
                    <td>
                      <span style={{
                        fontWeight:'bold', 
                        color: f.status === 'DISPONIVEL' ? '#4caf50' : 
                               f.status === 'EMPRESTADA' ? '#ff9800' : 
                               f.status === 'EM_MANUTENCAO' ? '#ffc107' : '#f44336'
                      }}>
                        {f.status === 'EM_MANUTENCAO' ? 'MANUTENÇÃO' : f.status}
                      </span>
                    </td>

                    {/* CORREÇÃO 2: Verificar o código correto do banco (EM_MANUTENCAO) */}
                    <td style={{color:'#ccc', fontSize:'0.9rem'}}>
                      {f.status === 'EMPRESTADA' ? f.local_uso : 
                      (f.status === 'EM_MANUTENCAO' ? 'Manutenção' : '-')}
                    </td>
                    
                    <td style={{color:'#ccc', fontSize:'0.9rem'}}>{f.status === 'EMPRESTADA' ? f.mecanico : '-'}</td>
                    <td className="acoes">
                      <button className="btn editar" onClick={() => navigate(`/gerente/editar-ferramenta/${f.id_ferramenta}`)}>Editar</button>
                      {f.status === 'DISPONIVEL' && <button className="btn" style={{ backgroundColor: '#ff9800', color: '#000', fontWeight: 'bold' }} onClick={() => handleManutencao(f.id_ferramenta, f.nome_ferramenta)}>Manut.</button>}
                      <button className="btn devolver" style={{backgroundColor: '#d32f2f', color: '#fff'}} onClick={() => handleExcluir(f.id_ferramenta, f.nome_ferramenta)}>Excluir</button>
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
export default GerenciarFerramentas;