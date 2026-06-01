import { TCreateProduct, TUpdateProduct } from "@app/lib-shared-types";
import { ApiError } from "@utils";
import { Product } from "./model";

class ProductsService {
  public async getProduct(_id: string) {
    const product = await Product.findById(_id).exec();
    if (!product) {
      throw ApiError.NotFound(`Product with this _id ${_id} does not exists`);
    }
    return product;
  }

  public async getProducts(
    categoryId: string | undefined,
    limit: number,
    cursor: string | undefined
  ) {
    const query: { categoryId?: string; _id?: unknown } = {};

    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (cursor) {
      query._id = { $gt: cursor };
    }

    const products = await Product.find(query)
      .sort({ _id: 1 })
      .limit(limit)
      .exec();

    const hasMore = products.length === limit;
    const nextCursor = hasMore ? products[products.length - 1]._id : null;

    return {
      data: products,
      nextCursor,
    };
  }

  //TODO: check role for create, update and delete, uncomment within Story 7 on account set up implementation
  public async createProduct(dto: TCreateProduct) {
    const newCategory = await Product.create({ ...dto });
    return newCategory;
  }

  public async updateProduct(dto: TUpdateProduct) {
    const { _id, ...updateData } = dto;

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        $set: updateData,
      },
      { new: true }
    ).exec();
    if (!updatedProduct) {
      throw ApiError.NotFound(`Product with this _id ${_id} does not exists`);
    }

    return updatedProduct;
  }

  public async deleteProduct(_id: string) {
    const deletedProduct = await Product.findByIdAndDelete(_id).exec();
    if (!deletedProduct) {
      throw ApiError.NotFound(`Product with this _id ${_id} does not exists`);
    }
    return deletedProduct;
  }
}

export const productsService = new ProductsService();
