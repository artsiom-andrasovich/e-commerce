import { TCreateCategory, TUpdateCategory } from "@app/lib-shared-types";
import { ApiError } from "@utils";
import { Category } from "./model";

class CategoriesService {
  public async getCategories(limit: number, cursor: string | undefined) {
    const query = cursor ? { _id: { $gt: cursor } } : {};
    const categories = await Category.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1)
      .exec();

    const hasMore = categories.length > limit;
    const responseCategories = hasMore
      ? categories.slice(0, limit)
      : categories;
    const nextCursor = hasMore
      ? responseCategories[responseCategories.length - 1]._id
      : null;

    return {
      data: responseCategories,
      nextCursor,
    };
  }

  //TODO: make creation and deletion of categories only for ADMIN role;
  public async createCategory(dto: TCreateCategory) {
    const category = await Category.findOne({ name: dto.name }).exec();
    if (category) {
      throw ApiError.Conflict("Category with this name already exists");
    }
    const newCategory = await Category.create({ ...dto });
    return newCategory;
  }

  public async deleteCategory(id: string) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw ApiError.NotFound(`Category with id ${id} does not exist`);
    }
    return;
  }

  public async updateCategory(id: string, dto: TUpdateCategory) {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: { name: dto.name } },
      { new: true },
    ).exec();
    if (!updatedCategory) {
      throw ApiError.NotFound(`Category with id ${id} does not exist`);
    }
    return updatedCategory;
  }
}

export const categoriesService = new CategoriesService();
