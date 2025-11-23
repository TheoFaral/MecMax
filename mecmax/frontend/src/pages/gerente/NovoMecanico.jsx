import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function NovoMecanico() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome || !matricula) return alert("Preencha Nome e Matrícula.");
    if (!/^\d{6}$/.test(matricula)) return alert("A matrícula deve conter EXATAMENTE 6 números.");
    try {
      setSalvando(true);
      await api.post("/mecanicos", { nome_completo: nome, matricula });
      alert("Mecânico cadastrado com sucesso!");
      navigate("/gerente/mecanicos");
    } catch (e) { 
      alert(e.response?.data?.message || "Erro ao salvar."); 
    } finally { setSalvando(false); }
  }


  
  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2>Novo Mecânico</h2>
          <div className="grupo-campo-mecanico"><label>Nome</label><input className="input-mecanico" value={nome} onChange={e => setNome(e.target.value)} /></div>
          <div className="grupo-campo-mecanico"><label>Matrícula</label><input className="input-mecanico" value={matricula} onChange={e => setMatricula(e.target.value)} maxLength={6} /></div>
          
          <button className="btn-primario-mecanico" style={{width:'100%'}} onClick={handleSalvar} disabled={salvando}>Cadastrar</button>
          <button className="btn-primario-mecanico" style={{width:'100%', marginTop:10, backgroundColor:'#444', color:'#fff'}} onClick={() => navigate("/gerente/mecanicos")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default NovoMecanico;