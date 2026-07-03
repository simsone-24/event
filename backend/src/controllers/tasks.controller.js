const prisma = require('../lib/prisma');

const getTasks = async (req, res) => {
  const { customerId, status, assignedTo } = req.query;
  const where = {};
  if (customerId) where.customerId = parseInt(customerId);
  if (status) where.status = status;
  if (assignedTo) where.assignedTo = parseInt(assignedTo);

  const tasks = await prisma.eventTask.findMany({
    where,
    include: {
      customer: { select: { customerName: true, functionDate: true } },
      user: { select: { name: true } },
    },
    orderBy: { dueDate: 'asc' },
  });
  res.json({ success: true, data: tasks });
};

const getTask = async (req, res) => {
  const task = await prisma.eventTask.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { customer: true, user: { select: { id: true, name: true } } },
  });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, data: task });
};

const createTask = async (req, res) => {
  const { customerId, taskName, assignedTo, dueDate, status } = req.body;
  const task = await prisma.eventTask.create({
    data: {
      customerId: parseInt(customerId),
      taskName,
      assignedTo: assignedTo ? parseInt(assignedTo) : null,
      dueDate: new Date(dueDate),
      status: status || 'PENDING',
    },
  });
  res.status(201).json({ success: true, data: task });
};

const updateTask = async (req, res) => {
  const data = { ...req.body };
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  if (data.customerId) data.customerId = parseInt(data.customerId);
  if (data.assignedTo) data.assignedTo = parseInt(data.assignedTo);
  const task = await prisma.eventTask.update({ where: { id: parseInt(req.params.id) }, data });
  res.json({ success: true, data: task });
};

const deleteTask = async (req, res) => {
  await prisma.eventTask.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true, message: 'Task deleted' });
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
