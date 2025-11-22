// backend/src/controllers/ferramentas.controller.js
const db = require("../config/db");

const extrairDados = (consulta) => {
  if (Array.isArray(consulta) && Array.isArray(consulta[0])) return consulta[0];
  if (Array.isArray(consulta)) return consulta;
  if (consulta && consulta.insertId) return consulta;
  if (Array.isArray(consulta) && consulta[0] && consulta[0].insertId) return consulta[0];
  return [];
};

exports.listarFerramentas = async (req, res) => {
  try {
    const sql = "SELECT * FROM ferramentas";
    const consulta = await db.query(sql);
    return res.json({ success: true, data: extrairDados(consulta) });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};

exports.listarFerramentasCompleto = async (req, res) => {
  try {
    const sql = `
      SELECT f.id_ferramenta, f.codigo_ferramenta, f.nome_ferramenta, f.descricao,
             sf.descricao_status AS status_ferramenta, f.id_status,
             e.id_emprestimo, e.local_uso, e.previsao_devolucao AS previsao, 
             m.nome_completo AS mecanico, m.id_mecanico
      FROM ferramentas f
      LEFT JOIN status_ferramenta sf ON f.id_status = sf.id_status
      LEFT JOIN emprestimos e ON f.id_ferramenta = e.id_ferramenta AND e.status_emprestimo IN ('ATIVO', 'ATRASADO')
      LEFT JOIN mecanicos m ON e.id_mecanico = m.id_mecanico
      ORDER BY f.nome_ferramenta ASC
    `;
    const consulta = await db.query(sql);
    const results = extrairDados(consulta);
    const dados = Array.isArray(results) ? results.map(item => ({
      ...item, status: item.id_emprestimo ? 'EMPRESTADA' : item.status_ferramenta
    })) : [];
    return res.json({ success: true, data: dados });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};

exports.criarFerramenta = async (req, res) => {
  try {
    const { codigo_ferramenta, nome_ferramenta, marca, id_categoria, observacoes } = req.body;
    if (!codigo_ferramenta || !nome_ferramenta) return res.status(400).json({ success: false, message: "Dados incompletos." });

    const checkQuery = await db.query("SELECT id_ferramenta FROM ferramentas WHERE codigo_ferramenta = ?", [codigo_ferramenta]);
    const existe = extrairDados(checkQuery);
    if (existe && existe.length > 0) return res.status(409).json({ success: false, message: "Código já existe." });

    await db.query("INSERT INTO ferramentas (codigo_ferramenta, nome_ferramenta, marca, id_categoria, descricao, id_status, data_aquisicao) VALUES (?, ?, ?, ?, ?, 1, NOW())", [codigo_ferramenta, nome_ferramenta, marca, id_categoria, observacoes]);
    return res.status(201).json({ success: true, message: "Cadastrado!" });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro ao cadastrar." }); }
};

exports.buscarFerramenta = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = await db.query("SELECT * FROM ferramentas WHERE id_ferramenta = ?", [id]);
    const result = extrairDados(consulta);
    return res.json({ success: true, data: result ? result[0] : null });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};

exports.atualizarFerramenta = async (req, res) => {
  try {
    const { id } = req.params;
    // Recebe codigo_ferramenta para atualizar
    const { nome_ferramenta, marca, id_categoria, observacoes, id_status, codigo_ferramenta } = req.body;
    
    await db.query(
      "UPDATE ferramentas SET nome_ferramenta=?, marca=?, id_categoria=?, descricao=?, id_status=?, codigo_ferramenta=? WHERE id_ferramenta=?", 
      [nome_ferramenta, marca, id_categoria, observacoes, id_status, codigo_ferramenta, id]
    );
    return res.json({ success: true, message: "Atualizado!" });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};

exports.excluirFerramenta = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE ferramentas SET id_status = 5 WHERE id_ferramenta = ?", [id]);
    return res.json({ success: true, message: "Inativada." });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};

exports.enviarManutencao = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE ferramentas SET id_status = 3 WHERE id_ferramenta = ?", [id]);
    return res.json({ success: true, message: "Em manutenção." });
  } catch (err) { return res.status(500).json({ success: false, message: "Erro." }); }
};