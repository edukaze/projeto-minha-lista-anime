require("dotenv").config();
const express = require("express");
const cors =  require("cors");
const multer = require ("multer");
const upload = multer();
const app = express();

//permite JSON no body
app.use(express.json());
app.use(cors());

//importar as rotas
const rotas = require("./src/rotas");

// Permite dados multipart/form-data (FormData)
app.use(upload.none());

// Usar as rotas
app.use("/api", rotas);


app.get("/", (req, res)=>{
    res.send("Servidor rodando")
});
// iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});