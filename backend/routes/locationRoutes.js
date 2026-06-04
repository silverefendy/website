const express = require('express');
const { countries, provinces, cities } = require('../controllers/locationController');
const router = express.Router();
router.get('/countries', countries);
router.get('/countries/:countryCode/provinces', provinces);
router.get('/countries/:countryCode/provinces/:provinceCode/cities', cities);
module.exports = router;
