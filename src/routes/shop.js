const express = require('express');
const router = express.Router();

const ShopController = require('../controllers/ShopController');

//Đường dẫn tới trang chi tiết, mấy cái link để dẫn tới trang chi tiết cấu hình theo đường dẫn này nha
//Coi cái đường dẫn tới trang chi tiết sản phẩm của từng sản phẩm bên mấy file hbs là hiểu thôi.
router.get('/:brand/:gender/:category/:id', ShopController.fullview);

router.get('/:brand/:gender/:category', ShopController.shopByCategory);

router.get('/:brand/:gender', ShopController.shopByGender);

router.get('/:brand', ShopController.shopByBrand);

router.get('/', ShopController.shop);


module.exports = router;
