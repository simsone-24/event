const prisma = require('../lib/prisma');

const getItems = async (req, res) => {
  const items = await prisma.inventoryItem.findMany({ orderBy: { itemName: 'asc' } });
  res.json({ success: true, data: items });
};

const getItem = async (req, res) => {
  const item = await prisma.inventoryItem.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { transactions: { orderBy: { createdAt: 'desc' } } },
  });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: item });
};

const createItem = async (req, res) => {
  const { itemName, category, quantityAvailable } = req.body;
  const item = await prisma.inventoryItem.create({
    data: { itemName, category, quantityAvailable: parseInt(quantityAvailable) || 0 },
  });
  res.status(201).json({ success: true, data: item });
};

const updateItem = async (req, res) => {
  const data = { ...req.body };
  if (data.quantityAvailable) data.quantityAvailable = parseInt(data.quantityAvailable);
  if (data.quantityUsed) data.quantityUsed = parseInt(data.quantityUsed);
  const item = await prisma.inventoryItem.update({ where: { id: parseInt(req.params.id) }, data });
  res.json({ success: true, data: item });
};

const deleteItem = async (req, res) => {
  await prisma.inventoryItem.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true, message: 'Item deleted' });
};

const stockTransaction = async (req, res) => {
  const { itemId, transactionType, quantity, notes } = req.body;
  const id = parseInt(itemId);
  const qty = parseInt(quantity);

  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  const update = transactionType === 'IN'
    ? { quantityAvailable: item.quantityAvailable + qty }
    : { quantityUsed: item.quantityUsed + qty, quantityAvailable: item.quantityAvailable - qty };

  const [transaction, updatedItem] = await Promise.all([
    prisma.inventoryTransaction.create({ data: { itemId: id, transactionType, quantity: qty, notes } }),
    prisma.inventoryItem.update({ where: { id }, data: update }),
  ]);

  res.status(201).json({ success: true, data: { transaction, item: updatedItem } });
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, stockTransaction };
