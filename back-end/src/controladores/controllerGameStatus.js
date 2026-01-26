const pool = require("../config/db");

// LISTAR status dos jogos do usuário
async function listarStatus(req, res) {
  try {
    const usuarioId = req.userId;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    // Usamos o JOIN para buscar os dados do jogo junto com o status
    const { rows } = await pool.query(
      `SELECT 
        gs.game_id, 
        gs.status, 
        g.titulo, 
        g.imagem 
       FROM status_games gs
       JOIN games g ON gs.game_id = g.id
       WHERE gs.usuario_id = $1`,
      [usuarioId]
    );

    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao listar status" });
  }
}

// SALVAR ou ATUALIZAR status do jogo
async function salvarStatusGame(req, res) {
  try {
    const usuarioId = req.userId;
    const { game_id, status } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (!game_id || !status) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    await pool.query(
      `
      INSERT INTO status_games (usuario_id, game_id, status)
      VALUES ($1, $2, $3)
      ON CONFLICT (usuario_id, game_id)
      DO UPDATE SET status = EXCLUDED.status
      `,
      [usuarioId, game_id, status]
    );

    return res.json({ msg: "Status salvo com sucesso" });
  } catch (error) {
    console.error("ERRO DETALHADO DO BANCO:", error.message);
    return res.status(500).json({ erro: "Erro ao salvar status",
      detalhe: error.message
     });
    
  }
}

async function excluirStatus(req, res) {
  const { game_id } = req.params;
  const usuario_id = req.userId; 

  try {
    const resultado = await pool.query(
      "DELETE FROM status_games WHERE usuario_id = $1 AND game_id = $2",
      [usuario_id, game_id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Jogo não encontrado na sua lista" });
    }

    res.json({ msg: "Removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro interno ao deletar" });
  }
}

module.exports = {
  listarStatus,
  salvarStatusGame,
  excluirStatus
};
