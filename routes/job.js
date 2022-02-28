const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Mongoose = require("mongoose");
const auth = require("../middleware/auth");
const JobModel = require("../model/JobModel");
const UserModel = require("../model/UserModel");

//Get all jobs
router.get("/", auth, async (req, res) => {
  try {
    let jobs = await JobModel.find();
    res.status(200).json({ success: true, data: jobs });
    // console.log(jobs);
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});


//Get applied jobs per employee 
router.get("/per", auth, async (req, res) => {
  try {
    let jobs = await JobModel.find({employee:req.user.id});
    res.status(200).json({ success: true, data: jobs });
    // console.log(jobs);
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});








//Get job by applied employee
router.put("/apply/:jid", auth, async (req, res) => {
  try {
    let jobs = await JobModel.findByIdAndUpdate(req.params.jid, {
      employee: req.user.id
    }, { new: true });

    res.status(200).json({ success: true});
    // console.log(jobs);
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});



//Get jobs per employer
router.get("/per_user", auth, async (req, res) => {
  try {
    console.log(req.user.id);
    let job = await JobModel.find({ employer: req.user.id });
    res.status(200).json({ success: true, data: job });
    // console.log(job);

  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});

//post new jobs
router.post(
  "/",
  [
    auth,
    check("job_title", "Enter job title").not().isEmpty(),
    check("experience_required", "Enter experience required for job")
      .not()
      .isEmpty(),
    check("company", "Company name required").not().isEmpty(),
    check("company_details", "Company details required").not().isEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    JobModel.init();
    const { job_title, experience_required, company, company_details, job_level, job_time, employer } =
      req.body;
    try {
      let job = new JobModel({
        job_title,
        experience_required,
        company,
        company_details,
        job_level,
        job_time,
        employer
      });

      await job.save();
      res.status(200).json({ success: true, msg: "Job added" });
    } catch (errors) {
      res.status(500).json({ msg: "Internal server error", success: false });
      console.log(errors.message);
    }
  }
);

//Delete job
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    let job = await JobModel.findById(req.params.id);
    console.log(job);
    if (!job) {
      return res.status(404).json({ msg: "Job not found", success: false });
    }
    await JobModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Job deleted from database" });
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});

//update job
router.put("/update/:id", auth, async (req, res) => {

  const { job_title, experience_required, company, company_details, job_level, job_time } = req.body;
  const newJob = {};
  if (job_title) newJob.job_title = job_title;
  if (experience_required) newJob.experience_required = experience_required;
  if (company) newJob.company = company;
  if (company_details) newJob.company_details = company_details;
  if (job_level) newJob.job_level = job_level;
  if (job_time) newJob.job_time = job_time;
  // if(employer) newJob.employer = employer
  // console.log(newJob);
  try {
    let job = await JobModel.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: "Job not found", success: false });
    }
    console.log(job);
    console.log(req.params.id);
    let updatedJob = await JobModel.findByIdAndUpdate(
      req.params.id,
      { $set: newJob },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Job updated", success: true });
  } catch (errors) {
    res.status(500).json({ msg: "Internal server error", success: false });
    console.log(errors.message);
  }
});



module.exports = router;
