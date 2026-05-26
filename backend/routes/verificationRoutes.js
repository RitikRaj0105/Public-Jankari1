const express = require('express');
const router = express.Router();
const { getVerificationsForProject, createVerification } = require('../controllers/verificationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, upload.single('image'), createVerification);

router.route('/:projectId')
  .get(getVerificationsForProject);

module.exports = router;
