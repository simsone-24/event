const prisma = require('../lib/prisma');

const getReports = async (req, res) => {
  const { type, startDate, endDate, status, month, year } = req.query;

  let data = {};

  if (type === 'customer-list') {
    data = await prisma.customer.findMany({
      where: status ? { orderStatus: status } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  else if (type === 'lost-orders') {
    data = await prisma.customer.findMany({
      where: { orderStatus: 'LOST' },
      orderBy: { updatedAt: 'desc' },
    });
  }

  else if (type === 'upcoming-events') {
    data = await prisma.customer.findMany({
      where: { functionDate: { gte: new Date() }, orderStatus: 'CONFIRMED' },
      orderBy: { functionDate: 'asc' },
    });
  }

  else if (type === 'monthly-events') {
    const m = month ? parseInt(month) - 1 : new Date().getMonth();
    const y = year ? parseInt(year) : new Date().getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    data = await prisma.customer.findMany({
      where: { functionDate: { gte: start, lte: end }, orderStatus: { in: ['CONFIRMED', 'COMPLETED'] } },
      orderBy: { functionDate: 'asc' },
    });
  }

  else if (type === 'payment-report') {
    const where = {};
    if (startDate && endDate) where.paymentDate = { gte: new Date(startDate), lte: new Date(endDate) };
    if (status) where.paymentStatus = status;
    data = await prisma.payment.findMany({
      where,
      include: { customer: { select: { customerName: true } } },
      orderBy: { paymentDate: 'desc' },
    });
  }

  else if (type === 'pending-payments') {
    data = await prisma.payment.findMany({
      where: { paymentStatus: { not: 'PAID' } },
      include: { customer: { select: { customerName: true, functionDate: true } } },
      orderBy: { paymentDate: 'desc' },
    });
  }

  else if (type === 'expense-report') {
    const where = {};
    if (startDate && endDate) where.expenseDate = { gte: new Date(startDate), lte: new Date(endDate) };
    data = await prisma.expense.findMany({
      where,
      include: { customer: { select: { customerName: true } } },
      orderBy: { expenseDate: 'desc' },
    });
  }

  else if (type === 'profit-loss') {
    const payWhere = {}, expWhere = {};
    if (startDate && endDate) {
      payWhere.paymentDate = { gte: new Date(startDate), lte: new Date(endDate) };
      expWhere.expenseDate = { gte: new Date(startDate), lte: new Date(endDate) };
    }
    const [revenue, expenses] = await Promise.all([
      prisma.payment.aggregate({ _sum: { paidAmount: true }, where: payWhere }),
      prisma.expense.aggregate({ _sum: { amount: true }, where: expWhere }),
    ]);
    const rev = parseFloat(revenue._sum.paidAmount || 0);
    const exp = parseFloat(expenses._sum.amount || 0);
    data = { revenue: rev, expenses: exp, profit: rev - exp };
  }

  else {
    return res.status(400).json({ success: false, message: 'Invalid report type' });
  }

  res.json({ success: true, data });
};

module.exports = { getReports };
