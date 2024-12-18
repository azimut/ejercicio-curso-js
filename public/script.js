function producto2Article(producto, idx) {
  const computePrice = (np) =>
    Math.round((np / 1337 + Number.EPSILON) * 100) / 100;
  const { nombre, imagen, creacion, poligonos } = producto;
  const newEle = window.document.createElement("article");
  const price = computePrice(poligonos);
  newEle.innerHTML = `
    <div class="details">
      <h3>${nombre}</h3>
      <ul>
        <li><i class="fa-solid fa-sack-dollar"></i>\$${price}</li>
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
  const jsonValue = window.sessionStorage.getItem(key);
  return JSON.parse(jsonValue);
}
function storageSet(key, value) {
  const jsonValue = JSON.stringify(value);
  window.sessionStorage.setItem(key, jsonValue);
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
  window.document.querySelector("p.carrito").innerText = getCarrito().length;
}

function fillProducts() {
  window
    .fetch("productos.json")
    .then((resp) => resp.json())
    .then((products) => {
      setProducts(shuffle(products));
      return products.map(producto2Article);
    })
    .then((articles) => appendArticles(articles))
    .catch((err) => console.error(err));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let randPos = Math.floor(Math.random() * i);
    let tmp = arr[randPos];
    arr[randPos] = arr[i];
    arr[i] = tmp;
  }
  return arr;
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

window.onload = function () {
  updateCarritoCount();
};
