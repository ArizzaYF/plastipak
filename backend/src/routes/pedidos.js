const router = require('express').Router();
const { getPedidos, crearPedido } = require('../controllers/pedidos.controller');
router.get('/', getPedidos);
router.post('/', crearPedido);
module.exports = router;
