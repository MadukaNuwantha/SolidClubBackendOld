const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.post("/create-user-notification", notificationController.createNewUserNotification);

router.post("/create-admin-notification", notificationController.createNewAdminNotification);

router.post("/mark-all-read-admin-notifications", notificationController.markAllReadAdminNotification);

router.post("/mark-all-read-user-notifications/:id", notificationController.markAllReadUserNotification);

router.post("/mark-read-admin-notification/:id", notificationController.markReadAdminNotification);

router.post("/mark-read-user-notification/:id", notificationController.markReadUserNotification);

module.exports = router;