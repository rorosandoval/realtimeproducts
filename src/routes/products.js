const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../managers/ProductManager.js");
const filePath = path.join(__dirname, "../data/products.json");
const productManager = new ProductManager(filePath);

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnails, code, category, stock } =
    req.body;

  if (
    !title ||
    !description ||
    !price ||
    !thumbnails ||
    !code ||
    !category ||
    !stock
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const newProduct = await productManager.addProduct({
      title,
      description,
      price,
      thumbnails,
      code,
      category,
      stock,
    });

    const { io } = require("../../app.js");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnails, code, category, stock } =
    req.body;

  try {
    const products = await productManager.getProducts();
    const product = products.find((p) => p.id === parseInt(pid));

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.thumbnails = thumbnails || product.thumbnails;
    product.code = code || product.code;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    await productManager.saveProducts(products);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const products = await productManager.getProducts();
    const filteredProducts = products.filter((p) => p.id !== parseInt(pid));
    await productManager.saveProducts(filteredProducts);

    const { io } = require("../../app.js");
    io.emit("updateProducts", filteredProducts);

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
