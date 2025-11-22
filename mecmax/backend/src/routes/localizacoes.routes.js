const express = require("express");
const router = express.Router();
const localizacoesController = require("../controllers/localizacoes.controller");

router.get("/", localizacoesController.listarLocalizacoes);
router.post("/", localizacoesController.criarLocalizacao);
router.get("/:id", localizacoesController.buscarLocal);
router.put("/:id", localizacoesController.atualizarLocal);
router.delete("/:id", localizacoesController.excluirLocal);

module.exports = router;