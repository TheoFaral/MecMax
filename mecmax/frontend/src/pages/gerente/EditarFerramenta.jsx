// frontend/src/pages/gerente/EditarFerramenta.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/layoutMecanico.css";

function EditarFerramenta() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [codigo, setCodigo] = useState(""); // Estado para o código
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("1");
  const [observacoes, setObservacoes] = useState("");
  const [idStatus, setIdStatus] = useState("1"); 
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const resp = await api.get(`/ferramentas/${id}`);
        const f = resp.data.data;
        if (f) {
          setCodigo(f.codigo_ferramenta);
          setNome(f.nome_ferramenta);
          setMarca(f.marca);
          setCategoria(f.id_categoria);
          setObservacoes(f.descricao || "");
          setIdStatus(f.id_status);
        }
      } catch (e) { alert("Erro ao carregar."); navigate("/gerente/ferramentas"); }
      finally { setCarregando(false); }
    }
    carregar();
  }, [id, navigate]);

  async function handleSalvar() {
    try {
      await api.put(`/ferramentas/${id}`, { 
          codigo_ferramenta: codigo, // ENVIA O CÓDIGO EDITADO
          nome_ferramenta: nome, 
          marca, 
          id_categoria: categoria, 
          observacoes,
          id_status: idStatus
      });
      alert("Atualizado!");
      navigate("/gerente/ferramentas");
    } catch (e) { alert("Erro ao atualizar."); }
  }

  if(carregando) return <p style={{color:'#fff', padding: 20}}>Carregando...</p>;

  return (
    <div className="pagina-mecanico">
      <div className="container-mecanico">
        <div className="card-form-mecanico">
          <h2>Editar Ferramenta</h2>
          
          <div className="grupo-campo-mecanico">
            <label>Código</label>
            {/* CAMPO AGORA EDITÁVEL (Sem disabled) */}
            <input 
              className="input-mecanico" 
              value={codigo} 
              onChange={e => setCodigo(e.target.value.toUpperCase())} 
            />
          </div>
          
          <div className="grupo-campo-mecanico">
            <label>Nome</label>
            <input className="input-mecanico" value={nome} onChange={e=>setNome(e.target.value)}/>
          </div>
          
          <div className="grupo-campo-mecanico">
            <label>Marca</label>
            <input className="input-mecanico" value={marca} onChange={e=>setMarca(e.target.value)}/>
          </div>
          
          <div className="grupo-campo-mecanico">
            <label>Status Atual</label>
            <select className="input-mecanico" value={idStatus} onChange={e => setIdStatus(e.target.value)}>
              <option value="1">DISPONÍVEL</option>
              <option value="3">EM MANUTENÇÃO</option>
              <option value="5">INATIVA (Excluída)</option>
              {idStatus == 2 && <option value="2" disabled>EMPRESTADA (Devolva pelo sistema)</option>}
            </select>
          </div>

          <div className="grupo-campo-mecanico">
            <label>Categoria</label>
            <select className="input-mecanico" value={categoria} onChange={e=>setCategoria(e.target.value)}>
              <option value="1">Manuais</option><option value="2">Elétricas</option><option value="3">Diagnóstico</option><option value="4">Pneumáticas</option><option value="5">Especiais</option><option value="7">Elevação</option>
            </select>
          </div>
          
          <div className="grupo-campo-mecanico">
            <label>Observações</label>
            <textarea className="input-mecanico" rows="3" value={observacoes} onChange={e=>setObservacoes(e.target.value)}/>
          </div>
          
          <button className="btn-primario-mecanico" style={{width:'100%'}} onClick={handleSalvar}>Salvar</button>
          <button className="btn-primario-mecanico" style={{width:'100%', marginTop:10, backgroundColor:'#444', color:'#fff'}} onClick={() => navigate("/gerente/ferramentas")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default EditarFerramenta;