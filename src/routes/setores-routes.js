const express = require ('express');
const router = express.Router();
const setorController = require ('../controllers/setores-controller.js');

router.get('/setores', setorController.listarSetores);

module.exports = router;