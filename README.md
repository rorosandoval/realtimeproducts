# Entrega 2

Proyecto de gestión de productos y carritos con Express, Handlebars y Socket.io.

## Características

- Listado y administración de productos en tiempo real.
- Carritos de compra con persistencia en archivos JSON.
- Interfaz web con Handlebars.
- Actualización en tiempo real usando Socket.io.

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/rorosandoval/realtimeproducts.git
   cd entrega-2
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Inicia el servidor:

   ```sh
   node app.js
   ```

4. Accede a [http://localhost:8080](http://localhost:8080) en tu navegador.

## Uso de la pantalla `realtimeproducts`

La pantalla `realtimeproducts` permite administrar productos en tiempo real:

1. Ingresa a [http://localhost:8080/realtimeproducts](http://localhost:8080/realtimeproducts).
2. Verás el listado actual de productos.
3. Puedes agregar un producto llenando el formulario y presionando "Agregar". El producto se añadirá y todos los usuarios conectados verán la actualización instantáneamente.
4. Puedes eliminar productos usando el botón correspondiente junto a cada producto. La lista se actualizará en tiempo real para todos los usuarios.

## Estructura del proyecto

- `app.js`: Archivo principal del servidor.
- `src/managers/ProductManager.js`: Lógica para productos.
- `src/routes/products.js`: Rutas de la API de productos.
- `src/routes/carts.js`: Rutas de la API de carritos.
- `src/routes/views.js`: Rutas para las vistas.
- `src/data/products.json`: Persistencia de productos.
- `src/data/carts.json`: Persistencia de carritos.
- `views/`: Plantillas Handlebars.
- `public/`: Archivos estáticos (CSS, JS).

## Endpoints principales

- `GET /`: Vista principal con listado de productos.
- `GET /realtimeproducts`: Administración de productos en tiempo real.
- `GET /api/products`: API para productos.
- `GET /api/carts`: API para carritos.



#### Rodrigo Sandoval - 2025
