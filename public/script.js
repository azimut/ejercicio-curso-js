window.onload = function () {
  updateCarritoCount();
};

function updateCarritoCount() {
  const carrito = window.document.querySelector("p.carrito");
  const nitems = getCarrito().length;
  if (nitems === 0) {
    carrito.innerText = null;
  } else {
    carrito.innerText = nitems;
  }
}

function fillProducts() {
  window
    .fetch("productos.json")
    .then((resp) => resp.json())
    .then((products) => {
      setProducts(shuffle(products));
      return products.map(producto2Article);
    })
    .then(appendChilds)
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

function appendChilds(childs) {
  childs.forEach((child) =>
    window.document.querySelector("div.articulos").appendChild(child)
  );
}

function producto2Article(producto) {
  const computePrice = (np) =>
    Math.round((np / 1337 + Number.EPSILON) * 100) / 100;
  const { id, nombre, imagen, creacion, poligonos } = producto;
  const price = computePrice(poligonos);
  const carrito = getCarrito();
  const newArticle = window.document.createElement("article");
  if (carrito.includes(id)) {
    newArticle.classList.add("active");
  }
  newArticle.setAttribute("product-id", id);
  newArticle.innerHTML = `
    <div class="details">
      <h3>${nombre}</h3>
      <ul>
        <li><i class="fa-solid fa-sack-dollar"></i>\$${price}</li>
        <li><i class="fa-solid fa-cube"></i>${poligonos}</li>
        <li><i class="fa-regular fa-calendar"></i>${creacion}</li>
      </ul>
      <button onclick="buyProduct(${id})">Comprar</button>
    </div>
    <figure>
      <img src="${imagen}" alt="${nombre}" />
    </figure>`;
  return newArticle;
}

function buyProduct(pid) {
  const articleEle = window.document.querySelector(
    `article[product-id="${pid}"]`
  );
  articleEle.classList.add("active");
  const newCarrito = getCarrito();
  if (!newCarrito.includes(pid)) {
    newCarrito.push(pid);
  }
  setCarrito(newCarrito);
  updateCarritoCount();
  shakeit();
}

function shakeit() {
  const carrito = window.document.querySelector("p.carrito");
  carrito.classList.add("shakeit");
  setTimeout(() => carrito.classList.remove("shakeit"), 500);
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
