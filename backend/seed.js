const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const createDummyImages = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64Data, 'base64');

  fs.writeFileSync(path.join(uploadsDir, 'proof-highway.png'), buffer);
  fs.writeFileSync(path.join(uploadsDir, 'proof-school.png'), buffer);
  console.log('Dummy proof images verified.');
};

async function main() {
  console.log('Clearing database...');
  await prisma.verification.deleteMany();
  await prisma.material.deleteMany();
  await prisma.fundAllocation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleared.');

  createDummyImages();

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('adminpassword', 10);
  const statePasswordHash = await bcrypt.hash('statepassword', 10);
  const districtPasswordHash = await bcrypt.hash('jaipurpassword', 10);
  const userPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Create Users
  console.log('Creating users...');
  
  // Country Admin
  const countryAdmin = await prisma.user.create({
    data: {
      name: 'National Auditor',
      email: 'admin@jankari.gov',
      password: adminPasswordHash,
      role: 'admin',
      adminLevel: 'Country',
      adminRegion: 'India',
      country: 'India',
      state: 'Delhi',
      district: 'Central Delhi',
      block: 'Delhi',
      panchayat: 'Central Delhi',
      village: 'Delhi'
    }
  });

  // State Admin
  const stateAdmin = await prisma.user.create({
    data: {
      name: 'State Auditor Maharashtra',
      email: 'stateadmin@jankari.gov',
      password: statePasswordHash,
      role: 'admin',
      adminLevel: 'State',
      adminRegion: 'Maharashtra',
      country: 'India',
      state: 'Maharashtra',
      district: 'Nagpur',
      block: 'Nagpur',
      panchayat: 'Nagpur',
      village: 'Nagpur'
    }
  });

  // District Admin
  const districtAdmin = await prisma.user.create({
    data: {
      name: 'Jaipur District Auditor',
      email: 'jaipuradmin@jankari.gov',
      password: districtPasswordHash,
      role: 'admin',
      adminLevel: 'District',
      adminRegion: 'Jaipur',
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer'
    }
  });

  // Citizen
  const citizen = await prisma.user.create({
    data: {
      name: 'Ramesh Kumar',
      email: 'ramesh@citizens.org',
      password: userPasswordHash,
      role: 'citizen',
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village'
    }
  });

  console.log('Users seeded successfully.');

  // 2. Seed Projects
  console.log('Creating projects...');

  // Project 1: Delhi
  const p1 = await prisma.project.create({
    data: {
      name: 'Greenfield Smart Highway (Phase 1)',
      description: 'Construction of a modern 6-lane bypass smart highway equipped with solar street lights, emergency call boxes, and smart traffic management sensors to reduce city congestion by 40%.',
      totalBudget: 150000000,
      status: 'In Progress',
      address: 'Outer Ring Road Bypass, Delhi NCR',
      latitude: 28.7041,
      longitude: 77.1025,
      startDate: new Date('2025-01-10'),
      endDate: new Date('2026-12-30'),
      country: 'India',
      state: 'Delhi',
      district: 'Central Delhi',
      block: 'Delhi',
      panchayat: 'Delhi',
      village: 'Delhi',
      creatorId: countryAdmin.id
    }
  });

  // Project 2: Nagpur, Maharashtra
  const p2 = await prisma.project.create({
    data: {
      name: 'District General Hospital Modernization',
      description: 'Adding a new 200-bed trauma center wing, state-of-the-art oxygen generator plant, and upgrading ICU equipment at the District General Hospital to serve rural populations.',
      totalBudget: 45000000,
      status: 'In Progress',
      address: 'Civil Lines, Nagpur, Maharashtra',
      latitude: 21.1458,
      longitude: 79.0882,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2026-06-15'),
      country: 'India',
      state: 'Maharashtra',
      district: 'Nagpur',
      block: 'Nagpur',
      panchayat: 'Nagpur',
      village: 'Nagpur',
      creatorId: stateAdmin.id
    }
  });

  // Project 3: Patna, Bihar
  const p3 = await prisma.project.create({
    data: {
      name: 'Saraswati Primary School Renovation',
      description: 'Rebuilding leaking roofs, constructing separate boys/girls toilets, painting classrooms with educational murals, and establishing a computer laboratory with 15 workstations.',
      totalBudget: 1200000,
      status: 'Completed',
      address: 'Kadamkuan Village, Patna, Bihar',
      latitude: 25.5941,
      longitude: 85.1376,
      startDate: new Date('2024-05-10'),
      endDate: new Date('2024-09-30'),
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village',
      creatorId: countryAdmin.id
    }
  });

  // Project 4: Jaipur, Rajasthan
  const p4 = await prisma.project.create({
    data: {
      name: 'Solar Street Light Installation',
      description: 'Procuring and installing 500 energy-efficient solar street lights across rural village streets in Jaipur district to enhance safety and decrease local electricity bills.',
      totalBudget: 5000000,
      status: 'Proposed',
      address: 'Amer Road Panchayat, Jaipur, Rajasthan',
      latitude: 26.9124,
      longitude: 75.7873,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-11-30'),
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer',
      creatorId: districtAdmin.id
    }
  });

  console.log('Projects seeded successfully.');

  // 3. Seed Fund Allocations
  console.log('Creating budget and fund hierarchies...');

  // Allocations for Project 1 (Highway)
  const a1_1 = await prisma.fundAllocation.create({
    data: {
      projectId: p1.id,
      name: 'Land Acquisition & Clearance',
      amount: 30000000,
      description: 'Compensation payouts for land clearing, surveying, and local legal clearance certificates.'
    }
  });

  const a1_2 = await prisma.fundAllocation.create({
    data: {
      projectId: p1.id,
      name: 'Pavement & Roadbed Structural',
      amount: 100000000,
      description: 'Major civil laying, asphalt spreading, structural flyovers, and drainage installations.'
    }
  });

  const a1_2_sub1 = await prisma.fundAllocation.create({
    data: {
      projectId: p1.id,
      name: 'Raw Materials Procurement',
      amount: 70000000,
      parentId: a1_2.id,
      description: 'Bulk ordering for sand, gravel, TMT steel rebar, and Portland cement.'
    }
  });

  const a1_2_sub2 = await prisma.fundAllocation.create({
    data: {
      projectId: p1.id,
      name: 'Construction Labor Contracting',
      amount: 30000000,
      parentId: a1_2.id,
      description: 'Contracted pay for engineering supervisors, heavy machinery operators, and unskilled workers.'
    }
  });

  const a1_3 = await prisma.fundAllocation.create({
    data: {
      projectId: p1.id,
      name: 'Smart Systems & Solar Lighting',
      amount: 20000000,
      description: 'Procurement of roadside emergency call systems, speed radar sensors, and smart solar street lights.'
    }
  });

  // Allocations for Project 2 (Nagpur Hospital)
  const a2_1 = await prisma.fundAllocation.create({
    data: {
      projectId: p2.id,
      name: 'Trauma Wing Building Construction',
      amount: 25000000,
      description: 'RCC framework, bricklaying, electrical wiring, sanitization plumbing, and painting.'
    }
  });

  const a2_1_sub1 = await prisma.fundAllocation.create({
    data: {
      projectId: p2.id,
      name: 'Materials Store',
      amount: 15000000,
      parentId: a2_1.id
    }
  });

  const a2_2 = await prisma.fundAllocation.create({
    data: {
      projectId: p2.id,
      name: 'Oxygen & ICU Equipment Procurement',
      amount: 20000000,
      description: 'Advanced medical patient monitors, ventilators, and setting up the oxygen generating plant.'
    }
  });

  const a2_2_sub1 = await prisma.fundAllocation.create({
    data: {
      projectId: p2.id,
      name: 'Medical Hardware',
      amount: 20000000,
      parentId: a2_2.id
    }
  });

  // Allocations for Project 3 (School Patna)
  const a3_1 = await prisma.fundAllocation.create({
    data: {
      projectId: p3.id,
      name: 'Roof Waterproofing & Classroom Murals',
      amount: 400000,
      description: 'Repairing concrete roof cracks and painting educational murals inside Class 1-5.'
    }
  });

  const a3_2 = await prisma.fundAllocation.create({
    data: {
      projectId: p3.id,
      name: 'Computer Laboratory Set Up',
      amount: 800000,
      description: 'Procuring 15 Desktop PCs, local networking hardware, routers, and electrical wiring.'
    }
  });

  // Allocations for Project 4 (Solar Jaipur)
  const a4_1 = await prisma.fundAllocation.create({
    data: {
      projectId: p4.id,
      name: 'Solar Lighting Hardware',
      amount: 4000000,
      description: 'Bulk orders for Luminous solar lighting poles, integrated batteries, and LED panels.'
    }
  });

  const a4_2 = await prisma.fundAllocation.create({
    data: {
      projectId: p4.id,
      name: 'Installation Labor',
      amount: 1000000,
      description: 'Panchayat labor wages for erecting and securing the solar poles.'
    }
  });

  console.log('Allocations seeded.');

  // 4. Seed Materials
  console.log('Seeding itemized materials list...');

  // Materials for Highway raw procurement
  await prisma.material.createMany({
    data: [
      {
        projectId: p1.id,
        name: 'TMT Steel Rebars Fe 550D',
        quantity: 400,
        unit: 'Tons',
        unitCost: 65000,
        totalCost: 26000000,
        supplier: 'Tata Steel Ltd',
        allocationId: a1_2_sub1.id
      },
      {
        projectId: p1.id,
        name: 'OPC Grade 53 Portland Cement',
        quantity: 40000,
        unit: 'Bags',
        unitCost: 450,
        totalCost: 18000000,
        supplier: 'UltraTech Cement Ltd',
        allocationId: a1_2_sub1.id
      },
      {
        projectId: p1.id,
        name: 'Coarse Sand & Aggregates',
        quantity: 12000,
        unit: 'Cubic Meters',
        unitCost: 500,
        totalCost: 6000000,
        supplier: 'Apex Aggregates Ltd',
        allocationId: a1_2_sub1.id
      }
    ]
  });

  // Materials for Nagpur Hospital
  await prisma.material.createMany({
    data: [
      {
        projectId: p2.id,
        name: 'Structural Reinforced Steel',
        quantity: 100,
        unit: 'Tons',
        unitCost: 60000,
        totalCost: 6000000,
        supplier: 'Jindal Steel & Power',
        allocationId: a2_1_sub1.id
      },
      {
        projectId: p2.id,
        name: 'Grade 53 Construction Cement',
        quantity: 20000,
        unit: 'Bags',
        unitCost: 450,
        totalCost: 9000000,
        supplier: 'Ambuja Cements Ltd',
        allocationId: a2_1_sub1.id
      },
      {
        projectId: p2.id,
        name: 'PSA Oxygen Plant 500 LPM',
        quantity: 1,
        unit: 'Unit',
        unitCost: 12000000,
        totalCost: 12000000,
        supplier: 'Absotech Gas Systems',
        allocationId: a2_2_sub1.id
      },
      {
        projectId: p2.id,
        name: 'Advanced ICU Bedside Monitors',
        quantity: 40,
        unit: 'Units',
        unitCost: 200000,
        totalCost: 8000000,
        supplier: 'Philips Healthcare India',
        allocationId: a2_2_sub1.id
      }
    ]
  });

  // Materials for School Patna
  await prisma.material.createMany({
    data: [
      {
        projectId: p3.id,
        name: 'Dell Inspiron Desktop computer systems',
        quantity: 15,
        unit: 'Units',
        unitCost: 30000,
        totalCost: 450000,
        supplier: 'Dell India Pvt Ltd',
        allocationId: a3_2.id
      },
      {
        projectId: p3.id,
        name: '1KVA Online UPS Power Backup',
        quantity: 1,
        unit: 'Unit',
        unitCost: 50000,
        totalCost: 50000,
        supplier: 'APC Systems Pvt Ltd',
        allocationId: a3_2.id
      }
    ]
  });

  // Materials for Solar Jaipur
  await prisma.material.create({
    data: {
      projectId: p4.id,
      name: 'Integrated Solar LED Poles (120W)',
      quantity: 500,
      unit: 'Units',
      unitCost: 8000,
      totalCost: 4000000,
      supplier: 'Luminous Power Technologies',
      allocationId: a4_1.id
    }
  });

  console.log('Materials seeded successfully.');

  // 5. Seed Verifications
  console.log('Seeding verifications...');
  await prisma.verification.createMany({
    data: [
      {
        projectId: p1.id, // Smart highway
        userId: citizen.id,
        status: 'Not Completed',
        comment: 'Visited the bypass highway site today. Only earthworks have started. The layout isn’t fully graded yet and no smart sensors or lights are installed. Budget spent seems disproportionate to the actual work visible.',
        imageUrl: '/uploads/proof-highway.png'
      },
      {
        projectId: p3.id, // School Patna
        userId: citizen.id,
        status: 'Completed',
        comment: 'The classrooms look beautiful now and have new murals! The new computer lab is active with kids using it, and toilets are functional with running water. Excellent public fund usage!',
        imageUrl: '/uploads/proof-school.png'
      }
    ]
  });

  console.log('Verifications seeded.');
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
