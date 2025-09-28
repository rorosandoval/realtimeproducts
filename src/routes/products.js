const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager.js");

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query, category, status } = req.query;

    const options = {};
    if (limit) options.limit = limit;
    if (page) options.page = page;
    if (sort) options.sort = sort;
    if (query) options.query = query;
    if (category) options.category = category;
    if (status !== undefined) options.status = status === "true";

    const result = await productManager.getProducts(options);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (product) {
      res.status(200).json({ status: "success", payload: product });
    } else {
      res.status(404).json({
        status: "error",
        error: "Producto no encontrado",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnails, code, category, stock } =
    req.body;

  if (
    !title ||
    !description ||
    !price ||
    !code ||
    !category ||
    stock === undefined
  ) {
    return res.status(400).json({
      status: "error",
      error: "Faltan campos obligatorios",
    });
  }

  try {
    const newProduct = await productManager.addProduct({
      title,
      description,
      price: Number(price),
      thumbnails: thumbnails || [],
      code,
      category,
      stock: Number(stock),
    });

    const { io } = require("../../app.js");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products.payload);

    res.status(201).json({
      status: "success",
      payload: newProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error.code === 11000) {
      res.status(400).json({
        status: "error",
        error: "El código del producto ya existe",
      });
    } else {
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updateData = req.body;

  delete updateData._id;

  try {
    const updatedProduct = await productManager.updateProduct(pid, updateData);

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        error: "Producto no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const deletedProduct = await productManager.deleteProduct(pid);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        error: "Producto no encontrado",
      });
    }

    const { io } = require("../../app.js");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products.payload);

    res.status(200).json({
      status: "success",
      message: "Producto eliminado correctamente",
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
