const express = require("express");
const router = express.Router();

const controladorUser = require("./controladores/controladorUser");

router.post("/cadastrar", controladorUser.cadastrar);
router.post("/login", controladorUser.login);

module.exports = router;