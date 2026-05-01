const router = require('express').Router();
const { getReferencias, crearReferencia } = require('../controllers/referencias.controller');
router.get('/', getReferencias);
router.post('/', crearReferencia);
module.exports = router;
