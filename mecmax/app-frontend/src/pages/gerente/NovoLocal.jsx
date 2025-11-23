import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function NovoLocal() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("OFICINA");
  const [novoTipo, setNovoTipo] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!nome || !codigo) return alert("Preencha todos os campos.");
    if (!/^[0-9]{3}[A-Z]{3}$/.test(codigo)) return alert("O Código deve ser 3 Números e 3 Letras (Ex: 001BOX).");

    const tipoFinal = tipoSelecionado === "OUTRO" ? novoTipo.toUpperCase() : tipoSelecionado;
    if (!tipoFinal) return alert("Informe o tipo.");

    try {
      setSalvando(true);
      await api.post("/localizacoes", { nome_local: nome, tipo_local: tipoFinal, codigo_local: codigo });
      alert("Local criado!");
      navigate("/gerente/locais");
    } catch (e) { alert(e.response?.data?.message || "Erro ao salvar."); } 
    finally { setSalvando(false); }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2>Novo Local</h2>
          <div className="grupo-campo-mecanico"><label>Código (Ex: 001BOX)</label><input className="input-mecanico" value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())} maxLength={6}/></div>
          <div className="grupo-campo-mecanico"><label>Nome</label><input className="input-mecanico" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Box 01"/></div>
          <div className="grupo-campo-mecanico"><label>Tipo</label>
            <select className="input-mecanico" value={tipoSelecionado} onChange={e => setTipoSelecionado(e.target.value)}>
              <option value="OFICINA">OFICINA</option><option value="ALMOXARIFADO">ALMOXARIFADO</option><option value="PINTURA">PINTURA</option><option value="OUTRO">OUTRO...</option>
            </select>
          </div>
          {tipoSelecionado === "OUTRO" && <div className="grupo-campo-mecanico"><label>Qual?</label><input className="input-mecanico" value={novoTipo} onChange={e => setNovoTipo(e.target.value)}/></div>}
          
          <button className="btn-primario-mecanico" style={{width:'100%'}} onClick={handleSalvar} disabled={salvando}>Cadastrar</button>
          <button className="btn-primario-mecanico" style={{width:'100%', marginTop:10, backgroundColor:'#444', color:'#fff'}} onClick={() => navigate("/gerente/locais")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default NovoLocal;