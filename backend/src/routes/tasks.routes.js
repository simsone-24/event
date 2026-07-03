const router = require('express').Router();
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/tasks.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', authorize('ADMIN', 'OPERATIONS'), createTask);
router.put('/:id', authorize('ADMIN', 'OPERATIONS'), updateTask);
router.delete('/:id', authorize('ADMIN'), deleteTask);

module.exports = router;
