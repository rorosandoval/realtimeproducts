function changeMainImage(src) {
  document.getElementById("mainImage").src = src;
}

async function addToCartWithQuantity(productId) {
  try {
    const quantityInput = document.getElementById("quantity");
    const quantity = parseInt(quantityInput.value);
    const maxStock = parseInt(quantityInput.max);

    if (isNaN(quantity) || quantity < 1) {
      alert("Por favor, ingresa una cantidad válida (mínimo 1)");
      quantityInput.value = 1;
      return;
    }

    if (quantity > maxStock) {
      alert(`La cantidad no puede ser mayor al stock disponible (${maxStock})`);
      quantityInput.value = maxStock;
      return;
    }

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
      body: JSON.stringify({ quantity: quantity }),
    });

    if (response.ok) {
      alert(`${quantity} producto(s) agregado(s) al carrito`);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al agregar producto");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al agregar producto al carrito: " + error.message);
  }
}

function redirectToCart() {
  const cartId = localStorage.getItem("cartId");

  if (cartId) {
    window.location.href = `/carts/${cartId}`;
  } else {
    alert("Aún no tienes un carrito activo. ¡Agrega un producto primero!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const quantityInput = document.getElementById("quantity");

  if (quantityInput) {
    quantityInput.addEventListener("input", function () {
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

    quantityInput.addEventListener("blur", function () {
      const value = parseInt(this.value);

      if (isNaN(value) || value < 1) {
        this.value = 1;
      }
    });
  }
});
