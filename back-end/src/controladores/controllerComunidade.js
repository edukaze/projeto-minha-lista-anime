const pool = require("../config/db");

async function listaAvaliaçõesPublicas(req, res) {

    try{
        const query = `
            SELECT 
                a.nota, 
                a.descricao, 
                u.username AS usuario_nome, 
                g.titulo AS jogo_titulo,
                g.imagem AS jogo_imagem
            FROM avaliacoes a
            INNER JOIN usuarios u ON a.id_usuario = u.id
            INNER JOIN games g ON a.id_jogo = g.id
            ORDER BY a.id_avaliacao DESC LIMIT 20; 
        `;
        const resultado = pool.query(query);
        res.status(200).json(resultado.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("Erro ao carregar comunidade");
    }
    
}

module.exports = {listaAvaliaçõesPublicas};