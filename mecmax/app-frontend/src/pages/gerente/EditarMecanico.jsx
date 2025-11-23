// frontend/src/pages/gerente/EditarMecanico.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function EditarMecanico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get(`/mecanicos/${id}`);
        const m = resp.data.data;
        setNome(m.nome_completo);
        setMatricula(m.matricula);
      } catch (e) { 
        alert("Erro ao carregar."); 
        navigate("/gerente/mecanicos"); 
      }
    }
    carregar();
  }, [id, navigate]);

  async function handleSalvar() {
    // Validação de 6 dígitos
    if (!/^\d{6}$/.test(matricula)) {
      alert("A matrícula deve conter EXATAMENTE 6 números.");
      return;
    }

    try {
      await api.put(`/mecanicos/${id}`, { 
        nome_completo: nome, 
        matricula: matricula // Agora envia a matrícula atualizada
      }); 
      alert("Mecânico atualizado com sucesso!");
      navigate("/gerente/mecanicos");
    } catch (e) { 
      // Mostra mensagem de erro do backend (ex: duplicidade)
      alert(e.response?.data?.message || "Erro ao atualizar."); 
    }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2 className="titulo-form-mecanico">Editar Mecânico</h2>
          
          <div className="grupo-campo-mecanico">
            <label>Nome</label>
            <input 
              className="input-mecanico" 
              value={nome} 
              onChange={e=>setNome(e.target.value)}
            />
          </div>
          
          <div className="grupo-campo-mecanico">
            <label>Matrícula</label>
            {/* CORREÇÃO: Campo liberado (sem disabled) e com maxLength */}
            <input 
              className="input-mecanico" 
              value={matricula} 
              onChange={e=>setMatricula(e.target.value)} 
              maxLength={6}
            />
            <small style={{color:'#888', fontSize:'12px'}}>Deve ser única e ter 6 dígitos.</small>
          </div>
          
          <button 
            className="btn-primario-mecanico" 
            style={{width:'100%'}} 
            onClick={handleSalvar}
          >
            Salvar Alterações
          </button>

          {/* CORREÇÃO: Botão Cancelar Adicionado */}
          <button 
            className="btn-primario-mecanico" 
            style={{width:'100%', marginTop:'10px', backgroundColor:'#444', color:'#fff'}} 
            onClick={() => navigate("/gerente/mecanicos")}
          >
            Cancelar
          </button>

        </div>
      </div>
    </div>
  );
}
export default EditarMecanico;