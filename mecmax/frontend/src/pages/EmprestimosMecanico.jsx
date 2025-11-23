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
        setErro("Erro ao carregar dados do empréstimo.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  async function handleSalvar() {
    if (!previsaoDevolucao) {
      alert("Informe a previsão de devolução.");
      return;
    }
    if (!localUso) {
      alert("Informe o local de uso.");
      return;
    }

    try {
      const payload = {
        previsao_devolucao: previsaoDevolucao,
        local_uso: localUso,
      };

      const resp = await api.put(`/emprestimos/${id}`, payload);

      if (!resp.data?.success) {
        alert(resp.data?.message || "Erro ao salvar alterações.");
        return;
      }

      alert("Empréstimo atualizado com sucesso.");
      navigate("/consulta-ferramentas");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar alterações do empréstimo.");
    }
  }

  if (carregando) {
    return (
      <div className="pagina">
        <div className="form-card" style={{ maxWidth: 480 }}>
          <h2 className="titulo">Editar Empréstimo</h2>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="pagina">
        <div className="form-card" style={{ maxWidth: 480 }}>
          <h2 className="titulo">Editar Empréstimo</h2>
          <p style={{ marginBottom: 16 }}>{erro}</p>
          <button className="btn salvar" onClick={() => navigate("/consulta-ferramentas")}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina">
      <div className="form-card" style={{ maxWidth: 480 }}>
        <h2 className="titulo">Editar Empréstimo</h2>

        <div className="linha">
          <label>Ferramenta</label>
          <input type="text" value={codigoFerramenta} disabled />
        </div>

        <div className="linha">
          <label>Previsão de devolução</label>
          <input
            type="datetime-local"
            className="input-data-mecanico"
            value={previsaoDevolucao}
            onChange={(e) => setPrevisaoDevolucao(e.target.value)}
          />
        </div>

        <div className="linha">
          <label>Local de uso</label>
          <select
            value={localUso}
            onChange={(e) => setLocalUso(e.target.value)}
          >
            <option value="">Selecione...</option>
            {locaisUso.map((loc) => {
              const label = `${loc.tipo_local} - ${loc.nome_local}`;
              return (
                <option key={loc.id_localizacao} value={label}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <button className="btn salvar" onClick={handleSalvar}>
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

export default EditarEmprestimo;
