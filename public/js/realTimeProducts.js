const socket = io();

document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const thumbnailsValue = document.getElementById("thumbnails").value;
  const thumbnailsArray = thumbnailsValue
    ? thumbnailsValue.split(",").map((url) => url.trim())
    : [];

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    code: document.getElementById("code").value,
    category: document.getElementById("category").value,
    stock: parseInt(document.getElementById("stock").value),
    thumbnails: thumbnailsArray,
  };

  socket.emit("createProduct", product);
  document.getElementById("productForm").reset();
});

function deleteProduct(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    socket.emit("deleteProduct", id);
  }
}

socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${product.title}</h3>
      <p>${product.description}</p>
      <p>Precio: $${product.price}</p>
      <p>Stock: ${product.stock}</p>
      <p>Código: ${product.code}</p>
      <p>Categoría: ${product.category}</p>
      <p>Estado: ${product.status ? "Activo" : "Inactivo"}</p>
      ${
        product.thumbnails && product.thumbnails.length > 0
          ? `<div class="thumbnails">
          ${product.thumbnails
            .map(
              (thumb) =>
                `<img src="${thumb}" alt="Thumbnail" class="thumbnail">`
            )
            .join("")}
        </div>`
          : "<p>Sin imágenes</p>"
      }
      <button class="btn-clear" onclick="deleteProduct('${
        product._id
      }')">Eliminar</button>
    `;
    productsList.appendChild(div);
  });
});

socket.on("error", (error) => {
  alert("Error: " + error.message);
});

socket.emit("getProducts");
