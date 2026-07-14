import {
  TAddToCart,
  TJwtPayload,
  TProductListItem,
} from "@app/lib-shared-types";
import { env, logger } from "@configs";
import { ApiError } from "@utils";
import { Cart } from "./model";

export class CartService {
  public async getCart(user: TJwtPayload, lang?: string, currency?: string) {
    let cartDoc = await Cart.findOne({ userId: user.id }).exec();
    if (!cartDoc) {
      cartDoc = await Cart.create({ userId: user.id, items: [] });
    }

    const cart = cartDoc.toJSON();

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const params = new URLSearchParams();
          if (lang) params.set("lang", lang);
          if (currency) params.set("currency", currency);
          const query = params.toString() ? `?${params}` : "";
          const res = await fetch(
            `${env.PRODUCTS_SERVICE_URL}/api/products/${item.productId}${query}`,
          );
          if (res.ok) {
            const product = (await res.json()) as TProductListItem;
            return { ...item, product };
          }
        } catch (e) {
          logger.error(`Failed to fetch product ${item.productId} for cart`, e);
        }
        return item;
      }),
    );

    cart.items = populatedItems;
    return cart;
  }

  public async addToCart(user: TJwtPayload, dto: TAddToCart) {
    let cart = await Cart.findOne({ userId: user.id }).exec();
    if (!cart) {
      cart = new Cart({ userId: user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId === dto.productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += dto.quantity;
    } else {
      cart.items.push({ productId: dto.productId, quantity: dto.quantity });
    }

    await cart.save();
    return this.getCart(user);
  }

  public async updateCartItemQuantity(user: TJwtPayload, dto: TAddToCart) {
    const cart = await Cart.findOne({ userId: user.id }).exec();
    if (!cart) {
      throw ApiError.NotFound("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId === dto.productId,
    );

    if (itemIndex === -1) {
      throw ApiError.NotFound("Item not found in cart");
    }

    cart.items[itemIndex].quantity = dto.quantity;
    await cart.save();
    return this.getCart(user);
  }

  public async removeFromCart(user: TJwtPayload, productId: string) {
    const cart = await Cart.findOne({ userId: user.id }).exec();
    if (!cart) {
      throw ApiError.NotFound("Cart not found");
    }

    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();
    return this.getCart(user);
  }

  public async clearCart(user: TJwtPayload) {
    const cart = await Cart.findOne({ userId: user.id }).exec();
    if (cart) {
      cart.items = [];
      await cart.save();
    }
  }
}

export const cartService = new CartService();
