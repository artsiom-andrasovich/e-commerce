import {
  TCategory,
  TCreateCategory,
  TLocale,
  TUpdateCategory,
} from "@app/lib-shared-types";
import { ApiError } from "@utils";
import { Category } from "./model";

class CategoriesService {
  public async getCategories(
    limit: number,
    page: number,
    lang: TLocale = "en",
  ) {
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit + 1)
      .exec();

    const hasMore = categories.length > limit;
    const responseCategories = hasMore
      ? categories.slice(0, limit)
      : categories;

    const data = responseCategories.map((cat) => {
      const raw = cat.toJSON() as unknown as TCategory & {
        name: Record<TLocale, string>;
      };
      const localizedName = raw.name[lang] || raw.name["en"];

      return {
        id: raw.id,
        name: localizedName,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };
    });

    const nextPage = hasMore ? page + 1 : null;

    return {
      data,
      nextPage,
    };
  }

  public async createCategory(dto: TCreateCategory) {
    await this.checkUniqueness(dto.name);
    const newCategory = await Category.create({ ...dto });
    return newCategory;
  }

  public async deleteCategory(id: string) {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw ApiError.NotFound(`Category with id ${id} does not exist`);
    }
    return deletedCategory;
  }

  public async updateCategory(id: string, dto: TUpdateCategory) {
    await this.checkUniqueness(dto.name, id);
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

  private async checkUniqueness(
    name: Record<TLocale, string>,
    idToExclude?: string,
  ) {
    const orConditions = Object.entries(name).map(([lang, value]) => ({
      [`name.${lang}`]: value,
    }));

    const category = await Category.findOne({
      $or: orConditions,
      _id: { $ne: idToExclude },
    }).exec();
    if (category) {
      throw ApiError.Conflict(
        `Category with name ${JSON.stringify(name)} already exists`,
      );
    }
  }
}

export const categoriesService = new CategoriesService();
