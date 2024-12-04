function producto2Article(producto, idx) {
  const { nombre, imagen, creacion, precio, poligonos } = producto;
  const newEle = window.document.createElement("article");
  newEle.innerHTML = `
    <div class="details">
      <h3>${nombre}</h3>
      <ul>
        <li><i class="fa-solid fa-sack-dollar"></i>\$${precio}</li>
        <li><i class="fa-solid fa-cube"></i>${poligonos}</li>
        <li><i class="fa-regular fa-calendar"></i>${creacion}</li>
      </ul>
      <button onclick="buyProduct(${idx})">Comprar</button>
    </div>
    <figure>
      <img src="${imagen}" alt="${nombre}" />
    </figure>`;
  return newEle;
}

function appendArticles(articles) {
  articles.forEach((article, idx) =>
    window.document.querySelector("div.articulos").appendChild(article, idx)
  );
}

function storageGet(key) {
  const jsonValue = window.localStorage.getItem(key);
  return JSON.parse(jsonValue);
}
function storageSet(key, value) {
  const jsonValue = JSON.stringify(value);
  window.localStorage.setItem(key, jsonValue);
}

function getProducts() {
  return storageGet("products") || [];
}
function setProducts(products) {
  storageSet("products", products);
}
function getCarrito() {
  return storageGet("carrito") || [];
}
function setCarrito(carrito) {
  storageSet("carrito", carrito);
}

function updateCarritoCount() {
  window.document.querySelector("p.carrito").innerText =
    getCarrito().length + 1;
}

function fillProducts() {
  window
    .fetch("productos.json")
    .then((resp) => resp.json())
    .then((products) => {
      setProducts(products);
      return products.map(producto2Article);
    })
    .then((articles) => appendArticles(articles))
    .catch((err) => console.error(err));
}

function shakeit() {
  const carrito = window.document.querySelector("p.carrito");
  carrito.classList.add("shakeit");
  setTimeout(() => carrito.classList.remove("shakeit"), 500);
}

function buyProduct(pid) {
  let newCarrito = getCarrito();
  newCarrito.push(pid);
  setCarrito(newCarrito);
  updateCarritoCount();
  shakeit();
}
