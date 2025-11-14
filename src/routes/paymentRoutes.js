// routes/paymentsRoutes.js
const express = require("express");
const router = express.Router();

const {
  createPayment,
  updatePaymentStatus,
  getPaymentByOrder,
} = require("../controllers/paymentsController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createPayment);
router.put("/", authMiddleware, updatePaymentStatus);
router.get("/:orderId", authMiddleware, getPaymentByOrder);

module.exports = router;
