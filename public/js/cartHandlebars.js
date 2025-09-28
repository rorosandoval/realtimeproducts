async function updateQuantity(cartId, productId, currentQuantity, change) {
  const newQuantity = currentQuantity + change;
  if (newQuantity < 1) return;

  await updateQuantityDirect(cartId, productId, newQuantity);
}

async function updateQuantityDirect(cartId, productId, newQuantity) {
  try {
    if (newQuantity < 1) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(newQuantity) }),
    });

    const responseData = await response.json();

    if (response.ok) {
      window.location.reload();
    } else {
      throw new Error(responseData.error || "Error al actualizar cantidad");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar la cantidad: " + error.message);

    window.location.reload();
  }
}

async function removeFromCart(cartId, productId) {
  if (
    !confirm("¿Estás seguro de que quieres eliminar este producto del carrito?")
  ) {
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
    });

    const responseData = await response.json();

    if (response.ok) {
      window.location.reload();
    } else {
      throw new Error(responseData.error || "Error al eliminar producto");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar el producto del carrito: " + error.message);
  }
}

async function clearCart(cartId) {
  if (!confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    const responseData = await response.json();

    if (response.ok) {
      window.location.reload();
    } else {
      throw new Error(responseData.error || "Error al vaciar carrito");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al vaciar el carrito: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const quantityInputs = document.querySelectorAll(".quantity-input");

  quantityInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const value = parseInt(this.value);
      const max = parseInt(this.max);
      const min = parseInt(this.min);

      if (value > max) {
        this.value = max;
        alert(`La cantidad máxima disponible es ${max}`);
      } else if (value < min) {
        this.value = min;
      }
    });

    input.addEventListener("blur", function () {
      const value = parseInt(this.value);

      if (isNaN(value) || value < 1) {
        this.value = 1;
      }
    });
  });
});
