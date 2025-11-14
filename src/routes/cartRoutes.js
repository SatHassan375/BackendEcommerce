const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateItem,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/update", authMiddleware, updateItem);
router.delete("/remove/:productId", authMiddleware, removeItem);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
