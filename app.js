const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static("public"));

const ProductManager = require("./src/managers/ProductManager.js");
const productFilePath = path.join(__dirname, "src", "data", "products.json");
const productManager = new ProductManager(productFilePath);

const productsRouter = require("./src/routes/products.js");
const cartsRouter = require("./src/routes/carts.js");
const viewsRouter = require("./src/routes/views.js");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Usuario conectado");
  
  socket.on("createProduct", async (productData) => {
    try {
      await productManager.addProduct(productData);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error:", error);
    }
  });
  
  socket.on("deleteProduct", async (productId) => {
    try {
      const products = await productManager.getProducts();
      const filteredProducts = products.filter(p => p.id !== parseInt(productId));
      await productManager.saveProducts(filteredProducts);
      io.emit("updateProducts", filteredProducts);
    } catch (error) {
      console.error("Error:", error);
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