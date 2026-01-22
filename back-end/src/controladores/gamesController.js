const pool = require ("../config/db");


//fazer uma requisição assicrona 
 async function listarJogos(req, res) {

  //colocar como limitador de 12 jogos por paginas 
    const { page = 1, limit = 10 } = req.query;

    // sabe a pagina em que o usuario estar e multiplicar pelo limite para começa a contagem aparti do ultimo limite da pagina anterior
    const offset = (page - 1) * limit;

    try {
        const totalQuery = await pool.query("SELECT COUNT(*) FROM games");
        const total = parseInt(totalQuery.rows[0].count);

        const result = await pool.query(
            "SELECT * FROM games ORDER BY ano DESC LIMIT $1 OFFSET $2",
            [limit, offset]
        );

        return res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar jogos" });
    }
}

module.exports = { listarJogos };