// src/controllers/productController.js
const {
  createTax,
  getTaxById,
  getAllTaxes,
  updateTax,
  deleteTax,
} = require("../models/taxModel");

const addTax = async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    const product = await createTax(
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
const fetchTax = async (req, res) => {
  try {
    const products = await getAllTaxes();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchTaxById = async (req, res) => {
  try {
    const product = await getTaxById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editTax = async (req, res) => {
  try {
    const product = await updateTax(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeTax = async (req, res) => {
  try {
    const product = await deleteTax(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  addTax,
  fetchTax,
  fetchTaxById,
  editTax,
  removeTax,
};
