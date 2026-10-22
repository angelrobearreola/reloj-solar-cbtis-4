const lunas = ["🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔"];

const datos = [
    "La Luna se aleja de la Tierra unos 3.8 centímetros por año.",
    "La gravedad lunar es aproximadamente una sexta parte de la terrestre.",
    "La Luna no tiene luz propia: refleja la luz del Sol.",
    "Las huellas de los astronautas pueden conservarse durante muchísimo tiempo.",
    "La Luna tarda unos 27.3 días en orbitar la Tierra.",
    "El primer ser humano en pisar la Luna fue Neil Armstrong, en 1969."
];

const fondos = [
    "linear-gradient(135deg, #08001f, #170b50, #003b70)",
    "linear-gradient(135deg, #300046, #8b1e83, #ff6b9d)",
    "linear-gradient(135deg, #001c30, #00695c, #00bcd4)",
    "linear-gradient(135deg, #330000, #a52a2a, #ff9800)",
    "linear-gradient(135deg, #000000, #202040, #533483)"
];

let indiceLuna = 0;
let indiceFondo = 0;

function cambiarLuna() {
    indiceLuna = (indiceLuna + 1) % lunas.length;

    document.getElementById("luna").textContent = lunas[indiceLuna];

    document.getElementById("titulo").textContent =
        "Fase lunar: " + lunas[indiceLuna];

    document.getElementById("informacion").textContent =
        "¡Explora las diferentes apariencias de nuestro satélite natural!";
}

function datoLunar() {
    const indice = Math.floor(Math.random() * datos.length);

    document.getElementById("titulo").textContent = "🚀 ¡Dato sorprendente!";
    document.getElementById("informacion").textContent = datos[indice];
}

function cambiarColor() {
    indiceFondo = (indiceFondo + 1) % fondos.length;
    document.body.style.background = fondos[indiceFondo];
}

function animarLuna() {
    document.getElementById("luna").classList.toggle("girar");
}
