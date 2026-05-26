const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const store = require('../config/store');

// Get scoped admin dashboard metrics
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const metrics = await store.getAdminDashboardMetrics(req.user);
    return res.json(metrics);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
