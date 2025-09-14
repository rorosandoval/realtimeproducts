const socket = io();

document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    category: document.getElementById("category").value,
    stock: document.getElementById("stock").value,
    thumbnails: document.getElementById("thumbnails").value.split(","),
  };

  socket.emit("createProduct", product);
  document.getElementById("productForm").reset();
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

socket.on("updateProducts", (products) => {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = "";

  products.forEach((product) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Código: ${product.code}</p>
        <p>Categoría: ${product.category}</p>
        <p>Thumbnails: ${product.thumbnails}</p>
        <button class="boton-elminar" onclick="deleteProduct(${product.id})">Eliminar</button>
        `;
    productsList.appendChild(div);
  });
});