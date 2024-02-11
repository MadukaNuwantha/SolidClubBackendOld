const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const miscellaneousController = require('../controllers/miscellaneous.controller');

const router = express.Router();

router.get("/districts", miscellaneousController.getDistricts);

router.get("/cities-by-district/:id", miscellaneousController.getCitesByDistrict);

router.get("/education-levels", miscellaneousController.getEducationLevels);

router.get("/job-types", miscellaneousController.getJobTypes);

router.get("/job-statuses", miscellaneousController.getJobStatuses);

router.get("/levels", miscellaneousController.getLevels);

router.get("/tenants", miscellaneousController.getTenants);

router.get("/product-types", miscellaneousController.getProductTypes);

router.get("/user-statuses", miscellaneousController.getUserStatuses);

router.get("/roles", miscellaneousController.getRoles);

router.get("/staffs", miscellaneousController.getStaffs);

router.get("/technician-job-statuses", miscellaneousController.getTechncianJobStatuses);

router.get("/country-phone-codes", miscellaneousController.getCountryPhoneCodes);

router.get("/levels-by-tenant/:id", miscellaneousController.getLevelsByTenant);

module.exports = router;