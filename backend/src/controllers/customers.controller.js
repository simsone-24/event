const prisma = require('../lib/prisma');

// GET all customers
const getCustomers = async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { mobileNumber: { contains: search } },
      { email: { contains: search } },
      { location: { contains: search } },
    ];
  }
  if (status) where.orderStatus = status;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ]);

  res.json({ success: true, data: customers, total, page: parseInt(page), limit: parseInt(limit) });
};

// GET single customer
const getCustomer = async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { payments: true, expenses: true, tasks: { include: { user: { select: { name: true } } } } },
  });
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
  res.json({ success: true, data: customer });
};

// POST create customer
const createCustomer = async (req, res) => {
  const {
    customerName, mobileNumber, email, address, functionType,
    functionDate, functionPlan, location, estimationAmountMin,
    estimationAmountMax, orderStatus, notes,
  } = req.body;

  const customer = await prisma.customer.create({
    data: {
      customerName, mobileNumber, email, address, functionType,
      functionDate: new Date(functionDate), functionPlan, location,
      estimationAmountMin: parseFloat(estimationAmountMin),
      estimationAmountMax: parseFloat(estimationAmountMax),
      orderStatus: orderStatus || 'PENDING', notes,
    },
  });

  res.status(201).json({ success: true, data: customer });
};

// PUT update customer
const updateCustomer = async (req, res) => {
  const id = parseInt(req.params.id);
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, message: 'Customer not found' });

  const data = { ...req.body };
  if (data.functionDate) data.functionDate = new Date(data.functionDate);
  if (data.estimationAmountMin) data.estimationAmountMin = parseFloat(data.estimationAmountMin);
  if (data.estimationAmountMax) data.estimationAmountMax = parseFloat(data.estimationAmountMax);

  const customer = await prisma.customer.update({ where: { id }, data });
  res.json({ success: true, data: customer });
};

// DELETE customer
const deleteCustomer = async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.customer.delete({ where: { id } });
  res.json({ success: true, message: 'Customer deleted' });
};

// GET calendar events (confirmed customers)
const getCalendarEvents = async (req, res) => {
  const { month, year, functionType, status, location } = req.query;
  const where = {};

  if (status) {
    where.orderStatus = status;
  } else {
    where.orderStatus = { in: ['CONFIRMED', 'COMPLETED'] };
  }
  if (functionType) where.functionType = functionType;
  if (location) where.location = { contains: location };
  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0);
    where.functionDate = { gte: start, lte: end };
  }

  const events = await prisma.customer.findMany({
    where,
    select: {
      id: true, customerName: true, functionType: true,
      functionDate: true, location: true, orderStatus: true, functionPlan: true,
    },
    orderBy: { functionDate: 'asc' },
  });

  res.json({ success: true, data: events });
};

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, getCalendarEvents };
