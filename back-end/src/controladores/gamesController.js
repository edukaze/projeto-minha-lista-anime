const pool =require("../config/db");

const listarJogos = async (req, res) => {
  try {
    //  Extrair os parâmetros da query string
    // Definimos valores padrão caso eles não venham na requisição
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const busca = req.query.busca || ""; 

    //  Calcular o deslocamento (offset) para a paginação
    const offset = (page - 1) * limit;

    //  Criar a Query SQL com filtro de busca
    // O ILIKE pesquisa nomes parciais e ignora maiúsculas/minúsculas
    const query = `
      SELECT * FROM games 
      WHERE titulo ILIKE $1 
      ORDER BY titulo ASC 
      LIMIT $2 OFFSET $3
    `;

    // O termo de busca precisa dos símbolos % para busca parcial
    const values = [`%${busca}%`, limit, offset];

    const { rows } = await pool.query(query, values);

    //  (Opcional) Buscar o total de páginas para o frontend saber quando parar
    const countQuery = "SELECT COUNT(*) FROM games WHERE titulo ILIKE $1";
    const totalRes = await pool.query(countQuery, [`%${busca}%`]);
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

module.exports = {listarJogos};