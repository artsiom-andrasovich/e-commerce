import { TCreateProduct, TUpdateProduct } from "@app/lib-shared-types";
import { env, logger } from "@configs";
import { ApiError } from "@utils";
import { Product } from "./model";

class ProductsService {
  public async getProduct(productId: string, lang?: string, currency?: string) {
    const product = await Product.findById(productId).exec();
    if (!product) {
      throw ApiError.NotFound(`Product with id ${productId} does not exist`);
    }
    let [enrichedProduct] = await this.enrichWithImageUrls(
      [product.toJSON()],
      false,
    );
    [enrichedProduct] = this.enrichWithLocale([enrichedProduct], lang);
    [enrichedProduct] = await this.enrichWithCurrency(
      [enrichedProduct],
      currency,
    );
    return enrichedProduct;
  }

  public async getProducts(
    categoryId: string | undefined,
    limit: number,
    cursor: string | undefined,
    search: string | undefined,
    lang?: string,
    currency?: string,
  ) {
    const query: Record<string, unknown> = {};

    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (cursor) {
      query._id = { $gt: cursor };
    }
    if (search) {
      const targetLang = lang ?? "en";
      query.$or = [
        { [`title.${targetLang}`]: { $regex: search, $options: "i" } },
        { [`description.${targetLang}`]: { $regex: search, $options: "i" } },
      ];
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

    let enrichedProducts = await this.enrichWithImageUrls(
      responseProducts.map((p) => p.toJSON()),
      true,
    );
    enrichedProducts = this.enrichWithLocale(enrichedProducts, lang);
    enrichedProducts = await this.enrichWithCurrency(
      enrichedProducts,
      currency,
    );

    return {
      data: enrichedProducts.map((p: any) => ({
        ...p,
        imageKey: p.imageKeys?.[0] ?? null,
      })),
      nextCursor,
    };
  }

  private async enrichWithImageUrls(products: any[], onlyFirstImage?: boolean) {
    if (!products || products.length === 0) return products;

    const keys = [
      ...new Set(
        products
          .flatMap((product) => {
            const imgKeys = product.imageKeys || [];
            return onlyFirstImage ? imgKeys[0] : imgKeys;
          })
          .filter(Boolean),
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
        const imgKeys: string[] = obj.imageKeys || [];

        if (onlyFirstImage) {
          if (urlsMap[imgKeys[0]]) obj.imageUrl = urlsMap[imgKeys[0]];
        } else {
          obj.imageUrls = imgKeys
            .map((key) => urlsMap[key])
            .filter(Boolean);
        }

        return obj;
      });
    } catch (e) {
      logger.error("Error fetching batch image URLs", e);
      return products;
    }
  }

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
  public enrichWithLocale(products: any[], lang: string | undefined) {
    if (products == null || products.length === 0) {
      return products;
    }

    const targetLang = lang ?? "en";

    return products.map((product) => ({
      ...product,
      title: product.title?.[targetLang] ?? product.title?.["en"],
      description:
        product.description?.[targetLang] ?? product.description?.["en"],
    }));
  }

  public async enrichWithCurrency(
    products: any[],
    currency: string | undefined,
  ) {
    if (products == null || products.length === 0) {
      return products;
    }

    const targetCurrency = currency ?? "USD";

    if (targetCurrency === "USD") {
      return products.map((product) => ({ ...product, currency: "USD" }));
    }

    let rate = 1;
    try {
      const url = `https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`;
      const response = await fetch(url);
      if (response.ok) {
        const data: any = await response.json();
        if (data.rates != null && data.rates[targetCurrency] != null) {
          rate = data.rates[targetCurrency];
        }
      } else {
        logger.error(`Frankfurter API error: ${response.statusText}`);
      }
    } catch (e) {
      logger.error("Failed to fetch exchange rate", e);
    }

    return products.map((product) => ({
      ...product,
      price: product.price * rate,
      currency: targetCurrency,
    }));
  }
}

export const productsService = new ProductsService();
