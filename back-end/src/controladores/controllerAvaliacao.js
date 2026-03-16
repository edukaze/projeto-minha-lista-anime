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
 async function buscarAvaliacoes(req, res) {
    try {
    //query para busca todas as avaliaçõe de um jogo
    const query = ` SELECT * FROM avaliacoes`;
    const { rows } = await pool.query(query);

   

    return res.status(200).json(rows);
    }catch (err) {
        console.error("Erro ao buscar avaliações:", err);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }
 }

 //apaga uma avaliação

 async function apagarAvaliacao(req, res) {
    const { id_jogo } = req.params;
    const id_usuario = req.userId; //do token  
 
   try {
       const query = 
       `DELETE FROM avaliacoes WHERE id_usuario = $1 AND id_jogo = $2`;
       const result = await pool.query(query, [id_usuario, id_jogo]);
      
       
       if (result.rowCount === 0) {
              return res.status(404).json({ erro: "Avaliação não encontrada" });
          }
          return res.status(200).json({ mensagem: "Avaliação apagada com sucesso" });
     }
    catch (err) {
        console.error("Erro ao apagar avaliação:", err);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }   
 }  

 // buscar avaliações de um usuario específico
 async function buscarAvaliacoesUsuario(req, res) {
    const id_usuario = req.userId; //do token   
    try {
        const query = `
        SELECT 
            a.id_jogo, 
            a.nota, 
            a.descricao, 
            g.titulo, 
            g.imagem 
        FROM avaliacoes a
        JOIN games g ON a.id_jogo = g.id
        WHERE a.id_usuario = $1
        `;
        const { rows } = await pool.query(query, [id_usuario]);
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Erro ao buscar avaliações do usuário:", err);
        return res.status(500).json({ erro: "Erro interno no servidor" });
    }   
}

module.exports = { salvarOuAtualizarAvaliacao, buscarAvaliacoes, apagarAvaliacao, buscarAvaliacoesUsuario };