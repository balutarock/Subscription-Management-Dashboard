import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '../../.env' });

// Log the database URL for debugging
console.log('Database URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();

  // Create sample plans
  const plans = [
    {
      name: 'Basic',
      price: 9.99,
      features: [
        '10GB Storage',
        'Basic Support',
        'Email Support',
        'API Access',
      ],
      duration: 30, // 30 days
    },
    {
      name: 'Pro',
      price: 29.99,
      features: [
        '50GB Storage',
        'Priority Support',
        '24/7 Email Support',
        'API Access',
        'Advanced Analytics',
      ],
      duration: 30, // 30 days
    },
    {
      name: 'Enterprise',
      price: 99.99,
      features: [
        'Unlimited Storage',
        '24/7 Priority Support',
        'Dedicated Account Manager',
        'API Access',
        'Advanced Analytics',
        'Custom Integrations',
        'SLA 99.9%',
      ],
      duration: 30, // 30 days
    },
    {
      name: 'Annual Basic',
      price: 99.99, // Discounted annual price
      features: [
        '10GB Storage',
        'Basic Support',
        'Email Support',
        'API Access',
      ],
      duration: 365, // 1 year
    },
  ];

  // Create plans
  for (const plan of plans) {
    await prisma.plan.create({
      data: {
        name: plan.name,
        price: plan.price,
        features: plan.features,
        duration: plan.duration,
      },
    });
  }

  console.log('✅ Successfully seeded database with plans');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
