var express = require('express');
var router = express.Router();
const p = require('../controllers/product.controller')
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/',p.getProduct);
router.post('/add',p.addProduct);
router.post('/cart', authMiddleware, p.addToCart);
router.get('/get-cart', authMiddleware, p.getCart);
router.post('/checkout', authMiddleware, p.checkout);
//Gửi đơn hàng: sử dùng hàm checkout, dữ liệu về giỏ hàng đã có trên server
//đây là ví dụ nên không làm tính năng chọn sản phẩm, mà cho gửi toàn bộ sản phẩm trong giỏ hàng.

router.get('/orders', authMiddleware,p.getOrder) // lấy danh sách đơn hàng

router.get('/search', p.search); // http://localhost:3000/products/search?q=xxxx
module.exports = router;