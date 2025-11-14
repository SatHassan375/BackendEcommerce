// controllers/wishListController.js
const wishlistModel = require("../models/wishListModel");

// Add to wishlist
addToWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const item = await wishlistModel.addToWishList(userId, productId, quantity);
    return res.status(201).json({
      message: "Item added to wishlist",
      item,
    });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Product already exists in wishlist",
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Get wishlist
getWishList = async (req, res) => {
  try {
    const userId = req.params.id;

    const list = await wishlistModel.getWishList(userId);

    res.status(200).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from wishlist
removeItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    const removed = await wishlistModel.removeItem(userId, productId);

    if (!removed) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Clear wishlist
clearWishList = async (req, res) => {
  try {
    const userId = req.user.id;

    await wishlistModel.clearWishList(userId);

    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToWishList, getWishList, removeItem, clearWishList };
