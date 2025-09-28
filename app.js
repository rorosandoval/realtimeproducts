require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      gt: function (a, b) {
        return a > b;
      },
      gte: function (a, b) {
        return a >= b;
      },
      multiply: function (a, b) {
        return (a * b).toFixed(2);
      },
      getCartId: function () {
        return "cartId";
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((error) => console.error("Error conectando a MongoDB:", error));

const Product = require("./src/models/Product");

const productsRouter = require("./src/routes/products.js");
const cartsRouter = require("./src/routes/carts.js");
const viewsRouter = require("./src/routes/views.js");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("getProducts", async () => {
    try {
      const products = await Product.find();
      socket.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      socket.emit("error", { message: "Error al cargar productos" });
    }
  });

  socket.on("createProduct", async (productData) => {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      const products = await Product.find();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error:", error);
      socket.emit("error", { message: "Error al crear producto" });
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      const products = await Product.find();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error:", error);
      socket.emit("error", { message: "Error al eliminar producto" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = { io };
