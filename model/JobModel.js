const mongoose = require("mongoose");

const JobSchema = mongoose.Schema({

  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  job_image: {
    type: String,
    required: false,
  },
  job_title: {
    type: String,
    required: true,
  },
  experience_required: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  company_details: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null
  },
  job_level: {
    type: String,
    required: false,
  },
  job_time: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("job", JobSchema);