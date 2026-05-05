const router = require('express').Router();
const { getPlanillas, crearPlanilla } = require('../controllers/planillas.controller');
const auth = require('../middleware/auth');
router.get('/', auth, getPlanillas);
router.post('/', auth, crearPlanilla);
module.exports = router;
