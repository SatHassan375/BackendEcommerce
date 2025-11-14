const pool = require("../config/db");


async function getOrCreateCart(userId) {
  const result = await pool.query(
    "SELECT cart_id FROM carts WHERE user_id = $1 LIMIT 1",
    [userId]
  );

  if (result.rows.length === 0) {
    const newCart = await pool.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id",
      [userId]
    );
    return newCart.rows[0].cart_id;
  }

  return result.rows[0].cart_id;
}

async function addItem(cartId, productId, quantity) {
  // 1️⃣ Check if item exists
  const existing = await pool.query(
    "SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cartId, productId]
  );

  if (existing.rows.length > 0) {
    // 2️⃣ Update quantity
    await pool.query(
      `UPDATE cart_items 
       SET quantity = quantity + $1, updated_at = NOW() 
       WHERE cart_id = $2 AND product_id = $3`,
      [quantity, cartId, productId]
    );
  } else {
    // 3️⃣ Insert new cart item — include price snapshot
    const productPrice = await pool.query(
      "SELECT price FROM products WHERE id = $1",
      [productId]
    );

    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_added) 
       VALUES ($1, $2, $3, $4)`,
      [cartId, productId, quantity, productPrice.rows[0].price]
    );
  }
}

async function getCartItems(cartId) {
  const result = await pool.query(
    `SELECT 
        ci.cart_item_id,
        ci.product_id,
        ci.quantity,
        ci.price_at_added,
        p.name,
        p.price,
        p.description,
        p.category,
        p.image_url,
        p.stock,
        (ci.quantity * ci.price_at_added) AS total
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = $1`,
    [cartId]
  );

  return result.rows;
}

async function updateQuantity(cartId, productId, quantity) {
  await pool.query(
    `UPDATE cart_items 
     SET quantity = $1, updated_at = NOW() 
     WHERE cart_id = $2 AND product_id = $3`,
    [quantity, cartId, productId]
  );
}

async function removeItem(cartId, productId) {
  await pool.query(
    "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cartId, productId]
  );
}

async function clearCart(cartId) {
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
}

module.exports = {
  getOrCreateCart,
  addItem,
  getCartItems,
  updateQuantity,
  removeItem,
  clearCart,
};
