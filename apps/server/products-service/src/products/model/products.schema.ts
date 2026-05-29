import { Schema, model } from 'mongoose';
const ProductsSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  imagePath: { type: String, default: 'products/default.png' },
});

const Product = model('Product', ProductsSchema);
export { Product };
