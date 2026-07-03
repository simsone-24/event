const router = require('express').Router();
const { getReports } = require('../controllers/reports.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getReports);

module.exports = router;
