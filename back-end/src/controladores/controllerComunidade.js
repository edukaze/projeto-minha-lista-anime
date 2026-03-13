const pool = require("../config/db");

async function listaAvaliaçõesPublicas(req, res) {

    try{
        const query = `
    SELECT 
        g.id AS id_jogo,
        g.titulo AS jogo_titulo,
        g.imagem AS jogo_imagem,
        ROUND(AVG(a.nota), 1) AS media_nota,
        COUNT(a.id_avaliacao) AS total_resenhas,
        -- Buscamos o comentário mais recente deste jogo específico
        (SELECT descricao FROM avaliacoes WHERE id_jogo = g.id ORDER BY id_avaliacao DESC LIMIT 1) AS ultima_descricao,
        -- Buscamos o nome do usuário que fez esse último comentário
        (SELECT u.username FROM avaliacoes av 
         INNER JOIN usuarios u ON av.id_usuario = u.id 
         WHERE av.id_jogo = g.id 
         ORDER BY av.id_avaliacao DESC LIMIT 1) AS ultimo_usuario
    FROM games g
    INNER JOIN avaliacoes a ON g.id = a.id_jogo
    GROUP BY g.id, g.titulo, g.imagem
    ORDER BY MAX(a.id_avaliacao) DESC 
    LIMIT 20;
`;
        const resultado =  await pool.query(query);
        
        res.status(200).json(resultado.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("Erro ao carregar comunidade");
    }
    
}
async function buscaDetalhesJogo(req, res) {
    const{ id } = req.params; 

    try{
        //busca informações do jogo
        const jogoQuery = "SELECT id, titulo, imagem, genero, plataforma, ano, desenvolvedora FROM games WHERE id = $1";
        const jogoResult = await pool.query(jogoQuery, [id]); 
        if(jogoResult.rows.length === 0){
            return res.status(404).send("Jogo não encontrado");
        }

        //busca avaliações do jogo
        const avaliacoesQuery = `
            SELECT 
                a.nota, 
                a.descricao, 
                u.username AS usuario_nome
            FROM avaliacoes a
            INNER JOIN usuarios u ON a.id_usuario = u.id
            WHERE a.id_jogo = $1
            Order BY a.id_avaliacao DESC;
        `;
        const avaliacoesResult = await pool.query(avaliacoesQuery, [id]);
        const resposta = {
            ...jogoResult.rows[0],
            avaliacoes: avaliacoesResult.rows,
            mediaNota: avaliacoesResult.rows.reduce((acc, av) => acc + av.nota, 0) / avaliacoesResult.rows.length || 0
        };
        res.status(200).json(resposta);
    }catch(err){
        console.error(err);
        res.status(500).send("Erro ao carregar detalhes do jogo");
    }
}

module.exports = {listaAvaliaçõesPublicas, buscaDetalhesJogo};