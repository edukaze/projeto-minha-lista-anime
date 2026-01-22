const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    max:10,
    idleTimeoutMillis: 20000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

pool.connect()
    .then(() => console.log(" Conectado ao PostgreSQL!"))
    .catch((err) => console.error("Erro ao conectar:", err));

module.exports = pool;
