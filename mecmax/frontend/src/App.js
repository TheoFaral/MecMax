import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Inicio from "./pages/Inicio";

import LoginMecanico from "./pages/LoginMecanico";
import ConsultaFerramentas from "./pages/ConsultaFerramentas";
import Emprestar from "./pages/Emprestar";
import EditarEmprestimo from "./pages/EditarEmprestimo";
import ListaReservas from "./pages/ListaReservas";
import NovaReserva from "./pages/NovaReserva";
import EditarReserva from "./pages/EditarReserva"; 
import PrivateRoute from "./components/PrivateRoute";

import PainelGerente from "./pages/gerente/PainelGerente";
import GerenciarFerramentas from "./pages/gerente/GerenciarFerramentas";
import NovaFerramenta from "./pages/gerente/NovaFerramenta";
import EditarFerramenta from "./pages/gerente/EditarFerramenta"; 
import GerenciarMecanicos from "./pages/gerente/GerenciarMecanicos";
import NovoMecanico from "./pages/gerente/NovoMecanico";
import EditarMecanico from "./pages/gerente/EditarMecanico"; 
import GerenciarLocais from "./pages/gerente/GerenciarLocais";
import NovoLocal from "./pages/gerente/NovoLocal";
import EditarLocal from "./pages/gerente/EditarLocal"; 
import Relatorios from "./pages/gerente/Relatorios";


function LayoutMecanico({ children }) {
  const navigate = useNavigate();
  const mecanicoLogado = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");
  return (
    <div>
      <header style={{ padding: 10, backgroundColor: "#222", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#ffc400' }}>MecMax</h1>
          <nav style={{ marginTop: 4, fontSize: '0.9rem' }}>
            <Link to="/consulta-ferramentas" style={{ color: "#fff", marginRight: 15, textDecoration: 'none' }}>Empréstimo / Consulta</Link>
            <Link to="/reservas" style={{ color: "#fff", marginRight: 15, textDecoration: 'none' }}>Reservas / Consulta</Link>
          </nav>
        </div>
        <div style={{ fontSize: '0.9rem' }}>
          {mecanicoLogado && (
            <>
              <span style={{ marginRight: 10 }}>Olá, {mecanicoLogado.nome_completo.split(' ')[0]}</span>
              <button onClick={() => { localStorage.removeItem("mecanicoLogado"); navigate("/"); }} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
            </>
          )}
        </div>
      </header>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}

function LayoutGerente({ children }) {
  return (
    <div>
      <header style={{ padding: "15px 20px", backgroundColor: "#1f2228", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2 style={{ margin: 0, color: "#ffc400", fontSize: '1.4rem' }}>MecMax <span style={{color: "#fff", fontSize: "0.6em"}}>| Gerente</span></h2>
          <nav style={{ display: 'flex', gap: '15px' }}>
             <Link to="/gerente/painel" style={{ color: '#fff', textDecoration: 'none' }}>Painel</Link>
             <Link to="/gerente/ferramentas" style={{ color: '#aaa', textDecoration: 'none' }}>Ferramentas</Link>
             <Link to="/gerente/mecanicos" style={{ color: '#aaa', textDecoration: 'none' }}>Mecânicos</Link>
             <Link to="/gerente/locais" style={{ color: '#aaa', textDecoration: 'none' }}>Locais</Link>
          </nav>
        </div>
        <Link to="/" style={{ color: "#aaa", textDecoration: "none", fontWeight: "bold" }}>Sair</Link>
      </header>
      <div className="pagina-mecanico" style={{ minHeight: 'calc(100vh - 70px)' }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        
        <Route path="/login-mecanico" element={<LoginMecanico onLoginSuccess={(mec) => { localStorage.setItem("mecanicoLogado", JSON.stringify(mec)); window.location.href = "/consulta-ferramentas"; }} />} />
        <Route path="/consulta-ferramentas" element={<PrivateRoute><LayoutMecanico><ConsultaFerramentas /></LayoutMecanico></PrivateRoute>} />
        <Route path="/emprestar/:codigo" element={<PrivateRoute><LayoutMecanico><Emprestar /></LayoutMecanico></PrivateRoute>} />
        <Route path="/editar/:id" element={<PrivateRoute><LayoutMecanico><EditarEmprestimo /></LayoutMecanico></PrivateRoute>} />
        <Route path="/reservas" element={<PrivateRoute><LayoutMecanico><ListaReservas /></LayoutMecanico></PrivateRoute>} />
        <Route path="/nova-reserva" element={<PrivateRoute><LayoutMecanico><NovaReserva /></LayoutMecanico></PrivateRoute>} />
        <Route path="/reservas/editar/:id" element={<PrivateRoute><LayoutMecanico><EditarReserva /></LayoutMecanico></PrivateRoute>} />

        <Route path="/gerente/painel" element={<LayoutGerente><PainelGerente /></LayoutGerente>} />
        <Route path="/gerente/ferramentas" element={<LayoutGerente><GerenciarFerramentas /></LayoutGerente>} />
        <Route path="/gerente/nova-ferramenta" element={<LayoutGerente><NovaFerramenta /></LayoutGerente>} />
        <Route path="/gerente/editar-ferramenta/:id" element={<LayoutGerente><EditarFerramenta /></LayoutGerente>} />
        <Route path="/gerente/mecanicos" element={<LayoutGerente><GerenciarMecanicos /></LayoutGerente>} />
        <Route path="/gerente/novo-mecanico" element={<LayoutGerente><NovoMecanico /></LayoutGerente>} />
        <Route path="/gerente/editar-mecanico/:id" element={<LayoutGerente><EditarMecanico /></LayoutGerente>} />
        <Route path="/gerente/locais" element={<LayoutGerente><GerenciarLocais /></LayoutGerente>} />
        <Route path="/gerente/novo-local" element={<LayoutGerente><NovoLocal /></LayoutGerente>} />
        <Route path="/gerente/editar-local/:id" element={<LayoutGerente><EditarLocal /></LayoutGerente>} />
        <Route path="/gerente/relatorios" element={<LayoutGerente><Relatorios /></LayoutGerente>} />
      </Routes>
    </Router>
  );
}

export default App;