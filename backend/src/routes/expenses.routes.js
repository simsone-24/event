const router = require('express').Router();
const { getExpenses, getExpense, createExpense, updateExpense, deleteExpense } = require('../controllers/expenses.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.use(protect);

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', authorize('ADMIN', 'FINANCE'), upload.single('attachment'), createExpense);
router.put('/:id', authorize('ADMIN', 'FINANCE'), upload.single('attachment'), updateExpense);
router.delete('/:id', authorize('ADMIN'), deleteExpense);

module.exports = router;
