const pool =require("../config/db");

const listarJogos = async (req, res) => {
  try {
    //  Extrair os parâmetros da query string
    // Definimos valores padrão caso eles não venham na requisição
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const busca = req.query.busca || ""; 

    // generos
    const generoId = req.query.genero || null; 
    //  Calcular o deslocamento (offset) para a paginação
    const offset = (page - 1) * limit;

    //  Criar a Query SQL com filtro de busca
    // O ILIKE pesquisa nomes parciais e ignora maiúsculas/minúsculas
    const query = `
      SELECT DISTINCT g.* FROM games g
      LEFT JOIN game_generos gg ON g.id = gg.game_id
      WHERE g.titulo ILIKE $1 
      AND ($4::integer IS NULL OR gg.genero_id = $4)
      ORDER BY g.titulo ASC 
      LIMIT $2 OFFSET $3
    `;

    // O termo de busca precisa dos símbolos % para busca parcial
    const values = [`%${busca}%`, limit, offset, generoId];

    const { rows } = await pool.query(query, values);

    const countQuery = `
      SELECT COUNT(DISTINCT g.id) 
      FROM games g
      LEFT JOIN game_generos gg ON g.id = gg.game_id
      WHERE g.titulo ILIKE $1 
      AND ($2::integer IS NULL OR gg.genero_id = $2)
    `;

    //  (Opcional) Buscar o total de páginas para o frontend saber quando parar
    
    const totalRes = await pool.query(countQuery, [`%${busca}%`, generoId]);
    const totalItems = parseInt(totalRes.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    //  Enviar a resposta formatada
    res.json({
      jogos: rows,
      totalPages: totalPages,
      currentPage: page
    });

  } catch (error) {
    console.error("Erro no controlador de jogos:", error);
    res.status(500).json({ error: "Erro ao buscar jogos do servidor." });
  }
};

const listarGeneros = async (req, res) => {
  try {
    const query = "SELECT * FROM generos ORDER BY nome ASC";
    const { rows } = await pool.query(query);
    res.json({ generos: rows });
  } catch (error) {
    console.error("Erro no controlador de gêneros:", error);
    res.status(500).json({ error: "Erro ao buscar gêneros do servidor." });
  }
};


module.exports = 
{listarJogos, 
listarGeneros};