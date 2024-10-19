const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ msg: 'Token không tồn tại, quyền truy cập bị từ chối' });
  }

  // Kiểm tra định dạng token
  const parts = token.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token không hợp lệ, định dạng phải là Bearer <token>' });
  }

  try {
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.userId = decoded.userId; // Thêm userId vào request
    next();
  } catch (err) {
    console.error('Lỗi xác thực token:', err.message); // Ghi log lỗi với thông điệp
    res.status(401).json({ msg: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = authMiddleware;
