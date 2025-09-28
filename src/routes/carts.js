const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager.js");
const ProductManager = require("../managers/ProductManager.js");

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({
      status: "success",
      payload: newCart,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno al crear el carrito",
    });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        error: "Producto no encontrado",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        status: "error",
        error: "La cantidad debe ser mayor a 0",
      });
    }

    const updatedCart = await cartManager.addProductToCart(
      cid,
      pid,
      Number(quantity)
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.message.includes("Stock insuficiente")) {
      return res.status(400).json({
        status: "error",
        error: error.message,
      });
    }

    if (error.message.includes("Producto no encontrado")) {
      return res.status(404).json({
        status: "error",
        error: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: updatedCart,
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({
      status: "error",
      error: "El cuerpo debe contener un arreglo de productos",
    });
  }

  for (const item of products) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      return res.status(400).json({
        status: "error",
        error: "Cada producto debe tener un ID válido y cantidad mayor a 0",
      });
    }
  }

  try {
    const updatedCart = await cartManager.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error:", error);

    if (
      error.message.includes("Stock insuficiente") ||
      error.message.includes("no encontrado")
    ) {
      return res.status(400).json({
        status: "error",
        error: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      status: "error",
      error: "La cantidad debe ser un número positivo mayor a 0",
    });
  }

  try {
    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      Number(quantity)
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.message.includes("Stock insuficiente")) {
      return res.status(400).json({
        status: "error",
        error: error.message,
      });
    }

    if (error.message.includes("Producto no encontrado")) {
      return res.status(404).json({
        status: "error",
        error: error.message,
      });
    }

    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const updatedCart = await cartManager.clearCart(cid);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: updatedCart,
      message: "Carrito vaciado correctamente",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
