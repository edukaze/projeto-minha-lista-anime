const pool = require("../config/db");

// LISTAR status dos jogos do usuário
async function listarStatus(req, res) {
  try {
    const usuarioId = req.userId;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    const { rows } = await pool.query(
      "SELECT game_id, status FROM status_games WHERE usuario_id = $1",
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

module.exports = {
  listarStatus,
  salvarStatusGame
};
