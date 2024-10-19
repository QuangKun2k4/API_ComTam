const db = require('./db');
const orderSchema = db.mongoose.Schema({
  user: {
    type: db.mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cart: {
    type: db.mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });

const Order = db.mongoose.model('Order', orderSchema);
module.exports = Order;
