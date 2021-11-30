const express = require('express');
const router = express.Router();

const SiteController = require('../controllers/SiteController');
router.get('/contact', SiteController.contact);
router.get('/', SiteController.index);


module.exports = router;
