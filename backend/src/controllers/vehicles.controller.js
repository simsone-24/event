const prisma = require('../lib/prisma');

const getVehicles = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: vehicles });
};

const getVehicle = async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, data: vehicle });
};

const createVehicle = async (req, res) => {
  const { vehicleNumber, vehicleType, driverName, capacity, status } = req.body;
  const vehicle = await prisma.vehicle.create({
    data: { vehicleNumber, vehicleType, driverName, capacity: parseInt(capacity), status: status || 'AVAILABLE' },
  });
  res.status(201).json({ success: true, data: vehicle });
};

const updateVehicle = async (req, res) => {
  const data = { ...req.body };
  if (data.capacity) data.capacity = parseInt(data.capacity);
  const vehicle = await prisma.vehicle.update({ where: { id: parseInt(req.params.id) }, data });
  res.json({ success: true, data: vehicle });
};

const deleteVehicle = async (req, res) => {
  await prisma.vehicle.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true, message: 'Vehicle deleted' });
};

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle };
