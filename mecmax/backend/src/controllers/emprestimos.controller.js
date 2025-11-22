// backend/src/controllers/emprestimos.controller.js
const db = require("../config/db");

const extrairDados = (consulta) => {
  if (Array.isArray(consulta) && Array.isArray(consulta[0])) {
    return consulta[0]; 
  }
  if (Array.isArray(consulta)) {
    return consulta;
  }
  return [];
};

exports.listarEmprestimos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.id_emprestimo,
        e.data_retirada,
        e.previsao_devolucao,
        e.data_devolucao,
        e.status_emprestimo,
        f.codigo_ferramenta,
        f.nome_ferramenta,
        m.nome_completo AS nome_mecanico
      FROM emprestimos e
      JOIN ferramentas f ON e.id_ferramenta = f.id_ferramenta
      JOIN mecanicos m ON e.id_mecanico = m.id_mecanico
      ORDER BY e.data_retirada DESC
    `;
    const consulta = await db.query(sql);
    const results = extrairDados(consulta);

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("Erro ao listar empréstimos:", err);
    return res.status(500).json({ success: false, message: "Erro interno." });
  }
};

exports.listarEmprestimosPorMecanico = async (req, res) => {
  try {
    const { idMecanico } = req.params;
    const sql = `
      SELECT 
        e.id_emprestimo,
        e.data_retirada,
        e.previsao_devolucao,
        e.data_devolucao,
        e.status_emprestimo,
        e.local_uso,
        f.codigo_ferramenta,
        f.nome_ferramenta
      FROM emprestimos e
      JOIN ferramentas f ON e.id_ferramenta = f.id_ferramenta
      WHERE e.id_mecanico = ?
      ORDER BY e.data_retirada DESC
    `;
    const consulta = await db.query(sql, [idMecanico]);
    const results = extrairDados(consulta);

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("Erro ao listar por mecânico:", err);
    return res.status(500).json({ success: false, message: "Erro interno." });
  }
};


exports.criarEmprestimo = async (req, res) => {
  try {
    const { id_mecanico, codigo_ferramenta, previsao_devolucao, local_uso } = req.body;

    if (!id_mecanico || !codigo_ferramenta || !previsao_devolucao) {
      return res.status(400).json({ success: false, message: "Dados incompletos." });
    }

    const consultaFerr = await db.query("SELECT id_ferramenta, id_status FROM ferramentas WHERE codigo_ferramenta = ?", [codigo_ferramenta]);
    const ferramentas = extrairDados(consultaFerr);
    
    if (!ferramentas || ferramentas.length === 0) {
      return res.status(404).json({ success: false, message: "Ferramenta não encontrada." });
    }


    const ferramenta = ferramentas[0];

    if (ferramenta.id_status !== 1) {
      return res.status(400).json({ success: false, message: "Ferramenta não está disponível." });
    }

    const sqlInsert = `
      INSERT INTO emprestimos (id_mecanico, id_ferramenta, previsao_devolucao, local_uso, status_emprestimo)
      VALUES (?, ?, ?, ?, 'ATIVO')
    `;
    
    await db.query(sqlInsert, [id_mecanico, ferramenta.id_ferramenta, previsao_devolucao, local_uso]);

    return res.json({ success: true, message: "Empréstimo registrado com sucesso." });

  } catch (err) {
    console.error("Erro ao criar empréstimo:", err);
    return res.status(500).json({ success: false, message: "Erro ao registrar empréstimo." });
  }
};

exports.buscarEmprestimo = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT e.*, f.codigo_ferramenta, f.nome_ferramenta 
      FROM emprestimos e
      JOIN ferramentas f ON e.id_ferramenta = f.id_ferramenta
      WHERE e.id_emprestimo = ?
    `;
    const consulta = await db.query(sql, [id]);
    const results = extrairDados(consulta);
    
    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "Empréstimo não encontrado" });
    }
    return res.json({ success: true, data: results[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro interno." });
  }
};

exports.atualizarEmprestimo = async (req, res) => {
  try {
    const { id } = req.params;
    const { previsao_devolucao, local_uso } = req.body;
    
    await db.query(
      "UPDATE emprestimos SET previsao_devolucao = ?, local_uso = ? WHERE id_emprestimo = ?",
      [previsao_devolucao, local_uso, id]
    );
    
    return res.json({ success: true, message: "Atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro ao atualizar." });
  }
};

exports.devolverFerramenta = async (req, res) => {
  try {
    const { id } = req.params; 
    const sql = `
      UPDATE emprestimos 
      SET status_emprestimo = 'FINALIZADO', data_devolucao = NOW() 
      WHERE id_emprestimo = ?
    `;
    await db.query(sql, [id]);
    return res.json({ success: true, message: "Devolução registrada." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro ao devolver." });
  }
};

exports.relatorioGeral = async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.id_emprestimo,
        f.codigo_ferramenta,
        f.nome_ferramenta,
        m.nome_completo AS mecanico,
        e.data_retirada,
        e.data_devolucao,
        e.status_emprestimo,
        e.local_uso
      FROM emprestimos e
      JOIN ferramentas f ON e.id_ferramenta = f.id_ferramenta
      JOIN mecanicos m ON e.id_mecanico = m.id_mecanico
      ORDER BY e.data_retirada DESC
    `;
    
    const consulta = await db.query(sql);
    const results = extrairDados(consulta);

    return res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro ao gerar relatório." });
  }
};