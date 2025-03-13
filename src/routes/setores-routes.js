const express = require ('express');
const router = express.Router();
const setorController = require ('../controllers/setores-controller.js');

router.get('/setores', setorController.listarSetores);
router.get('/setores/:id', setorController.listarSetorPorId);
router.post('/setores/add', setorController.adicionarSetor);
router.patch('/atualizarSetor/:id', setorController.atualizarSetor);
router.patch('/setores/edit/:id', setorController.editarAtividadeDoSetor);
router.patch('/deletarSetores/:id', setorController.deletarSetores);

module.exports = router;