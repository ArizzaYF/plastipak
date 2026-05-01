const router = require('express').Router();
const { getRegistros, crearRegistro, finalizarRegistro } = require('../controllers/registros.controller');
const auth = require('../middleware/auth');
router.get('/', auth, getRegistros);
router.post('/', auth, crearRegistro);
router.put('/:id/finalizar', auth, finalizarRegistro);
module.exports = router;
