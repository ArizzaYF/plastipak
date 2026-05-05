const router = require('express').Router();
const { getPedidos, crearPedido } = require('../controllers/pedidos.controller');
const auth = require('../middleware/auth');
router.get('/', auth, getPedidos);
router.post('/', auth, crearPedido);
module.exports = router;
