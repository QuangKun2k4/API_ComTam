const mongoose = require('mongoose');

// Đọc URI từ biến môi trường (nếu bạn đang sử dụng biến môi trường)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

const connectDB = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true, // Tùy chọn này có thể bỏ qua nếu bạn dùng Mongoose >= 4.0
            useUnifiedTopology: true, // Tùy chọn này cũng có thể bỏ qua nếu bạn dùng Mongoose >= 4.0
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Lỗi kết nối CSDL', error);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được
    }
};

// Xuất hàm kết nối và mongoose để có thể sử dụng ở nơi khác trong ứng dụng
module.exports = { connectDB, mongoose };
