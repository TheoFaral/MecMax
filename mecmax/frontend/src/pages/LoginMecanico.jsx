// frontend/src/pages/LoginMecanico.jsx
import React, { useState } from "react";
import api from "../services/api";
import "../styles/layoutMecanico.css";

function LoginMecanico({ onLoginSuccess }) {
  const [matricula, setMatricula] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    // 1. Validação de preenchimento
    if (!matricula) {
      return setErro("Digite a matrícula.");
    }

    // 2. Validação de formato (Exatamente 6 dígitos)
    const regexMatricula = /^\d{6}$/;
    
    if (!regexMatricula.test(matricula)) {
      return setErro("A matrícula deve conter exatamente 6 números.");
    }

    try {
      const resp = await api.post("/mecanicos/login", { matricula });
      if (resp.data.success) {
        onLoginSuccess(resp.data.data);
      } else {
        setErro(resp.data.message);
      }
    } catch (error) {
      setErro(error.response?.data?.message || "Erro de conexão.");
    }
  }

  return (
    <div className="pagina-mecanico" style={{ padding: 0 }}>
      <header style={{ padding: "15px 20px", backgroundColor: "#1f2228", borderBottom: "1px solid #333", marginBottom: "40px" }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#ffc400' }}>MecMax</h1>
      </header>

      <div className="container-mecanico" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card-form-mecanico" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="titulo-form-mecanico" style={{ textAlign: 'center' }}>Acesso do Mecânico</h2>
          
          {erro && <div style={{ backgroundColor: '#ff5252', color: '#fff', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>{erro}</div>}

          <form onSubmit={handleLogin}>
            <div className="grupo-campo-mecanico">
              <label>Matrícula</label>
              <input
                type="text"
                className="input-mecanico"
                placeholder="Ex: 100001"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                maxLength={6} 
                autoFocus
              />
            </div>
            <button className="btn-primario-mecanico" style={{ width: "100%", marginTop: "10px" }}>
              Entrar
            </button>
          </form>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Voltar ao Início</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginMecanico;