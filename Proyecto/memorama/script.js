// Lista de imágenes (coloca tus imágenes en la carpeta img/)
const imagenes = [
  'img/ben1.jpeg',
  'img/ben2.jpeg',
  'img/ben3.jpeg',
  'img/ben4.jpeg',
  'img/ben5.jpeg',
  'img/ben6.jpeg',
  'img/ben7.jpeg',
  'img/ben8.jpeg'
];

let cartas = [...imagenes, ...imagenes]; // duplicar para pares
cartas.sort(() => Math.random() - 0.5); // barajar

const tablero = document.getElementById('tablero');
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;

// Crear cartas
cartas.forEach((imgSrc) => {
  const carta = document.createElement('div');
  carta.classList.add('carta');
  carta.innerHTML = `
    <div class="contenido">
      <div class="frente">?</div>
      <div class="atras"><img src="${imgSrc}" alt="Imagen"></div>
    </div>
  `;

  carta.addEventListener('click', () => {
    if (bloqueo || carta.classList.contains('volteada')) return;
    carta.classList.add('volteada');

    if (!primeraCarta) {
      primeraCarta = carta;
    } else {
      segundaCarta = carta;
      bloqueo = true;

      const img1 = primeraCarta.querySelector('.atras img').src;
      const img2 = segundaCarta.querySelector('.atras img').src;

      if (img1 === img2) {
        primeraCarta = null;
        segundaCarta = null;
        bloqueo = false;
      } else {
        setTimeout(() => {
          primeraCarta.classList.remove('volteada');
          segundaCarta.classList.remove('volteada');
          primeraCarta = null;
          segundaCarta = null;
          bloqueo = false;
        }, 1000);
      }
    }
  });

  tablero.appendChild(carta);
});
