// src/models/productModel.js
const pool = require("../config/db");

const createProduct = async (
  name,
  description,
  price,
  stock,
  category,
  image_url
) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock, category, image_url) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [name, description, price, stock, category, image_url]
  );
  return result.rows[0];
};
const createProductCategory = async (name, slug, parent_id) => {
  const result = await pool.query(
    `INSERT INTO categories (name, slug, parent_id) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [name, slug, parent_id]
  );
  return result.rows[0];
};

const getAllProducts = async () => {
  const result = await pool.query(
    "SELECT pd.id, pd.name, pd.description, pd.price, pd.stock, ct.name as category, pd.image_url, pd.created_at FROM products as pd left join categories as ct on pd.category_id = ct.id ORDER BY created_at DESC"
  );
  if (result.rows.length === 0) return [];
  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, description, price, stock, category, image_url, created_at FROM products WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const updateProduct = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return null;

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE products SET ${setClause} WHERE id = $${
    keys.length + 1
  } RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

const deleteProduct = async (id) => {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
const search = async (filters) => {
  const {
    query,
    category_id,
    min_price,
    max_price,
    min_stock,
    max_stock,
    sort_by = "created_at",
    sort_order = "desc",
    page = 1,
    limit = null,
  } = filters;

  const offset = (page - 1) * limit || 0;

  let where = [];
  let params = [];
  let i = 1;

  if (query && query.trim() !== "") {
    where.push(`(name ILIKE $${i} OR description ILIKE $${i})`);
    params.push(`%${query}%`);
    i++;
  }

  if (category_id) {
    where.push(`category_id = $${i}`);
    params.push(category_id);
    i++;
  }

  if (min_price !== null && min_price !== undefined) {
    where.push(`price >= $${i}`);
    params.push(min_price);
    i++;
  }

  if (max_price !== null && max_price !== undefined) {
    where.push(`price <= $${i}`);
    params.push(max_price);
    i++;
  }

  if (min_stock !== null && min_stock !== undefined) {
    where.push(`stock >= $${i}`);
    params.push(min_stock);
    i++;
  }

  if (max_stock !== null && max_stock !== undefined) {
    where.push(`stock >= $${i}`);
    params.push(max_stock);
    i++;
  }

  const whereQuery = where.length > 0 ? "WHERE " + where.join(" AND ") : "";

  const sql = `
    SELECT * FROM products
    ${whereQuery}
    ORDER BY ${sort_by} ${sort_order} ${limit ?? `LIMIT ${limit}`}
    OFFSET ${offset}
  `;
  console.log(sql);
  console.log(params);
  const result = await pool.query(sql, params);
  return result.rows;
};
const getAllCategories = async () => {
  const result = await pool.query(
    "SELECT id,name,slug,parent_id,created_at,updated_at FROM categories"
  );
  return result.rows;
};
const deleteCategory = async (id) => {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
const updateCategory = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return null;

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE categories SET ${setClause} WHERE id = $${
    keys.length + 1
  } RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  search,
  getAllCategories,
  createProductCategory,
  deleteCategory,
  updateCategory,
};
