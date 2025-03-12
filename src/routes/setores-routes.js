const express = require ('express');
const router = express.Router();
const setorController = require ('../controllers/setores-controller.js');

router.get('/setores', setorController.listarSetores);
router.get('/setores/:id', setorController.listarSetorPorId);
router.patch('/atualizarSetor/:id', setorController.atualizarSetor);

module.exports = router;