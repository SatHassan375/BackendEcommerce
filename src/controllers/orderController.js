// controllers/ordersController.js
const ordersModel = require("../models/orderModel");
const paymentsModel = require("../models/paymentModel");

// Create new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, items, totalAmount, paymentMethod } = req.body;

    if (!addressId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Address and items are required" });
    }

    const order = await ordersModel.createOrder(
      userId,
      addressId,
      items,
      totalAmount
    );

    if (paymentMethod) {
      await paymentsModel.createPayment(order.id, paymentMethod, totalAmount);
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all orders of a user
const getUserOrders = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = role === "admin" ? null : req.user.id;
    const orders = await ordersModel.getUserOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single order with items
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const order = await ordersModel.getOrderById(userId, orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status (admin or internal use)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updated = await ordersModel.updateOrderStatus(orderId, status);
    res.status(200).json({ message: "Order updated", order: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
