const express = require("express");
const router = express.Router();

const controladorUser = require("./controladores/controladorUser");
const {listarJogos, listarGeneros} = require("./controladores/gamesController");
const {
    salvarStatusGame,
    listarStatus,
    excluirStatus
} = require("./controladores/controllerGameStatus");
const {salvarOuAtualizarAvaliacao,
        buscarAvaliacoes,
        apagarAvaliacao,
        buscarAvaliacoesUsuario
} = require("./controladores/controllerAvaliacao")
const ControllerComunidade = require("./controladores/controllerComunidade");


//middleware
const autenticar = require("./middlewares/autenticar")

//  protegidas
router.get("/status", autenticar, listarStatus);
router.post("/status", autenticar, salvarStatusGame);
router.delete("/status/:game_id", autenticar, excluirStatus);
router.delete("/avaliacao/:id_jogo", autenticar, apagarAvaliacao);
router.post("/avaliar", autenticar, salvarOuAtualizarAvaliacao);
router.get("/avaliacoes/usuario", autenticar, buscarAvaliacoesUsuario);

//  públicas
router.post("/login", controladorUser.login);
router.post("/cadastrar", controladorUser.cadastrar);
router.get("/jogos", listarJogos);
router.get("/generos", listarGeneros);
router.get("/avaliacoes/", buscarAvaliacoes);
router.get("/comunidade", ControllerComunidade.listaAvaliaçõesPublicas);
router.get("/jogo/:id", ControllerComunidade.buscaDetalhesJogo);

module.exports = router;