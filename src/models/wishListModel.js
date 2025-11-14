// models/wishlistModel.js
const pool = require("../config/db");

// Add item or update if exists
const addToWishList = async (userId, productId) => {
  const query = `
    INSERT INTO wishlist (user_id, product_id)
    VALUES ($1, $2);
  `;
  const values = [userId, productId];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get user's wishlist
const getWishList = async (userId) => {
  const query = `
    SELECT w.id, w.product_id, w.created_at, p.*
    FROM wishlist w
    JOIN products p ON p.id = w.product_id
    WHERE w.user_id = $1
    ORDER BY w.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

// Remove a single item
const removeItem = async (userId, productId) => {
  const query = `
    DELETE FROM wishlist
    WHERE user_id = $1 AND product_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, productId]);
  return result.rows[0];
};

// Clear entire wishlist
const clearWishList = async (userId) => {
  const query = `
    DELETE FROM wishlist
    WHERE user_id = $1;
  `;
  await pool.query(query, [userId]);
  return true;
};
module.exports = { addToWishList, getWishList, removeItem, clearWishList };
