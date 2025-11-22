const express = require("express");
const router = express.Router();
const mecanicosController = require("../controllers/mecanicos.controller");

router.post("/login", mecanicosController.login);
router.get("/", mecanicosController.listarMecanicos);
router.post("/", mecanicosController.criarMecanico);
router.get("/:id", mecanicosController.buscarMecanico);

router.put("/:id", mecanicosController.atualizarMecanico);

router.delete("/:id", mecanicosController.excluirMecanico);

module.exports = router;