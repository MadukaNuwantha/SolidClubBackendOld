const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const settingsController = require('../controllers/settings.controller');
const router = express.Router();

//,checkAuthMiddleware.checkAuth ,

router.get("/job-types", settingsController.jobTypeIndex);

router.get("/job-type-view/:id", settingsController.jobTypeView);

router.post("/job-type-create", settingsController.jobTypeCreate);

router.post("/job-type-update/:id", settingsController.jobTypeUpdate);

router.get("/levels", settingsController.levelIndex);

router.get("/level-view/:id", settingsController.levelView);

router.post("/level-create", settingsController.levelCreate);

router.post("/level-update/:id", settingsController.levelUpdate);

router.get("/level-criteria", settingsController.levelCriteriaIndex);

router.get("/level-criteria-view/:id", settingsController.levelCriteriaView);

router.post("/level-criteria-create", settingsController.levelCriteriaCreate);

router.post("/level-criteria-update/:id", settingsController.levelCriteriaUpdate);

module.exports = router;