// backend/src/controllers/reservas.controller.js
const db = require('../config/db');

const extrairDados = (consulta) => {
  if (Array.isArray(consulta) && Array.isArray(consulta[0])) {
    return consulta[0]; 
  }
  if (Array.isArray(consulta)) {
    return consulta;
  }
  if (consulta && typeof consulta === 'object' && 'insertId' in consulta) {
      return consulta;
  }
  if (Array.isArray(consulta) && consulta[0] && 'insertId' in consulta[0]) {
      return consulta[0];
  }
  return [];
};

exports.listarReservas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        r.id_reserva,
        r.id_mecanico,
        r.id_ferramenta,
        r.data_reserva_inicio AS data_hora_inicio,
        r.data_reserva_fim AS data_hora_fim,
        r.data_reserva_inicio,
        r.data_reserva_fim,
        r.status_reserva,
        m.nome_completo AS mecanico,
        f.nome_ferramenta,
        f.codigo_ferramenta
      FROM reservas r
      JOIN mecanicos m ON r.id_mecanico = m.id_mecanico
      JOIN ferramentas f ON r.id_ferramenta = f.id_ferramenta
      ORDER BY r.data_reserva_inicio DESC
    `;

    const consulta = await db.query(sql);
    const results = extrairDados(consulta);
    
    return res.json({ success: true, data: results });
  } catch (err) {
    console.error("Erro ao listar reservas:", err);
    return res.status(500).json({ success: false, message: "Erro no servidor." });
  }
};

exports.criarReserva = async (req, res) => {
  try {
    const id_mecanico = req.body.id_mecanico;
    let id_ferramenta = req.body.id_ferramenta;
    const codigo_ferramenta = req.body.codigo_ferramenta;
    
    const inicio = req.body.data_inicio || req.body.data_reserva_inicio;
    const fim = req.body.data_fim || req.body.data_reserva_fim;

    if (!id_mecanico || (!id_ferramenta && !codigo_ferramenta) || !inicio || !fim) {
      return res.status(400).json({ success: false, message: "Dados incompletos." });
    }

    if (!id_ferramenta) {
      const consultaBusca = await db.query("SELECT id_ferramenta FROM ferramentas WHERE codigo_ferramenta = ?", [codigo_ferramenta]);
      const ferramentas = extrairDados(consultaBusca);
      
      if (!ferramentas || ferramentas.length === 0) {
        return res.status(404).json({ success: false, message: "Ferramenta não encontrada." });
      }
      id_ferramenta = ferramentas[0].id_ferramenta;
    }

    const sqlCheckLoan = `
      SELECT id_emprestimo FROM emprestimos 
      WHERE id_ferramenta = ? 
      AND status_emprestimo IN ('ATIVO', 'ATRASADO')
      AND (
        (data_retirada BETWEEN ? AND ?) OR
        (previsao_devolucao BETWEEN ? AND ?) OR
        (? BETWEEN data_retirada AND previsao_devolucao)
      )
    `;
    const consultaLoan = await db.query(sqlCheckLoan, [id_ferramenta, inicio, fim, inicio, fim, inicio]);
    const loans = extrairDados(consultaLoan);

    if (loans && loans.length > 0) {
      return res.status(400).json({ success: false, message: "Conflito: Ferramenta está emprestada neste período." });
    }

    const sqlCheckRes = `
      SELECT id_reserva FROM reservas 
      WHERE id_ferramenta = ? 
      AND status_reserva = 'ATIVA'
      AND (
        (data_reserva_inicio BETWEEN ? AND ?) OR
        (data_reserva_fim BETWEEN ? AND ?) OR
        (? BETWEEN data_reserva_inicio AND data_reserva_fim)
      )
    `;
    const consultaRes = await db.query(sqlCheckRes, [id_ferramenta, inicio, fim, inicio, fim, inicio]);
    const reservasExistentes = extrairDados(consultaRes);

    if (reservasExistentes && reservasExistentes.length > 0) {
      return res.status(400).json({ success: false, message: "Conflito: Já existe uma reserva para este horário." });
    }

    const sqlInsert = `
      INSERT INTO reservas (id_mecanico, id_ferramenta, data_reserva_inicio, data_reserva_fim, status_reserva)
      VALUES (?, ?, ?, ?, 'ATIVA')
    `;

    const consultaInsert = await db.query(sqlInsert, [id_mecanico, id_ferramenta, inicio, fim]);
    const result = extrairDados(consultaInsert);
    
    // Pega o ID gerado
    const insertId = result.insertId || (result[0] ? result[0].insertId : 0);

    return res.json({ 
      success: true, 
      message: "Reserva criada com sucesso!", 
      id_reserva: insertId 
    });

  } catch (err) {
    console.error("Erro ao criar reserva:", err);
    return res.status(500).json({ success: false, message: "Erro ao processar reserva." });
  }
};

exports.cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM reservas WHERE id_reserva = ?";
    
    const consulta = await db.query(sql, [id]);
    const result = extrairDados(consulta);
    
    const affectedRows = result.affectedRows || (result[0] ? result[0].affectedRows : 0);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Reserva não encontrada." });
    }
    return res.json({ success: true, message: "Reserva cancelada." });

  } catch (err) {
    console.error("Erro ao cancelar:", err);
    return res.status(500).json({ success: false, message: "Erro ao cancelar reserva." });
  }
};

exports.buscarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT r.*, f.nome_ferramenta, f.codigo_ferramenta 
      FROM reservas r
      JOIN ferramentas f ON r.id_ferramenta = f.id_ferramenta
      WHERE r.id_reserva = ?
    `;
    const consulta = await db.query(sql, [id]);
    const result = extrairDados(consulta);
    
    return res.json({ success: true, data: result ? result[0] : null });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erro interno." });
  }
};

