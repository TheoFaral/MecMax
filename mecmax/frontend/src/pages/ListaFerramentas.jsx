// src/pages/ListaFerramentas.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

function ListaFerramentas() {
  const [ferramentas, setFerramentas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get("/ferramentas");
        if (response.data.success) {
          setFerramentas(response.data.data);
        } else {
          setErro("Erro ao carregar ferramentas.");
        }
      } catch (e) {
        setErro("Erro ao conectar com a API.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>Lista de Ferramentas</h2>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Status</th>
            <th>Local</th>
          </tr>
        </thead>
        <tbody>
          {ferramentas.map((f) => (
            <tr key={f.id_ferramenta}>
              <td>{f.codigo_ferramenta}</td>
              <td>{f.nome_ferramenta}</td>
              <td>{f.status_ferramenta}</td>
              {/* Se não houver local_atual (DISPONIVEL/MANUTENCAO), mostra "-" */}
              <td>{f.local_atual || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaFerramentas;
