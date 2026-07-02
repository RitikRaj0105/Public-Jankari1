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
  fs.writeFileSync(path.join(uploadsDir, 'proof-bridge.png'), buffer);
  fs.writeFileSync(path.join(uploadsDir, 'proof-hospital.png'), buffer);
  fs.writeFileSync(path.join(uploadsDir, 'proof-water.png'), buffer);
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
  const adminPw = await bcrypt.hash('adminpassword', 10);
  const statePw = await bcrypt.hash('statepassword', 10);
  const distPw = await bcrypt.hash('jaipurpassword', 10);
  const blockPw = await bcrypt.hash('blockpassword', 10);
  const panchPw = await bcrypt.hash('panchayatpassword', 10);
  const userPw = await bcrypt.hash('password123', 10);

  // ============================================================
  //  USERS & ADMINS
  // ============================================================
  console.log('Creating admins & citizens...');

  const countryAdmin = await prisma.user.create({
    data: { name: 'National Auditor', email: 'admin@jankari.gov', password: adminPw, role: 'admin', adminLevel: 'Country', adminRegion: 'India', country: 'India', state: 'Delhi', district: 'Central Delhi', block: 'Delhi', panchayat: 'Central Delhi', village: 'Delhi' }
  });

  const stateAdminMah = await prisma.user.create({
    data: { name: 'State Auditor Maharashtra', email: 'stateadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Maharashtra', country: 'India', state: 'Maharashtra', district: 'Nagpur', block: 'Nagpur', panchayat: 'Nagpur', village: 'Nagpur' }
  });

  const stateAdminBihar = await prisma.user.create({
    data: { name: 'State Auditor Bihar', email: 'biharadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Bihar', country: 'India', state: 'Bihar', district: 'Patna', block: 'Patna Block', panchayat: 'Kadamkuan Panchayat', village: 'Kadamkuan Village' }
  });

  const distAdminJaipur = await prisma.user.create({
    data: { name: 'Jaipur District Auditor', email: 'jaipuradmin@jankari.gov', password: distPw, role: 'admin', adminLevel: 'District', adminRegion: 'Jaipur', country: 'India', state: 'Rajasthan', district: 'Jaipur', block: 'Amer', panchayat: 'Amer', village: 'Amer' }
  });

  const blockAdminPatna = await prisma.user.create({
    data: { name: 'Patna Block Auditor', email: 'blockadmin@jankari.gov', password: blockPw, role: 'admin', adminLevel: 'Block', adminRegion: 'Patna Block', country: 'India', state: 'Bihar', district: 'Patna', block: 'Patna Block', panchayat: 'Kadamkuan Panchayat', village: 'Kadamkuan Village' }
  });

  const panchAdminAmer = await prisma.user.create({
    data: { name: 'Amer Panchayat Auditor', email: 'panchayatadmin@jankari.gov', password: panchPw, role: 'admin', adminLevel: 'Panchayat', adminRegion: 'Amer', country: 'India', state: 'Rajasthan', district: 'Jaipur', block: 'Amer', panchayat: 'Amer', village: 'Amer' }
  });

  const stateAdminUP = await prisma.user.create({
    data: { name: 'State Auditor UP', email: 'upadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Uttar Pradesh', country: 'India', state: 'Uttar Pradesh', district: 'Lucknow', block: 'Lucknow', panchayat: 'Lucknow', village: 'Lucknow' }
  });

  const stateAdminMP = await prisma.user.create({
    data: { name: 'State Auditor MP', email: 'mpadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Madhya Pradesh', country: 'India', state: 'Madhya Pradesh', district: 'Bhopal', block: 'Bhopal', panchayat: 'Bhopal', village: 'Bhopal' }
  });

  const stateAdminKA = await prisma.user.create({
    data: { name: 'State Auditor Karnataka', email: 'kaadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Karnataka', country: 'India', state: 'Karnataka', district: 'Bengaluru', block: 'Bengaluru', panchayat: 'Bengaluru', village: 'Bengaluru' }
  });

  const stateAdminTN = await prisma.user.create({
    data: { name: 'State Auditor Tamil Nadu', email: 'tnadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Tamil Nadu', country: 'India', state: 'Tamil Nadu', district: 'Chennai', block: 'Chennai', panchayat: 'Chennai', village: 'Chennai' }
  });

  const stateAdminGJ = await prisma.user.create({
    data: { name: 'State Auditor Gujarat', email: 'gjadmin@jankari.gov', password: statePw, role: 'admin', adminLevel: 'State', adminRegion: 'Gujarat', country: 'India', state: 'Gujarat', district: 'Ahmedabad', block: 'Ahmedabad', panchayat: 'Ahmedabad', village: 'Ahmedabad' }
  });

  const citizen1 = await prisma.user.create({
    data: { name: 'Ramesh Kumar', email: 'ramesh@citizens.org', password: userPw, role: 'citizen', country: 'India', state: 'Bihar', district: 'Patna', block: 'Patna Block', panchayat: 'Kadamkuan Panchayat', village: 'Kadamkuan Village' }
  });

  const citizen2 = await prisma.user.create({
    data: { name: 'Priya Sharma', email: 'priya@citizens.org', password: userPw, role: 'citizen', country: 'India', state: 'Rajasthan', district: 'Jaipur', block: 'Amer', panchayat: 'Amer', village: 'Amer' }
  });

  const citizen3 = await prisma.user.create({
    data: { name: 'Arun Verma', email: 'arun@citizens.org', password: userPw, role: 'citizen', country: 'India', state: 'Maharashtra', district: 'Nagpur', block: 'Nagpur', panchayat: 'Nagpur', village: 'Nagpur' }
  });

  console.log('Users seeded.');

  // ============================================================
  //  50 PROJECTS — Data-Driven Definitions
  //  35 Completed + 8 In Progress + 4 Proposed + 3 Suspended
  // ============================================================
  console.log('Creating 50 projects...');

  const adminMap = {
    'Delhi': countryAdmin.id,
    'Maharashtra': stateAdminMah.id,
    'Bihar': stateAdminBihar.id,
    'Rajasthan': distAdminJaipur.id,
    'Uttar Pradesh': stateAdminUP.id,
    'Madhya Pradesh': stateAdminMP.id,
    'Karnataka': stateAdminKA.id,
    'Tamil Nadu': stateAdminTN.id,
    'Gujarat': stateAdminGJ.id,
  };

  // Each project definition: [name, desc, budget, status, address, lat, lng, state, district, block, panchayat, village, startDate, endDate]
  const projectDefs = [
    // ====== 35 COMPLETED PROJECTS ======
    // Bihar (8 completed)
    ['Saraswati Primary School Renovation', 'Rebuilding leaking roofs, constructing separate boys/girls toilets, painting classrooms with educational murals, and establishing a computer laboratory with 15 workstations.', 1200000, 'Completed', 'Kadamkuan Village, Patna, Bihar', 25.5941, 85.1376, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-01-10', '2024-07-30'],
    ['Patna Block Public Library & Digitization Center', 'Establishing a public digital library with high-speed internet, e-learning subscriptions, and 12 public access computer terminals.', 3500000, 'Completed', 'Panchayat Bhavan Road, Kadamkuan Village, Patna, Bihar', 25.5920, 85.1320, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-03-01', '2024-08-15'],
    ['Patna Block Secondary School Girls Toilet Blocks', 'Building two multi-stall sanitation blocks with washbasins, sanitary napkin vending machines, and solar water heating for school girls.', 1500000, 'Completed', 'Saraswati Girls High School, Patna, Bihar', 25.5935, 85.1380, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-04-01', '2024-09-20'],
    ['Kadamkuan Village Hand Pump Borewell Network', 'Drilling and installing 8 India Mark-II hand pumps across village clusters to ensure year-round drinking water access.', 800000, 'Completed', 'Multiple Sites, Kadamkuan Village, Patna, Bihar', 25.5950, 85.1350, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-02-15', '2024-06-30'],
    ['Patna Rural Road Concrete Paving (Phase I)', 'Constructing 3.5 km CC road connecting Kadamkuan Village to NH-30 highway with proper drainage channels.', 4500000, 'Completed', 'Village Road to NH-30, Patna, Bihar', 25.5880, 85.1400, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2023-11-01', '2024-05-30'],
    ['Kadamkuan Gram Panchayat Bhawan Construction', 'Building a new 2-story Panchayat office with community meeting hall, record storage room, and digital service center.', 2800000, 'Completed', 'Central Chowk, Kadamkuan Village, Patna, Bihar', 25.5945, 85.1365, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-06-01', '2024-12-15'],
    ['Kadamkuan Village Solar Street Lights', 'Installing 120 solar-powered LED street lights along village main roads and community gathering points.', 1800000, 'Completed', 'Main Roads, Kadamkuan Village, Patna, Bihar', 25.5938, 85.1372, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-07-01', '2024-11-30'],
    ['Patna Block Anganwadi Center Upgradation', 'Renovating 5 Anganwadi centers with proper flooring, nutrition kitchens, child-safe play equipment, and learning kits.', 2200000, 'Completed', 'Various Anganwadi Centers, Patna Block, Bihar', 25.5960, 85.1340, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2024-08-01', '2025-01-15'],

    // Rajasthan (7 completed)
    ['Amer Village Clean Drinking Water Filtration Kiosk', 'Installation of a centralized RO water purification plant and distribution kiosk to provide fluoride-free drinking water to 800+ local families.', 4500000, 'Completed', 'Main Chowk, Amer Village, Jaipur, Rajasthan', 26.9800, 75.8450, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-04-15', '2024-09-20'],
    ['Amer Heritage Walk Cobblestone Restoration', 'Restoring 1.2 km heritage walkway with hand-cut sandstone pavers, heritage signage, and low-intensity lighting for tourist safety.', 6500000, 'Completed', 'Fort Access Road, Amer, Jaipur, Rajasthan', 26.9855, 75.8513, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-01-01', '2024-08-30'],
    ['Amer Panchayat Community Health Clinic', 'Constructing a primary health sub-center with OPD rooms, pharmacy, vaccination cold-chain unit, and maternal care ward.', 5200000, 'Completed', 'Near Bus Stand, Amer, Jaipur, Rajasthan', 26.9810, 75.8440, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-03-01', '2024-10-30'],
    ['Amer Government Senior Secondary School Lab', 'Setting up Physics, Chemistry, and Biology laboratories with apparatus, chemical reagents, and smart boards.', 3800000, 'Completed', 'Govt. Sr. Sec. School, Amer, Jaipur, Rajasthan', 26.9820, 75.8460, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-05-01', '2024-11-15'],
    ['Amer Village Drain-Line Covered Channel', 'Converting 2 km open drain to covered RCC drain channel to prevent waterlogging and mosquito breeding.', 3200000, 'Completed', 'Village Main Drains, Amer, Jaipur, Rajasthan', 26.9808, 75.8475, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-06-15', '2024-12-20'],
    ['Amer Cremation Ground Shed & Boundary Wall', 'Building a proper cremation shed with concrete platform, boundary wall, and water facilities.', 1500000, 'Completed', 'Cremation Ground, Amer, Jaipur, Rajasthan', 26.9790, 75.8430, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-07-01', '2024-10-30'],
    ['Amer Panchayat Toilet Complex (Swachh Bharat)', 'Constructing 25 individual household toilets and 2 community toilet blocks under Swachh Bharat Mission.', 2000000, 'Completed', 'Various Households, Amer Village, Jaipur, Rajasthan', 26.9815, 75.8455, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2024-02-01', '2024-07-30'],

    // Maharashtra (6 completed)
    ['Nagpur Village Watershed Harvesting Structures', 'Excavation of check dams and farm ponds to recharge ground aquifers and ensure irrigation during dry cycles.', 5000000, 'Completed', 'Rural Farming Outskirts, Nagpur, Maharashtra', 21.1390, 79.0980, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2024-02-15', '2024-08-30'],
    ['Nagpur Zilla Parishad School Renovation', 'Complete renovation of ZP school including new roof, classrooms painting, library setup, and playground development.', 2800000, 'Completed', 'ZP School Campus, Nagpur, Maharashtra', 21.1420, 79.0860, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2024-01-10', '2024-06-30'],
    ['Nagpur Rural Electrification (Last Mile)', 'Electrifying 45 unconnected households with poles, transformers, and individual meters under Saubhagya scheme.', 3200000, 'Completed', 'Outer Hamlets, Nagpur, Maharashtra', 21.1350, 79.1020, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2024-04-01', '2024-09-15'],
    ['Nagpur PHC Vaccine Cold-Chain Upgradation', 'Installing walk-in cold rooms, ice-lined refrigerators, and solar-powered backup at Primary Health Centre.', 4200000, 'Completed', 'PHC Campus, Nagpur, Maharashtra', 21.1480, 79.0830, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2024-05-01', '2024-10-30'],
    ['Nagpur Gram Panchayat Digital Service Kiosk', 'Setting up a CSC (Common Service Centre) with biometric Aadhaar enrolment, land record printing, and bill payment services.', 1500000, 'Completed', 'Gram Panchayat Office, Nagpur, Maharashtra', 21.1460, 79.0900, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2024-06-01', '2024-09-30'],
    ['Mumbai Coastal Promenade Renovation', 'Repairing 800m stretch of Marine Drive promenade with new granite flooring, anti-corrosion railings, and LED path lights.', 8500000, 'Completed', 'Marine Drive Section-C, Mumbai, Maharashtra', 18.9438, 72.8229, 'Maharashtra', 'Mumbai', 'Mumbai', 'Mumbai', 'Mumbai', '2024-03-15', '2024-11-30'],

    // Uttar Pradesh (4 completed)
    ['Lucknow PHC Building Construction', 'Building a 6-room Primary Health Centre with OPD, labor room, pharmacy, and staff quarters.', 6500000, 'Completed', 'Aliganj Block, Lucknow, Uttar Pradesh', 26.8890, 80.9422, 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Lucknow', 'Lucknow', '2024-01-15', '2024-09-30'],
    ['Lucknow Rural Bridge Over Gomti Tributary', 'Constructing 45m RCC slab bridge connecting two villages across seasonal Gomti tributary.', 12000000, 'Completed', 'Gomti Nala Crossing, Lucknow, Uttar Pradesh', 26.8750, 80.9500, 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Lucknow', 'Lucknow', '2023-09-01', '2024-07-30'],
    ['Lucknow Atal Pension Yojana Awareness Center', 'Setting up a financial literacy and pension enrolment center with banking correspondents.', 800000, 'Completed', 'Block Office Complex, Lucknow, Uttar Pradesh', 26.8950, 80.9380, 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Lucknow', 'Lucknow', '2024-06-01', '2024-08-30'],
    ['Lucknow Village Playground & Open Gym', 'Developing a children playground with swings, slides, and open-air gym equipment for youth fitness.', 1200000, 'Completed', 'Community Ground, Aliganj, Lucknow, UP', 26.8920, 80.9410, 'Uttar Pradesh', 'Lucknow', 'Lucknow', 'Lucknow', 'Lucknow', '2024-04-15', '2024-08-15'],

    // Karnataka (3 completed)
    ['Bengaluru Rural Mid-Day Meal Kitchen', 'Constructing a centralized Akshara Dasoha kitchen serving hot meals to 2000+ students across 12 schools.', 5500000, 'Completed', 'Education Block Office, Bengaluru Rural, Karnataka', 12.9716, 77.5946, 'Karnataka', 'Bengaluru', 'Bengaluru', 'Bengaluru', 'Bengaluru', '2024-02-01', '2024-08-31'],
    ['Bengaluru Gram Panchayat Rainwater Harvesting', 'Installing 30 rooftop rainwater harvesting units on public buildings and community halls.', 1800000, 'Completed', 'Various GP Buildings, Bengaluru Rural, Karnataka', 12.9680, 77.5980, 'Karnataka', 'Bengaluru', 'Bengaluru', 'Bengaluru', 'Bengaluru', '2024-05-01', '2024-10-15'],
    ['Bengaluru Village Skill Training Center', 'Building a multi-purpose skill training center with computer lab, tailoring unit, and electrician workshop.', 3200000, 'Completed', 'ITI Campus Extension, Bengaluru Rural, Karnataka', 12.9740, 77.5910, 'Karnataka', 'Bengaluru', 'Bengaluru', 'Bengaluru', 'Bengaluru', '2024-03-15', '2024-09-30'],

    // Tamil Nadu (3 completed)
    ['Chennai Slum Resettlement Housing Block-A', 'Constructing 50-unit 2BHK apartments for slum-dwelling families with proper water and sanitation.', 25000000, 'Completed', 'Perumbakkam Resettlement Colony, Chennai, Tamil Nadu', 12.9060, 80.2000, 'Tamil Nadu', 'Chennai', 'Chennai', 'Chennai', 'Chennai', '2023-06-01', '2024-06-30'],
    ['Chennai Corporation School Computer Lab', 'Setting up 25-seat computer laboratory with projector, UPS backup, and internet connectivity.', 2000000, 'Completed', 'Corporation School No. 42, Chennai, Tamil Nadu', 13.0827, 80.2707, 'Tamil Nadu', 'Chennai', 'Chennai', 'Chennai', 'Chennai', '2024-04-01', '2024-09-15'],
    ['Chennai Bus Terminus Passenger Shelter Upgrade', 'Renovating passenger waiting area with seating, fans, LED display boards, and CCTV cameras.', 3500000, 'Completed', 'Tambaram Bus Terminus, Chennai, Tamil Nadu', 12.9249, 80.1000, 'Tamil Nadu', 'Chennai', 'Chennai', 'Chennai', 'Chennai', '2024-01-15', '2024-07-30'],

    // Gujarat (2 completed)
    ['Ahmedabad Rural School Boundary Wall & Gate', 'Constructing RCC compound wall with iron gate and guard room for school campus security.', 1600000, 'Completed', 'Primary School, Daskroi, Ahmedabad, Gujarat', 22.9580, 72.5714, 'Gujarat', 'Ahmedabad', 'Ahmedabad', 'Ahmedabad', 'Ahmedabad', '2024-03-01', '2024-07-30'],
    ['Ahmedabad Village Piped Water Supply Scheme', 'Laying 4 km pipeline from overhead tank to individual household connections serving 300 families.', 5500000, 'Completed', 'Daskroi Village, Ahmedabad, Gujarat', 22.9550, 72.5680, 'Gujarat', 'Ahmedabad', 'Ahmedabad', 'Ahmedabad', 'Ahmedabad', '2024-01-15', '2024-08-30'],

    // Delhi (2 completed)
    ['Delhi Municipal Ward Community Toilet Complex', 'Building a 20-seat community toilet block with bio-digester technology, caretaker room, and rainwater harvesting.', 4500000, 'Completed', 'Trilokpuri Ward, East Delhi', 28.6180, 77.3056, 'Delhi', 'East Delhi', 'Delhi', 'Delhi', 'Delhi', '2024-02-01', '2024-07-15'],
    ['Delhi Smart Bus Shelter Installation (Phase-II)', 'Installing 15 solar-powered smart bus shelters with real-time arrival displays, USB charging, and CCTV.', 9000000, 'Completed', 'Various Locations, South Delhi', 28.5355, 77.2090, 'Delhi', 'South Delhi', 'Delhi', 'Delhi', 'Delhi', '2024-01-01', '2024-08-30'],

    // ====== 8 IN PROGRESS PROJECTS ======
    ['Greenfield Smart Highway (Phase 1)', 'Construction of a modern 6-lane bypass smart highway with solar street lights, emergency call boxes, and smart traffic sensors.', 150000000, 'In Progress', 'Outer Ring Road Bypass, Delhi NCR', 28.7041, 77.1025, 'Delhi', 'Central Delhi', 'Delhi', 'Delhi', 'Delhi', '2025-01-10', '2026-12-30'],
    ['District General Hospital Modernization', 'Adding a 200-bed trauma center wing, oxygen generator plant, and upgrading ICU equipment.', 45000000, 'In Progress', 'Civil Lines, Nagpur, Maharashtra', 21.1458, 79.0882, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2025-03-01', '2026-06-15'],
    ['Coastal Sea Wall Defense Construction', 'Reinforcement wall along coastline to block high-tide waves from flooding the highway promenade.', 95000000, 'In Progress', 'Marine Drive Coastline, Mumbai, Maharashtra', 18.9438, 72.8229, 'Maharashtra', 'Mumbai', 'Mumbai', 'Mumbai', 'Mumbai', '2025-02-15', '2026-05-30'],
    ['Kadamkuan Drainage System Upgradation', 'Upgrading open drains to underground storm-water channels to prevent monsoon waterlogging.', 12000000, 'In Progress', 'Central Market Drains, Kadamkuan Village, Patna, Bihar', 25.5960, 85.1410, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2025-03-10', '2026-06-30'],
    ['Amer Fort Pedestrian Safety Railings', 'Upgrading pedestrian walkways with heritage-appropriate safety barricades and low-intensity lighting.', 18000000, 'In Progress', 'Amer Fort Access Road, Jaipur, Rajasthan', 26.9855, 75.8513, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2025-05-01', '2026-08-30'],
    ['Amer Panchayat Smart Anganwadi Center', 'Constructing a double-story child daycare and maternal health clinic with early-education tools.', 2500000, 'In Progress', 'Anganwadi Lane, Amer Village, Jaipur, Rajasthan', 26.9812, 75.8480, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2025-10-01', '2026-07-15'],
    ['Nagpur Rural Health Sub-Center Upgradation', 'Modernizing diagnostic equipment, pharmacy rooms, and vaccine cold-chain storage.', 8500000, 'In Progress', 'Health Lane, Civil Suburbs, Nagpur, Maharashtra', 21.1490, 79.0810, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2025-08-01', '2026-05-10'],
    ['Nagpur District High School Science Laboratories', 'Establishing Physics, Chemistry, and Biology labs with microscopes and demonstration screens.', 4000000, 'In Progress', 'District Education Board, Nagpur, Maharashtra', 21.1440, 79.0850, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2025-09-01', '2026-07-31'],

    // ====== 4 PROPOSED PROJECTS ======
    ['Solar Street Light Installation', 'Procuring and installing 500 solar street lights across rural village streets in Jaipur district.', 5000000, 'Proposed', 'Amer Road Panchayat, Jaipur, Rajasthan', 26.9124, 75.7873, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2026-07-01', '2026-11-30'],
    ['Amer Micro-Irrigation Canal Lining', 'Concrete lining of 2.5 km irrigation canal to reduce water seepage for tail-end fields.', 6200000, 'Proposed', 'Agricultural Fields, Amer, Jaipur, Rajasthan', 26.9920, 75.8390, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2026-08-01', '2027-02-28'],
    ['Kadamkuan Village Community Center Construction', 'Community hall with kitchen, toilets, and drinking water for gatherings and health campaigns.', 5500000, 'Proposed', 'Community Park, Kadamkuan Village, Patna, Bihar', 25.5910, 85.1360, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2026-09-01', '2027-04-30'],
    ['Nagpur Panchayat Solar Water Borewell', 'Boring and installing 3 solar-powered submersible tube wells with concrete storage tanks.', 3000000, 'Proposed', 'Panchayat Squares, Nagpur, Maharashtra', 21.1510, 79.0920, 'Maharashtra', 'Nagpur', 'Nagpur', 'Nagpur', 'Nagpur', '2026-10-01', '2027-03-31'],

    // ====== 3 SUSPENDED PROJECTS ======
    ['Patna Block Health Clinic Annex', 'Establishing local outpatient clinic with modular exam rooms and cold-chain vaccine storage.', 7500000, 'Suspended', 'Kadamkuan Block Center, Patna, Bihar', 25.6022, 85.1420, 'Bihar', 'Patna', 'Patna Block', 'Kadamkuan Panchayat', 'Kadamkuan Village', '2025-04-01', '2025-10-30'],
    ['Amer Panchayat Solar Power Grid Hub', 'Setting up 50kW rooftop solar grid on Panchayat library for clean backup power.', 8000000, 'Suspended', 'Panchayat Bhavan, Amer, Jaipur, Rajasthan', 26.9830, 75.8420, 'Rajasthan', 'Jaipur', 'Amer', 'Amer', 'Amer', '2025-06-10', '2025-12-15'],
    ['Madhya Pradesh Highway Culvert Repair', 'Emergency repair of 3 damaged culverts on state highway SH-18 damaged in monsoon floods.', 4500000, 'Suspended', 'SH-18 Near Bhopal, Madhya Pradesh', 23.2599, 77.4126, 'Madhya Pradesh', 'Bhopal', 'Bhopal', 'Bhopal', 'Bhopal', '2025-07-01', '2025-11-30'],
  ];

  // Create all projects
  const projects = [];
  for (const p of projectDefs) {
    const proj = await prisma.project.create({
      data: {
        name: p[0], description: p[1], totalBudget: p[2], status: p[3],
        address: p[4], latitude: p[5], longitude: p[6],
        country: 'India', state: p[7], district: p[8], block: p[9], panchayat: p[10], village: p[11],
        startDate: new Date(p[12]), endDate: new Date(p[13]),
        creatorId: adminMap[p[7]] || countryAdmin.id
      }
    });
    projects.push(proj);
  }
  console.log(`${projects.length} projects created.`);

  // ============================================================
  //  FUND ALLOCATION HIERARCHIES — Detailed for all 35 Completed
  // ============================================================
  console.log('Creating detailed fund hierarchies for completed projects...');

  // Helper: create allocation tree for a project
  async function createTree(projIdx, allocations) {
    const proj = projects[projIdx];
    const allocMap = {};
    for (const a of allocations) {
      const alloc = await prisma.fundAllocation.create({
        data: {
          projectId: proj.id,
          name: a.name,
          amount: a.amount,
          description: a.description || null,
          parentId: a.parentKey ? allocMap[a.parentKey] : null
        }
      });
      if (a.key) allocMap[a.key] = alloc.id;

      // Create materials if defined
      if (a.materials) {
        for (const m of a.materials) {
          await prisma.material.create({
            data: {
              projectId: proj.id,
              name: m.name,
              quantity: m.qty,
              unit: m.unit,
              unitCost: m.rate,
              totalCost: m.qty * m.rate,
              supplier: m.supplier,
              allocationId: alloc.id
            }
          });
        }
      }
    }
  }

  // ----- Project 0: Saraswati Primary School Renovation (₹12L) -----
  await createTree(0, [
    { key: 'roof', name: 'Roof Repairs & Waterproofing', amount: 350000, description: 'Removing old tiles, waterproofing slab, new concrete roof casting.', materials: [
      { name: 'Dr. Fixit Waterproofing Compound', qty: 50, unit: 'Liters', rate: 450, supplier: 'Pidilite Industries' },
      { name: 'AAC Roof Blocks', qty: 200, unit: 'Blocks', rate: 800, supplier: 'Bihar Building Materials' },
    ]},
    { key: 'toilet', name: 'Boys/Girls Toilet Construction', amount: 250000, description: 'Separate toilet blocks with running water and tile flooring.', materials: [
      { name: 'Ceramic Sanitary Sets', qty: 6, unit: 'Sets', rate: 12000, supplier: 'Cera Sanitaryware Ltd' },
      { name: 'CPVC Pipes & Fittings', qty: 80, unit: 'Meters', rate: 180, supplier: 'Astral Poly Technik' },
    ]},
    { key: 'paint', name: 'Classroom Painting & Murals', amount: 150000, description: 'Educational wall murals and anti-fungal paint.', materials: [
      { name: 'Asian Paints Apex (20L Drums)', qty: 15, unit: 'Drums', rate: 6500, supplier: 'Asian Paints Ltd' },
    ]},
    { key: 'lab', name: 'Computer Laboratory Setup', amount: 450000, description: '15 desktops with networking and UPS.', materials: [
      { name: 'Dell Inspiron Desktop PCs', qty: 15, unit: 'Units', rate: 25000, supplier: 'Dell India Pvt Ltd' },
      { name: '1KVA Online UPS Backup', qty: 1, unit: 'Unit', rate: 50000, supplier: 'APC Systems Pvt Ltd' },
      { name: 'LAN Switch & Cabling Kit', qty: 1, unit: 'Set', rate: 25000, supplier: 'D-Link India Ltd' },
    ]},
  ]);

  // ----- Project 1: Patna Library & Digitization (₹35L) -----
  await createTree(1, [
    { key: 'it', name: 'IT & Computer Networking Setup', amount: 2000000, description: 'High-speed internet with 12 terminals.', materials: [
      { name: 'HP Thin Client Desktops', qty: 12, unit: 'Units', rate: 35000, supplier: 'HP India Ltd' },
      { name: 'Cisco Managed Switch 24-port', qty: 2, unit: 'Units', rate: 75000, supplier: 'Cisco Systems Ltd' },
      { name: 'Jio Fiber 1Gbps Annual Plan', qty: 1, unit: 'Plan', rate: 120000, supplier: 'Jio Platforms Ltd' },
    ]},
    { key: 'reno', name: 'Interior Renovation & Shelving', amount: 1000000, description: 'Wooden shelving, reading tables, and AC installation.', materials: [
      { name: 'Teak Wood Book Shelves', qty: 20, unit: 'Units', rate: 18000, supplier: 'Bihar Timber Co-op' },
      { name: 'Split AC 1.5T Inverter', qty: 2, unit: 'Units', rate: 45000, supplier: 'Voltas Ltd' },
    ]},
    { key: 'books', name: 'Books & E-Learning Subscriptions', amount: 500000, description: 'Reference books, competitive exam guides, and digital subscriptions.', materials: [
      { name: 'NCERT & Reference Book Sets', qty: 500, unit: 'Books', rate: 400, supplier: 'S. Chand Publications' },
      { name: 'BYJU\'s Annual Subscription', qty: 12, unit: 'Licenses', rate: 15000, supplier: 'BYJU\'s Education' },
    ]},
  ]);

  // ----- Project 2: Girls Toilet Blocks (₹15L) -----
  await createTree(2, [
    { key: 'pipe', name: 'Sanitary Piping & Fittings', amount: 700000, description: 'Complete plumbing with septic tank.', materials: [
      { name: 'PVC Soil Pipes 110mm', qty: 120, unit: 'Pipes', rate: 350, supplier: 'Supreme Industries' },
      { name: 'Septic Tank Precast 2000L', qty: 2, unit: 'Units', rate: 65000, supplier: 'Bihar Precast Co' },
    ]},
    { key: 'civil', name: 'Civil Structure Masonry', amount: 500000, description: 'Brick walls, floor tiling, and roof slab.', materials: [
      { name: 'First Class Red Bricks', qty: 15000, unit: 'Bricks', rate: 8, supplier: 'Patna Brick Kiln' },
      { name: 'Anti-Skid Floor Tiles', qty: 80, unit: 'Sq.M', rate: 650, supplier: 'Kajaria Ceramics Ltd' },
    ]},
    { key: 'equip', name: 'Fixtures & Equipment', amount: 300000, description: 'Sanitary fittings, vending machines, solar heater.', materials: [
      { name: 'Ceramic Toilet & Basin Sets', qty: 8, unit: 'Sets', rate: 12000, supplier: 'Cera Sanitaryware' },
      { name: 'Sanitary Napkin Vending Machine', qty: 2, unit: 'Units', rate: 35000, supplier: 'Swachh India Corp' },
      { name: 'Solar Water Heater 200LPD', qty: 1, unit: 'Unit', rate: 65000, supplier: 'V-Guard Industries' },
    ]},
  ]);

  // ----- Project 3: Hand Pump Borewell Network (₹8L) -----
  await createTree(3, [
    { key: 'drill', name: 'Borewell Drilling', amount: 400000, description: 'Drilling 8 borewells at 150-200ft depth.', materials: [
      { name: 'GI Casing Pipes 6-inch', qty: 400, unit: 'Feet', rate: 500, supplier: 'Tata Steel Tubes' },
    ]},
    { key: 'pump', name: 'India Mark-II Hand Pumps', amount: 320000, description: 'Installation of 8 hand pumps with concrete platform.', materials: [
      { name: 'India Mark-II Hand Pump Sets', qty: 8, unit: 'Sets', rate: 32000, supplier: 'Ajay Industrial Corp' },
    ]},
    { key: 'platform', name: 'Concrete Platforms & Drainage', amount: 80000, description: 'Concrete soak-pit platforms around each pump.', materials: [
      { name: 'Ready-Mix Concrete M15', qty: 16, unit: 'Cu.M', rate: 4500, supplier: 'Bihar RMC Ltd' },
    ]},
  ]);

  // ----- Project 4: Rural Road Concrete Paving (₹45L) -----
  await createTree(4, [
    { key: 'earth', name: 'Earthwork & Grading', amount: 600000, description: 'Leveling and compacting 3.5 km road bed.', materials: [
      { name: 'Murum & Gravel Fill', qty: 2000, unit: 'Cu.M', rate: 250, supplier: 'Bihar Mining Corp' },
    ]},
    { key: 'cc', name: 'CC Road Concrete Laying', amount: 3200000, description: 'M20 grade concrete road 3.5m wide x 3.5km.', materials: [
      { name: 'OPC Grade 53 Cement', qty: 8000, unit: 'Bags', rate: 420, supplier: 'UltraTech Cement' },
      { name: 'Stone Aggregate 20mm', qty: 1500, unit: 'Cu.M', rate: 800, supplier: 'Bihar Quarries Ltd' },
      { name: 'River Sand (Fine)', qty: 800, unit: 'Cu.M', rate: 650, supplier: 'Ganga Sand Depot' },
    ]},
    { key: 'drain', name: 'Side Drainage Channels', amount: 500000, description: 'Brick-lined side drains for rainwater.', materials: [
      { name: 'Channel Bricks', qty: 25000, unit: 'Bricks', rate: 9, supplier: 'Patna Brick Association' },
    ]},
    { key: 'labor', name: 'Labor & Machinery Charges', amount: 200000, description: 'JCB, roller, and manual labor costs.' },
  ]);

  // ----- Project 5: Gram Panchayat Bhawan (₹28L) -----
  await createTree(5, [
    { key: 'found', name: 'Foundation & RCC Framework', amount: 1200000, description: '2-story RCC frame with pile foundation.', materials: [
      { name: 'TMT Steel Bars Fe500', qty: 8, unit: 'Tons', rate: 62000, supplier: 'SAIL Ltd' },
      { name: 'OPC Cement 53 Grade', qty: 3000, unit: 'Bags', rate: 430, supplier: 'Ambuja Cements' },
    ]},
    { key: 'wall', name: 'Brickwork & Plastering', amount: 800000, description: 'Walls, internal plastering, and external rendering.', materials: [
      { name: 'First Class Bricks', qty: 40000, unit: 'Bricks', rate: 8, supplier: 'Patna Brick Kiln' },
      { name: 'Birla White Cement Putty', qty: 200, unit: 'Bags', rate: 800, supplier: 'Birla Corp' },
    ]},
    { key: 'elec', name: 'Electrical & Networking', amount: 400000, description: 'Complete electrical wiring, switches, fans, and LAN.', materials: [
      { name: 'Havells Wire & MCB Kit', qty: 1, unit: 'Lot', rate: 180000, supplier: 'Havells India Ltd' },
      { name: 'Ceiling Fans 1200mm', qty: 12, unit: 'Units', rate: 2500, supplier: 'Crompton Greaves' },
    ]},
    { key: 'furn', name: 'Furniture & Digital Equipment', amount: 400000, description: 'Office furniture, filing, and computer setup.', materials: [
      { name: 'Office Desks & Chairs Set', qty: 8, unit: 'Sets', rate: 15000, supplier: 'Godrej Interio' },
      { name: 'Desktop PC with Printer', qty: 2, unit: 'Sets', rate: 40000, supplier: 'HP India Ltd' },
    ]},
  ]);

  // ----- Project 6: Solar Street Lights (₹18L) -----
  await createTree(6, [
    { key: 'lights', name: 'Solar LED Light Units', amount: 1440000, description: '120 integrated solar street light units.', materials: [
      { name: 'Solar LED Street Light 40W', qty: 120, unit: 'Units', rate: 9500, supplier: 'Tata Power Solar' },
    ]},
    { key: 'poles', name: 'GI Poles & Installation', amount: 240000, description: 'Galvanized iron poles with concrete base.', materials: [
      { name: 'GI Poles 4m Height', qty: 120, unit: 'Units', rate: 1800, supplier: 'Jindal Steel Ltd' },
    ]},
    { key: 'wiring', name: 'Underground Wiring & Earthing', amount: 120000, description: 'Earth pits and armored cable laying.' },
  ]);

  // ----- Project 7: Anganwadi Center Upgradation (₹22L) -----
  await createTree(7, [
    { key: 'floor', name: 'Flooring & Wall Repairs', amount: 800000, description: 'New vitrified tiles and damp-proof plastering in 5 centers.', materials: [
      { name: 'Vitrified Floor Tiles 2x2', qty: 500, unit: 'Sq.M', rate: 550, supplier: 'Kajaria Ceramics' },
      { name: 'Damp-Proof Plaster Mix', qty: 100, unit: 'Bags', rate: 600, supplier: 'Dr. Fixit Dealers' },
    ]},
    { key: 'kitchen', name: 'Nutrition Kitchen Setup', amount: 600000, description: 'Gas stoves, utensils, and hygiene equipment.', materials: [
      { name: 'Commercial LPG Stove 2-burner', qty: 5, unit: 'Units', rate: 15000, supplier: 'Indane Gas' },
      { name: 'SS Cooking Utensils Set', qty: 5, unit: 'Sets', rate: 25000, supplier: 'Stainless India' },
    ]},
    { key: 'play', name: 'Play Equipment & Learning Kits', amount: 500000, description: 'Child-safe play structures and early learning materials.', materials: [
      { name: 'FRP Playground Set (Slide+Swing)', qty: 5, unit: 'Sets', rate: 45000, supplier: 'Playtop Industries' },
      { name: 'Early Learning Kit Boxes', qty: 25, unit: 'Kits', rate: 8000, supplier: 'Sharda Toy Emporium' },
    ]},
    { key: 'paint', name: 'Painting & Finishing', amount: 300000, description: 'Child-friendly wall art and exterior painting.' },
  ]);

  // ----- Project 8: Amer RO Water Kiosk (₹45L) -----
  await createTree(8, [
    { key: 'ro', name: 'RO Filtration Hardware', amount: 2500000, description: 'Industrial 5000 LPH RO system with pre-filtration.', materials: [
      { name: 'Industrial 5000 LPH RO System', qty: 1, unit: 'Unit', rate: 2200000, supplier: 'Kent Aqua Systems' },
    ]},
    { key: 'civil', name: 'Civil Structural Kiosk', amount: 1500000, description: 'RCC kiosk structure with tiled walls and counter.', materials: [
      { name: 'Grade 43 OPC Cement', qty: 500, unit: 'Bags', rate: 420, supplier: 'UltraTech Cement' },
      { name: 'Vitrified Wall Tiles', qty: 100, unit: 'Sq.M', rate: 480, supplier: 'Somany Ceramics' },
    ]},
    { key: 'pipe', name: 'Piping & Borewell Drilling', amount: 500000, description: 'Borewell and distribution pipeline.', materials: [
      { name: 'PVC Water Pipes 4-inch', qty: 150, unit: 'Pipes', rate: 2000, supplier: 'Astral Poly Technik' },
    ]},
  ]);

  // ----- Project 9: Amer Heritage Walk Cobblestone (₹65L) -----
  await createTree(9, [
    { key: 'stone', name: 'Sandstone Paver Sourcing', amount: 3500000, description: 'Hand-cut Jodhpur sandstone pavers.', materials: [
      { name: 'Jodhpur Red Sandstone Pavers', qty: 50000, unit: 'Blocks', rate: 55, supplier: 'Rajasthan Sandstone Corp' },
    ]},
    { key: 'mason', name: 'Skilled Masonry & Laying', amount: 1500000, description: 'Expert heritage restoration masons.' },
    { key: 'light', name: 'Heritage Path Lighting', amount: 800000, description: 'Low-intensity brass bollard lights.', materials: [
      { name: 'Brass Bollard Path Lights', qty: 80, unit: 'Units', rate: 8500, supplier: 'Jaipur Heritage Crafts' },
    ]},
    { key: 'sign', name: 'Heritage Signage & Information Boards', amount: 700000, description: 'Bronze info plaques and directional signs.', materials: [
      { name: 'Bronze Heritage Info Plaques', qty: 15, unit: 'Units', rate: 35000, supplier: 'Rajasthan Arts Corp' },
    ]},
  ]);

  // ----- Project 10: Amer Community Health Clinic (₹52L) -----
  await createTree(10, [
    { key: 'build', name: 'Building Construction', amount: 2800000, description: 'RCC structure with OPD, pharmacy, and wards.', materials: [
      { name: 'TMT Steel Bars Fe500D', qty: 12, unit: 'Tons', rate: 62000, supplier: 'Tata Steel Ltd' },
      { name: 'OPC Cement Grade 53', qty: 4000, unit: 'Bags', rate: 430, supplier: 'UltraTech Cement' },
      { name: 'Red Bricks First Class', qty: 50000, unit: 'Bricks', rate: 7, supplier: 'Jaipur Brick Works' },
    ]},
    { key: 'equip', name: 'Medical Equipment', amount: 1500000, description: 'Diagnostic and treatment equipment.', materials: [
      { name: 'Examination Table Set', qty: 3, unit: 'Sets', rate: 35000, supplier: 'Medline Industries' },
      { name: 'Vaccine Cold-Chain ILR 300L', qty: 1, unit: 'Unit', rate: 180000, supplier: 'Blue Star Ltd' },
      { name: 'BP Monitor & Stethoscope Sets', qty: 5, unit: 'Sets', rate: 8000, supplier: 'Omron Healthcare' },
    ]},
    { key: 'elec', name: 'Electrical & Solar Backup', amount: 600000, description: 'Wiring, inverter, and rooftop solar panels.', materials: [
      { name: 'Solar Panels 400W', qty: 8, unit: 'Units', rate: 32000, supplier: 'Tata Power Solar' },
      { name: '5KVA Hybrid Inverter', qty: 1, unit: 'Unit', rate: 85000, supplier: 'Luminous Power' },
    ]},
    { key: 'furn', name: 'Furniture & Pharmacy Setup', amount: 300000, description: 'Waiting chairs, pharmacy shelving, signage.' },
  ]);

  // ----- Project 11: Amer School Science Lab (₹38L) -----
  await createTree(11, [
    { key: 'table', name: 'Lab Tables & Infrastructure', amount: 1500000, description: 'Chemistry-resistant tables with gas and water supply.', materials: [
      { name: 'Chemical-Resistant Lab Tables', qty: 20, unit: 'Units', rate: 25000, supplier: 'Lab Furniture India' },
      { name: 'Lab Gas Lines & Bunsen Burners', qty: 20, unit: 'Sets', rate: 5000, supplier: 'Scientific Suppliers' },
    ]},
    { key: 'equip', name: 'Lab Equipment & Apparatus', amount: 1500000, description: 'Microscopes, reagents, and demonstration kits.', materials: [
      { name: 'Compound Optical Microscopes', qty: 25, unit: 'Units', rate: 12000, supplier: 'Labo Premium' },
      { name: 'Chemistry Reagent Master Set', qty: 3, unit: 'Sets', rate: 45000, supplier: 'Fisher Scientific' },
      { name: 'Physics Demonstration Kit', qty: 3, unit: 'Kits', rate: 55000, supplier: 'National Instruments' },
    ]},
    { key: 'smart', name: 'Smart Board & AV System', amount: 800000, description: 'Interactive smart boards for demonstrations.', materials: [
      { name: '75-inch Interactive Smart Board', qty: 3, unit: 'Units', rate: 180000, supplier: 'Samsung India' },
    ]},
  ]);

  // ----- Project 12: Amer Drain-Line Channel (₹32L) -----
  await createTree(12, [
    { key: 'excav', name: 'Excavation & Trenching', amount: 800000, description: '2 km trench digging with JCB and manual labor.' },
    { key: 'rcc', name: 'RCC Drain Channel Casting', amount: 1800000, description: 'Cast-in-situ RCC U-drain with cover slabs.', materials: [
      { name: 'TMT Steel Bars', qty: 6, unit: 'Tons', rate: 60000, supplier: 'SAIL Ltd' },
      { name: 'OPC Cement Bags', qty: 3000, unit: 'Bags', rate: 430, supplier: 'ACC Cement' },
      { name: 'Pre-cast Drain Cover Slabs', qty: 400, unit: 'Units', rate: 800, supplier: 'Jaipur Precast Co' },
    ]},
    { key: 'soak', name: 'Soak Pits & Junction Chambers', amount: 400000, description: 'Brick soak pits at every 100m interval.', materials: [
      { name: 'Perforated Bricks', qty: 8000, unit: 'Bricks', rate: 10, supplier: 'Amer Brick Works' },
    ]},
  ]);

  // ----- Project 13: Amer Cremation Ground (₹15L) -----
  await createTree(13, [
    { key: 'shed', name: 'Cremation Shed & Platform', amount: 800000, description: 'Fire-resistant concrete platform with iron-sheet shed.', materials: [
      { name: 'Fire-Resistant Concrete Mix', qty: 40, unit: 'Cu.M', rate: 6000, supplier: 'Jaipur RMC' },
      { name: 'GI Corrugated Roofing Sheets', qty: 30, unit: 'Sheets', rate: 1200, supplier: 'Jindal Steel' },
    ]},
    { key: 'wall', name: 'Boundary Wall & Gate', amount: 500000, description: 'Brick boundary wall with iron gate.', materials: [
      { name: 'Red Bricks', qty: 15000, unit: 'Bricks', rate: 7, supplier: 'Amer Brick Works' },
      { name: 'MS Iron Gate 12ft', qty: 1, unit: 'Unit', rate: 45000, supplier: 'Jaipur Iron Works' },
    ]},
    { key: 'water', name: 'Water Tank & Piping', amount: 200000, description: 'Overhead tank with bore connection.', materials: [
      { name: 'Sintex 2000L Tank', qty: 1, unit: 'Unit', rate: 18000, supplier: 'Sintex Industries' },
    ]},
  ]);

  // ----- Project 14: Amer Toilets Swachh Bharat (₹20L) -----
  await createTree(14, [
    { key: 'ihh', name: 'Individual Household Toilets (25)', amount: 1250000, description: '25 twin-pit pour-flush toilets.', materials: [
      { name: 'Ceramic Pan & Trap Sets', qty: 25, unit: 'Sets', rate: 4500, supplier: 'Hindware Sanitary' },
      { name: 'Twin-Pit Ring & Cover Sets', qty: 25, unit: 'Sets', rate: 8000, supplier: 'Bihar Precast' },
    ]},
    { key: 'comm', name: 'Community Toilet Blocks (2)', amount: 550000, description: '2 multi-seat public toilet blocks with handwash stations.', materials: [
      { name: 'Stainless Steel Handwash Units', qty: 6, unit: 'Units', rate: 12000, supplier: 'SS Fabricators' },
      { name: 'Anti-Skid Floor Tiles', qty: 60, unit: 'Sq.M', rate: 650, supplier: 'Kajaria Tiles' },
    ]},
    { key: 'iec', name: 'IEC & Awareness Campaign', amount: 200000, description: 'Information, education, and communication materials.' },
  ]);

  // ----- Project 15: Nagpur Watershed (₹50L) -----
  await createTree(15, [
    { key: 'dam', name: 'Check Dam RCC Weir Construction', amount: 3000000, description: '3 check dams across seasonal streams.', materials: [
      { name: 'TMT Steel Structural Bars', qty: 30, unit: 'Tons', rate: 60000, supplier: 'SAIL Ltd' },
      { name: 'Ready-Mix Concrete M25', qty: 400, unit: 'Cu.M', rate: 5500, supplier: 'Nagpur RMC' },
    ]},
    { key: 'pond', name: 'Farm Pond Excavation', amount: 1200000, description: 'Digging 5 farm ponds with plastic lining.', materials: [
      { name: 'HDPE Pond Liner 500gsm', qty: 2500, unit: 'Sq.M', rate: 80, supplier: 'Tarpaulin India' },
    ]},
    { key: 'earth', name: 'Heavy Earthworks & Trenching', amount: 800000, description: 'JCB excavation and bund formation.' },
  ]);

  // ----- Project 16: Nagpur ZP School Renovation (₹28L) -----
  await createTree(16, [
    { key: 'roof', name: 'Roof Replacement & Structural Repair', amount: 1200000, description: 'New RCC roof slab replacing damaged asbestos sheets.', materials: [
      { name: 'TMT Steel Bars', qty: 4, unit: 'Tons', rate: 62000, supplier: 'Tata Steel' },
      { name: 'OPC Cement 53 Grade', qty: 1500, unit: 'Bags', rate: 430, supplier: 'ACC Cement' },
    ]},
    { key: 'paint', name: 'Painting & Flooring', amount: 600000, description: 'Exterior distemper and interior vitrified flooring.', materials: [
      { name: 'Vitrified Floor Tiles', qty: 300, unit: 'Sq.M', rate: 550, supplier: 'Somany Ceramics' },
      { name: 'Exterior Weather Coat Paint', qty: 10, unit: 'Drums (20L)', rate: 7500, supplier: 'Berger Paints' },
    ]},
    { key: 'lib', name: 'Library & Playground', amount: 600000, description: 'Book shelves, reading area, and outdoor play equipment.', materials: [
      { name: 'Steel Book Shelves', qty: 10, unit: 'Units', rate: 12000, supplier: 'Godrej Interio' },
      { name: 'Outdoor Play Set (Slide+See-saw)', qty: 2, unit: 'Sets', rate: 85000, supplier: 'Playtop Industries' },
    ]},
    { key: 'elec', name: 'Electrical Rewiring', amount: 400000, description: 'Complete rewiring with fans, lights, and MCB panel.', materials: [
      { name: 'Havells Wiring Kit Complete', qty: 1, unit: 'Lot', rate: 200000, supplier: 'Havells India' },
      { name: 'LED Tubelights 4ft', qty: 40, unit: 'Units', rate: 450, supplier: 'Philips India' },
    ]},
  ]);

  // ----- Project 17: Nagpur Rural Electrification (₹32L) -----
  await createTree(17, [
    { key: 'poles', name: 'Electric Poles & Transformer', amount: 1800000, description: '45 PSC poles and 1 distribution transformer.', materials: [
      { name: 'PSC Electric Poles 9m', qty: 45, unit: 'Units', rate: 18000, supplier: 'Nagpur Pole Factory' },
      { name: '63KVA Distribution Transformer', qty: 1, unit: 'Unit', rate: 350000, supplier: 'Crompton Greaves' },
    ]},
    { key: 'wire', name: 'Conductor & Cabling', amount: 800000, description: 'ACSR conductor and service cables.', materials: [
      { name: 'ACSR Conductor Dog', qty: 5000, unit: 'Meters', rate: 80, supplier: 'Sterlite Tech' },
      { name: 'Armored Service Cable', qty: 2000, unit: 'Meters', rate: 120, supplier: 'Polycab India' },
    ]},
    { key: 'meter', name: 'Energy Meters & Installation', amount: 600000, description: '45 smart prepaid meters with MCB boxes.', materials: [
      { name: 'Smart Prepaid Energy Meters', qty: 45, unit: 'Units', rate: 8000, supplier: 'Genus Power' },
      { name: 'MCB Distribution Boxes', qty: 45, unit: 'Units', rate: 1500, supplier: 'Havells India' },
    ]},
  ]);

  // ----- Project 18: Nagpur PHC Cold-Chain (₹42L) -----
  await createTree(18, [
    { key: 'cold', name: 'Walk-In Cold Room Installation', amount: 2000000, description: 'Modular walk-in cold room for bulk vaccine storage.', materials: [
      { name: 'Walk-In Cold Room 8x6ft', qty: 1, unit: 'Unit', rate: 1800000, supplier: 'Blue Star Ltd' },
    ]},
    { key: 'ilr', name: 'Ice-Lined Refrigerators', amount: 1200000, description: '4 ILRs for daily vaccine distribution.', materials: [
      { name: 'ILR 300L WHO-Approved', qty: 4, unit: 'Units', rate: 250000, supplier: 'Haier Biomedical' },
    ]},
    { key: 'solar', name: 'Solar Power Backup System', amount: 800000, description: 'Solar panels and battery bank for uninterrupted cold chain.', materials: [
      { name: 'Solar Panels 400W Mono', qty: 10, unit: 'Units', rate: 32000, supplier: 'Tata Power Solar' },
      { name: 'Lithium Battery Bank 10KWh', qty: 1, unit: 'Unit', rate: 280000, supplier: 'Amara Raja' },
    ]},
    { key: 'reno', name: 'Room Renovation & Insulation', amount: 200000, description: 'Thermal insulation and false ceiling.' },
  ]);

  // ----- Project 19: Nagpur Digital Service Kiosk (₹15L) -----
  await createTree(19, [
    { key: 'equip', name: 'Computer & Biometric Equipment', amount: 800000, description: 'PCs with Aadhaar enrolment kit and printers.', materials: [
      { name: 'Desktop PCs with Monitor', qty: 3, unit: 'Sets', rate: 40000, supplier: 'Dell India' },
      { name: 'Aadhaar Biometric Enrolment Kit', qty: 1, unit: 'Kit', rate: 125000, supplier: 'Mantra Tech' },
      { name: 'Laser Printer Multi-function', qty: 2, unit: 'Units', rate: 25000, supplier: 'HP India' },
    ]},
    { key: 'civil', name: 'Kiosk Renovation & Signage', amount: 400000, description: 'Counter, seating, AC, and exterior signage.', materials: [
      { name: 'Granite Service Counter', qty: 1, unit: 'Unit', rate: 45000, supplier: 'Nagpur Stone Works' },
      { name: 'Split AC 1.5T', qty: 1, unit: 'Unit', rate: 38000, supplier: 'Voltas Ltd' },
    ]},
    { key: 'net', name: 'Internet & Networking', amount: 300000, description: 'Fiber broadband, UPS, and networking.', materials: [
      { name: 'Jio Fiber Annual Plan', qty: 1, unit: 'Plan', rate: 100000, supplier: 'Jio Platforms' },
      { name: '3KVA Online UPS', qty: 1, unit: 'Unit', rate: 85000, supplier: 'APC Systems' },
    ]},
  ]);

  // ----- Project 20: Mumbai Coastal Promenade (₹85L) -----
  await createTree(20, [
    { key: 'floor', name: 'Granite Flooring & Paving', amount: 3500000, description: 'Polished granite flooring along 800m stretch.', materials: [
      { name: 'Polished Granite Slabs 60x60cm', qty: 2500, unit: 'Slabs', rate: 1200, supplier: 'Rajasthan Granite Corp' },
    ]},
    { key: 'rail', name: 'Anti-Corrosion Stainless Railings', amount: 2500000, description: '800m SS304 railings with coastal-grade coating.', materials: [
      { name: 'SS304 Railing Sections 2m', qty: 400, unit: 'Sections', rate: 5500, supplier: 'Jindal Stainless' },
    ]},
    { key: 'light', name: 'LED Pathway Lighting', amount: 1500000, description: 'Marine-grade LED bollards and pole lights.', materials: [
      { name: 'Marine-Grade LED Bollards', qty: 100, unit: 'Units', rate: 12000, supplier: 'Philips India' },
    ]},
    { key: 'drain', name: 'Storm Drainage Improvement', amount: 1000000, description: 'Grated drainage channels for wave runoff.' },
  ]);

  // ----- Project 21: Lucknow PHC Building (₹65L) -----
  await createTree(21, [
    { key: 'struct', name: 'Building Structure & RCC', amount: 3500000, description: '6-room building with veranda and ramp.', materials: [
      { name: 'TMT Steel Fe500D', qty: 18, unit: 'Tons', rate: 63000, supplier: 'SAIL Ltd' },
      { name: 'OPC Cement 53 Grade', qty: 5000, unit: 'Bags', rate: 430, supplier: 'Birla Cement' },
      { name: 'Clay Bricks First Class', qty: 80000, unit: 'Bricks', rate: 8, supplier: 'UP Brick Association' },
    ]},
    { key: 'equip', name: 'Medical Equipment & Furniture', amount: 1800000, description: 'OPD tables, examination beds, and pharmacy racks.', materials: [
      { name: 'Hospital Examination Beds', qty: 4, unit: 'Units', rate: 55000, supplier: 'Medline Industries' },
      { name: 'Pharmacy Storage Racks', qty: 6, unit: 'Units', rate: 18000, supplier: 'Godrej Interio' },
      { name: 'Labor Room Equipment Set', qty: 1, unit: 'Set', rate: 350000, supplier: 'Hindustan Syringes' },
    ]},
    { key: 'staff', name: 'Staff Quarters Construction', amount: 800000, description: '2-room staff quarters with kitchen and toilet.' },
    { key: 'elec', name: 'Electrical, Plumbing & Solar', amount: 400000, description: 'Complete MEP work with 3KW solar backup.', materials: [
      { name: 'Solar Panel 400W Kit', qty: 8, unit: 'Units', rate: 32000, supplier: 'Luminous Solar' },
    ]},
  ]);

  // ----- Project 22: Lucknow Bridge Over Gomti (₹1.2Cr) -----
  await createTree(22, [
    { key: 'found', name: 'Pile Foundation & Abutments', amount: 4500000, description: 'Deep pile foundation in riverbed soil.', materials: [
      { name: 'TMT Steel Bars Fe550D', qty: 50, unit: 'Tons', rate: 65000, supplier: 'Tata Steel' },
      { name: 'Ready-Mix Concrete M30', qty: 500, unit: 'Cu.M', rate: 6500, supplier: 'ACC RMC' },
    ]},
    { key: 'slab', name: 'RCC Deck Slab & Girders', amount: 4000000, description: 'Pre-stressed girders and deck slab casting.', materials: [
      { name: 'Pre-stressed Concrete Girders', qty: 8, unit: 'Units', rate: 350000, supplier: 'L&T Construction' },
      { name: 'Deck Slab Steel Reinforcement', qty: 20, unit: 'Tons', rate: 63000, supplier: 'SAIL Ltd' },
    ]},
    { key: 'approach', name: 'Approach Road & Guard Rails', amount: 2000000, description: 'Bituminous approach roads on both banks.', materials: [
      { name: 'Bitumen VG-30', qty: 30, unit: 'Tons', rate: 42000, supplier: 'HPCL Bitumen' },
      { name: 'Steel Crash Barriers', qty: 100, unit: 'Meters', rate: 5000, supplier: 'Jindal Steel' },
    ]},
    { key: 'misc', name: 'Drainage, Lighting & Signage', amount: 1500000, description: 'Bridge drainage, LED lights, and traffic signs.', materials: [
      { name: 'LED Street Lights 100W', qty: 12, unit: 'Units', rate: 25000, supplier: 'Havells India' },
    ]},
  ]);

  // ----- Project 23: Lucknow Pension Center (₹8L) -----
  await createTree(23, [
    { key: 'reno', name: 'Room Renovation & Furniture', amount: 400000, description: 'Counter, seating, fans, and paint.', materials: [
      { name: 'Service Counter with Glass', qty: 1, unit: 'Unit', rate: 35000, supplier: 'UP Furniture Co' },
      { name: 'Plastic Molded Chairs', qty: 30, unit: 'Units', rate: 500, supplier: 'Nilkamal Ltd' },
    ]},
    { key: 'equip', name: 'Computer & Biometric Systems', amount: 250000, description: 'PC, fingerprint scanner, and printer.', materials: [
      { name: 'Desktop PC with Fingerprint Scanner', qty: 1, unit: 'Set', rate: 55000, supplier: 'HP India' },
      { name: 'Laser Printer A4', qty: 1, unit: 'Unit', rate: 18000, supplier: 'Canon India' },
    ]},
    { key: 'iec', name: 'IEC Materials & Campaigns', amount: 150000, description: 'Pamphlets, banners, and village awareness camps.' },
  ]);

  // ----- Project 24: Lucknow Playground & Open Gym (₹12L) -----
  await createTree(24, [
    { key: 'play', name: 'Playground Equipment', amount: 500000, description: 'Swings, slides, merry-go-round for children.', materials: [
      { name: 'FRP Multiplay System', qty: 1, unit: 'Set', rate: 250000, supplier: 'Playtop Industries' },
      { name: 'Rubber Safety Mats', qty: 100, unit: 'Sq.M', rate: 1200, supplier: 'Sports India' },
    ]},
    { key: 'gym', name: 'Open-Air Gym Equipment', amount: 400000, description: 'Outdoor gym stations for youth fitness.', materials: [
      { name: 'Outdoor Gym Multi-Station Set', qty: 1, unit: 'Set', rate: 320000, supplier: 'Sports Authority India' },
    ]},
    { key: 'land', name: 'Landscaping & Fencing', amount: 300000, description: 'Grass turfing, tree planting, and chain-link fencing.', materials: [
      { name: 'Natural Grass Turf', qty: 500, unit: 'Sq.M', rate: 80, supplier: 'Green Lawns Nursery' },
      { name: 'Chain-Link Fencing', qty: 200, unit: 'Meters', rate: 350, supplier: 'Tata Wiron' },
    ]},
  ]);

  // ----- Project 25: Bengaluru Mid-Day Meal Kitchen (₹55L) -----
  await createTree(25, [
    { key: 'build', name: 'Kitchen Building Construction', amount: 2500000, description: 'Industrial kitchen with loading dock.', materials: [
      { name: 'TMT Steel Fe500D', qty: 10, unit: 'Tons', rate: 62000, supplier: 'JSW Steel' },
      { name: 'OPC Cement 53 Grade', qty: 2500, unit: 'Bags', rate: 440, supplier: 'UltraTech Cement' },
    ]},
    { key: 'equip', name: 'Kitchen Equipment', amount: 2000000, description: 'Industrial stoves, steam vessels, and cold storage.', materials: [
      { name: 'Industrial Gas Stoves 6-burner', qty: 4, unit: 'Units', rate: 85000, supplier: 'Prestige Kitchen' },
      { name: 'SS Steam Cooking Vessels 200L', qty: 6, unit: 'Units', rate: 45000, supplier: 'Stainless India' },
      { name: 'Walk-In Cold Storage 6x4ft', qty: 1, unit: 'Unit', rate: 350000, supplier: 'Blue Star Ltd' },
    ]},
    { key: 'vehicle', name: 'Delivery Vehicles', amount: 600000, description: 'Insulated food delivery vans.', materials: [
      { name: 'Tata Ace Insulated Van', qty: 2, unit: 'Units', rate: 280000, supplier: 'Tata Motors Ltd' },
    ]},
    { key: 'hyg', name: 'Hygiene & Safety Systems', amount: 400000, description: 'Hand wash stations, pest control, fire extinguishers.' },
  ]);

  // ----- Project 26: Bengaluru Rainwater Harvesting (₹18L) -----
  await createTree(26, [
    { key: 'tank', name: 'Rooftop Collection & Storage Tanks', amount: 1000000, description: '30 units of collection systems with filters.', materials: [
      { name: 'Sintex Rainwater Filter Units', qty: 30, unit: 'Units', rate: 8500, supplier: 'Sintex Industries' },
      { name: 'PVC Storage Tank 1000L', qty: 30, unit: 'Units', rate: 12000, supplier: 'Supreme Industries' },
    ]},
    { key: 'pipe', name: 'PVC Piping & Gutters', amount: 500000, description: 'Roof gutters and downpipe installation.', materials: [
      { name: 'PVC Rain Gutters', qty: 300, unit: 'Meters', rate: 350, supplier: 'Finolex Industries' },
      { name: 'PVC Downpipes 90mm', qty: 200, unit: 'Meters', rate: 180, supplier: 'Finolex Industries' },
    ]},
    { key: 'recharge', name: 'Recharge Pits & Percolation', amount: 300000, description: 'Gravel-filled recharge pits at each building.' },
  ]);

  // ----- Project 27: Bengaluru Skill Training Center (₹32L) -----
  await createTree(27, [
    { key: 'build', name: 'Building Extension & Renovation', amount: 1500000, description: '3-room extension with toilet block.', materials: [
      { name: 'AAC Blocks 600x200x150', qty: 3000, unit: 'Blocks', rate: 60, supplier: 'Aerocon Blocks' },
      { name: 'OPC Cement 43 Grade', qty: 1000, unit: 'Bags', rate: 410, supplier: 'Zuari Cement' },
    ]},
    { key: 'comp', name: 'Computer Lab Setup', amount: 800000, description: '15 PCs with projector and broadband.', materials: [
      { name: 'Desktop PCs i5 11th Gen', qty: 15, unit: 'Units', rate: 35000, supplier: 'Lenovo India' },
      { name: 'LCD Projector 3500 Lumens', qty: 1, unit: 'Unit', rate: 55000, supplier: 'Epson India' },
    ]},
    { key: 'tailor', name: 'Tailoring Unit Equipment', amount: 500000, description: 'Industrial sewing machines and cutting tables.', materials: [
      { name: 'Industrial Sewing Machines', qty: 10, unit: 'Units', rate: 35000, supplier: 'Usha International' },
      { name: 'Fabric Cutting Tables', qty: 5, unit: 'Units', rate: 12000, supplier: 'Local Fabricator' },
    ]},
    { key: 'elec', name: 'Electrician Workshop', amount: 400000, description: 'Wiring practice boards and tool kits.', materials: [
      { name: 'Electrician Training Boards', qty: 8, unit: 'Units', rate: 25000, supplier: 'Skills India Corp' },
      { name: 'Professional Tool Kits', qty: 15, unit: 'Kits', rate: 8000, supplier: 'Stanley Tools' },
    ]},
  ]);

  // ----- Project 28: Chennai Slum Housing (₹2.5Cr) -----
  await createTree(28, [
    { key: 'struct', name: 'RCC Structure & Foundation', amount: 12000000, description: '50-unit 4-story apartment block.', materials: [
      { name: 'TMT Steel Fe500D', qty: 120, unit: 'Tons', rate: 63000, supplier: 'Tata Steel' },
      { name: 'OPC Cement 53 Grade', qty: 25000, unit: 'Bags', rate: 440, supplier: 'Ramco Cements' },
      { name: 'River Sand (Fine)', qty: 3000, unit: 'Cu.M', rate: 800, supplier: 'TN Sand Depot' },
    ]},
    { key: 'finish', name: 'Finishing & Interiors', amount: 6000000, description: 'Doors, windows, tiles, paint for all 50 units.', materials: [
      { name: 'Flush Doors Standard', qty: 200, unit: 'Units', rate: 4500, supplier: 'Greenply Industries' },
      { name: 'Aluminium Sliding Windows', qty: 150, unit: 'Units', rate: 6000, supplier: 'Fenesta Windows' },
      { name: 'Vitrified Floor Tiles', qty: 3000, unit: 'Sq.M', rate: 500, supplier: 'Kajaria Ceramics' },
    ]},
    { key: 'mep', name: 'Plumbing, Electrical & Lifts', amount: 4500000, description: 'Complete MEP with overhead tank and 1 lift.', materials: [
      { name: 'Passenger Lift 6-person', qty: 1, unit: 'Unit', rate: 1200000, supplier: 'Otis Elevators' },
      { name: 'Overhead SS Tank 10000L', qty: 2, unit: 'Units', rate: 250000, supplier: 'Sintex Industries' },
    ]},
    { key: 'ext', name: 'External Works & Landscaping', amount: 2500000, description: 'Compound wall, parking, garden, and drainage.' },
  ]);

  // ----- Project 29: Chennai School Computer Lab (₹20L) -----
  await createTree(29, [
    { key: 'comp', name: 'Computers & Accessories', amount: 1200000, description: '25 desktop PCs with headphones and webcams.', materials: [
      { name: 'Desktop PCs i3 12th Gen', qty: 25, unit: 'Units', rate: 30000, supplier: 'Dell India' },
      { name: 'Webcam & Headphone Sets', qty: 25, unit: 'Sets', rate: 2000, supplier: 'Logitech India' },
    ]},
    { key: 'infra', name: 'Room Renovation & AC', amount: 500000, description: 'False ceiling, wiring, and air conditioning.', materials: [
      { name: 'Split AC 2T Inverter', qty: 2, unit: 'Units', rate: 55000, supplier: 'Daikin India' },
      { name: 'LED Panel Lights 40W', qty: 12, unit: 'Units', rate: 1800, supplier: 'Philips India' },
    ]},
    { key: 'ups', name: 'UPS & Internet Setup', amount: 300000, description: '5KVA UPS and fiber broadband.', materials: [
      { name: '5KVA Online UPS', qty: 1, unit: 'Unit', rate: 120000, supplier: 'APC Systems' },
      { name: 'Broadband Annual Plan', qty: 1, unit: 'Plan', rate: 80000, supplier: 'BSNL Fiber' },
    ]},
  ]);

  // ----- Project 30: Chennai Bus Terminus Shelter (₹35L) -----
  await createTree(30, [
    { key: 'civil', name: 'Shelter Structure & Seating', amount: 1500000, description: 'SS frame shelter with granite seating.', materials: [
      { name: 'SS Shelter Frame Structure', qty: 1, unit: 'Lot', rate: 800000, supplier: 'Chennai Steel Fab' },
      { name: 'Granite Bench Slabs', qty: 20, unit: 'Units', rate: 15000, supplier: 'TN Granite Works' },
    ]},
    { key: 'elec', name: 'LED Displays & Fans', amount: 1000000, description: 'LED arrival boards and ceiling fans.', materials: [
      { name: 'LED Display Board 55-inch', qty: 3, unit: 'Units', rate: 180000, supplier: 'LG Electronics' },
      { name: 'Industrial Ceiling Fans', qty: 15, unit: 'Units', rate: 3500, supplier: 'Crompton Greaves' },
    ]},
    { key: 'cctv', name: 'CCTV & Security System', amount: 700000, description: '16-channel CCTV with night vision cameras.', materials: [
      { name: 'CCTV Camera 2MP Night Vision', qty: 16, unit: 'Units', rate: 8000, supplier: 'Hikvision India' },
      { name: '16-Ch NVR with 4TB HDD', qty: 1, unit: 'Unit', rate: 55000, supplier: 'Hikvision India' },
    ]},
    { key: 'tile', name: 'Flooring & Painting', amount: 300000, description: 'Anti-skid tiles and exterior painting.' },
  ]);

  // ----- Project 31: Ahmedabad School Boundary Wall (₹16L) -----
  await createTree(31, [
    { key: 'wall', name: 'RCC Compound Wall', amount: 1000000, description: '250m compound wall with pillar buttresses.', materials: [
      { name: 'Concrete Blocks 400x200x150', qty: 5000, unit: 'Blocks', rate: 45, supplier: 'Gujarat Block Co' },
      { name: 'TMT Steel Fe500', qty: 3, unit: 'Tons', rate: 61000, supplier: 'ArcelorMittal' },
    ]},
    { key: 'gate', name: 'Main Gate & Guard Room', amount: 400000, description: 'MS main gate with guard cabin.', materials: [
      { name: 'MS Fabricated Main Gate 16ft', qty: 1, unit: 'Unit', rate: 120000, supplier: 'Ahmedabad Iron Works' },
      { name: 'Guard Room Prefab Cabin', qty: 1, unit: 'Unit', rate: 85000, supplier: 'Portacabin India' },
    ]},
    { key: 'paint', name: 'Wall Painting & Numbering', amount: 200000, description: 'School name board and exterior painting.' },
  ]);

  // ----- Project 32: Ahmedabad Piped Water Supply (₹55L) -----
  await createTree(32, [
    { key: 'pipe', name: 'HDPE Pipeline Laying (4km)', amount: 2800000, description: 'Underground HDPE pipeline from OHT.', materials: [
      { name: 'HDPE Pipes 110mm PN6', qty: 4000, unit: 'Meters', rate: 350, supplier: 'Finolex Industries' },
      { name: 'Pipe Fittings & Valves', qty: 1, unit: 'Lot', rate: 250000, supplier: 'Supreme Industries' },
    ]},
    { key: 'oht', name: 'Overhead Tank Construction', amount: 1500000, description: '50,000L elevated RCC tank.', materials: [
      { name: 'TMT Steel Fe500D', qty: 8, unit: 'Tons', rate: 63000, supplier: 'SAIL Ltd' },
      { name: 'OPC Cement 53 Grade', qty: 2000, unit: 'Bags', rate: 440, supplier: 'Ambuja Cements' },
    ]},
    { key: 'conn', name: 'Household Connections (300)', amount: 900000, description: 'Individual tap connections with meters.', materials: [
      { name: 'Water Meter Sets', qty: 300, unit: 'Sets', rate: 1800, supplier: 'Kranti Industries' },
      { name: 'GI Pipe 15mm', qty: 3000, unit: 'Meters', rate: 80, supplier: 'Tata Steel Tubes' },
    ]},
    { key: 'pump', name: 'Pump House & Chlorination', amount: 300000, description: 'Submersible pump with auto-chlorinator.', materials: [
      { name: 'Submersible Pump 5HP', qty: 1, unit: 'Unit', rate: 85000, supplier: 'Lubi Pumps' },
      { name: 'Auto Chlorination System', qty: 1, unit: 'Unit', rate: 120000, supplier: 'Ion Exchange' },
    ]},
  ]);

  // ----- Project 33: Delhi Community Toilet Complex (₹45L) -----
  await createTree(33, [
    { key: 'struct', name: 'Toilet Block Structure', amount: 2000000, description: '20-seat bio-digester toilet building.', materials: [
      { name: 'Bio-Digester Tanks DRDO', qty: 20, unit: 'Units', rate: 45000, supplier: 'DRDO Licensed Vendor' },
      { name: 'OPC Cement 53 Grade', qty: 2000, unit: 'Bags', rate: 450, supplier: 'UltraTech Cement' },
    ]},
    { key: 'finish', name: 'Tiles, Fixtures & Plumbing', amount: 1500000, description: 'Complete sanitary fittings and tiling.', materials: [
      { name: 'Ceramic Wall & Floor Tiles', qty: 200, unit: 'Sq.M', rate: 600, supplier: 'Kajaria Ceramics' },
      { name: 'SS Wash Basins with Taps', qty: 10, unit: 'Units', rate: 8000, supplier: 'Cera Sanitaryware' },
    ]},
    { key: 'rwh', name: 'Rainwater Harvesting System', amount: 500000, description: 'Rooftop collection with recharge well.', materials: [
      { name: 'RWH Filter System', qty: 1, unit: 'Unit', rate: 85000, supplier: 'Rain Centre' },
    ]},
    { key: 'care', name: 'Caretaker Room & Maintenance', amount: 500000, description: 'Caretaker cabin with cleaning equipment storage.' },
  ]);

  // ----- Project 34: Delhi Smart Bus Shelters (₹90L) -----
  await createTree(34, [
    { key: 'struct', name: 'Shelter Structures (15 units)', amount: 4000000, description: 'Prefab SS shelters with tempered glass panels.', materials: [
      { name: 'Prefab SS Shelter Units', qty: 15, unit: 'Units', rate: 220000, supplier: 'Delhi Street Furniture Co' },
    ]},
    { key: 'solar', name: 'Solar Power Systems', amount: 2000000, description: 'Rooftop solar panels with battery for each shelter.', materials: [
      { name: 'Solar Panel 200W Kits', qty: 30, unit: 'Kits', rate: 18000, supplier: 'Tata Power Solar' },
      { name: 'Lithium Battery 5KWh', qty: 15, unit: 'Units', rate: 65000, supplier: 'Amara Raja' },
    ]},
    { key: 'display', name: 'Real-Time Bus Arrival Displays', amount: 1500000, description: 'GPS-linked LED displays showing live arrival.', materials: [
      { name: 'LED Display Board 42-inch', qty: 15, unit: 'Units', rate: 85000, supplier: 'Samsung India' },
    ]},
    { key: 'usb', name: 'USB Charging Stations', amount: 500000, description: 'Multi-port USB charging units.', materials: [
      { name: 'USB Charging Station 8-port', qty: 15, unit: 'Units', rate: 25000, supplier: 'Belkin India' },
    ]},
    { key: 'cctv', name: 'CCTV Surveillance', amount: 1000000, description: 'IP cameras with cloud monitoring.', materials: [
      { name: 'IP Camera 4MP PoE', qty: 30, unit: 'Units', rate: 12000, supplier: 'Hikvision India' },
      { name: 'Cloud NVR Subscription Annual', qty: 1, unit: 'Plan', rate: 300000, supplier: 'CP Plus India' },
    ]},
  ]);

  console.log('All fund hierarchies with materials created.');

  // ============================================================
  //  FUND ALLOCATIONS FOR IN-PROGRESS & OTHER PROJECTS (simpler)
  // ============================================================
  console.log('Creating allocations for non-completed projects...');

  // In Progress projects (indices 35-42)
  for (let i = 35; i < 43; i++) {
    const proj = projects[i];
    const budget = proj.totalBudget;
    await prisma.fundAllocation.create({
      data: { projectId: proj.id, name: 'Phase 1 — Structural Works', amount: Math.round(budget * 0.5), description: 'Primary construction and structural work.' }
    });
    await prisma.fundAllocation.create({
      data: { projectId: proj.id, name: 'Phase 2 — Equipment & Finishing', amount: Math.round(budget * 0.3), description: 'Equipment procurement and interior finishing.' }
    });
    await prisma.fundAllocation.create({
      data: { projectId: proj.id, name: 'Phase 3 — Labor & Overheads', amount: Math.round(budget * 0.2), description: 'Labor contracting and administrative overheads.' }
    });
  }

  // Proposed projects (indices 43-46)
  for (let i = 43; i < 47; i++) {
    const proj = projects[i];
    await prisma.fundAllocation.create({
      data: { projectId: proj.id, name: 'Proposed Budget Allocation', amount: proj.totalBudget, description: 'Budget pending detailed allocation after approval.' }
    });
  }

  // Suspended projects (indices 47-49)
  for (let i = 47; i < 50; i++) {
    const proj = projects[i];
    const budget = proj.totalBudget;
    await prisma.fundAllocation.create({
      data: { projectId: proj.id, name: 'Completed Works (Before Suspension)', amount: Math.round(budget * 0.35), description: 'Work completed before project suspension.' }
    });
    await prisma.fundAllocation.create({
      data: { projectId: proj.id, name: 'Pending Works (Suspended)', amount: Math.round(budget * 0.65), description: 'Remaining work halted due to suspension.' }
    });
  }

  // ============================================================
  //  CITIZEN VERIFICATIONS
  // ============================================================
  console.log('Seeding citizen audit verifications...');

  const verifications = [
    { idx: 0, userId: citizen1.id, status: 'Completed', comment: 'School renovation looks excellent! New computer lab is running, toilets are functional with running water. Children are actively using the facilities.', image: '/uploads/proof-school.png' },
    { idx: 1, userId: citizen1.id, status: 'Completed', comment: 'Digital library is operational with all 12 computers working. Internet speed is good. Students are using e-learning platforms.', image: '/uploads/proof-school.png' },
    { idx: 4, userId: citizen1.id, status: 'Completed', comment: 'The concrete road is properly laid with drainage on both sides. Smooth surface connecting village to NH-30. Great improvement over the old muddy track.', image: '/uploads/proof-highway.png' },
    { idx: 8, userId: citizen2.id, status: 'Completed', comment: 'RO water kiosk is providing clean drinking water. Locals are very happy. The water tastes much better than borewell water. Queue system is well managed.', image: '/uploads/proof-water.png' },
    { idx: 9, userId: citizen2.id, status: 'Completed', comment: 'The heritage walk looks beautiful! Sandstone pavers are authentic and the brass bollard lights create a wonderful ambiance. Tourists are loving it.', image: '/uploads/proof-highway.png' },
    { idx: 15, userId: citizen3.id, status: 'Completed', comment: 'Check dams are holding water well. Farmers report improved groundwater levels. Farm ponds are full even in March this year.', image: '/uploads/proof-water.png' },
    { idx: 20, userId: citizen3.id, status: 'Completed', comment: 'Promenade looks stunning! New granite flooring and stainless railings are premium quality. LED lighting makes evening walks very pleasant.', image: '/uploads/proof-seawall.png' },
    { idx: 22, userId: citizen1.id, status: 'Completed', comment: 'Bridge is strong and well-built. Guard rails are proper. Approach road is smooth. This has cut travel time between the two villages by 45 minutes!', image: '/uploads/proof-bridge.png' },
    { idx: 28, userId: citizen3.id, status: 'Completed', comment: 'Housing block looks solid. Families have moved in. Water and electricity connections are functional. Lift is operational.', image: '/uploads/proof-highway.png' },
    { idx: 35, userId: citizen1.id, status: 'Not Completed', comment: 'Visited the smart highway site. Only earthworks have started. No smart sensors or lights installed yet. Budget spent seems disproportionate to visible work.', image: '/uploads/proof-highway.png' },
    { idx: 36, userId: citizen3.id, status: 'Not Completed', comment: 'Hospital modernization is slow. Trauma center wing walls are up but no equipment installed. Oxygen plant foundation is ready but installation pending.', image: '/uploads/proof-hospital.png' },
    { idx: 38, userId: citizen1.id, status: 'Not Completed', comment: 'Drainage work started but progressing slowly. Only 200m of drain channel completed. Open drains still causing issues during rains.', image: '/uploads/proof-water.png' },
  ];

  for (const v of verifications) {
    await prisma.verification.create({
      data: {
        projectId: projects[v.idx].id,
        userId: v.userId,
        status: v.status,
        comment: v.comment,
        imageUrl: v.image
      }
    });
  }

  console.log('='.repeat(60));
  console.log('SEEDING COMPLETE!');
  console.log(`  ${projects.length} Projects (35 Completed, 8 In Progress, 4 Proposed, 3 Suspended)`);
  console.log('  35 Detailed Fund Hierarchies with Materials');
  console.log('  12 Citizen Verification Audits');
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
