const express = require("express");
const router = express.Router();
const path = require("path");
const ProductManager = require("../managers/ProductManager.js");
const CartManager = require("../managers/CartManager.js");
const filePath = path.join(__dirname, "../data/products.json");
const productManager = new ProductManager(filePath);
const cartFilePath = path.join(__dirname, "../data/carts.json");
const cartManager = new CartManager(cartFilePath);

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productManager.getProductById(parseInt(pid));
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    const updatedCart = await cartManager.addProductToCart(cid, parseInt(pid));
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;