const router = require('express').Router();
const { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, getCalendarEvents } = require('../controllers/customers.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/calendar', getCalendarEvents);
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', authorize('ADMIN', 'SALES'), createCustomer);
router.put('/:id', authorize('ADMIN', 'SALES'), updateCustomer);
router.delete('/:id', authorize('ADMIN'), deleteCustomer);

module.exports = router;
