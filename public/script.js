window.onload = () => {
  updateVisuals();
};

function fillProducts() {
  getProducts()
    .then((products) => {
      setProducts(products);
      sortBySecretRecommendationAlgo(products);
      sortByCarrito(products);
      return products.map(producto2Article);
    })
    .then(appendToStore)
    .catch((err) => console.error(err));
}

function sortByCarrito(products) {
  const carrito = getCarrito();
  products.sort(function (a, b) {
    if (carrito.has(a.id) && carrito.has(b.id))
      return a.nombre < b.nombre ? -1 : 1;
    else if (carrito.has(a.id)) return -1;
    else if (carrito.has(b.id)) return +1;
    else return 0;
  });
}
function sortBySecretRecommendationAlgo(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randPos = Math.floor(Math.random() * i);
    [arr[randPos], arr[i]] = [arr[i], arr[randPos]]; // swap
  }
}

function appendToStore(elements) {
  const articulos = window.document.querySelector("div.articulos");
  articulos.innerHTML = null;
  elements.forEach((el) => articulos.appendChild(el));
}

function roundPrice(price) {
  return Math.round((price + Number.EPSILON) * 100) / 100;
}
function computePrice(n) {
  return roundPrice(n / 1337);
}

function producto2Article({ id, nombre, imagen, creacion, poligonos, precio }) {
  const newArticle = window.document.createElement("article");
  if (getCarrito().has(id)) newArticle.classList.add("active");
  newArticle.setAttribute("product-id", id);
  newArticle.innerHTML = `
    <div class="details">
      <h3>${nombre}</h3>
      <ul>
        <li title="Precio">
          <i class="fa-solid fa-sack-dollar"></i>\$${precio}
        </li>
        <li title="Numero de poligonos">
          <i class="fa-solid fa-cube"></i>${poligonos}
        </li>
        <li title="Año de creacion">
          <i class="fa-regular fa-calendar"></i>${creacion}
        </li>
      </ul>
      <button onclick="buyProduct(${id})">Comprar</button>
    </div>
    <figure>
      <img src="${imagen}" alt="${nombre}" />
    </figure>`;
  return newArticle;
}

function buyProduct(pid) {
  const article = window.document.querySelector(`article[product-id="${pid}"]`);
  const carrito = getCarrito();
  if (carrito.has(pid)) {
    article.classList.remove("active");
    deleteFromCarrito(pid);
  } else {
    article.classList.add("active");
    addToCarrito(pid);
  }
  updateVisuals();
}

function updateVisuals() {
  updateCarritoCount();
  updateAnuncio();
}

/* Anuncio Carrito */

function updateAnuncio() {
  const anuncio = window.document.querySelector("div.anuncio");
  if (getCarrito().size === 0) anuncio.classList.remove("anuncia"); // hide
  else anuncio.classList.add("anuncia"); // show
}

/* Contador Carrito */

function updateCarritoCount() {
  const contador = window.document.querySelector("p.contador");
  const nitems = getCarrito().size;
  contador.innerText = nitems === 0 ? null : nitems;
  shakeit();
}
function shakeit() {
  const contador = window.document.querySelector("p.contador");
  contador.classList.add("shakeit");
  setTimeout(() => contador.classList.remove("shakeit"), 500);
}

/* <dialog> carrito */

function closeDialog() {
  window.document.querySelector("dialog").close();
  fillProducts();
  updateVisuals();
}
function showDialog() {
  fillCarrito();
  window.document.querySelector("dialog").showModal();
}
function fillCarrito() {
  getProducts()
    .then(keepProductsInCarrito)
    .then((products) => {
      fillFactura(products);
      return products.map(productToElement);
    })
    .then(appendToCarrito)
    .catch(console.error);
}
function fillFactura(products) {
  const total = products.reduce((acc, { precio }) => acc + precio, 0);
  const factura = window.document.querySelector("table.factura");
  factura.innerHTML = `
    <tr><td>Items:</td><td>${products.length}</td></tr>
    <tr><td>Total:</td><td><mark>\$${roundPrice(total)}</mark></td></tr>
  `;
}
function appendToCarrito(elements) {
  const dock = window.document.querySelector("table.dock");
  dock.innerHTML = null;
  elements.forEach((el) => dock.appendChild(el));
}
function productToElement({ id, nombre, imagen, precio }) {
  const newItem = window.document.createElement("tr");
  newItem.setAttribute("product-id", id);
  newItem.innerHTML = `
    <td>${nombre}</td>
    <td>
      <img src="${imagen}" alt="${nombre}" />
    </td>
    <td>\$${precio}</td>
    <td>
      <button onclick="removeElementFromCarrito(${id})">X</button>
    </td>
  `;
  return newItem;
}
function removeElementFromCarrito(pid) {
  const product = window.document.querySelector(
    `table.dock tr[product-id="${pid}"]`
  );
  deleteFromCarrito(pid);
  if (product) product.remove();
  if (getCarrito().size === 0) closeDialog();
  fillCarrito();
}
function keepProductsInCarrito(products) {
  const carrito = getCarrito();
  return products.filter((p) => carrito.has(p.id));
}

/* Session Storage */

function storageGet(key) {
  const jsonValue = window.sessionStorage.getItem(key);
  return JSON.parse(jsonValue);
}
function storageSet(key, value) {
  const jsonValue = JSON.stringify(value);
  window.sessionStorage.setItem(key, jsonValue);
}

async function getProducts() {
  const storedProducts = storageGet("products");
  return storedProducts
    ? storedProducts
    : window
      .fetch("productos.json")
      .then((resp) => resp.json())
      .then((products) =>
        products.map((product) => {
          product.precio = computePrice(product.poligonos);
          return product;
        })
      );
}
function setProducts(products) {
  storageSet("products", products);
}
function getCarrito() {
  return new Set(storageGet("carrito") || []);
}
function addToCarrito(pid) {
  setCarrito(getCarrito().add(pid));
}
function deleteFromCarrito(pid) {
  const carrito = getCarrito();
  carrito.delete(pid);
  setCarrito(carrito);
}
function setCarrito(carrito) {
  storageSet("carrito", Array.from(carrito.values()));
}
