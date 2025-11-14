// src/config/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for Render PostgreSQL
  },
});

pool
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL (Render)");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  });

module.exports = pool;
