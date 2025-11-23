import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function EditarLocal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("OFICINA");
  const [novoTipo, setNovoTipo] = useState("");
  const [carregando, setCarregando] = useState(true);

  const tiposPadrao = ["OFICINA", "ALMOXARIFADO", "PINTURA", "FUNILARIA", "EXTERNO"];

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get(`/localizacoes/${id}`);
        if (resp.data && resp.data.data) {
            const d = resp.data.data;
            setNome(d.nome_local);
            setCodigo(d.codigo_local || "");
            if (tiposPadrao.includes(d.tipo_local)) { setTipoSelecionado(d.tipo_local); }
            else { setTipoSelecionado("OUTRO"); setNovoTipo(d.tipo_local); }
        }
      } catch (e) { alert("Erro."); navigate("/gerente/locais"); }
      finally { setCarregando(false); }
    }
    carregar();
  }, [id, navigate]);

  async function handleSalvar() {
    if (!/^[0-9]{3}[A-Z]{3}$/.test(codigo)) return alert("Código inválido (3 Num + 3 Letras).");
    const tipoFinal = tipoSelecionado === "OUTRO" ? novoTipo.toUpperCase() : tipoSelecionado;
    try {
      await api.put(`/localizacoes/${id}`, { nome_local: nome, tipo_local: tipoFinal, codigo_local: codigo });
      alert("Atualizado!");
      navigate("/gerente/locais");
    } catch (e) { alert("Erro ao atualizar."); }
  }

  if(carregando) return <p style={{color:'#fff'}}>Carregando...</p>;

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2>Editar Local</h2>
          <div className="grupo-campo-mecanico"><label>Código</label><input className="input-mecanico" value={codigo} onChange={e=>setCodigo(e.target.value.toUpperCase())} maxLength={6}/></div>
          <div className="grupo-campo-mecanico"><label>Nome</label><input className="input-mecanico" value={nome} onChange={e=>setNome(e.target.value)}/></div>
          <div className="grupo-campo-mecanico"><label>Tipo</label>
            <select className="input-mecanico" value={tipoSelecionado} onChange={e=>setTipoSelecionado(e.target.value)}>
              {tiposPadrao.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="OUTRO">OUTRO...</option>
            </select>
          </div>
          {tipoSelecionado === "OUTRO" && <div className="grupo-campo-mecanico"><label>Qual?</label><input className="input-mecanico" value={novoTipo} onChange={e=>setNovoTipo(e.target.value)}/></div>}
          
          <button className="btn-primario-mecanico" style={{width:'100%'}} onClick={handleSalvar}>Salvar</button>
          <button className="btn-primario-mecanico" style={{width:'100%', marginTop:10, backgroundColor:'#444', color:'#fff'}} onClick={() => navigate("/gerente/locais")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default EditarLocal;