// frontend/src/pages/gerente/PainelGerente.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/layoutMecanico.css"; 

function PainelGerente() {
  const navigate = useNavigate();

  return (
    <div className="pagina-mecanico">
      <header style={{
        backgroundColor: "#1f2228", 
        padding: "15px 20px", 
        borderBottom: "1px solid #333",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <h2 style={{ margin: 0, color: "#ffc400" }}>
          MecMax <span style={{color: "#fff", fontSize: "0.6em"}}>| Módulo Gerencial</span>
        </h2>
        <nav>
          <Link to="/" style={{ color: "#aaa", textDecoration: "none", fontWeight: "bold" }}>Sair</Link>
        </nav>
      </header>

      <div className="container-mecanico">
        <h2 className="titulo">Visão Geral</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          
          {/* 1. Ferramentas */}
          <div className="card-form-mecanico" style={{ maxWidth: '100%', textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛠️</div>
            <h3 style={{ color: "#fff", marginBottom: '10px' }}>Ferramentas</h3>
            <button className="btn-primario-mecanico" style={{ width: '100%' }} onClick={() => navigate("/gerente/ferramentas")}>
              Gerenciar
            </button>
          </div>

          {/* 2. Mecânicos */}
          <div className="card-form-mecanico" style={{ maxWidth: '100%', textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👷‍♂️</div>
            <h3 style={{ color: "#fff", marginBottom: '10px' }}>Mecânicos</h3>
            <button className="btn-primario-mecanico" style={{ width: '100%' }} onClick={() => navigate("/gerente/mecanicos")}>
              Gerenciar
            </button>
          </div>

          {/* 3. Locais */}
          <div className="card-form-mecanico" style={{ maxWidth: '100%', textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📍</div>
            <h3 style={{ color: "#fff", marginBottom: '10px' }}>Locais</h3>
            <button className="btn-primario-mecanico" style={{ width: '100%' }} onClick={() => navigate("/gerente/locais")}>
              Gerenciar
            </button>
          </div>

          {/* 4. Relatórios (CORRIGIDO AQUI) */}
          <div className="card-form-mecanico" style={{ maxWidth: '100%', textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
            <h3 style={{ color: "#fff", marginBottom: '10px' }}>Relatórios</h3>
            <button 
              className="btn-primario-mecanico" 
              style={{ width: '100%' }} 
              onClick={() => navigate("/gerente/relatorios")} 
            >
              Ver Histórico
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PainelGerente;