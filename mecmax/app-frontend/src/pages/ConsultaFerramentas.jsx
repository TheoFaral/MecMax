// frontend/src/pages/ConsultaFerramentas.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function formatarDataHora(valor) {
  if (!valor) return "-";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString('pt-BR', { 
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
}

function ConsultaFerramentas() {
  const [ferramentas, setFerramentas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  
  const mecanicoLogado = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const resp = await api.get("/ferramentas/completo");
        setFerramentas(resp.data?.data || []);
      } catch (e) {
        console.error("Erro", e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function handleDevolver(idEmprestimo) {
    if (!window.confirm("Confirmar devolução desta ferramenta?")) return;
    try {
      await api.put(`/emprestimos/${idEmprestimo}/devolver`);
      alert("Devolução registrada com sucesso!");
      window.location.reload();
    } catch (e) {
      alert("Erro ao devolver.");
    }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="tabela-container">
          <h2 className="titulo">Consulta de Ferramentas</h2>
          
          {mecanicoLogado && (
            <div style={{ marginBottom: '15px', fontSize: '14px', color: '#aaa' }}>
              Logado como: <strong style={{ color: '#fff' }}>{mecanicoLogado.nome_completo}</strong>
            </div>
          )}

          {carregando ? <p>Carregando...</p> : (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Cód</th>
                  <th>Ferramenta</th>
                  <th>Status</th>
                  <th>Local</th>
                  <th>Mecânico</th>
                  <th>Prev. Devolução</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ferramentas.map((f) => {
                  const status = f.status || f.status_ferramenta;
                  const isEmprestada = status === "EMPRESTADA";
                  
                  // Mostra botões se estiver emprestada (Modo Apresentação)
                  const mostrarBotoes = isEmprestada;

                  return (
                    <tr key={f.id_ferramenta}>
                      <td>{f.codigo_ferramenta}</td>
                      <td>{f.nome_ferramenta}</td>
                      
                      {/* CORREÇÃO AQUI: Exibe 'MANUTENÇÃO' se o status for 'EM_MANUTENCAO' */}
                      <td style={{ 
                        fontWeight: 'bold', 
                        color: status === 'DISPONIVEL' ? '#4caf50' : 
                               status === 'EMPRESTADA' ? '#ff9800' : '#f44336' 
                      }}>
                        {status === 'EM_MANUTENCAO' ? 'MANUTENÇÃO' : status}
                      </td>

                      <td>{f.local_uso || "-"}</td>
                      <td>{f.mecanico || "-"}</td>
                      
                      <td>{isEmprestada ? formatarDataHora(f.previsao) : "-"}</td>

                      <td className="acoes">
                        {/* Botão Emprestar */}
                        {status === "DISPONIVEL" && (
                          <button className="btn emprestar" onClick={() => navigate(`/emprestar/${f.codigo_ferramenta}`)}>Emprestar</button>
                        )}

                        {/* Botões de Ação */}
                        {mostrarBotoes && (
                          <>
                            <button className="btn editar" onClick={() => navigate(`/editar/${f.id_emprestimo}`)}>Editar</button>
                            <button className="btn devolver" onClick={() => handleDevolver(f.id_emprestimo)}>Devolver</button>
                          </>
                        )}

                        {/* Botão Reservar */}
                        <button className="btn reservar" onClick={() => navigate("/nova-reserva", { state: { codigo_ferramenta: f.codigo_ferramenta } })}>Reservar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultaFerramentas;