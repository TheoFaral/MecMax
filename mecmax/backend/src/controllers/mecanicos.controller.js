// backend/src/controllers/mecanicos.controller.js
const db = require("../config/db");

const extrairDados = (consulta) => {
  if (Array.isArray(consulta) && Array.isArray(consulta[0])) return consulta[0];
  if (Array.isArray(consulta)) return consulta;
  return [];
};

// Matricula
exports.login = async (req, res) => {
  try {
    const { matricula } = req.body;
    if (!matricula) return res.status(400).json({ success: false, message: "Informe a matrícula." });

    const sql = "SELECT id_mecanico, matricula, nome_completo, status_usuario FROM mecanicos WHERE matricula = ?";
    const consulta = await db.query(sql, [matricula]);
    const results = extrairDados(consulta);

    if (results && results.length > 0) {
      const mecanico = results[0];
      if (mecanico.status_usuario === 'INATIVO') return res.status(401).json({ success: false, message: "Usuário inativo." });
      return res.json({ success: true, message: "Login ok!", data: mecanico });
    } else {
      return res.status(404).json({ success: false, message: "Matrícula não encontrada." });
    }
  } catch (err) { return res.status(500).json({ success: false, message: "Erro interno." }); }
};

// Listar (SÓ ATIVOS)
exports.listarMecanicos = async (req, res) => {
  try {
    const sql = "SELECT id_mecanico, matricula, nome_completo, status_usuario FROM mecanicos WHERE status_usuario = 'ATIVO' ORDER BY nome_completo";
    const consulta = await db.query(sql);
    return res.json({ success: true, data: extrairDados(consulta) });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro interno." }); }
};

// Criar
exports.criarMecanico = async (req, res) => {
  try {
    const { matricula, nome_completo } = req.body;
    if (!matricula || !nome_completo) return res.status(400).json({ success: false, message: "Dados incompletos." });

    const consultaExistente = await db.query("SELECT id_mecanico FROM mecanicos WHERE matricula = ?", [matricula]);
    const existente = extrairDados(consultaExistente);

    if (existente && existente.length > 0) {
      return res.status(409).json({ success: false, message: "Esta matrícula já existe." });
    }

    await db.query("INSERT INTO mecanicos (matricula, nome_completo, status_usuario) VALUES (?, ?, 'ATIVO')", [matricula, nome_completo]);
    return res.status(201).json({ success: true, message: "Cadastrado!" });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro ao cadastrar." }); }
};

// Buscar por ID
exports.buscarMecanico = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = await db.query("SELECT * FROM mecanicos WHERE id_mecanico = ?", [id]);
    const results = extrairDados(consulta);
    if (results && results.length > 0) return res.json({ success: true, data: results[0] });
    return res.status(404).json({ success: false, message: "Não encontrado." });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};

//ATUALIZAR 
exports.atualizarMecanico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_completo, matricula } = req.body; 
    
    const checkSql = "SELECT id_mecanico FROM mecanicos WHERE matricula = ? AND id_mecanico != ?";
    const checkQuery = await db.query(checkSql, [matricula, id]);
    const existe = extrairDados(checkQuery);

    if (existe && existe.length > 0) {
      return res.status(409).json({ success: false, message: "Erro: Matrícula já pertence a outro mecânico." });
    }

    await db.query("UPDATE mecanicos SET nome_completo = ?, matricula = ? WHERE id_mecanico = ?", [nome_completo, matricula, id]);
    return res.json({ success: true, message: "Atualizado com sucesso." });
  } catch (err) { 
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro ao atualizar." }); 
  }
};

// Excluir
exports.excluirMecanico = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE mecanicos SET status_usuario = 'INATIVO' WHERE id_mecanico = ?", [id]);
    return res.json({ success: true, message: "Excluído." });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};