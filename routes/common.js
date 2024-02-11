const express = require('express');
const checkAuthMiddleware = require('../middleware/check-auth');
const tenantsController = require('../controllers/tenants.controller');
const router = express.Router();

router.get("/tenants", tenantsController.tenantIndex);

router.get("/product-types", tenantsController.productTypeIndex);

module.exports = router;