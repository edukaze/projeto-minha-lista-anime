require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const upload = multer();
const app = express();

// middlewares globais
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] // LIBERA O TOKEN
}));
app.use(express.json());
app.use(upload.none()); //  antes das rotas

// importar rotas
const rotas = require("./src/rotas");

// usar rotas
app.use("/api", rotas);

app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

// iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
