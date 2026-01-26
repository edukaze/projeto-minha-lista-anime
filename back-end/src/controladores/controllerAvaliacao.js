const pool = require ("../config/db");

async function salvarOuAtualizarAvaliacao(req, res) {
    
    const {id_jogo, nota, descricao} = req.body;
    const id_usuario = req.userId //do token

    try{
        const query = `
        INSERT INTO avaliacoes (id_usuario, id_jogo, nota, descricao)
        Values ($1, $2, $3, $4)
        ON CONFLICT  (id_usuario, id_jogo)
        DO UPDATE SET nota = EXCLUDED.nota, descricao = EXCLUDED.descricao;
        `;
        await pool.query(query, [id_usuario, id_jogo, nota, descricao]);

        return res.status(200).json({mensagem: "Avaliação salva com sucesso"});
    }   catch (err) {
            console.error("Erro ao salvar avaliação:", err);
            return res.status(500).json({ erro: "Erro interno no servidor" });
    }
}

module.exports = { salvarOuAtualizarAvaliacao };