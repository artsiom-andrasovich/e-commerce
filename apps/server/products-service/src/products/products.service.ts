import { TCreateProduct, TUpdateProduct } from "@app/lib-shared-types";
import { env, logger } from "@configs";
import { ApiError } from "@utils";
import { Product } from "./model";

class ProductsService {
  public async getProduct(productId: string) {
    const product = await Product.findById(productId).exec();
    if (!product) {
      throw ApiError.NotFound(`Product with id ${productId} does not exist`);
    }
    const [enrichedProduct] = await this.enrichWithImageUrls([product.toJSON()]);
    return enrichedProduct;
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

    const enrichedProducts = await this.enrichWithImageUrls(
      responseProducts.map((p) => p.toJSON())
    );

    return {
      data: enrichedProducts,
      nextCursor,
    };
  }

  private async enrichWithImageUrls(products: any[]) {
    if (!products || products.length === 0) return products;

    const keys = [
      ...new Set(
        products.map((product) => product.imageKey).filter((k) => !!k),
      ),
    ];
    if (keys.length === 0) return products;

    try {
      const response = await fetch(
        `${env.UPLOADS_SERVICE_URL}/api/upload/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keys }),
        },
      );

      if (!response.ok) {
        logger.error(`Failed to fetch image URLs: ${response.statusText}`);
        return products;
      }

      const urlsMap: Record<string, string> = await response.json();

      return products.map((product) => {
        const obj = { ...product };

        if (obj.imageKey && urlsMap[obj.imageKey]) {
          obj.imageUrl = urlsMap[obj.imageKey];
        }

        return obj;
      });
    } catch (e) {
      logger.error("Error fetching batch image URLs", e);
      return products;
    }
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
      throw ApiError.NotFound(`Product with id ${productId} does not exist`);
    }

    return updatedProduct;
  }

  public async deleteProduct(productId: string) {
    const deletedProduct = await Product.findByIdAndDelete(productId).exec();
    if (!deletedProduct) {
      throw ApiError.NotFound(`Product with id ${productId} does not exist`);
    }
    return;
  }
}

export const productsService = new ProductsService();
