const db = require('./db')
const productSchema = db.mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Đảm bảo giá không âm
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const Product = db.mongoose.model('Product', productSchema);
module.exports = Product;