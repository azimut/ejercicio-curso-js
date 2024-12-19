# Proyecto E-Commerce

Tienda de modelos 3D.

## Tecnologias

- HTML5
  - [pravatar.cc](https://pravatar.cc/) para las imagenes en `testimonios.html`
  - [formsubmit.co](https://formsubmit.co/) para el formulario de contacto en `contacto.html`
  - [imagemagick](https://imagemagick.org/) para generar el favicon.ico, apple-touch-icon.png y el logo en svg principal

- CSS
  - gradient para generar el background que imita a un [UV map](https://beforesandafters.com/2021/01/26/wrapping-around-the-uv-map-in-80-frames%E2%80%A8/) usado en programacion grafica
  - flex
  - grid: para los elementos de la tienda
  - animacion basada en keyframes para el contador del carrito[*](https://unused-css.com/blog/css-shake-animation/)

- Javascript
  - productos agregados al DOM de forma dinamica
  - productos ordenados aleatoriamente en cada recarga [2](https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
  - aproximando el precio del producto basado en una propiedad del mismo (numero de poligonos)
  - precio redondeado a 2 decimales [1](https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary)
  - toggle visual de productos comprados, usando [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

- npm
  - [live-server](https://www.npmjs.com/package/live-server) para tener feedback inmediato de los cambios
  - [PostCSS](https://www.npmjs.com/package/postcss) para desanidar mi codigo CSS
  - [concurrently](https://www.npmjs.com/package/concurrently) para combinar ambos 2 packages
