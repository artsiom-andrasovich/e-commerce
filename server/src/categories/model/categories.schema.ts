import { Schema, model } from 'mongoose';

const CategoriesSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = model('Category', CategoriesSchema);
export { Category };
