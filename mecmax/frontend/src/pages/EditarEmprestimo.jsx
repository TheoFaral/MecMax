import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function formatDateTimeForInput(value) {
  if (!value) return "";
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function EditarEmprestimo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [codigoFerramenta, setCodigoFerramenta] = useState("");
  const [previsaoDevolucao, setPrevisaoDevolucao] = useState("");
  const [localUso, setLocalUso] = useState("");
  const [locaisUso, setLocaisUso] = useState([]);

  useEffect(() => {
    async function carregar() {
      try {
        setErro("");
        const respEmp = await api.get(`/emprestimos/${id}`);
        const emp = respEmp.data?.data;

        if (!emp) {
          setErro("Empréstimo não encontrado.");
          setCarregando(false);
          return;
        }

        setCodigoFerramenta(emp.codigo_ferramenta || "");
        setPrevisaoDevolucao(formatDateTimeForInput(emp.previsao_devolucao));
        setLocalUso(emp.local_uso || "");

        const respLocais = await api.get("/localizacoes");
        const dadosLocais = respLocais.data?.data || respLocais.data || [];
        setLocaisUso(dadosLocais);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar dados.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function handleSalvar() {
    if (!previsaoDevolucao || !localUso) return alert("Preencha todos os campos.");

    try {
      await api.put(`/emprestimos/${id}`, {
        previsao_devolucao: previsaoDevolucao,
        local_uso: localUso,
      });
      alert("Empréstimo atualizado!");
      navigate("/consulta-ferramentas");
    } catch (e) {
      alert("Erro ao salvar.");
    }
  }

  if (carregando) return <div className="pagina-mecanico"><p style={{color:"#fff"}}>Carregando...</p></div>;
  if (erro) return <div className="pagina-mecanico"><p style={{color:"#fff"}}>{erro}</p><button onClick={() => navigate("/consulta-ferramentas")}>Voltar</button></div>;

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2 className="titulo-form-mecanico">Editar Empréstimo</h2>

          <div className="grupo-campo-mecanico">
            <label>Ferramenta</label>
            <input type="text" className="input-mecanico" value={codigoFerramenta} disabled />
          </div>

          <div className="grupo-campo-mecanico">
            <label>Previsão</label>
            <input
              type="datetime-local"
              className="input-mecanico input-data-mecanico"
              value={previsaoDevolucao}
              onChange={(e) => setPrevisaoDevolucao(e.target.value)}
            />
          </div>

          <div className="grupo-campo-mecanico">
            <label>Local de uso</label>
            <select
              className="input-mecanico"
              value={localUso}
              onChange={(e) => setLocalUso(e.target.value)}
            >
              <option value="">Selecione...</option>
              {locaisUso.map((loc) => (
                // CORREÇÃO: Usar apenas o Nome do Local
                <option key={loc.id_localizacao} value={loc.nome_local}>
                  {loc.nome_local}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-primario-mecanico" onClick={handleSalvar} style={{ width: '100%' }}>
            Salvar alterações
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

export default EditarEmprestimo;