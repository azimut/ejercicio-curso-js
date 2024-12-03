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
      <button product-id="${idx}">Comprar</button>
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

function getProducts() {
  const jsonProducts = window.localStorage.getItem("products");
  return JSON.parse(jsonProducts);
}
function setProducts(products) {
  const jsonProducts = JSON.stringify(products);
  window.localStorage.setItem("products", jsonProducts);
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
