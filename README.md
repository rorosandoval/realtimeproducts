# Entrega 3

Proyecto de gestión de productos y carritos con Express, Handlebars, Socket.io y MongoDB Atlas.

---

## Descripción

Aplicación web para la gestión de productos y carritos de compra, con actualización en tiempo real y persistencia en base de datos MongoDB Atlas. Permite la administración de productos desde una interfaz web y la gestión de carritos mediante endpoints REST.

---

## Características principales

- **Listado y administración de productos en tiempo real** (pantalla `/realtimeproducts`).
- **Gestión de carritos de compra** con persistencia en MongoDB Atlas.
- **Interfaz web dinámica** usando Handlebars.
- **Actualización instantánea** de productos usando Socket.io.
- **API RESTful** para productos y carritos.

---

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/rorosandoval/realtimeproducts.git
   cd entrega-3
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```
   MONGODB_URI=<tu-string-de-conexión-a-mongodb-atlas>
   PORT=8080
   ```

4. Inicia el servidor:

   ```sh
   node app.js
   ```

5. Accede a [http://localhost:8080](http://localhost:8080) en tu navegador.

---

## Arquitectura del proyecto

```
entrega-3/
│
├── app.js                      # Archivo principal del servidor
├── .env                        # Variables de entorno (no incluido en el repo)
├── package.json
│
├── src/
│   ├── models/
│   │   ├── Product.js          # Modelo de producto (Mongoose)
│   │   └── Cart.js             # Modelo de carrito (Mongoose)
│   ├── routes/
│   │   ├── products.js         # Rutas de la API de productos
│   │   ├── carts.js            # Rutas de la API de carritos
│   │   └── views.js            # Rutas para las vistas web
│
├── views/                      # Plantillas Handlebars
│   ├── layouts/
│   ├── partials/
│   ├── home.handlebars
│   └── realtimeproducts.handlebars
│
├── public/                     # Archivos estáticos (CSS, JS)
│
└── README.md
```

---

## Funcionalidades

### Productos

- **Ver productos:**  
  Accede a `/` para ver el listado de productos disponibles.
- **Agregar producto:**  
  Desde `/realtimeproducts`, completa el formulario y presiona "Agregar". El producto se añade y se actualiza la lista en tiempo real.
- **Eliminar producto:**  
  En `/realtimeproducts`, haz clic en el botón de eliminar junto a un producto. La lista se actualiza automáticamente para todos los usuarios conectados.

### Carritos

- **Crear carrito:**  
  Mediante la API (`POST /api/carts`), se puede crear un nuevo carrito.
- **Agregar producto a carrito:**  
  Mediante la API (`POST /api/carts/:cid/products/:pid`), se agrega un producto a un carrito específico.
- **Ver carrito:**  
  Accede a la API (`GET /api/carts/:cid`) para ver los productos de un carrito.

### Actualización en tiempo real

- Todos los cambios en productos (agregar/eliminar) se reflejan automáticamente en la pantalla `/realtimeproducts` para todos los usuarios conectados, gracias a Socket.io.

---

## Endpoints principales

- `GET /`  
  Vista principal con listado de productos.
- `GET /realtimeproducts`  
  Administración de productos en tiempo real.
- `GET /api/products`  
  API para obtener productos.
- `POST /api/products`  
  API para crear productos.
- `DELETE /api/products/:id`  
  API para eliminar productos.
- `GET /api/carts`  
  API para obtener carritos.
- `POST /api/carts`  
  API para crear carritos.
- `GET /api/carts/:cid`  
  API para ver un carrito específico.
- `POST /api/carts/:cid/products/:pid`  
  API para agregar productos a un carrito.

---

## Autor

Rodrigo Sandoval - 2025
