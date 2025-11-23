import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function EditarReserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [nomeFerramenta, setNomeFerramenta] = useState("");
  const [idFerramenta, setIdFerramenta] = useState(null);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [carregando, setCarregando] = useState(true);

  const formatarParaInput = (dataIso) => {
    if (!dataIso) return "";
    const d = new Date(dataIso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get(`/reservas/${id}`);
        const r = resp.data?.data;
        if (r) {
          setNomeFerramenta(r.nome_ferramenta);
          setIdFerramenta(r.id_ferramenta);
          setInicio(formatarParaInput(r.data_reserva_inicio));
          setFim(formatarParaInput(r.data_reserva_fim));
        }
      } catch (e) {
        alert("Erro ao carregar reserva.");
        navigate("/reservas");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id, navigate]);

  async function handleSalvar() {
    try {
      // Formata para MySQL
      const dataInicio = inicio.replace("T", " ") + ":00";
      const dataFim = fim.replace("T", " ") + ":00";

      await api.put(`/reservas/${id}`, {
        id_ferramenta: idFerramenta,
        inicio: dataInicio,
        fim: dataFim
      });
      alert("Reserva atualizada com sucesso!");
      navigate("/reservas");
    } catch (e) {
      // Backend retorna 400 se houver colisão, mostramos a mensagem dele
      alert(e.response?.data?.message || "Erro ao atualizar (Colisão ou Conexão).");
    }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2 className="titulo-form-mecanico">Editar Reserva #{id}</h2>
          <div className="grupo-campo-mecanico">
            <label>Ferramenta</label>
            <input className="input-mecanico" value={nomeFerramenta} disabled style={{ color: '#888' }} />
          </div>
          <div className="grupo-campo-mecanico">
            <label>Novo Início</label>
            <input type="datetime-local" className="input-mecanico input-data-mecanico" value={inicio} onChange={e => setInicio(e.target.value)} />
          </div>
          <div className="grupo-campo-mecanico">
            <label>Novo Fim</label>
            <input type="datetime-local" className="input-mecanico input-data-mecanico" value={fim} onChange={e => setFim(e.target.value)} />
          </div>
          <button className="btn-primario-mecanico" style={{width:'100%'}} onClick={handleSalvar}>Salvar Alterações</button>
          <button className="btn-primario-mecanico" style={{width:'100%', marginTop:10, backgroundColor:'#444', color:'#fff'}} onClick={() => navigate("/reservas")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default EditarReserva;