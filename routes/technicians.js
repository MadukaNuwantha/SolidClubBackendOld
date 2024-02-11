const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const technicianController = require('../controllers/technicians.controller');
const uploadHelper = require('../helpers/upload-helper');
const router = express.Router();

router.get("/index", technicianController.index);

router.post('/create', uploadHelper.technicianUpload.fields([{name: 'profilePicture', maxCount: 1}, {name: 'nicFrontpicture', maxCount: 1}, {name: 'nicBackpicture', maxCount: 1}, {name: 'picture', maxCount: 5}]), technicianController.create);

router.get("/view/:id", technicianController.view);

router.post('/update/:id/:technicianId', technicianController.update);

router.post('/update-status/:id', technicianController.updateStatus);

router.post('/update-profile-picture/:id', uploadHelper.profileUpload.single('profilePicture'), technicianController.updateProfilePicture)

router.post('/update-nic-pictures/:id', uploadHelper.technicianUpload.fields([{name: 'nicFrontpicture', maxCount: 1}, {name: 'nicBackpicture', maxCount: 1}]),technicianController.updateNicPictures)

router.post('/update-password/:id',technicianController.updatePassword);

router.post('/update-job-status',technicianController.updateJobStatus);

router.post('/upload-old-jobs', uploadHelper.technicianUpload.fields([{name: 'picture', maxCount: 5}]), technicianController.uploadOldJobsPicture);

router.post('/remove-old-job/:id', technicianController.removeOldJobsPicture);

router.post("/remove-profile-picture/:id", technicianController.removeProfilePicture);

router.post("/remove-nic-picture/:id", technicianController.removeNicPictures);

router.get('/get-technicians-tenants/:id',technicianController.getTechniciansTenants);

router.get('/get-blacklist-whitelist-status/:id',technicianController.getBlacklistWhiteList);

router.post('/set-blacklist-whitelist-status/:id',technicianController.setBlacklistWhitelist);

router.post('/update-technician-tenant-level/:id', technicianController.updateTechnicianTenantLevel);

router.get('/get-profile-picture/:id', technicianController.getProfilePicture);

module.exports = router;