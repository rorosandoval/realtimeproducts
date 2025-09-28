const Product = require("../models/Product");

class ProductManager {
  async getProducts(options = {}) {
    try {
      const { limit = 10, page = 1, sort, query, category, status } = options;

      const filter = {};

      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
      }

      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }

      if (status !== undefined) {
        filter.status = status;
      }

      let sortOption = {};
      if (sort === "asc") {
        sortOption.price = 1;
      } else if (sort === "desc") {
        sortOption.price = -1;
      }

      const result = await Product.paginate(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: Object.keys(sortOption).length ? sortOption : undefined,
        lean: true,
      });

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/api/products?page=${result.prevPage}&limit=${limit}${
              sort ? `&sort=${sort}` : ""
            }${query ? `&query=${query}` : ""}${
              category ? `&category=${category}` : ""
            }`
          : null,
        nextLink: result.hasNextPage
          ? `/api/products?page=${result.nextPage}&limit=${limit}${
              sort ? `&sort=${sort}` : ""
            }${query ? `&query=${query}` : ""}${
              category ? `&category=${category}` : ""
            }`
          : null,
      };
    } catch (error) {
      return {
        status: "error",
        payload: [],
        message: error.message,
      };
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      return null;
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;