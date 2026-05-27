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
  fs.writeFileSync(path.join(uploadsDir, 'proof-seawall.png'), buffer);
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
  const biharPasswordHash = await bcrypt.hash('biharpassword', 10);
  const districtPasswordHash = await bcrypt.hash('jaipurpassword', 10);
  const blockPasswordHash = await bcrypt.hash('blockpassword', 10);
  const panchayatPasswordHash = await bcrypt.hash('panchayatpassword', 10);
  const userPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Create Hierarchical Admins
  console.log('Creating admins...');
  
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

  // State Admin (Maharashtra)
  const stateAdminMah = await prisma.user.create({
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

  // State Admin (Bihar)
  const stateAdminBihar = await prisma.user.create({
    data: {
      name: 'State Auditor Bihar',
      email: 'biharadmin@jankari.gov',
      password: biharPasswordHash,
      role: 'admin',
      adminLevel: 'State',
      adminRegion: 'Bihar',
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village'
    }
  });

  // District Admin (Jaipur)
  const districtAdminJaipur = await prisma.user.create({
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

  // Block Admin (Patna Block)
  const blockAdminPatna = await prisma.user.create({
    data: {
      name: 'Patna Block Auditor',
      email: 'blockadmin@jankari.gov',
      password: blockPasswordHash,
      role: 'admin',
      adminLevel: 'Block',
      adminRegion: 'Patna Block',
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village'
    }
  });

  // Panchayat Admin (Amer Panchayat)
  const panchayatAdminAmer = await prisma.user.create({
    data: {
      name: 'Amer Panchayat Auditor',
      email: 'panchayatadmin@jankari.gov',
      password: panchayatPasswordHash,
      role: 'admin',
      adminLevel: 'Panchayat',
      adminRegion: 'Amer',
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer'
    }
  });

  // Citizen Ramesh
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

  console.log('Users and Admins seeded.');

  // 2. Seed Projects
  console.log('Creating projects...');

  // Project 1: Delhi NCR
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
      creatorId: stateAdminMah.id
    }
  });

  // Project 3: Jaipur, Rajasthan (Amer)
  const p3 = await prisma.project.create({
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
      creatorId: districtAdminJaipur.id
    }
  });

  // Project 4: Patna, Bihar (Village Scope)
  const p4 = await prisma.project.create({
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
      creatorId: stateAdminBihar.id
    }
  });

  // Project 5: Mumbai, Maharashtra (Coastal Wall)
  const p5 = await prisma.project.create({
    data: {
      name: 'Coastal Sea Wall Defense Construction',
      description: 'Reinforcement wall barrier along the coastline to block high-tide waves from flooding the highway promenade, incorporating concrete foundation piles.',
      totalBudget: 95000000,
      status: 'In Progress',
      address: 'Marine Drive Coastline, Mumbai, Maharashtra',
      latitude: 18.9438,
      longitude: 72.8229,
      startDate: new Date('2025-02-15'),
      endDate: new Date('2026-05-30'),
      country: 'India',
      state: 'Maharashtra',
      district: 'Mumbai',
      block: 'Mumbai',
      panchayat: 'Mumbai',
      village: 'Mumbai',
      creatorId: stateAdminMah.id
    }
  });

  // Project 6: Patna, Bihar (Health Clinic Block Scope)
  const p6 = await prisma.project.create({
    data: {
      name: 'Patna Block Health Clinic Annex',
      description: 'Establishing a local outpatient clinic annex containing modular examination rooms, primary immunizations rooms, and cold-chain storage for vaccines.',
      totalBudget: 7500000,
      status: 'Suspended',
      address: 'Kadamkuan Block Center, Patna, Bihar',
      latitude: 25.6022,
      longitude: 85.1420,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-10-30'),
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village',
      creatorId: blockAdminPatna.id
    }
  });

  // ==================== NEW PROJECTS: JAIPUR / AMER (RAJASTHAN) ====================
  console.log('Creating 5 additional Jaipur projects...');
  
  const p7 = await prisma.project.create({
    data: {
      name: 'Amer Fort Pedestrian Safety Railings',
      description: 'Upgrading the pedestrian walkways and safety railings leading up to the historic Amer Fort. Features cobblestone repaving, heritage-appropriate safety barricades, and low-intensity lighting.',
      totalBudget: 18000000,
      status: 'In Progress',
      address: 'Amer Fort Access Road, Amer, Jaipur, Rajasthan',
      latitude: 26.9855,
      longitude: 75.8513,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2026-08-30'),
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer',
      creatorId: districtAdminJaipur.id
    }
  });

  const p8 = await prisma.project.create({
    data: {
      name: 'Amer Village Clean Drinking Water Filtration Kiosk',
      description: 'Installation of a centralized Reverse Osmosis (RO) water purification plant and distribution kiosk to provide fluoride-free drinking water to 800+ local families.',
      totalBudget: 4500000,
      status: 'Completed',
      address: 'Main Chowk, Amer Village, Jaipur, Rajasthan',
      latitude: 26.9800,
      longitude: 75.8450,
      startDate: new Date('2024-08-15'),
      endDate: new Date('2025-01-20'),
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer',
      creatorId: panchayatAdminAmer.id
    }
  });

  const p9 = await prisma.project.create({
    data: {
      name: 'Amer Panchayat Smart Anganwadi Center',
      description: 'Construction of a new double-story child daycare and maternal health clinic center (Anganwadi) containing early-education learning tools and automated pediatric health trackers.',
      totalBudget: 2500000,
      status: 'In Progress',
      address: 'Anganwadi Lane, Amer Village, Jaipur, Rajasthan',
      latitude: 26.9812,
      longitude: 75.8480,
      startDate: new Date('2025-10-01'),
      endDate: new Date('2026-07-15'),
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer',
      creatorId: panchayatAdminAmer.id
    }
  });

  const p10 = await prisma.project.create({
    data: {
      name: 'Amer Micro-Irrigation Canal Lining',
      description: 'Concrete lining of a 2.5 km stretch of irrigation canal to reduce water seepage, ensuring agricultural water reaches tail-end fields during dry seasons.',
      totalBudget: 6200000,
      status: 'Proposed',
      address: 'Agricultural Fields Outer Border, Amer, Jaipur, Rajasthan',
      latitude: 26.9920,
      longitude: 75.8390,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2027-02-28'),
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer',
      creatorId: districtAdminJaipur.id
    }
  });

  const p11 = await prisma.project.create({
    data: {
      name: 'Amer Panchayat Solar Power Grid Hub',
      description: 'Setting up a 50kW rooftop solar grid system on the Amer Panchayat library and community center to provide uninterrupted clean backup power.',
      totalBudget: 8000000,
      status: 'Suspended',
      address: 'Panchayat Bhavan Terrace, Amer, Jaipur, Rajasthan',
      latitude: 26.9830,
      longitude: 75.8420,
      startDate: new Date('2025-06-10'),
      endDate: new Date('2025-12-15'),
      country: 'India',
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amer',
      panchayat: 'Amer',
      village: 'Amer',
      creatorId: panchayatAdminAmer.id
    }
  });


  // ==================== NEW PROJECTS: PATNA BLOCK (BIHAR) ====================
  console.log('Creating 4 additional Patna projects...');

  const p12 = await prisma.project.create({
    data: {
      name: 'Patna Block Public Library & Digitization Center',
      description: 'Establishing a public digital library with high-speed internet, e-learning subscriptions, and 12 public access computer terminal desks.',
      totalBudget: 3500000,
      status: 'Completed',
      address: 'Panchayat Bhavan Road, Kadamkuan Village, Patna, Bihar',
      latitude: 25.5920,
      longitude: 85.1320,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-15'),
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village',
      creatorId: blockAdminPatna.id
    }
  });

  const p13 = await prisma.project.create({
    data: {
      name: 'Kadamkuan Drainage System Upgradation',
      description: 'Upgrading open drains to reinforced underground storm-water channels to prevent urban waterlogging during monsoons and enhance community hygiene.',
      totalBudget: 12000000,
      status: 'In Progress',
      address: 'Central Market Drain Outlets, Kadamkuan Village, Patna, Bihar',
      latitude: 25.5960,
      longitude: 85.1410,
      startDate: new Date('2025-03-10'),
      endDate: new Date('2026-06-30'),
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village',
      creatorId: stateAdminBihar.id
    }
  });

  const p14 = await prisma.project.create({
    data: {
      name: 'Kadamkuan Village Community Center Construction',
      description: 'Construction of a community hall with kitchen facilities, toilets, and drinking water for village gatherings, marriages, and public health campaigns.',
      totalBudget: 5500000,
      status: 'Proposed',
      address: 'Community Park Compound, Kadamkuan Village, Patna, Bihar',
      latitude: 25.5910,
      longitude: 85.1360,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-04-30'),
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village',
      creatorId: blockAdminPatna.id
    }
  });

  const p15 = await prisma.project.create({
    data: {
      name: 'Patna Block Secondary School Girls Toilet Blocks',
      description: 'Building two multi-stall sanitation blocks equipped with washbasins, sanitary napkin vending machines, and solar water heating for school girls.',
      totalBudget: 1500000,
      status: 'Completed',
      address: 'Saraswati Girls High School Compound, Patna, Bihar',
      latitude: 25.5935,
      longitude: 85.1380,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-20'),
      country: 'India',
      state: 'Bihar',
      district: 'Patna',
      block: 'Patna Block',
      panchayat: 'Kadamkuan Panchayat',
      village: 'Kadamkuan Village',
      creatorId: blockAdminPatna.id
    }
  });


  // ==================== NEW PROJECTS: NAGPUR (MAHARASHTRA) ====================
  console.log('Creating 4 additional Nagpur projects...');

  const p16 = await prisma.project.create({
    data: {
      name: 'Nagpur Rural Health Sub-Center Upgradations',
      description: 'Modernizing the diagnostic equipment, pharmacy rooms, and cold-chain vaccine storage at the local health sub-center to support maternal checkups.',
      totalBudget: 8500000,
      status: 'In Progress',
      address: 'Health Lane, Civil Suburbs, Nagpur, Maharashtra',
      latitude: 21.1490,
      longitude: 79.0810,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-05-10'),
      country: 'India',
      state: 'Maharashtra',
      district: 'Nagpur',
      block: 'Nagpur',
      panchayat: 'Nagpur',
      village: 'Nagpur',
      creatorId: stateAdminMah.id
    }
  });

  const p17 = await prisma.project.create({
    data: {
      name: 'Nagpur Village Watershed Harvesting Structures',
      description: 'Excavation of check dams and farm ponds to recharge ground aquifers and ensure irrigation supply during summer dry cycles.',
      totalBudget: 5000000,
      status: 'Completed',
      address: 'Rural Farming Outskirts, Nagpur, Maharashtra',
      latitude: 21.1390,
      longitude: 79.0980,
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-11-30'),
      country: 'India',
      state: 'Maharashtra',
      district: 'Nagpur',
      block: 'Nagpur',
      panchayat: 'Nagpur',
      village: 'Nagpur',
      creatorId: stateAdminMah.id
    }
  });

  const p18 = await prisma.project.create({
    data: {
      name: 'Nagpur District High School Science Laboratories',
      description: 'Establishing Physics, Chemistry, and Biology laboratories equipped with compound microscopes, reagents, burner tables, and interactive demonstration screens.',
      totalBudget: 4000000,
      status: 'In Progress',
      address: 'District Education Board High School, Nagpur, Maharashtra',
      latitude: 21.1440,
      longitude: 79.0850,
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-07-31'),
      country: 'India',
      state: 'Maharashtra',
      district: 'Nagpur',
      block: 'Nagpur',
      panchayat: 'Nagpur',
      village: 'Nagpur',
      creatorId: stateAdminMah.id
    }
  });

  const p19 = await prisma.project.create({
    data: {
      name: 'Nagpur Panchayat Solar Water Borewell Installation',
      description: 'Boring and installing 3 solar-powered submersible tube wells equipped with 5HP solar water pumps and concrete storage tanks to serve rural communities.',
      totalBudget: 3000000,
      status: 'Proposed',
      address: 'Panchayat Community Squares, Nagpur, Maharashtra',
      latitude: 21.1510,
      longitude: 79.0920,
      startDate: new Date('2026-10-01'),
      endDate: new Date('2027-03-31'),
      country: 'India',
      state: 'Maharashtra',
      district: 'Nagpur',
      block: 'Nagpur',
      panchayat: 'Nagpur',
      village: 'Nagpur',
      creatorId: stateAdminMah.id
    }
  });


  console.log('Projects created successfully.');

  // 3. Seed Hierarchical Fund Allocations
  console.log('Creating nested budget trees...');

  // Allocations Project 1 (NCR Highway)
  const a1 = await prisma.fundAllocation.create({
    data: { projectId: p1.id, name: 'Pavement & Heavy Structural Works', amount: 100000000, description: 'Major asphalt laying, concrete flyovers, and bridge joint structural laying.' }
  });
  const a1_sub1 = await prisma.fundAllocation.create({
    data: { projectId: p1.id, name: 'Raw Materials Procurement', amount: 70000000, parentId: a1.id, description: 'Bulk ordering for sand, steel bars, and Portland cement.' }
  });
  const a1_sub2 = await prisma.fundAllocation.create({
    data: { projectId: p1.id, name: 'Engineering Labor Contracting', amount: 30000000, parentId: a1.id, description: 'Pay for machinery operators and site engineering staff.' }
  });

  // Allocations Project 2 (Nagpur Hospital)
  const a2 = await prisma.fundAllocation.create({
    data: { projectId: p2.id, name: 'Trauma Center RCC Wing structural', amount: 25000000, description: 'RCC framing foundations, bricks, and internal partitioning works.' }
  });
  const a2_sub1 = await prisma.fundAllocation.create({
    data: { projectId: p2.id, name: 'Materials Store', amount: 15000000, parentId: a2.id }
  });
  const a2_2 = await prisma.fundAllocation.create({
    data: { projectId: p2.id, name: 'Advanced Oxygen Plant & Monitors', amount: 20000000, description: 'Setting up the bedside medical hardware and central oxygen gas piping.' }
  });

  // Allocations Project 3 (Jaipur Lights)
  const a3 = await prisma.fundAllocation.create({
    data: { projectId: p3.id, name: 'Solar LED Lighting Hardware', amount: 4000000, description: 'Sourcing 500 integrated batteries and solar panels.' }
  });

  // Allocations Project 4 (School Patna)
  const a4 = await prisma.fundAllocation.create({
    data: { projectId: p4.id, name: 'Roof Repairs & Classroom Plasters', amount: 400000, description: 'Waterproofing slab work and plaster walls.' }
  });
  const a4_2 = await prisma.fundAllocation.create({
    data: { projectId: p4.id, name: 'Computer Laboratory Set Up', amount: 800000, description: 'Desktop computers procurement and networking switches setup.' }
  });

  // Allocations Project 5 (Mumbai Wall)
  const a5 = await prisma.fundAllocation.create({
    data: { projectId: p5.id, name: 'Concrete Base Foundations', amount: 50000000, description: 'Piling reinforcement columns along the shoreline.' }
  });
  const a5_sub1 = await prisma.fundAllocation.create({
    data: { projectId: p5.id, name: 'Armored Block Procurement', amount: 30000000, parentId: a5.id }
  });

  // Allocations Project 6 (Patna Health)
  const a6 = await prisma.fundAllocation.create({
    data: { projectId: p6.id, name: 'Building Structural Masonry', amount: 5000000, description: 'Brick walls, modular partitions, and roofing.' }
  });

  // Allocations Project 7 (Amer Pedestrian Safety)
  const a7 = await prisma.fundAllocation.create({
    data: { projectId: p7.id, name: 'Pedestrian Safety Railings', amount: 6000000, description: 'Safety barricades and handles.' }
  });
  const a7_sub1 = await prisma.fundAllocation.create({
    data: { projectId: p7.id, name: 'Brass Heritage Guardrails', amount: 4500000, parentId: a7.id }
  });
  const a7_sub2 = await prisma.fundAllocation.create({
    data: { projectId: p7.id, name: 'Masonry Anchoring Work', amount: 1500000, parentId: a7.id }
  });
  const a7_2 = await prisma.fundAllocation.create({
    data: { projectId: p7.id, name: 'Cobblestone Pavement Restoration', amount: 12000000, description: 'Cobblestone mapping and skilled masonry placement.' }
  });
  const a7_2_sub1 = await prisma.fundAllocation.create({
    data: { projectId: p7.id, name: 'Granite Cobblestones Sourcing', amount: 8000000, parentId: a7_2.id }
  });

  // Allocations Project 8 (Amer Filtration Kiosk)
  const a8 = await prisma.fundAllocation.create({
    data: { projectId: p8.id, name: 'RO Filtration Hardware', amount: 2500000 }
  });
  const a8_2 = await prisma.fundAllocation.create({
    data: { projectId: p8.id, name: 'Civil Structural Kiosk', amount: 1500000 }
  });
  const a8_3 = await prisma.fundAllocation.create({
    data: { projectId: p8.id, name: 'Piping & Borewell Drilling', amount: 500000 }
  });

  // Allocations Project 9 (Amer Anganwadi)
  const a9 = await prisma.fundAllocation.create({
    data: { projectId: p9.id, name: 'Building Structural Foundation', amount: 1500000 }
  });
  const a9_sub1 = await prisma.fundAllocation.create({
    data: { projectId: p9.id, name: 'Cement and Steel Works', amount: 1000000, parentId: a9.id }
  });
  const a9_sub2 = await prisma.fundAllocation.create({
    data: { projectId: p9.id, name: 'Bricks and Plastering', amount: 500000, parentId: a9.id }
  });
  const a9_2 = await prisma.fundAllocation.create({
    data: { projectId: p9.id, name: 'Educational Furnishing & Kits', amount: 1000000 }
  });

  // Allocations Project 10 (Amer Canal Lining)
  const a10 = await prisma.fundAllocation.create({
    data: { projectId: p10.id, name: 'Canal Earthworks & Excavation', amount: 1200000 }
  });
  const a10_2 = await prisma.fundAllocation.create({
    data: { projectId: p10.id, name: 'Concrete Cast-in-Situ Panels', amount: 5000000 }
  });

  // Allocations Project 11 (Amer Solar Hub)
  const a11 = await prisma.fundAllocation.create({
    data: { projectId: p11.id, name: 'Solar Photovoltaic Modules', amount: 5000000 }
  });
  const a11_2 = await prisma.fundAllocation.create({
    data: { projectId: p11.id, name: 'Hybrid Inverters & Battery Storage', amount: 3000000 }
  });

  // Allocations Project 12 (Patna Library)
  const a12 = await prisma.fundAllocation.create({
    data: { projectId: p12.id, name: 'IT & Computer Networking Setup', amount: 2000000 }
  });
  const a12_2 = await prisma.fundAllocation.create({
    data: { projectId: p12.id, name: 'Interior Renovation & Books', amount: 1500000 }
  });

  // Allocations Project 13 (Patna Drainage)
  const a13 = await prisma.fundAllocation.create({
    data: { projectId: p13.id, name: 'Drainage Channel Trench Excavation', amount: 3000000 }
  });
  const a13_2 = await prisma.fundAllocation.create({
    data: { projectId: p13.id, name: 'Precast RCC Drainage Pipes Sourcing', amount: 9000000 }
  });

  // Allocations Project 14 (Patna Community Center)
  const a14 = await prisma.fundAllocation.create({
    data: { projectId: p14.id, name: 'Foundation & Brickwork Masonry', amount: 3500000 }
  });
  const a14_2 = await prisma.fundAllocation.create({
    data: { projectId: p14.id, name: 'Roof Slab Casting', amount: 2000000 }
  });

  // Allocations Project 15 (Patna School Toilets)
  const a15 = await prisma.fundAllocation.create({
    data: { projectId: p15.id, name: 'Sanitary Piping & Fitting', amount: 700000 }
  });
  const a15_2 = await prisma.fundAllocation.create({
    data: { projectId: p15.id, name: 'Civil Structure Masonry', amount: 800000 }
  });

  // Allocations Project 16 (Nagpur Health Sub-center)
  const a16 = await prisma.fundAllocation.create({
    data: { projectId: p16.id, name: 'Diagnostic Medical Instruments', amount: 5000000 }
  });
  const a16_2 = await prisma.fundAllocation.create({
    data: { projectId: p16.id, name: 'Cold-Chain Vaccine Cabinets', amount: 3500000 }
  });

  // Allocations Project 17 (Nagpur Watershed check dams)
  const a17 = await prisma.fundAllocation.create({
    data: { projectId: p17.id, name: 'Check Dam RCC Weir Construction', amount: 3500050 }
  });
  const a17_2 = await prisma.fundAllocation.create({
    data: { projectId: p17.id, name: 'Heavy Earthworks Trench Digging', amount: 1499950 }
  });

  // Allocations Project 18 (Nagpur Science Labs)
  const a18 = await prisma.fundAllocation.create({
    data: { projectId: p18.id, name: 'Lab Tables & Reagents Racks', amount: 1500000 }
  });
  const a18_2 = await prisma.fundAllocation.create({
    data: { projectId: p18.id, name: 'Precision Lab Equipment', amount: 2500000 }
  });

  // Allocations Project 19 (Nagpur Solar Submersibles)
  const a19 = await prisma.fundAllocation.create({
    data: { projectId: p19.id, name: 'Submersible Borewell Pumps', amount: 1800000 }
  });
  const a19_2 = await prisma.fundAllocation.create({
    data: { projectId: p19.id, name: 'Concrete Storage Reservoirs', amount: 1200000 }
  });

  console.log('Fund trees seeded.');

  // 4. Seed Materials
  console.log('Seeding materials invoices...');

  // Highway Materials
  await prisma.material.createMany({
    data: [
      { projectId: p1.id, name: 'TMT Steel Rebars Fe 550D', quantity: 400, unit: 'Tons', unitCost: 65000, totalCost: 26000000, supplier: 'Tata Steel Ltd', allocationId: a1_sub1.id },
      { projectId: p1.id, name: 'OPC Grade 53 Portland Cement', quantity: 40000, unit: 'Bags', unitCost: 450, totalCost: 18000000, supplier: 'UltraTech Cement Ltd', allocationId: a1_sub1.id }
    ]
  });

  // Nagpur Hospital Materials
  await prisma.material.createMany({
    data: [
      { projectId: p2.id, name: 'PSA Oxygen Plant 500 LPM', quantity: 1, unit: 'Unit', unitCost: 12000000, totalCost: 12000000, supplier: 'Absotech Gas Systems', allocationId: a2_2.id },
      { projectId: p2.id, name: 'Grade 53 Construction Cement', quantity: 20000, unit: 'Bags', unitCost: 450, totalCost: 9000000, supplier: 'Ambuja Cements Ltd', allocationId: a2_sub1.id }
    ]
  });

  // School Patna Materials
  await prisma.material.createMany({
    data: [
      { projectId: p4.id, name: 'Dell Inspiron Desktop PCs', quantity: 15, unit: 'Units', unitCost: 30000, totalCost: 450000, supplier: 'Dell India Pvt Ltd', allocationId: a4_2.id },
      { projectId: p4.id, name: '1KVA Online UPS Power Backup', quantity: 1, unit: 'Unit', unitCost: 50000, totalCost: 50000, supplier: 'APC Systems Pvt Ltd', allocationId: a4_2.id }
    ]
  });

  // Mumbai Wall Materials
  await prisma.material.createMany({
    data: [
      { projectId: p5.id, name: 'Armored Tetrapod Concrete Blocks', quantity: 1500, unit: 'Units', unitCost: 20000, totalCost: 30000000, supplier: 'L&T Infrastructure Ltd', allocationId: a5_sub1.id }
    ]
  });

  // New projects materials
  await prisma.material.createMany({
    data: [
      // Amer Safety walkway
      { projectId: p7.id, name: 'Brass Antique Guard Railings', quantity: 250, unit: 'Units', unitCost: 15000, totalCost: 3750000, supplier: 'Jaipur Heritage Crafts', allocationId: a7_sub1.id },
      { projectId: p7.id, name: 'Red Granite Cobblestones', quantity: 80000, unit: 'Blocks', unitCost: 80, totalCost: 6400000, supplier: 'Rajasthan Mining Corp', allocationId: a7_2_sub1.id },
      
      // Amer RO filter
      { projectId: p8.id, name: 'Industrial 5000 LPH RO System', quantity: 1, unit: 'Unit', unitCost: 2200000, totalCost: 2200000, supplier: 'Kent Aqua Systems Ltd', allocationId: a8.id },
      { projectId: p8.id, name: 'PVC Water Pipes 4-inch', quantity: 150, unit: 'Pipes', unitCost: 2000, totalCost: 300000, supplier: 'Astral Poly Technik Ltd', allocationId: a8_3.id },

      // Amer Anganwadi
      { projectId: p9.id, name: 'Grade 53 Portland Cement', quantity: 1200, unit: 'Bags', unitCost: 450, totalCost: 540000, supplier: 'UltraTech Cement Ltd', allocationId: a9_sub1.id },
      { projectId: p9.id, name: 'Anganwadi Early Learning Kits', quantity: 30, unit: 'Kits', unitCost: 10050, totalCost: 301500, supplier: 'Sharda Toy Emporium', allocationId: a9_2.id },

      // Amer Canal
      { projectId: p10.id, name: 'Ready-mix Concrete M20 Grade', quantity: 800, unit: 'Cubic Meters', unitCost: 5000, totalCost: 4000000, supplier: 'Jaipur Concrete Co', allocationId: a10_2.id },

      // Amer Solar Power grid
      { projectId: p11.id, name: 'Tata Power Solar 400W Panels', quantity: 125, unit: 'Units', unitCost: 32000, totalCost: 4000000, supplier: 'Tata Power Solar Systems', allocationId: a11.id },

      // Patna Digital Library
      { projectId: p12.id, name: 'HP Thin Client Desktops', quantity: 12, unit: 'Units', unitCost: 35000, totalCost: 420000, supplier: 'HP India Ltd', allocationId: a12.id },
      { projectId: p12.id, name: 'Optical Fiber Router & Switch', quantity: 2, unit: 'Units', unitCost: 75000, totalCost: 150000, supplier: 'Cisco Systems Ltd', allocationId: a12.id },

      // Patna Drainage Upgrades
      { projectId: p13.id, name: 'RCC Hume Pipes 900mm Class NP3', quantity: 800, unit: 'Pipes', unitCost: 8500, totalCost: 6800000, supplier: 'Bihar Concrete Pipes Ltd', allocationId: a13_2.id },

      // Patna Community Center
      { projectId: p14.id, name: 'First Class Clay Red Bricks', quantity: 60000, unit: 'Bricks', unitCost: 8, totalCost: 480000, supplier: 'Patna Brick Kiln Association', allocationId: a14.id },

      // Patna Girls school toilet stalls
      { projectId: p15.id, name: 'Ceramic Sanitary Toilets & Sinks', quantity: 8, unit: 'Sets', unitCost: 12000, totalCost: 96000, supplier: 'Cera Sanitaryware Ltd', allocationId: a15.id },
      { projectId: p15.id, name: 'Solar Water Heater 200LPD', quantity: 1, unit: 'Unit', unitCost: 65000, totalCost: 65000, supplier: 'V-Guard Industries', allocationId: a15.id },

      // Nagpur Rural health upgrades
      { projectId: p16.id, name: 'Deep Vaccine Freezers -20C', quantity: 2, unit: 'Units', unitCost: 250000, totalCost: 500000, supplier: 'Blue Star Ltd', allocationId: a16_2.id },
      { projectId: p16.id, name: 'Semi-Auto Biochemistry Analyzer', quantity: 1, unit: 'Unit', unitCost: 1200000, totalCost: 1200000, supplier: 'Siemens Healthineers', allocationId: a16.id },

      // Nagpur watershed
      { projectId: p17.id, name: 'TMT Steel Structural Bars', quantity: 30, unit: 'Tons', unitCost: 60000, totalCost: 1800000, supplier: 'SAIL Ltd', allocationId: a17.id },

      // Nagpur school science labs
      { projectId: p18.id, name: 'Compound Optical Microscopes', quantity: 25, unit: 'Units', unitCost: 12000, totalCost: 300000, supplier: 'Labo Premium Instruments', allocationId: a18_2.id },
      { projectId: p18.id, name: 'Physics Demonstration Screen Kit', quantity: 1, unit: 'Unit', unitCost: 350000, totalCost: 350000, supplier: 'Samsung India', allocationId: a18_2.id },

      // Nagpur Solar Wells
      { projectId: p19.id, name: 'Lubi 5HP Solar Submersible Pump', quantity: 3, unit: 'Units', unitCost: 320000, totalCost: 960000, supplier: 'Lubi Pumps Ltd', allocationId: a19.id }
    ]
  });

  console.log('Materials list seeded.');

  // 5. Seed Verifications
  console.log('Seeding audits...');
  await prisma.verification.createMany({
    data: [
      {
        projectId: p1.id,
        userId: citizen.id,
        status: 'Not Completed',
        comment: 'Visited the bypass highway site today. Only earthworks have started. The layout isn’t fully graded yet and no smart sensors or lights are installed. Budget spent seems disproportionate to the actual work visible.',
        imageUrl: '/uploads/proof-highway.png'
      },
      {
        projectId: p4.id,
        userId: citizen.id,
        status: 'Completed',
        comment: 'The classrooms look beautiful now and have new murals! The new computer lab is active with kids using it, and toilets are functional with running water. Excellent public fund usage!',
        imageUrl: '/uploads/proof-school.png'
      }
    ]
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
