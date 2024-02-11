const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const CustomersController = require('../controllers/customers.controller');
const uploadHelper = require('../helpers/upload-helper');
const router = express.Router();

router.get("/index", CustomersController.index);

router.get("/view/:id", CustomersController.view);

router.post("/create",  uploadHelper.profileUpload.single('profilePicture'), CustomersController.create);

router.post("/update/:id", CustomersController.update);

router.post("/update-status/:id", CustomersController.updateStatus);

router.post("/change-password/:id", CustomersController.updatePassword);

router.post("/update-profile-picture/:id",  uploadHelper.profileUpload.single('profilePicture'), CustomersController.updateProfilePicture);

router.post('/update-job-status/:id',CustomersController.updateJobStatus);

router.post("/remove-profile-picture/:id", CustomersController.removeProfilePicture);

router.post('/update-jobs-job-type-status',CustomersController.updateJobsJobTypeStatus);

module.exports = router;