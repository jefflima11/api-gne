const express = require('express');
const router =  express.Router();
const usuarioController = require('../controllers/usuario-controller');

router.get('/perfil', usuarioController.listarUsuarios);
router.get('/perfil/:id', usuarioController.listarUsuarioPorId);
router.patch('/atualizaPerfil/:id', usuarioController.atualizarUsuario);

module.exports = router;