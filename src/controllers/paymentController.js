// controllers/paymentsController.js
const paymentsModel = require("../models/paymentsModel");
const ordersModel = require("../models/ordersModel");

// Create payment entry
const createPayment = async (req, res) => {
  try {
    const { orderId, method, amount } = req.body;

    const payment = await paymentsModel.createPayment(orderId, method, amount);

    res.status(201).json({
      message: "Payment created",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status, transactionId } = req.body;

    const updated = await paymentsModel.updatePaymentStatus(
      paymentId,
      status,
      transactionId
    );

    res.status(200).json({
      message: "Payment status updated",
      payment: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get payment by order
const getPaymentByOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const payment = await paymentsModel.getPaymentByOrder(orderId);

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPayment, updatePaymentStatus, getPaymentByOrder };
