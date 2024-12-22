window.onload = () => {
  updateVisuals();
};

function fillProducts() {
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/ejercicio-curso-js/"
  )
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
  products.sort(function (a, b) {
    if (isInCarrito(a.id) && isInCarrito(b.id))
      return a.nombre < b.nombre ? -1 : 1;
    else if (isInCarrito(a.id)) return -1;
    else if (isInCarrito(b.id)) return +1;
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
  if (isInCarrito(id)) newArticle.classList.add("active");
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
      <div>
        <button onclick="sellProduct(${id})">-</button>
        <span class="item-counter">${countInCarrito(id)}</span>
        <button onclick="buyProduct(${id})">+</button>
      </div>
    </div>
    <figure>
      <img src="${imagen}" alt="${nombre}" />
    </figure>`;
  return newArticle;
}

function sellProduct(pid) {
  const article = document.querySelector(`article[product-id="${pid}"]`);
  const span = document.querySelector(`article[product-id="${pid}"] span`);
  deleteOneFromCarrito(pid);
  if (countInCarrito(pid) === 0) article.classList.remove("active");
  span.innerText = countInCarrito(pid);
  updateVisuals();
}

function buyProduct(pid) {
  const article = document.querySelector(`article[product-id="${pid}"]`);
  const span = document.querySelector(`article[product-id="${pid}"] span`);
  addToCarrito(pid);
  article.classList.add("active");
  span.innerText = countInCarrito(pid);
  updateVisuals();
}

function updateVisuals() {
  updateCarritoCount();
  updateAnuncio();
}

/* Anuncio Carrito */

function updateAnuncio() {
  const anuncio = window.document.querySelector("div.anuncio");
  if (isCarritoEmpty()) anuncio.classList.remove("anuncia"); // hide
  else anuncio.classList.add("anuncia"); // show
}

/* Contador Carrito */

function updateCarritoCount() {
  const contador = window.document.querySelector("p.contador");
  contador.innerText = isCarritoEmpty() ? null : sizeOfCarrito();
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
function fillGretting() {
  const dialog = window.document.querySelector("dialog");
  dialog.innerHTML = `
    <button onclick="closeDialog()">X</button>
    <h2 class="greeting">¡Gracias por su compra!</h2>`;
}
function fillCarrito() {
  if (isCarritoEmpty()) {
    closeDialog();
    return;
  }
  const dialog = window.document.querySelector("dialog");
  dialog.innerHTML = `
    <button onclick="closeDialog()">X</button>
    <header>
      <h1>Carrito</h1>
    </header>
    <table class="dock"></table>
    <div class="checkout">
      <table class="factura"></table>
      <button onclick="comprar()">Comprar!</button>
    </div>`;
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
  const total = products.reduce(
    (acc, product) => acc + product.precio * countInCarrito(product.id),
    0
  );
  const factura = window.document.querySelector("table.factura");
  factura.innerHTML = `
    <tr><td>Items:</td><td>${sizeOfCarrito()}</td></tr>
    <tr><td>Total:</td><td><mark>\$${roundPrice(total)}</mark></td></tr>`;
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
    <td class="product-image">
      <img src="${imagen}" alt="${nombre}" />
    </td>
    <td>\$${precio}</td>
    <td class="quantity">
      <div>
        <button onclick="addToCarrito(${id}); fillCarrito()">+</button>
        <span>${countInCarrito(id)}</span>
        <button onclick="deleteOneFromCarrito(${id}); fillCarrito()">-</button>
      </div>
    </td>
    <td>\$${roundPrice(countInCarrito(id) * precio)}</td>
    <td class="delete">
      <button onclick="removeElementFromCarrito(${id})">X</button>
    </td>`;
  return newItem;
}
function removeElementFromCarrito(pid) {
  const product = window.document.querySelector(
    `table.dock tr[product-id="${pid}"]`
  );
  deleteAllFromCarrito(pid);
  if (product) product.remove();
  if (isCarritoEmpty()) closeDialog();
  fillCarrito();
}
function keepProductsInCarrito(products) {
  const carrito = getCarrito();
  return products.filter((p) => carrito.includes(p.id));
}

function comprar() {
  emptyOutCarrito();
  fillGretting();
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

function addToCarrito(pid) {
  const newCarrito = getCarrito();
  newCarrito.push(pid);
  setCarrito(newCarrito);
}
function deleteOneFromCarrito(pid) {
  const newCarrito = getCarrito();
  if (isInCarrito(pid)) newCarrito.splice(newCarrito.indexOf(pid), 1);
  setCarrito(newCarrito);
}
function deleteAllFromCarrito(pid) {
  setCarrito(getCarrito().filter((p) => p !== pid));
}
const countInCarrito = (pid) => getCarrito().filter((p) => p === pid).length;
const isInCarrito = (x) => getCarrito().includes(x);
const isCarritoEmpty = () => sizeOfCarrito() === 0;
const emptyOutCarrito = () => setCarrito([]);
const getCarrito = () => storageGet("carrito") || [];
const setCarrito = (x) => storageSet("carrito", x);
const sizeOfCarrito = () => getCarrito().length;
