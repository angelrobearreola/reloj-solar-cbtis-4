/* ==========================================================
   RELOJ SOLAR HORIZONTAL · CBTis No. 4
   Interactividad principal
   JavaScript nativo · Sin dependencias
   ========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ========================================================
  // 1. MENÚ DE NAVEGACIÓN PARA MÓVILES
  // ========================================================

  const botonMenu = document.getElementById("menu-toggle");
  const navegacion = document.getElementById("navegacion");

  if (botonMenu && navegacion) {

    const cerrarMenu = () => {
      navegacion.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
      botonMenu.setAttribute("aria-label", "Abrir menú");
    };

    botonMenu.addEventListener("click", () => {
      const estaAbierto =
        botonMenu.getAttribute("aria-expanded") === "true";

      navegacion.classList.toggle("abierto", !estaAbierto);

      botonMenu.setAttribute(
        "aria-expanded",
        String(!estaAbierto)
      );

      botonMenu.setAttribute(
        "aria-label",
        estaAbierto ? "Abrir menú" : "Cerrar menú"
      );
    });

    navegacion.querySelectorAll("a").forEach((enlace) => {
      enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        cerrarMenu();
        botonMenu.focus();
      }
    });

    document.addEventListener("click", (evento) => {
      if (
        botonMenu.getAttribute("aria-expanded") === "true" &&
        !navegacion.contains(evento.target) &&
        !botonMenu.contains(evento.target)
      ) {
        cerrarMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        cerrarMenu();
      }
    });
  }


  // ========================================================
  // 2. SIMULADOR DE SOMBRA
  // ========================================================

  const controlHora = document.getElementById("control-hora");
  const horaTexto = document.getElementById("hora-texto");
  const sombra = document.getElementById("sombra-svg");
  const botonReiniciar = document.getElementById("reiniciar-hora");

  /*
    Este dibujo es un modelo visual esquemático.

    No calcula la posición astronómica real del Sol:
    para ello necesitaríamos incorporar la fecha, las
    coordenadas geográficas y un modelo solar adecuado.

    Aquí la sombra cambia de dirección y longitud al
    modificar la hora para explicar visualmente el concepto.
  */

  function formatearHora(valor) {
    const horas = Math.floor(valor);
    const minutos = Math.round((valor - horas) * 60);

    const horaFinal = String(horas).padStart(2, "0");
    const minutoFinal = String(minutos).padStart(2, "0");

    return `${horaFinal}:${minutoFinal}`;
  }

  function actualizarSimulador() {
    if (!controlHora) return;

    const hora = Number(controlHora.value);

    if (!Number.isFinite(hora)) return;

    if (horaTexto) {
      horaTexto.textContent = formatearHora(hora);
    }

    if (sombra) {
      /*
        Centro del cuadrante:
        x = 200, y = 235.

        La sombra se representa mediante una línea
        cuya dirección cambia durante el día.
      */

      const proporcion = (hora - 6) / 12;
      const angulo = (proporcion - 0.5) * Math.PI;

      const longitud = 35 + 48 * Math.abs(Math.cos(angulo));

      const xFinal = 200 + Math.sin(angulo) * longitud;
      const yFinal = 235 - Math.cos(angulo) * longitud;

      sombra.setAttribute(
        "d",
        `M 200 235 L ${xFinal.toFixed(2)} ${yFinal.toFixed(2)}`
      );

      /*
        Cerca del mediodía ilustrativo, la sombra
        aparece más corta. Es una simplificación visual,
        no una predicción astronómica.
      */

      const distanciaAlMediodia = Math.abs(hora - 12);
      const opacidad = 0.55 + 0.4 *
        (distanciaAlMediodia / 6);

      sombra.setAttribute(
        "opacity",
        String(Math.min(0.95, opacidad))
      );
    }
  }

  if (controlHora) {
    controlHora.addEventListener(
      "input",
      actualizarSimulador
    );

    actualizarSimulador();
  }

  if (botonReiniciar && controlHora) {
    botonReiniciar.addEventListener("click", () => {
      controlHora.value = "12";
      actualizarSimulador();
    });
  }


  // ========================================================
  // 3. BÚSQUEDA DEL GLOSARIO
  // ========================================================

  const buscador = document.getElementById("buscar-concepto");
  const glosario = document.getElementById("glosario-lista");

  if (buscador && glosario) {
    const conceptos = Array.from(
      glosario.querySelectorAll(".concepto")
    );

    let mensajeSinResultados = document.getElementById(
      "mensaje-sin-resultados"
    );

    if (!mensajeSinResultados) {
      mensajeSinResultados = document.createElement("p");
      mensajeSinResultados.id = "mensaje-sin-resultados";
      mensajeSinResultados.className = "mensaje-busqueda";
      mensajeSinResultados.textContent =
        "No se encontraron conceptos que coincidan con tu búsqueda.";

      mensajeSinResultados.hidden = true;

      glosario.insertAdjacentElement(
        "afterend",
        mensajeSinResultados
      );
    }

    function normalizarTexto(texto) {
      return texto
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    }

    buscador.addEventListener("input", () => {
      const consulta = normalizarTexto(buscador.value);
      let visibles = 0;

      conceptos.forEach((concepto) => {
        const texto = normalizarTexto(concepto.textContent);
        const coincide = texto.includes(consulta);

        concepto.hidden = !coincide;

        if (coincide) {
          visibles++;
        }
      });

      mensajeSinResultados.hidden = visibles > 0;
    });
  }


  // ========================================================
  // 4. COMPROBACIÓN DE LAS 28 IMÁGENES
  // ========================================================

  const imagenesGaleria = document.querySelectorAll(
    "#galeria-imagenes img"
  );

  imagenesGaleria.forEach((imagen) => {

    imagen.addEventListener("error", () => {
      imagen.classList.add("imagen-no-disponible");
      imagen.dataset.errorImagen = "true";

      /*
        No ocultamos automáticamente las fotografías
        que fallan: así es más fácil detectar qué archivo
        falta o qué nombre debe corregirse en GitHub.
      */
    });

    imagen.addEventListener("load", () => {
      imagen.classList.remove("imagen-no-disponible");
      imagen.dataset.errorImagen = "false";
    });

  });


  // ========================================================
  // 5. AÑO ACTUAL, SI EXISTE EL ELEMENTO
  // ========================================================

  const anioActual = document.getElementById("anio-actual");

  if (anioActual) {
    anioActual.textContent = String(
      new Date().getFullYear()
    );
  }


  // ========================================================
  // 6. REGISTRO DE INICIALIZACIÓN
  // ========================================================

  console.info(
    "Reloj Solar CBTis No. 4: funciones inicializadas."
  );

});
