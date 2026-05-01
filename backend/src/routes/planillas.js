const router = require('express').Router();
const { getPlanillas, crearPlanilla } = require('../controllers/planillas.controller');
router.get('/', getPlanillas);
router.post('/', crearPlanilla);
module.exports = router;
