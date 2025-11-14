// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishListRoutes = require("./routes/wishListRoutes");
const ordersRoutes = require("./routes/orderRoutes");

dotenv.config();
const app = express();

// CORS Configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Change later to your Vue frontend URL
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishList", wishListRoutes);
app.use("/api/orders", ordersRoutes);

// handle 404
app.use((req, res, next) => {
  const error = new Error("Cannot find the requested resource");
  error.status = 404;
  next(error);
});

// handle errors
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: { message: error.message } });
});

// Use fallback port for Render or local development
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
