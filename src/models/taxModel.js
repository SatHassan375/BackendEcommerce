// src/models/productModel.js
const pool = require("../config/db");

const createTax = async (
  tax_name,
  tax_rate,
  tax_type,
  country_code,
  state_code,
  is_active
) => {
  const result = await pool.query(
    `INSERT INTO tax (tax_name, tax_rate, tax_type, country_code, state_code, is_active) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [tax_name, tax_rate, tax_type, country_code, state_code, is_active]
  );
  return result.rows[0];
};

const getTaxById = async (id) => {
  const result = await pool.query("SELECT * FROM tax WHERE tax_id = $1", [id]);
  return result.rows[0];
};

const getAllTaxes = async () => {
  const result = await pool.query(
    "SELECT tax_id ,tax_name, tax_rate, tax_type, country_code, state_code, is_active FROM tax"
  );
  return result.rows;
};

const updateTax = async (id, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return null;

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE tax SET ${setClause} WHERE tax_id = $${
    keys.length + 1
  } RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

const deleteTax = async (id) => {
  const result = await pool.query(
    "DELETE FROM tax WHERE tax_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createTax,
  getTaxById,
  getAllTaxes,
  updateTax,
  deleteTax,
};
