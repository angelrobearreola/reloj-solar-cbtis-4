// =====================================================
// RELOJ SOLAR HORIZONTAL · CBTis No. 4
// Interactividad del sitio web
// JavaScript nativo · Sin dependencias externas
// =====================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------------------
  // 1. MENÚ DE NAVEGACIÓN PARA MÓVILES
  // ---------------------------------------------------

  const botonMenu = document.getElementById("menu-toggle");
  const navegacion = document.getElementById("navegacion");

  if (botonMenu && navegacion) {
    const cerrarMenu = () => {
      navegacion.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
      botonMenu.setAttribute("aria-label", "Abrir menú");
      botonMenu.textContent = "☰";
    };

    botonMenu.addEventListener("click", () => {
      const estaAbierto = navegacion.classList.toggle("abierto");

      botonMenu.setAttribute("aria-expanded", String(estaAbierto));
      botonMenu.setAttribute(
        "aria-label",
        estaAbierto ? "Cerrar menú" : "Abrir menú"
      );
      botonMenu.textContent = estaAbierto ? "✕" : "☰";
    });

    navegacion.querySelectorAll("a").forEach((enlace) => {
      enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        cerrarMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) {
        cerrarMenu();
      }
    });
  }

  // ---------------------------------------------------
  // 2. SIMULADOR DEL RELOJ SOLAR
  // ---------------------------------------------------

  const controlHora = document.getElementById("control-hora");
  const textoHora = document.getElementById("hora-texto");
  const sombra = document.getElementById("sombra-svg");
  const gnomon = document.getElementById("gnomon-svg");
  const botonReiniciar = document.getElementById("reiniciar-hora");

  const CENTRO_X = 200;
  const CENTRO_Y = 200;

  if (controlHora && textoHora && sombra && gnomon) {

    /**
     * Convierte una hora decimal a formato HH:MM.
     */
    function formatearHora(horaDecimal) {
      const horas = Math.floor(horaDecimal);
      const minutos = Math.round((horaDecimal - horas) * 60);

      const horaAjustada = minutos === 60 ? horas + 1 : horas;
      const minutosAjustados = minutos === 60 ? 0 : minutos;

      return (
        String(horaAjustada).padStart(2, "0") +
        ":" +
        String(minutosAjustados).padStart(2, "0")
      );
    }

    /**
     * Actualiza la representación gráfica.
     *
     * Este modelo ilustra el cambio de dirección de la sombra.
     * No calcula la posición astronómica real del Sol.
     */
    function actualizarSimulacion() {
      const hora = Number(controlHora.value);

      textoHora.textContent = formatearHora(hora);

      /*
       * El ángulo se define de manera didáctica:
       * mañana: sombra hacia un lado;
       * mediodía: sombra más corta;
       * tarde: sombra hacia el lado opuesto.
       */
      const desplazamiento = hora - 12;
      const angulo = desplazamiento * 15;

      /*
       * La longitud aumenta al alejarse de las 12:00.
       * Es una relación visual simplificada, no una
       * predicción de la longitud real de la sombra.
       */
      const distancia = 45 + Math.abs(desplazamiento) * 7;

      const radianes = (angulo * Math.PI) / 180;

      const finalX =
        CENTRO_X + Math.sin(radianes) * distancia;

      const finalY =
        CENTRO_Y - Math.cos(radianes) * distancia;

      /*
       * Actualizar sombra.
       */
      sombra.setAttribute(
        "d",
        `M ${CENTRO_X} ${CENTRO_Y} L ${finalX} ${finalY}`
      );

      /*
       * El gnomon permanece fijo en este modelo.
       */
      gnomon.setAttribute(
        "d",
        `M ${CENTRO_X} ${CENTRO_Y} L ${CENTRO_X} ${CENTRO_Y - 55}`
      );

      /*
       * Cambiar la apariencia de la sombra según la hora.
       */
      const opacidad = Math.max(
        0.35,
        0.9 - Math.abs(desplazamiento) * 0.035
      );

      sombra.setAttribute("opacity", String(opacidad));
    }

    controlHora.addEventListener("input", actualizarSimulacion);

    if (botonReiniciar) {
      botonReiniciar.addEventListener("click", () => {
        controlHora.value = "12";
        actualizarSimulacion();
      });
    }

    actualizarSimulacion();
  }

  // ---------------------------------------------------
  // 3. BUSCADOR DEL GLOSARIO
  // ---------------------------------------------------

  const buscador = document.getElementById("buscar-concepto");
  const listaGlosario = document.getElementById("glosario-lista");

  if (buscador && listaGlosario) {
    const conceptos = Array.from(
      listaGlosario.querySelectorAll(".concepto")
    );

    const mensajeVacio = document.createElement("p");
    mensajeVacio.className = "nota";
    mensajeVacio.textContent = "No se encontraron conceptos.";
    mensajeVacio.hidden = true;

    listaGlosario.after(mensajeVacio);

    buscador.addEventListener("input", () => {
      const consulta = normalizarTexto(buscador.value.trim());
      let encontrados = 0;

      conceptos.forEach((concepto) => {
        const contenido = normalizarTexto(concepto.textContent);
        const coincide = contenido.includes(consulta);

        concepto.hidden = !coincide;

        if (coincide) {
          encontrados++;
        }
      });

      mensajeVacio.hidden = encontrados > 0;
    });
  }

  /**
   * Normaliza el texto para que las búsquedas
   * no dependan de mayúsculas ni acentos.
   */
  function normalizarTexto(texto) {
    return texto
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // ---------------------------------------------------
  // 4. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
  // ---------------------------------------------------

  const pie = document.querySelector(".pie");

  if (pie) {
    const anio = new Date().getFullYear();

    /*
     * Agrega el año actual sin eliminar el contenido
     * existente del pie de página.
     */
    const marcaAnio = document.createElement("p");
    marcaAnio.className = "anio-actual";
    marcaAnio.textContent = `© ${anio} · Proyecto educativo`;

    pie.appendChild(marcaAnio);
  }

  // ---------------------------------------------------
  // 5. ANIMACIONES DE ENTRADA
  // ---------------------------------------------------

  const elementosAnimados = document.querySelectorAll(
    ".tarjeta, .contenido-tiempo, .concepto, .galeria-elemento"
  );

  /*
   * Solo activa animaciones cuando el navegador admite
   * IntersectionObserver y el usuario no ha solicitado
   * movimiento reducido.
   */
  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !movimientoReducido) {
    const observador = new IntersectionObserver(
      (entradas, observer) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("revelar");
      observador.observe(elemento);
    });
  }

  // ---------------------------------------------------
  // 6. AÑO Y ESTADO INICIAL
  // ---------------------------------------------------

  document.documentElement.classList.add("js-activo");

  console.info(
    "Reloj Solar CBTis No. 4: sitio inicializado correctamente."
  );

});
