const express = require('express');
const router = express.Router();
const ferramentasController = require('../controllers/ferramentas.controller');

router.get('/', ferramentasController.listarFerramentas);
router.get('/completo', ferramentasController.listarFerramentasCompleto);
router.get('/:id', ferramentasController.buscarFerramenta);

router.post('/', ferramentasController.criarFerramenta); 
router.put('/:id', ferramentasController.atualizarFerramenta); 
router.put('/:id/excluir', ferramentasController.excluirFerramenta);
router.put('/:id/manutencao', ferramentasController.enviarManutencao);

module.exports = router;