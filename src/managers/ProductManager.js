const fs = require("fs/promises");
const path = require("path");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al guardar los productos:", error);
      throw error;
    }
  }

  async addProduct({
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
  }) {
    try {
      const products = await this.getProducts();
      const newProduct = {
        id:
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        status: true,
        category,
      };
      products.push(newProduct);
      await this.saveProducts(products);
      return newProduct;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);
      if (!product) {
        console.error(`Producto con ID ${id} no encontrado`);
        return null;
      } else {
        return product;
      }
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
    }
  }
}

module.exports = ProductManager;
