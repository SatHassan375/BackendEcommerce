const express = require("express");
const router = express.Router();
const {
  addToWishList,
  getWishList,
  removeItem,
  clearWishList,
} = require("../controllers/wishListController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/add/:id", authMiddleware, addToWishList);
router.get("/:id", authMiddleware, getWishList);
router.delete("/remove/:id", authMiddleware, removeItem);
router.delete("/clear", authMiddleware, clearWishList);

module.exports = router;
