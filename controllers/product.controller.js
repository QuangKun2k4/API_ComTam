// File controllers cho sản phẩm và giỏ hàng
const Product = require("../models/product");
const Cart = require('../models/cart');
const Order = require('../models/order'); // Thêm dòng này

exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find(); // Lấy tất cả sản phẩm từ database
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, image_url, price, description, category } = req.body;

  try {
    const product = new Product({
      name,
      image_url,
      price,
      description,
      category,
    });

    await product.save();
    res.status(201).json({ msg: 'Sản phẩm đã được thêm thành công' });
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi khi thêm sản phẩm', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).json({ msg: 'Sản phẩm đã được thêm vào giỏ hàng' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.userId;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');  // Sử dụng populate để lấy thông tin chi tiết về sản phẩm
    if (!cart || cart.items.length === 0) {
      return res.json({ items: [] }); // Trả về mảng rỗng nếu giỏ hàng trống
    }
    res.json(cart.items);  // Trả về danh sách sản phẩm trong giỏ hàng
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

exports.checkout = async (req, res) => {
  const userId = req.userId;
  const { address, phoneNumber } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Giỏ hàng của bạn đang trống' });
    }
    
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: {
        address,
        phoneNumber,
      },
    });

    await order.save();
    await Cart.findOneAndDelete({ user: userId });
    res.status(201).json({ msg: 'Đơn hàng của bạn đã được gửi thành công', order });
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await Order.find({ user: userId }).populate('items.product').sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ msg: 'Bạn chưa có đơn hàng nào' });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};

// API tìm kiếm sản phẩm theo tên
exports.search = async (req, res) => {
  const { q } = req.query;  // Lấy từ khóa tìm kiếm từ query params
  try {
    if (!q) {
      return res.status(400).json({ msg: 'Vui lòng nhập từ khóa tìm kiếm' });
    }
    const products = await Product.find({
      name: { $regex: q, $options: 'i' }
    });
    if (products.length === 0) {
      return res.status(404).json({ msg: 'Không tìm thấy sản phẩm phù hợp' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: 'Lỗi server', error: error.message });
  }
};
