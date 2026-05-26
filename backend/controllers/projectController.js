const store = require('../config/store');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const { search, status, state } = req.query;
    const userScope = state ? { state } : null;
    
    const projects = await store.findProjects(search, status, userScope);
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await store.findProjectById(req.params.id);

    if (project) {
      return res.json(project);
    } else {
      return res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a project
const createProject = async (req, res) => {
  try {
    const { name, description, budget, address, latitude, longitude, startDate, endDate, state, district, block, panchayat, village } = req.body;

    if (!name || !description || !budget || !address || !latitude || !longitude || !startDate || !endDate || !state || !district || !block || !panchayat || !village) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const project = await store.createProject(req.body, req.user.id || req.user._id);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const project = await store.updateProject(req.params.id, req.body);

    if (project) {
      return res.json(project);
    } else {
      return res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const success = await store.deleteProject(req.params.id);

    if (success) {
      return res.json({ message: 'Project deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
