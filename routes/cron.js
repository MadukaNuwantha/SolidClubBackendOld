const express = require('express');
const cronController = require('../controllers/cron.controller');
const router = express.Router();

router.get('/fetch-tenants',cronController.fetchTenants);

router.get('/fetch-product-types',cronController.fetchProductTypes);

module.exports = router;