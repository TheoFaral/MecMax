import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function formatarDataHoraBr(isoString) {
  if (!isoString) return "-";
  const data = new Date(isoString);
  if (Number.isNaN(data.getTime())) return "-";
  return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function ListaReservas() {
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const mecanico = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get("/reservas");
        setReservas(response.data?.data || []);
      } catch (e) { console.error(e); } 
      finally { setCarregando(false); }
    }
    carregar();
  }, []);

  async function handleCancelar(id) {
    if (!window.confirm("Cancelar reserva?")) return;
    try {
      await api.delete(`/reservas/${id}`);
      alert("Cancelada.");
      window.location.reload();
    } catch (e) { alert("Erro ao cancelar."); }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="tabela-container">
          <h2 className="titulo">Reservas / Consultas</h2>
          {carregando ? <p>Carregando...</p> : (
            <table className="tabela">
              <thead><tr><th>Cód.</th><th>Ferramenta</th><th>Início</th><th>Fim</th><th>Mecânico</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {reservas.map((r) => {
                  const isMinha = String(r.id_mecanico) === String(mecanico?.id_mecanico);
                  return (
                    <tr key={r.id_reserva}>
                      <td>{r.id_reserva}</td>
                      <td>{r.nome_ferramenta}</td>
                      <td>{formatarDataHoraBr(r.data_reserva_inicio)}</td>
                      <td>{formatarDataHoraBr(r.data_reserva_fim)}</td>
                      <td>{r.nome_mecanico}</td>
                      <td style={{fontWeight:'bold', color: r.status_reserva==='ATIVA'?'#4caf50':'#ffc107'}}>{r.status_reserva}</td>
                      <td className="acoes">
                        {isMinha && r.status_reserva === 'ATIVA' && (
                          <>
                            <button className="btn editar" onClick={() => navigate(`/reservas/editar/${r.id_reserva}`)}>Editar</button>
                            <button className="btn devolver" style={{backgroundColor:'#ff5252', color:'#fff'}} onClick={() => handleCancelar(r.id_reserva)}>Cancelar</button>
                          </>
                        )}
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
export default ListaReservas;