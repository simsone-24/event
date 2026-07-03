const prisma = require('../lib/prisma');
const path = require('path');

// GET all expenses
const getExpenses = async (req, res) => {
  const { customerId, category, page = 1, limit = 20 } = req.query;
  const where = {};
  if (customerId) where.customerId = parseInt(customerId);
  if (category) where.expenseCategory = category;

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      include: { customer: { select: { customerName: true, functionDate: true } } },
      orderBy: { expenseDate: 'desc' },
    }),
    prisma.expense.count({ where }),
  ]);

  res.json({ success: true, data: expenses, total });
};

// GET single expense
const getExpense = async (req, res) => {
  const expense = await prisma.expense.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { customer: true },
  });
  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
  res.json({ success: true, data: expense });
};

// POST create expense
const createExpense = async (req, res) => {
  const { customerId, expenseCategory, amount, expenseDate, description } = req.body;
  const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const expense = await prisma.expense.create({
    data: {
      customerId: parseInt(customerId),
      expenseCategory,
      amount: parseFloat(amount),
      expenseDate: new Date(expenseDate),
      description,
      attachmentUrl,
    },
  });

  res.status(201).json({ success: true, data: expense });
};

// PUT update expense
const updateExpense = async (req, res) => {
  const id = parseInt(req.params.id);
  const data = { ...req.body };
  if (data.amount) data.amount = parseFloat(data.amount);
  if (data.expenseDate) data.expenseDate = new Date(data.expenseDate);
  if (data.customerId) data.customerId = parseInt(data.customerId);
  if (req.file) data.attachmentUrl = `/uploads/${req.file.filename}`;

  const expense = await prisma.expense.update({ where: { id }, data });
  res.json({ success: true, data: expense });
};

// DELETE expense
const deleteExpense = async (req, res) => {
  await prisma.expense.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true, message: 'Expense deleted' });
};

module.exports = { getExpenses, getExpense, createExpense, updateExpense, deleteExpense };
