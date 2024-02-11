const express = require('express');
const registrationController = require('../controllers/registration.controller');
const loginController = require('../controllers/login.controller');
const passwordController = require('../controllers/password.controller');
const uploadHelper = require('../helpers/upload-helper');

const router = express.Router();

router.post('/customer-registration', uploadHelper.profileUpload.single('profilePicture'), registrationController.customerRegistration);

router.post('/technician-registration', uploadHelper.technicianUpload.fields([{name: 'profilePicture', maxCount: 1}, {name: 'nicFrontpicture', maxCount: 1}, {name: 'nicBackpicture', maxCount: 1}, {name: 'picture', maxCount: 5}]), registrationController.technicianRegistration);

router.post('/registration-with-job', uploadHelper.findTechnicianUpload.fields([{name: 'profilePicture', maxCount: 1}, {name: 'documents', maxCount: 5}]), registrationController.findTechnicianAndRegistration);

router.post('/forget-password', passwordController.forgetPassword);

router.post('/otp-login', passwordController.oTPlogin);

router.post('/update-password/:id', passwordController.updatePassword);

router.post('/login', loginController.login);

router.post('/admin-login', loginController.adminLogin);

module.exports = router;