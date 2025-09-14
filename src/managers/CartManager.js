const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");


class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getCarts() {
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

  async saveCarts(carts) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error("Error al guardar los productos:", error);
      throw error;
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const newCart = {
        id: crypto.randomUUID(),
        products: [],
      };
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === id);
      if (!cart) {
        console.error(`Carrito con ID ${id} no encontrado`);
        return null;
      } else {
        return cart;
      }
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cartId);
      if (!cart) return null;

      const product = cart.products.find((p) => p.product === productId);
      if (product) {
        product.quantity += 1;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }
      await this.saveCarts(carts);
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      throw error;
    }
  }
}

module.exports = CartManager;