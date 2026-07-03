const router = require('express').Router();
const { getPayments, getPayment, createPayment, updatePayment, deletePayment, getOutstandingSummary } = require('../controllers/payments.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/outstanding', getOutstandingSummary);
router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/', authorize('ADMIN', 'FINANCE'), createPayment);
router.put('/:id', authorize('ADMIN', 'FINANCE'), updatePayment);
router.delete('/:id', authorize('ADMIN'), deletePayment);

module.exports = router;
