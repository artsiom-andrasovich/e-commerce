import { TCreateProduct, TUpdateProduct } from "@app/lib-shared-types";
import { ApiError } from "@utils";
import { Product } from "./model";

class ProductsService {
  public async getProduct(productId: string) {
    const product = await Product.findById(productId).exec();
    if (!product) {
      throw ApiError.NotFound(
        `Product with this _id ${productId} does not exists`,
      );
    }
    return product;
  }

  public async getProducts(
    categoryId: string | undefined,
    limit: number,
    cursor: string | undefined,
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
      .limit(limit + 1)
      .exec();

    const hasMore = products.length > limit;
    const responseProducts = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore
      ? responseProducts[responseProducts.length - 1]._id
      : null;

    return {
      data: responseProducts,
      nextCursor,
    };
  }

  //TODO: check role for create, update and delete, uncomment within Story 7 on account set up implementation
  public async createProduct(dto: TCreateProduct) {
    const newProduct = await Product.create({ ...dto });
    return newProduct;
  }

  public async updateProduct(productId: string, dto: TUpdateProduct) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: dto,
      },
      { new: true },
    ).exec();
    if (!updatedProduct) {
      throw ApiError.NotFound(
        `Product with this _id ${productId} does not exists`,
      );
    }

    return updatedProduct;
  }

  public async deleteProduct(productId: string) {
    const deletedProduct = await Product.findByIdAndDelete(productId).exec();
    if (!deletedProduct) {
      throw ApiError.NotFound(
        `Product with this _id ${productId} does not exists`,
      );
    }
    return;
  }
}

export const productsService = new ProductsService();
