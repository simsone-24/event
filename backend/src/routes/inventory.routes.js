const router = require('express').Router();
const { getItems, getItem, createItem, updateItem, deleteItem, stockTransaction } = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getItems);
router.get('/:id', getItem);
router.post('/', authorize('ADMIN', 'OPERATIONS'), createItem);
router.post('/transaction', authorize('ADMIN', 'OPERATIONS'), stockTransaction);
router.put('/:id', authorize('ADMIN', 'OPERATIONS'), updateItem);
router.delete('/:id', authorize('ADMIN'), deleteItem);

module.exports = router;
