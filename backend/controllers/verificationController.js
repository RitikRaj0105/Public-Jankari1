const store = require('../config/store');

// Get verifications for a project
const getVerificationsForProject = async (req, res) => {
  try {
    const verifications = await store.findVerificationsByProjectId(req.params.projectId);
    return res.json(verifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a verification
const createVerification = async (req, res) => {
  const { projectId, status, comment } = req.body;

  try {
    if (!projectId || !status || !comment) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image as proof' });
    }

    const project = await store.findProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const verification = await store.createVerification({
      projectId,
      status,
      comment,
      imageUrl,
    }, req.user.id || req.user._id);

    // Populate user details for returning newly created verification object
    const newlyCreated = {
      ...verification,
      userId: {
        _id: req.user.id || req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    };

    return res.status(201).json(newlyCreated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVerificationsForProject,
  createVerification,
};
