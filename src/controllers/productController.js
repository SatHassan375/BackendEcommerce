// src/controllers/productController.js
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  search,
} = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    const product = await createProduct(
      name,
      description,
      price,
      stock,
      category,
      image_url
    );
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const searchProducts = async (req, res) => {
  try {
    const products = await search(req.query);
    if (!products.length) {
      return res.status(200).json({
        message: "No records found",
        products: [],
      });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err, message: "Server errorabc" });
  }
};
const fetchAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
module.exports = {
  addProduct,
  fetchProducts,
  fetchProduct,
  editProduct,
  removeProduct,
  searchProducts,
  fetchAllCategories,
};
