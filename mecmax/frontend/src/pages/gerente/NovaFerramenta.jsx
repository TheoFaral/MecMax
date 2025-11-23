import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css"; 

function NovaFerramenta() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("1");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!codigo || !nome) {
      alert("Preencha Código e Nome.");
      return;
    }

    try {
      setSalvando(true);
      await api.post("/ferramentas", {
        codigo_ferramenta: codigo,
        nome_ferramenta: nome,
        marca: marca,
        id_categoria: categoria,
        observacoes: observacoes
      });
      alert("Ferramenta cadastrada com sucesso!");
      navigate("/gerente/ferramentas");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Erro ao cadastrar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2 className="titulo-form-mecanico">Nova Ferramenta</h2>
          <div className="grupo-campo-mecanico">
            <label>Código (Ex: PAR001)</label>
            <input className="input-mecanico" value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())} />
          </div>
          <div className="grupo-campo-mecanico">
            <label>Nome</label>
            <input className="input-mecanico" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="grupo-campo-mecanico">
            <label>Marca</label>
            <input className="input-mecanico" value={marca} onChange={e => setMarca(e.target.value)} />
          </div>
          <div className="grupo-campo-mecanico">
            <label>Categoria</label>
            <select className="input-mecanico" value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="1">Manuais</option><option value="2">Elétricas</option><option value="3">Diagnóstico</option><option value="4">Pneumáticas</option><option value="5">Especiais</option><option value="7">Elevação</option>
            </select>
          </div>
          <div className="grupo-campo-mecanico">
            <label>Observações</label>
            <textarea className="input-mecanico" rows="3" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
          </div>
          
          <button className="btn-primario-mecanico" style={{width:'100%'}} onClick={handleSalvar} disabled={salvando}>Cadastrar</button>
          <button className="btn-primario-mecanico" style={{width:'100%', marginTop:10, backgroundColor:'#444', color:'#fff'}} onClick={() => navigate("/gerente/ferramentas")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default NovaFerramenta;