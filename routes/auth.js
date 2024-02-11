const express = require('express');
const authController = require('../controllers/auth.controller');
const imageUploader = require('../helpers/image-uploader');

const router = express.Router();

router.post('/customer-registration',authController.customerRegistration);

router.post('/technician-registration',authController.technicianRegistration);

router.post('/registration-with-job', authController.findTechnicianAndRegistration);

router.post('/create-jobs-job-type',authController.createJobsJobTypes);

router.post('/login', authController.login);

router.post('/forget-password', authController.forgetPassword);

router.post('/otp-login', authController.oTPlogin);

router.post('/update-password/:id', authController.updatePassword);

router.post('/create-experiances', authController.createExperiances);

router.get('/show-experieances-by-technician/:id', authController.showExperieancesByTechnician);

router.post('/remove-experiences/:id', authController.removeExperiences);

router.post('/remove-all-experiences/:id', authController.removeAllExperiences);

router.post('/create-technician-cities', authController.createTechnicianCities);

router.get('/show-cities-by-technician/:id', authController.showCitiesByTechnician);

router.post('/remove-technician-cities/:id', authController.removeTechnicianCities);

router.post('/remove-all-technician-cities/:id', authController.removeAllTechnicianCities);

router.post('/create-technician-tenant-level', authController.createTechnicianTenantLevel);

router.post('/remove-technician-tenant-level/:id', authController.removeTechnicianTenantLevel);

router.post('/remove-all-technician-tenant-level/:id', authController.removeAllTechnicianTenantLevel);

router.get('/show-tenant-level-by-technician/:id', authController.showTenantLevelsByTechnician);

router.post('/upload-profile-picture', imageUploader.profileUpload.single('profilePicture'), authController.uploadProfilePicture);

router.post('/upload-nic-front-picture', imageUploader.nicFrontUpload.single('nicFrontpicture'), authController.uploadNicFrontPicture);

router.post('/upload-nic-back-picture', imageUploader.nicBackUpload.single('nicBackpicture'), authController.uploadNicBackPicture);

router.post('/remove-old-jobs-picture/:id', authController.removeOldJobsPicture);

router.post('/remove-all-old-jobs/:id', authController.removeAllOldJobsPicture);

router.get('/show-old-jobs-by-technician/:id', authController.showOldJobsByTechnician);

router.post('/upload-old-jobs-picture', imageUploader.oldJobsUpload.array('picture', 5), authController.uploadOldJobsPicture);

router.post('/customer-registration-update/:id', authController.customerRegistrationUpdate);

router.post('/technician-registration-update/:id/:technicianId', authController.technicianRegistrationUpdate);

router.post('/remove-technician/:id', authController.removeTechnician);

router.post('/remove-customer/:id', authController.removeCustomer);

router.post('/create-experiances-array', authController.createArrayExperiances);

router.post('/create-technician-cities-array', authController.createArrayTechnicianCities);

router.post('/create-technician-tenant-level-array', authController.createArrayTechnicianTenantLevel);

router.post('/upload-job-attachments', imageUploader.JobAttachmentUpload.array('documents', 5), authController.uploadJobAttachments);

router.post('/generate-password-client', authController.generatePasswordForClient);

router.post('/upload-job-attachments-v2', imageUploader.JobAttachmentUpload.array('documents', 5), authController.uploadJobAttachmentsV2);

router.post('/upload-profile-picture-v2/:id', imageUploader.profileUpload.single('profilePicture'), authController.uploadProfilePictureV2);

router.post('/upload-nic-front-picture-v2/:id', imageUploader.nicFrontUpload.single('nicFrontpicture'), authController.uploadNicFrontPictureV2);

router.post('/upload-nic-back-picture-v2/:id', imageUploader.nicBackUpload.single('nicBackpicture'), authController.uploadNicBackPictureV2);


module.exports = router;