const prisma = require('../src/lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventportal.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Admin User',
      email: 'admin@eventportal.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create sales user
  const salesHash = await bcrypt.hash('sales123', 10);
  await prisma.user.upsert({
    where: { email: 'sales@eventportal.com' },
    update: { password: salesHash },
    create: {
      name: 'Sales Executive',
      email: 'sales@eventportal.com',
      password: salesHash,
      role: 'SALES',
    },
  });

  // Create finance user
  const financeHash = await bcrypt.hash('finance123', 10);
  await prisma.user.upsert({
    where: { email: 'finance@eventportal.com' },
    update: { password: financeHash },
    create: {
      name: 'Finance User',
      email: 'finance@eventportal.com',
      password: financeHash,
      role: 'FINANCE',
    },
  });

  // Create sample customers
  const today = new Date();
  const customers = [
    {
      customerName: 'Arun Kumar',
      mobileNumber: '9876543210',
      email: 'arun@example.com',
      address: '12, Gandhi Nagar, Trichy',
      functionType: 'Wedding',
      functionDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
      functionPlan: 'Premium',
      location: 'Trichy',
      estimationAmountMin: 150000,
      estimationAmountMax: 200000,
      orderStatus: 'CONFIRMED',
      notes: 'Prefers outdoor venue',
    },
    {
      customerName: 'Priya Sharma',
      mobileNumber: '9123456789',
      email: 'priya@example.com',
      address: '45, Anna Salai, Chennai',
      functionType: 'Birthday',
      functionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      functionPlan: 'Standard',
      location: 'Chennai',
      estimationAmountMin: 50000,
      estimationAmountMax: 80000,
      orderStatus: 'CONFIRMED',
      notes: 'Theme: Fairy Tale',
    },
    {
      customerName: 'Rajesh Patel',
      mobileNumber: '9988776655',
      email: 'rajesh@example.com',
      address: '78, MG Road, Coimbatore',
      functionType: 'Corporate Event',
      functionDate: new Date(today.getFullYear(), today.getMonth() + 2, 10),
      functionPlan: 'Executive',
      location: 'Coimbatore',
      estimationAmountMin: 300000,
      estimationAmountMax: 500000,
      orderStatus: 'PENDING',
      notes: 'Annual company meet',
    },
    {
      customerName: 'Meena Devi',
      mobileNumber: '9765432198',
      email: 'meena@example.com',
      address: '23, Lotus Street, Madurai',
      functionType: 'Baby Shower',
      functionDate: new Date(today.getFullYear(), today.getMonth() - 1, 20),
      functionPlan: 'Standard',
      location: 'Madurai',
      estimationAmountMin: 30000,
      estimationAmountMax: 50000,
      orderStatus: 'COMPLETED',
      notes: 'Pink theme',
    },
    {
      customerName: 'Suresh Babu',
      mobileNumber: '9654321087',
      email: 'suresh@example.com',
      address: '5, Nehru Street, Salem',
      functionType: 'Engagement',
      functionDate: new Date(today.getFullYear(), today.getMonth() - 2, 5),
      functionPlan: 'Premium',
      location: 'Salem',
      estimationAmountMin: 100000,
      estimationAmountMax: 150000,
      orderStatus: 'LOST',
      notes: 'Budget constraints',
    },
  ];

  for (const c of customers) {
    await prisma.customer.create({ data: c });
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Login Credentials:');
  console.log('  Admin    → admin@eventportal.com / admin123');
  console.log('  Sales    → sales@eventportal.com / sales123');
  console.log('  Finance  → finance@eventportal.com / finance123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
