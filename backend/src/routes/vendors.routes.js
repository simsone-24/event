const router = require('express').Router();
const { getVendors, getVendor, createVendor, updateVendor, deleteVendor } = require('../controllers/vendors.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getVendors);
router.get('/:id', getVendor);
router.post('/', authorize('ADMIN'), createVendor);
router.put('/:id', authorize('ADMIN'), updateVendor);
router.delete('/:id', authorize('ADMIN'), deleteVendor);

module.exports = router;
