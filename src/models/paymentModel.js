// models/paymentsModel.js
const pool = require("../config/db");

// Create a payment entry
const createPayment = async (orderId, method, amount) => {
  const query = `
    INSERT INTO payments (order_id, method, amount)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [orderId, method, amount]);
  return result.rows[0];
};

// Update payment status
const updatePaymentStatus = async (paymentId, status, transactionId) => {
  const query = `
    UPDATE payments
    SET status = $1, transaction_id = $2
    WHERE id = $3
    RETURNING *;
  `;
  const result = await pool.query(query, [status, transactionId, paymentId]);

  return result.rows[0];
};

// Get payment by order
const getPaymentByOrder = async (orderId) => {
  const query = `
    SELECT * FROM payments
    WHERE order_id = $1;
  `;
  const result = await pool.query(query, [orderId]);
  return result.rows[0];
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentByOrder,
};
