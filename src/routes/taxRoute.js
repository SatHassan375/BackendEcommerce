// src/routes/TaxRoutes.js
const express = require("express");
const {
  addTax,
  fetchTax,
  fetchTaxById,
  editTax,
  removeTax,
} = require("../controllers/TaxController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.get("/all", authMiddleware, authorizeRoles("admin"), fetchTax);
router.get("/:id", authMiddleware, authorizeRoles("admin"), fetchTaxById);
router.post("/create", authMiddleware, authorizeRoles("admin"), addTax);
router.put("/edit/:id", authMiddleware, authorizeRoles("admin"), editTax);
router.delete("/delete/:id", authMiddleware, authorizeRoles("admin"), removeTax);

module.exports = router;
