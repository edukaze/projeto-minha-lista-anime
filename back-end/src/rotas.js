const express = require("express");
const router = express.Router();

const controladorUser = require("./controladores/controladorUser");
const {listarJogos} = require("./controladores/gamesController");
const {
    salvarStatusGame,
    listarStatus,
    excluirStatus
} = require("./controladores/controllerGameStatus");

//middleware
const autenticar = require("./middlewares/autenticar")

//  públicas
router.post("/login", controladorUser.login);
router.get("/jogos", listarJogos);

//  protegidas
router.get("/status", autenticar, listarStatus);
router.post("/status", autenticar, salvarStatusGame);
router.delete("/status/:game_id", autenticar, excluirStatus);


module.exports = router;