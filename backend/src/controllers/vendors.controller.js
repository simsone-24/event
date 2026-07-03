const prisma = require('../lib/prisma');

const getVendors = async (req, res) => {
  const { search, serviceType, status } = req.query;
  const where = {};
  if (search) where.vendorName = { contains: search };
  if (serviceType) where.serviceType = serviceType;
  if (status) where.status = status;

  const vendors = await prisma.vendor.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: vendors });
};

const getVendor = async (req, res) => {
  const vendor = await prisma.vendor.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
  res.json({ success: true, data: vendor });
};

const createVendor = async (req, res) => {
  const { vendorName, mobileNumber, email, address, serviceType, contractAmount, status } = req.body;
  const vendor = await prisma.vendor.create({
    data: { vendorName, mobileNumber, email, address, serviceType, contractAmount: contractAmount ? parseFloat(contractAmount) : null, status: status || 'ACTIVE' },
  });
  res.status(201).json({ success: true, data: vendor });
};

const updateVendor = async (req, res) => {
  const data = { ...req.body };
  if (data.contractAmount) data.contractAmount = parseFloat(data.contractAmount);
  const vendor = await prisma.vendor.update({ where: { id: parseInt(req.params.id) }, data });
  res.json({ success: true, data: vendor });
};

const deleteVendor = async (req, res) => {
  await prisma.vendor.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true, message: 'Vendor deleted' });
};

module.exports = { getVendors, getVendor, createVendor, updateVendor, deleteVendor };
