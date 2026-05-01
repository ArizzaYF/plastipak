const router = require('express').Router();
const { getReporteTurno } = require('../controllers/reportes.controller');
router.get('/turno', getReporteTurno);
module.exports = router;
