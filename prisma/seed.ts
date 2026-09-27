import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding InkMonk Research database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@inkmonk.com' },
    update: {},
    create: {
      email: 'admin@inkmonk.com',
      name: 'Tuhit Roy (Admin)',
      hashedPassword: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Admin user ready:', admin.email);

  // 2. Create Client User
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@inkmonk.com' },
    update: {},
    create: {
      email: 'client@inkmonk.com',
      name: 'Dr. Ananya Sen',
      hashedPassword: clientPassword,
      role: 'CLIENT',
      status: 'ACTIVE',
    },
  });
  console.log('Client user ready:', client.email);

  // 3. Create Sample Leads
  const existingLeads = await prisma.lead.count();
  if (existingLeads === 0) {
    await prisma.lead.createMany({
      data: [
        {
          channel: 'CHAT',
          language: 'EN',
          workType: 'TECH',
          service: 'RESEARCH_PAPER',
          package: 'UPTO_6000_WORDS',
          domain: 'Machine Learning / Computer Vision',
          requirements: 'Deep learning paper on chest radiograph classification targeting IEEE Access.',
          deadline: '3 weeks',
          totalPaise: 1200000,
          breakdown: 'Research Paper (English Technical, up to 6,000 words): ₹12,000',
          name: 'Prof. Rajesh Banerjee',
          email: 'r.banerjee@heritage.edu.in',
          phone: '+91 9830112233',
          status: 'NEW',
        },
        {
          channel: 'MANUAL',
          language: 'HI',
          workType: 'NON_TECH',
          service: 'THESIS',
          package: 'WITHOUT_MODEL',
          domain: 'Hindi Literature & Modern Theater',
          requirements: 'Complete doctoral thesis structuring on 20th-century Hindi drama.',
          deadline: '45 days',
          totalPaise: 3800000,
          breakdown: 'Thesis (Hindi Non-Technical, without model): ₹38,000',
          name: 'Sunita Sharma',
          email: 'sunita.sharma@du.ac.in',
          phone: '+91 9811223344',
          status: 'CONTACTED',
        },
        {
          channel: 'MANUAL',
          language: 'TURNITIN',
          workType: 'NA',
          service: 'TURNITIN',
          domain: 'Management Dissertation Scan',
          requirements: 'Full similarity index and AI percentage check before submission.',
          deadline: 'Immediate',
          quantity: 2,
          totalPaise: 40000,
          breakdown: 'Turnitin AI & Plagiarism Report: ₹200 × 2 files = ₹400',
          name: 'Arindam Ghosh',
          email: 'arindam.g@iimcal.ac.in',
          phone: '+91 9831998877',
          status: 'CONVERTED',
        },
      ],
    });
    console.log('Sample leads created.');
  }

  // 4. Create Sample Project for Dr. Ananya Sen
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.create({
      data: {
        title: 'Deep Residual Networks for Automated Pulmonary Radiograph Diagnostics',
        scope: 'Technical research paper drafting in IEEE two-column format with custom PyTorch ResNet-50 simulation benchmarking.',
        status: 'IN_PROGRESS',
        totalPaise: 3400000,
        clientId: client.id,
        staffOwner: 'Tuhit Roy',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });
    console.log('Sample project created.');
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
