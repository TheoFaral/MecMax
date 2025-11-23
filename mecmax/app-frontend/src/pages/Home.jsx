import React from "react";

function Home() {
  const mecanico = JSON.parse(localStorage.getItem("mecanicoLogado") || "null");

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Bem-vindo ao MecMax</h2>
      {mecanico ? (
        <p>Mecânico: <strong>{mecanico.nome_completo}</strong></p>
      ) : (
        <p>Nenhum mecânico logado.</p>
      )}
    </div>
  );
}

export default Home;
