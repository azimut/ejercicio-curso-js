function producto2Article(producto) {
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
      <button>Comprar</button>
    </div>
    <figure>
      <img src="${imagen}" alt="${nombre}" />
    </figure>`;
  return newEle;
}

function appendArticles(articles) {
  articles.forEach((article) =>
    window.document.querySelector("div.articulos").appendChild(article)
  );
}

function fillProducts() {
  window
    .fetch("productos.json")
    .then((resp) => resp.json())
    .then((products) => products.map(producto2Article))
    .then((articles) => appendArticles(articles))
    .catch((err) => console.error(err));
}
