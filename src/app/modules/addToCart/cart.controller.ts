import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { ICartItem } from "./cart.interface";

export class CartController {
  // Add item to cart
  static async addToCart(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const item: ICartItem = req.body.items;
      console.log("full", req.body);

      if (!item || !item._id) {
        return res.status(400).json({ message: "Invalid item data" });
      }

      const cart = await CartService.addToCart(userId, item);
      res
        .status(200)
        .json({ message: "Item added to cart successfully", cart });
    } catch (error) {
      res.status(500).json();
    }
  }

  // Get cart items
  static async getCartItems(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const cart = await CartService.getCartItems(userId);

      if (cart) {
        return res
          .status(200)
          .json({ message: "Cart items retrieved successfully", cart });
      } else {
        return res
          .status(404)
          .json({ message: "Cart is empty or user not found" });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve cart items",
       
      });
    }
  }

  // Remove item from cart
  static async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const productId = req.params.productId;
      const cart = await CartService.removeFromCart(userId, productId);

      if (cart) {
        return res
          .status(200)
          .json({ message: "Item removed from cart successfully", cart });
      } else {
        return res
          .status(404)
          .json({ message: "Item not found or user not found" });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Failed to remove item from cart",
       
      });
    }
  }

  // Clear cart
  static async clearCart(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const cart = await CartService.clearCart(userId);

      if (cart) {
        return res
          .status(200)
          .json({ message: "Cart cleared successfully", cart });
      } else {
        return res
          .status(404)
          .json({ message: "User not found or cart already empty" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to clear cart", });
    }
  }

  // Checkout
  static async checkout(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const cart = await CartService.checkout(userId);

      if (cart) {
        return res.status(200).json({ message: "Checkout successful", cart });
      } else {
        return res
          .status(404)
          .json({ message: "User not found or cart is empty" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to checkout",  });
    }
  }
}
