const router = require('express').Router();
const { getReporteTurno } = require('../controllers/reportes.controller');
const auth = require('../middleware/auth');
router.get('/turno', auth, getReporteTurno);
module.exports = router;
