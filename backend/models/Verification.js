const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'Not Completed'],
    required: [true, 'Please specify if the project is Completed or Not Completed'],
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment explaining the ground reality'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please upload a photo as proof'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Verification', verificationSchema);
