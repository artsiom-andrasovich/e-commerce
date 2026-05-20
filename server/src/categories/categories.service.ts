import { ApiError } from '@utils';
import { TCreateCategory, TUpdateCategory } from './dto';
import { Category } from './model';

class CategoriesService {
  public async getAllCategories() {
    const categories = await Category.find();
    return categories;
  }

  public async getCategory(id: string) {
    const category = await Category.findOne({ _id: id });
    this.handleNoCategory(category, id);
  }

  //TODO: make creation and deletion of categories only for ADMIN role;
  public async createCategory(dto: TCreateCategory) {
    const category = await Category.findOne({ name: dto.name }).exec();
    if (category) {
      throw ApiError.BadRequest('Category with this name already exists');
    }
    const newCategory = await Category.create({ ...dto });
    return newCategory;
  }

  public async deleteCategory(id: string) {
    console.log(id);
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      this.handleNoCategory(null, id);
    }
    return deletedCategory;
  }

  public async updateCategory(dto: TUpdateCategory) {
    const category = await Category.findOne({
      $or: [{ _id: dto._id }, { name: dto.newName }],
    });
    this.handleNoCategory(dto._id);
    if (category?.name == dto.newName) {
      throw ApiError.BadRequest(
        `Category with name "${dto.newName}" already exists`
      );
    }
    const updatedCategory = await Category.updateOne(
      { _id: dto._id },
      { $set: { name: dto.newName } }
    );
    return updatedCategory;
  }

  private handleNoCategory(category: any, id: string = '') {
    if (!category) {
      throw ApiError.BadRequest(`Category with this _id ${id} does not exists`);
    }
  }
}

export const categoriesService = new CategoriesService();
