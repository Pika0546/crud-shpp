const express = require('express');
const router = express.Router();

const MeController = require('../controllers/MeController');
router.get('/profile', MeController.profile);
// router.get('/wishlist', MeController.wishlist);
router.get('/cart', MeController.showCart);
router.get('/order/:id', MeController.showOrderDetail);
router.get('/order', MeController.showOrder);
router.get('/checkout', MeController.checkout);
router.get('/change-password', MeController.changePassword);
module.exports = router;
