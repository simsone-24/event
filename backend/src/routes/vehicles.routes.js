const router = require('express').Router();
const { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicles.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.post('/', authorize('ADMIN', 'OPERATIONS'), createVehicle);
router.put('/:id', authorize('ADMIN', 'OPERATIONS'), updateVehicle);
router.delete('/:id', authorize('ADMIN'), deleteVehicle);

module.exports = router;
