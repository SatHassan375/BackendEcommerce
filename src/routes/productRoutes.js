// src/routes/productRoutes.js
const express = require("express");
const {
  addProduct,
  fetchProducts,
  fetchProduct,
  editProduct,
  removeProduct,
  searchProducts,
  fetchAllCategories,
} = require("../controllers/productController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.post("/", authMiddleware, authorizeRoles("admin"), addProduct);
router.put("/:id", authMiddleware, authorizeRoles("admin"), editProduct);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), removeProduct);

// Public routes
router.get("/", fetchProducts);
router.get("/search/ec", searchProducts);
router.get("/:id", fetchProduct);
router.get("/all/categories", fetchAllCategories);

module.exports = router;
