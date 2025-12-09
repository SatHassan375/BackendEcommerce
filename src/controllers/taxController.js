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
    const {
      tax_name,
      tax_rate,
      tax_type,
      country_code,
      state_code,
      is_active,
    } = req.body;
    const tax = await createTax(
      tax_name,
      tax_rate,
      tax_type,
      country_code,
      state_code,
      is_active
    );
    res.status(201).json({ message: "Tax created", tax });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const fetchTax = async (req, res) => {
  try {
    const tax = await getAllTaxes();
    res.json(tax);
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
    const tax = await updateTax(req.params.id, req.body);
    if (!tax) return res.status(404).json({ message: "Tax not found" });
    res.json(tax);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeTax = async (req, res) => {
  try {
    const tax = await deleteTax(req.params.id);
    if (!tax) return res.status(404).json({ message: "Tax not found" });
    res.json({ message: "Tax deleted", tax });
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
