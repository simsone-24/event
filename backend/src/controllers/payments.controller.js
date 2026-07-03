const prisma = require('../lib/prisma');

// GET all payments
const getPayments = async (req, res) => {
  const { customerId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = {};

  if (customerId) where.customerId = parseInt(customerId);
  if (status) where.paymentStatus = status;
  if (startDate && endDate) {
    where.paymentDate = { gte: new Date(startDate), lte: new Date(endDate) };
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: { customer: { select: { customerName: true, functionType: true, functionDate: true } } },
      orderBy: { paymentDate: 'desc' },
    }),
    prisma.payment.count({ where }),
  ]);

  res.json({ success: true, data: payments, total });
};

// GET payment by id
const getPayment = async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { customer: true },
  });
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  res.json({ success: true, data: payment });
};

// POST create payment
const createPayment = async (req, res) => {
  const { customerId, totalAmount, paidAmount, paymentMethod, transactionReference, paymentDate, remarks } = req.body;

  const total = parseFloat(totalAmount);
  const paid = parseFloat(paidAmount);
  const pending = total - paid;

  let paymentStatus = 'NOT_PAID';
  if (paid >= total) paymentStatus = 'PAID';
  else if (paid > 0) paymentStatus = 'PARTIAL';

  const payment = await prisma.payment.create({
    data: {
      customerId: parseInt(customerId),
      totalAmount: total,
      paidAmount: paid,
      pendingAmount: pending,
      paymentMethod,
      transactionReference,
      paymentDate: new Date(paymentDate),
      paymentStatus,
      remarks,
    },
  });

  res.status(201).json({ success: true, data: payment });
};

// PUT update payment
const updatePayment = async (req, res) => {
  const id = parseInt(req.params.id);
  const data = { ...req.body };

  if (data.totalAmount && data.paidAmount) {
    const total = parseFloat(data.totalAmount);
    const paid = parseFloat(data.paidAmount);
    data.pendingAmount = total - paid;
    if (paid >= total) data.paymentStatus = 'PAID';
    else if (paid > 0) data.paymentStatus = 'PARTIAL';
    else data.paymentStatus = 'NOT_PAID';
    data.totalAmount = total;
    data.paidAmount = paid;
  }
  if (data.paymentDate) data.paymentDate = new Date(data.paymentDate);
  if (data.customerId) data.customerId = parseInt(data.customerId);

  const payment = await prisma.payment.update({ where: { id }, data });
  res.json({ success: true, data: payment });
};

// DELETE payment
const deletePayment = async (req, res) => {
  await prisma.payment.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true, message: 'Payment deleted' });
};

// GET outstanding summary per customer
const getOutstandingSummary = async (req, res) => {
  const summary = await prisma.payment.groupBy({
    by: ['customerId'],
    _sum: { totalAmount: true, paidAmount: true, pendingAmount: true },
    where: { paymentStatus: { not: 'PAID' } },
  });

  const customerIds = summary.map(s => s.customerId);
  const customers = await prisma.customer.findMany({
    where: { id: { in: customerIds } },
    select: { id: true, customerName: true, functionDate: true },
  });

  const result = summary.map(s => ({
    ...s,
    customer: customers.find(c => c.id === s.customerId),
  }));

  res.json({ success: true, data: result });
};

module.exports = { getPayments, getPayment, createPayment, updatePayment, deletePayment, getOutstandingSummary };
