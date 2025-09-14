const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../managers/ProductManager.js");

const filePath = path.join(__dirname, "../data/products.json");
const productManager = new ProductManager(filePath);

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});


module.exports = router;