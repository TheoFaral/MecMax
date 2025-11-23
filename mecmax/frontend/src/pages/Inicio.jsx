// frontend/src/pages/Inicio.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/inicio.css";

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <div className="inicio-cabecalho">
        <h1>MecMax</h1>
        <p>Sistema de Gestão de Ferramentas</p>
      </div>

      <div className="cards-wrapper">
        {/* Card Mecânico */}
        <div 
          className="card-perfil" 
          onClick={() => navigate("/login-mecanico")}
        >
          <div className="icone-circulo">🔧</div>
          <h2>Sou Mecânico</h2>
          <p>Solicitar empréstimos, reservas e consultar ferramentas.</p>
        </div>

        {/* Card Gerente */}
        <div 
          className="card-perfil"
          onClick={() => navigate("/gerente/painel")}
        >
          <div className="icone-circulo">👔</div>
          <h2>Sou Gerente</h2>
          <p>Administrar estoque, cadastros e relatórios.</p>
        </div>
      </div>
    </div>
  );
}

export default Inicio;