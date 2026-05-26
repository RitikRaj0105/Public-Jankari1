const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
  },
  status: {
    type: String,
    enum: ['Proposed', 'In Progress', 'Completed', 'Suspended'],
    default: 'Proposed',
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please add a location address'],
    },
    latitude: {
      type: Number,
      required: [true, 'Please add latitude coordinates'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please add longitude coordinates'],
    },
  },
  timeline: {
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
