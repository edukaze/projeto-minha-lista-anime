const express = require("express");
const router = express.Router();

const controladorUser = require("./controladores/controladorUser");
const {listarJogos} = require("./controladores/gamesController");
const {
    salvarStatusGame,
    listarStatus,
} = require("./controladores/controllerGameStatus");

//middleware
const autenticar = require("./middlewares/autenticar")

//  públicas
router.post("/login", controladorUser.login);
router.get("/jogos", listarJogos);

//  protegidas
router.get("/status", autenticar, listarStatus);
router.post("/status", autenticar, salvarStatusGame);


module.exports = router;