// routes/ordersRoutes.js
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:id", authMiddleware, getOrderById);

// optional admin route
router.put("/status", updateOrderStatus);

module.exports = router;
