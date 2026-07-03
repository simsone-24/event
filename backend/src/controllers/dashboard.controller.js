const prisma = require('../lib/prisma');

const getDashboard = async (req, res) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    totalCustomers, pendingOrders, confirmedOrders, lostOrders, completedOrders,
    todayEvents, monthEvents, upcomingEvents,
    paymentStats, expenseStats, pendingPayments,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { orderStatus: 'PENDING' } }),
    prisma.customer.count({ where: { orderStatus: 'CONFIRMED' } }),
    prisma.customer.count({ where: { orderStatus: 'LOST' } }),
    prisma.customer.count({ where: { orderStatus: 'COMPLETED' } }),
    prisma.customer.count({ where: { functionDate: { gte: startOfToday, lt: endOfToday }, orderStatus: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    prisma.customer.count({ where: { functionDate: { gte: startOfMonth, lte: endOfMonth }, orderStatus: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    prisma.customer.findMany({
      where: { functionDate: { gte: today }, orderStatus: 'CONFIRMED' },
      select: { id: true, customerName: true, functionDate: true, functionType: true, location: true },
      orderBy: { functionDate: 'asc' },
      take: 5,
    }),
    prisma.payment.aggregate({ _sum: { totalAmount: true, paidAmount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.payment.aggregate({ _sum: { pendingAmount: true }, where: { paymentStatus: { not: 'PAID' } } }),
  ]);

  const totalRevenue = paymentStats._sum.paidAmount || 0;
  const totalExpenses = expenseStats._sum.amount || 0;
  const profit = parseFloat(totalRevenue) - parseFloat(totalExpenses);

  res.json({
    success: true,
    data: {
      customers: { total: totalCustomers, pending: pendingOrders, confirmed: confirmedOrders, lost: lostOrders, completed: completedOrders },
      events: { today: todayEvents, thisMonth: monthEvents, upcoming: upcomingEvents },
      finance: {
        totalRevenue: parseFloat(totalRevenue),
        totalExpenses: parseFloat(totalExpenses),
        pendingPayments: parseFloat(pendingPayments._sum.pendingAmount || 0),
        profit,
      },
    },
  });
};

module.exports = { getDashboard };
