import { Cart } from "./cart.model";
import { ICart, ICartItem } from "./cart.interface";

export class CartService {
  // Add item to cart
  static async addToCart(userId: string, item: ICartItem) {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const existingItem = cart.items.find((i) => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += item.quantity; // Update quantity if item exists
      } else {
        cart.items.push();
      }
      await cart.save();
    } else {
      const newCart = new Cart({ userId, items: [item] });
      await newCart.save();
      cart = newCart;
    }
    return cart;
  }

  // Get items in cart
  static async getCartItems(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId });
  }

  // Remove item from cart
  static async removeFromCart(
    userId: string,
    _id: string
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter((item) => item._id !== _id);
      await cart.save();
    }
    return cart;
  }

  // Clear the cart
  static async clearCart(userId: string): Promise<ICart | null> {
    return Cart.findOneAndUpdate({ userId }, { items: [] }, { new: true });
  }

  // Checkout
  static async checkout(userId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = []; // Empty the cart after checkout
      await cart.save();
    }
    return cart;
  }
}
