import { ApiError } from '@utils';
import { TCreateCategory, TUpdateCategory } from './dto';
import { Category } from './model';

class CategoriesService {
  public async getAllCategories(limit: number, cursor: string | undefined) {
    const query = cursor ? { _id: { $gt: cursor } } : {};
    const categories = await Category.find(query)
      .sort({ _id: 1 })
      .limit(limit)
      .exec();

    const hasMore = categories.length === limit;
    const nextCursor = hasMore ? categories[categories.length - 1]._id : null;

    return {
      data: categories,
      nextCursor,
    };
  }

  public async getCategory(id: string) {
    const category = await Category.findOne({ _id: id });
    if (!category) {
      throw ApiError.NotFound(`Category with this _id ${id} does not exists`);
    }
    return category;
  }

  //TODO: make creation and deletion and update of categories only for ADMIN role;
  public async createCategory(dto: TCreateCategory) {
    const category = await Category.findOne({ name: dto.name }).exec();
    if (category) {
      throw ApiError.BadRequest('Category with this name already exists');
    }
    const newCategory = await Category.create({ ...dto });
    return newCategory;
  }

  public async deleteCategory(id: string) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw ApiError.NotFound(`Category with this _id ${id} does not exists`);
    }
    return deletedCategory;
  }

  public async updateCategory(dto: TUpdateCategory) {
    const updatedCategory = await Category.findByIdAndUpdate(
      dto._id,
      { $set: { name: dto.newName } },
      { new: true }
    ).exec();
    if (!updatedCategory) {
      throw ApiError.NotFound(
        `Category with this _id ${dto._id} does not exists`
      );
    }
    return updatedCategory;
  }
}

export const categoriesService = new CategoriesService();
