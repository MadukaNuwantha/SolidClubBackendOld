const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const jobsController = require('../controllers/jobs.controller');
const uploadHelper = require('../helpers/upload-helper');
const router = express.Router();

router.get("/index", jobsController.index);

router.get("/view/:id", jobsController.view);

router.post("/create/:id", uploadHelper.findTechnicianUpload.fields([{name: 'documents', maxCount: 5}]), jobsController.create);

router.post("/update/:id", uploadHelper.findTechnicianUpload.fields([{name: 'documents', maxCount: 5}]), jobsController.update);

router.post("/technician-job-delete/:id", jobsController.technicianJobDelete);

router.get("/find-technician/:id", jobsController.findTechnician);

router.post("/assign-technician", jobsController.assignTechnician);

router.post("/remove-job/:id", jobsController.removeJob);

module.exports = router;