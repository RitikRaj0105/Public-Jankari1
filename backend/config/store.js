const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper to compile flat allocations list to recursive hierarchy tree
function buildAllocationsTree(flatAllocations, flatMaterials) {
  const map = {};
  const roots = [];
  
  flatAllocations.forEach(node => {
    node.children = [];
    node.materials = [];
    map[node.id] = node;
  });

  flatMaterials.forEach(mat => {
    if (mat.allocationId && map[mat.allocationId]) {
      map[mat.allocationId].materials.push(mat);
    }
  });

  flatAllocations.forEach(node => {
    if (node.parentId && map[node.parentId]) {
      map[node.parentId].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

const store = {
  connectStore: async () => {
    try {
      await prisma.$connect();
      console.log('Prisma Connected to SQLite DB successfully.');
    } catch (err) {
      console.error('Prisma connection error:', err);
    }
  },

  isMongoose: () => false,

  // User queries
  findUserByEmail: async (email) => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  findUserById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  createUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'citizen',
        adminLevel: userData.adminLevel || null,
        adminRegion: userData.adminRegion || null,
        country: userData.country || 'India',
        state: userData.state,
        district: userData.district,
        block: userData.block,
        panchayat: userData.panchayat,
        village: userData.village
      },
    });
  },

  updateUser: async (id, updateData) => {
    const data = {};
    if (updateData.name) data.name = updateData.name;
    if (updateData.email) data.email = updateData.email;
    if (updateData.password) {
      data.password = await bcrypt.hash(updateData.password, 10);
    }
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  // Project queries
  findProjects: async (search = '', status = 'All', userScope = null) => {
    const where = {};

    if (userScope) {
      where.state = userScope.state;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } }
      ];
    }

    const list = await prisma.project.findMany({
      where,
      include: {
        allocations: true,
        materials: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return list.map(project => {
      const tree = buildAllocationsTree(project.allocations, project.materials);
      return {
        ...project,
        budget: project.totalBudget,
        allocationsTree: tree
      };
    });
  },

  findProjectById: async (id) => {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        allocations: true,
        materials: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!project) return null;

    const tree = buildAllocationsTree(project.allocations, project.materials);

    return {
      ...project,
      allocationsTree: tree
    };
  },

  createProject: async (projectData, userId) => {
    return await prisma.project.create({
      data: {
        name: projectData.name,
        description: projectData.description,
        totalBudget: parseFloat(projectData.budget || projectData.totalBudget),
        status: projectData.status || 'Proposed',
        address: projectData.address,
        latitude: parseFloat(projectData.latitude),
        longitude: parseFloat(projectData.longitude),
        startDate: new Date(projectData.startDate),
        endDate: new Date(projectData.endDate),
        country: projectData.country || 'India',
        state: projectData.state,
        district: projectData.district,
        block: projectData.block,
        panchayat: projectData.panchayat,
        village: projectData.village,
        creatorId: userId
      }
    });
  },

  updateProject: async (id, projectData) => {
    const data = {};
    if (projectData.name) data.name = projectData.name;
    if (projectData.description) data.description = projectData.description;
    if (projectData.budget !== undefined || projectData.totalBudget !== undefined) {
      data.totalBudget = parseFloat(projectData.budget || projectData.totalBudget);
    }
    if (projectData.status) data.status = projectData.status;
    if (projectData.address) data.address = projectData.address;
    if (projectData.latitude !== undefined) data.latitude = parseFloat(projectData.latitude);
    if (projectData.longitude !== undefined) data.longitude = parseFloat(projectData.longitude);
    if (projectData.startDate) data.startDate = new Date(projectData.startDate);
    if (projectData.endDate) data.endDate = new Date(projectData.endDate);

    if (projectData.state) data.state = projectData.state;
    if (projectData.district) data.district = projectData.district;
    if (projectData.block) data.block = projectData.block;
    if (projectData.panchayat) data.panchayat = projectData.panchayat;
    if (projectData.village) data.village = projectData.village;

    return await prisma.project.update({
      where: { id },
      data
    });
  },

  deleteProject: async (id) => {
    await prisma.project.delete({
      where: { id }
    });
    return true;
  },

  // Verifications
  findVerificationsByProjectId: async (projectId) => {
    const list = await prisma.verification.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return list.map(v => ({
      ...v,
      userId: v.user
    }));
  },

  countVerificationsByUserId: async (userId) => {
    return await prisma.verification.count({
      where: { userId }
    });
  },

  findVerificationsByUserId: async (userId) => {
    const list = await prisma.verification.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            allocations: true,
            materials: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return list.map(v => {
      if (!v.project) return { ...v, projectId: null };
      
      const tree = buildAllocationsTree(v.project.allocations, v.project.materials);
      
      return {
        ...v,
        projectId: {
          _id: v.project.id,
          name: v.project.name,
          status: v.project.status,
          description: v.project.description,
          totalBudget: v.project.totalBudget,
          location: { 
            address: v.project.address,
            latitude: v.project.latitude,
            longitude: v.project.longitude
          },
          allocationsTree: tree
        }
      };
    });
  },

  createVerification: async (verData, userId) => {
    return await prisma.verification.create({
      data: {
        projectId: verData.projectId,
        userId: userId,
        status: verData.status,
        comment: verData.comment,
        imageUrl: verData.imageUrl
      }
    });
  },

  // Scoped admin metrics
  getAdminDashboardMetrics: async (admin) => {
    const where = {};
    if (admin.adminLevel === 'State') {
      where.state = admin.adminRegion;
    } else if (admin.adminLevel === 'District') {
      where.district = admin.adminRegion;
    } else if (admin.adminLevel === 'Block') {
      where.block = admin.adminRegion;
    } else if (admin.adminLevel === 'Panchayat') {
      where.panchayat = admin.adminRegion;
    } else if (admin.adminLevel === 'Village') {
      where.village = admin.adminRegion;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const totalProjects = projects.length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.totalBudget, 0);
    const completedCount = projects.filter(p => p.status === 'Completed').length;
    const inProgressCount = projects.filter(p => p.status === 'In Progress').length;
    const suspendedCount = projects.filter(p => p.status === 'Suspended').length;
    const proposedCount = projects.filter(p => p.status === 'Proposed').length;

    const projectIds = projects.map(p => p.id);
    const verificationsCount = await prisma.verification.count({
      where: {
        projectId: { in: projectIds }
      }
    });

    const projectsList = projects.map(p => ({
      _id: p.id,
      name: p.name,
      description: p.description,
      budget: p.totalBudget,
      status: p.status,
      location: {
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude
      },
      timeline: {
        startDate: p.startDate,
        endDate: p.endDate
      }
    }));

    return {
      adminLevel: admin.adminLevel,
      adminRegion: admin.adminRegion,
      totalProjects,
      totalBudget,
      completedCount,
      inProgressCount,
      suspendedCount,
      proposedCount,
      verificationsCount,
      projectsList
    };
  }
};

module.exports = store;
