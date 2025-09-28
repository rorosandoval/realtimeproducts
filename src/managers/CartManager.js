const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartManager {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate("products.product").lean();
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      return null;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      let newTotalQuantity;
      if (existingProductIndex > -1) {
        newTotalQuantity =
          cart.products[existingProductIndex].quantity + quantity;
      } else {
        newTotalQuantity = quantity;
      }

      if (newTotalQuantity > product.stock) {
        throw new Error(
          `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${newTotalQuantity}`
        );
      }

      if (existingProductIndex > -1) {
        cart.products[existingProductIndex].quantity = newTotalQuantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await cart.save();
      return await Cart.findById(cartId).populate("products.product").lean();
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
      await cart.save();
      return await Cart.findById(cartId).populate("products.product");
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Producto ${item.product} no encontrado`);
        }
        if (item.quantity > product.stock) {
          throw new Error(
            `Stock insuficiente para ${product.title}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
          );
        }
      }

      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      ).populate("products.product");

      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      if (quantity > product.stock) {
        throw new Error(
          `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`
        );
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();
      }
      return await Cart.findById(cartId).populate("products.product");
    } catch (error) {
      console.error("Error al actualizar cantidad del producto:", error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      return cart;
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      throw error;
    }
  }
}

module.exports = CartManager;
