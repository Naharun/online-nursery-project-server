import { Router } from "express";
import { CartController } from "./cart.controller";

const router = Router();

router.post("/cart", CartController.addToCart);
router.get("/cart/:userId", CartController.getCartItems);
router.delete("/cart/:userId/:productId", CartController.removeFromCart);
router.delete("/cart/clear/:userId", CartController.clearCart);
router.post("/cart/checkout/:userId", CartController.checkout);

export const CartRoutes = router;
