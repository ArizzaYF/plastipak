const router = require('express').Router();
const { getReferencias, crearReferencia } = require('../controllers/referencias.controller');
const auth = require('../middleware/auth');
router.get('/', auth, getReferencias);
router.post('/', auth, crearReferencia);
module.exports = router;
