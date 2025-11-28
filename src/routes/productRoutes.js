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
  addCategory,
  removeCategory,
  editCategory,
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
router.delete("/category/remove/:id", authMiddleware, authorizeRoles("admin"), removeCategory);
router.put("/category/edit/:id", authMiddleware, authorizeRoles("admin"), editCategory);
router.post(
  "/categories",
  authMiddleware,
  authorizeRoles("admin"),
  addCategory
);

// Public routes
router.get("/", fetchProducts);
router.get("/search/ec", searchProducts);
router.get("/:id", fetchProduct);
router.get("/all/categories", fetchAllCategories);

module.exports = router;
