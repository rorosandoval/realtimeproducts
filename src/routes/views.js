const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager.js");
const CartManager = require("../managers/CartManager.js");

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
  res.redirect("/products");
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query, category } = req.query;

    const options = { page, limit };
    if (sort) options.sort = sort;
    if (query) options.query = query;
    if (category) options.category = category;

    const result = await productManager.getProducts(options);

    const viewData = {
      products: result.payload,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
      query: req.query,
    };

    res.render("products", viewData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", { message: "Error al cargar productos" });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res
        .status(404)
        .render("error", { message: "Producto no encontrado" });
    }

    res.render("productDetail", { product });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", { message: "Error al cargar el producto" });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res
        .status(404)
        .render("error", { message: "Carrito no encontrado" });
    }

    const total = cart.products.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    res.render("cart", {
      cart,
      total: total.toFixed(2),
      cartId: cid,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", { message: "Error al cargar el carrito" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productManager.getProducts();
    res.render("realTimeProducts", { products: result.payload });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).render("error", { message: "Error al cargar productos" });
  }
});

module.exports = router;
