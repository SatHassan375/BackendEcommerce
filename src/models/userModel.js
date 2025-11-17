// src/models/userModel.js
const pool = require("../config/db");

const createUser = async (name, email, hashedPassword) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT id, name, email, role, created_at, password FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, role, created_at FROM users"
  );
  return result;
};
const getUserById = async (id) => {
  const result = await pool.query("SELECT id, name, email, role, created_at FROM users where id = $1", [id]);
  return result;
};
const changeUserPasswordById = async (id, hashedPassword) => {
  const result = await pool.query(
    "UPDATE users SET password = $1 WHERE id = $2",
    [hashedPassword, id]
  );
  return result;
};
const deleteUserById = async (id) => {
  const result = await pool.query("DELETE FROM users where id = $1", [id]);
  return result;
};
const getUserAddressesById = async (id) => {
  const result = await pool.query(
    `
    SELECT users.*, addresses.*
    FROM users
    LEFT JOIN addresses ON users.id = addresses.user_id
    WHERE users.id = $1
  `,
    [id]
  );
  return result.rows;
};

const getUserAddresses = async () => {
  const result = await pool.query(`
    SELECT users.*, addresses.*
    FROM users
    RIGHT JOIN addresses ON users.id = addresses.user_id
  `);
  return result.rows;
};
const deleteAddressById = async (id) => {
  const result = await pool.query("DELETE FROM addresses where id = $1", [id]);
  return result;
};
const editUserAddressesById = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) {
    throw new Error("No fields provided for update");
  }
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

  const values = Object.values(fields);

  const query = `
  UPDATE addresses
  SET ${setClause}
  WHERE user_id = $${keys.length + 1}
  RETURNING *;
  `;
  const result = await pool.query(query, [...values, id]);
  console.log(result);
  return result.rows[0];
};
const addUserAddressesById = async (id, fields) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) {
    throw new Error("No fields provided for insert");
  }

  // Prepare columns and values for INSERT
  const columns = keys.join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const values = Object.values(fields);

  const query = `
    INSERT INTO addresses (user_id, ${columns})
    VALUES ($${keys.length + 1}, ${placeholders})
    RETURNING *;
  `;

  const result = await pool.query(query, [...values, id]);
  console.log(result.rows[0]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  changeUserPasswordById,
  deleteUserById,
  getUserAddressesById,
  getUserAddresses,
  deleteAddressById,
  editUserAddressesById,
  addUserAddressesById,
};