exports.atualizarReserva = async (req, res) => {
  try {
    const { id } = req.params; // ID da reserva sendo editada
    const { id_ferramenta, inicio, fim } = req.body;

    const sqlCheckLoan = `
      SELECT id_emprestimo FROM emprestimos 
      WHERE id_ferramenta = ? 
      AND status_emprestimo IN ('ATIVO', 'ATRASADO')
      AND (
        (data_retirada BETWEEN ? AND ?) OR
        (previsao_devolucao BETWEEN ? AND ?) OR
        (? BETWEEN data_retirada AND previsao_devolucao)
      )
    `;
    const consultaLoan = await db.query(sqlCheckLoan, [id_ferramenta, inicio, fim, inicio, fim, inicio]);
    const loans = extrairDados(consultaLoan);

    if (loans && loans.length > 0) {
      return res.status(400).json({ success: false, message: "Conflito: Ferramenta está emprestada neste período." });
    }

    const sqlCheckRes = `
      SELECT id_reserva FROM reservas 
      WHERE id_ferramenta = ? 
      AND status_reserva = 'ATIVA'
      AND id_reserva != ? 
      AND (
        (data_reserva_inicio BETWEEN ? AND ?) OR
        (data_reserva_fim BETWEEN ? AND ?) OR
        (? BETWEEN data_reserva_inicio AND data_reserva_fim)
      )
    `;
    const consultaRes = await db.query(sqlCheckRes, [id_ferramenta, id, inicio, fim, inicio, fim, inicio]);
    const colisoes = extrairDados(consultaRes);

    if (colisoes && colisoes.length > 0) {
      return res.status(400).json({ success: false, message: "Conflito: Já existe outra reserva neste horário." });
    }

    const sqlUpdate = `
      UPDATE reservas 
      SET data_reserva_inicio = ?, data_reserva_fim = ?
      WHERE id_reserva = ?
    `;
    await db.query(sqlUpdate, [inicio, fim, id]);

    return res.json({ success: true, message: "Reserva atualizada com sucesso!" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Erro ao atualizar reserva." });
  }
};
