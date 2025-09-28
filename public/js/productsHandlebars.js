async function addToCart(productId) {
  try {
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
      const createCartResponse = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (createCartResponse.ok) {
        const newCart = await createCartResponse.json();
        cartId = newCart.payload._id;
        localStorage.setItem("cartId", cartId);
      } else {
        throw new Error("Error al crear carrito");
      }
    }

    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Producto agregado al carrito");
    } else {
      throw new Error("Error al agregar producto");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al agregar producto al carrito");
  }
}
