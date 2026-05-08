const router = require('express').Router();
const { getReferencias, crearReferencia, actualizarReferencia, eliminarReferencia } = require('../controllers/referencias.controller');
const auth = require('../middleware/auth');
router.get('/', auth, getReferencias);
router.post('/', auth, crearReferencia);
router.put('/:id', auth, actualizarReferencia);
router.delete('/:id', auth, eliminarReferencia);
module.exports = router;
