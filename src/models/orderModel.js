// models/ordersModel.js
const pool = require("../config/db");

// Create order with items
const createOrder = async (userId, addressId, items, totalAmount) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderQuery = `
      INSERT INTO orders (user_id, address_id, total_amount)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const orderResult = await client.query(orderQuery, [
      userId,
      addressId,
      totalAmount,
    ]);
    const order = orderResult.rows[0];

    const itemQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4);
    `;

    for (const item of items) {
      await client.query(itemQuery, [
        order.id,
        item.productId,
        item.quantity,
        item.price,
      ]);
    }

    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Get all orders for a user
const getUserOrders = async (userId) => {
  const query = `select od.id ,oi.quantity,oi.price,od.status,
  adrs.full_name,adrs.phone,adrs.address_line1,adrs.address_line2,
  adrs.city,adrs.state,adrs.postal_code,adrs.country,adrs.is_default,
  pd.id as product_id,pd.name as product_name,pd.description,pd.category,image_url,
  od.created_at,od.updated_at
  from orders as od 
  left join order_items as oi on oi.order_id = od.id
  left join products as pd on pd.id = oi.product_id
  left join addresses as adrs on adrs.id = od.address_id where od.user_id = $1`;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Get order with items
const getOrderById = async (userId, orderId) => {
  const orderQuery = `select od.id ,oi.quantity,oi.price,od.status,
  adrs.full_name,adrs.phone,adrs.address_line1,adrs.address_line2,
  adrs.city,adrs.state,adrs.postal_code,adrs.country,adrs.is_default,
  pd.id as product_id,pd.name as product_name,pd.description,pd.category,image_url,
  od.created_at,od.updated_at
  from orders as od 
  left join order_items as oi on oi.order_id = od.id
  left join products as pd on pd.id = oi.product_id
  left join addresses as adrs on adrs.id = od.address_id where od.user_id = $1 and oi.order_id = $2`;

  console.log("Fetching order for user:", userId, "order ID:", orderId);

  const orderResult = await pool.query(orderQuery, [userId, orderId]);

  return orderResult.rows;
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  const query = `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [status, orderId]);
  return result.rows[0];
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
