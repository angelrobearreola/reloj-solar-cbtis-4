"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // 1. MENÚ RESPONSIVE
  // =====================================================

  const botonMenu = document.getElementById("menu-toggle");
  const navegacion = document.getElementById("navegacion");

  if (botonMenu && navegacion) {
    function cerrarMenu() {
      navegacion.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
      botonMenu.setAttribute("aria-label", "Abrir menú");
      botonMenu.textContent = "☰";
    }

    botonMenu.addEventListener("click", () => {
      const abierto = navegacion.classList.toggle("abierto");

      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
      );
      botonMenu.textContent = abierto ? "✕" : "☰";
    });

    navegacion.querySelectorAll("a").forEach((enlace) => {
      enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") cerrarMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) cerrarMenu();
    });
  }

  // =====================================================
  // 2. SIMULADOR DEL RELOJ SOLAR
  // =====================================================

  const controlHora = document.getElementById("control-hora");
  const textoHora = document.getElementById("hora-texto");
  const sombra = document.getElementById("sombra-simulada");
  const marcas = document.getElementById("marcas-reloj");
  const etiquetas = document.getElementById("etiquetas-reloj");
  const reiniciar = document.getElementById("reiniciar-hora");

  const SVG_NS = "http://www.w3.org/2000/svg";
  const CX = 200;
  const CY = 200;

  function crearElementoSVG(nombre, atributos) {
    const elemento = document.createElementNS(SVG_NS, nombre);

    Object.entries(atributos).forEach(([clave, valor]) => {
      elemento.setAttribute(clave, String(valor));
    });

    return elemento;
  }

  // Crear marcas horarias alrededor de la esfera.
  if (marcas && etiquetas) {
    for (let hora = 0; hora < 24; hora++) {
      const angulo = (hora * 15 - 90) * Math.PI / 180;
      const esHoraPrincipal = hora % 3 === 0;

      const radioExterior = 157;
      const radioInterior = esHoraPrincipal ? 140 : 148;

      const x1 = CX + Math.cos(angulo) * radioInterior;
      const y1 = CY + Math.sin(angulo) * radioInterior;
      const x2 = CX + Math.cos(angulo) * radioExterior;
      const y2 = CY + Math.sin(angulo) * radioExterior;

      marcas.appendChild(
        crearElementoSVG("line", {
          x1, y1, x2, y2,
          stroke: esHoraPrincipal ? "#e5c780" : "#68819a",
          "stroke-width": esHoraPrincipal ? 2 : 1,
          opacity: esHoraPrincipal ? 1 : 0.65
        })
      );

      if (hora % 3 === 0) {
        const radioTexto = 124;
        const tx = CX + Math.cos(angulo) * radioTexto;
        const ty = CY + Math.sin(angulo) * radioTexto + 4;

        const texto = crearElementoSVG("text", {
          x: tx,
          y: ty,
          fill: "#e4d5b4",
          "font-size": 11,
          "text-anchor": "middle"
        });

        texto.textContent = String(hora).padStart(2, "0");
        etiquetas.appendChild(texto);
      }
    }
  }

  function formatoHora(valor) {
    let horas = Math.floor(valor);
    let minutos = Math.round((valor - horas) * 60);

    if (minutos >= 60) {
      horas++;
      minutos = 0;
    }

    return (
      String(horas).padStart(2, "0") +
      ":" +
      String(minutos).padStart(2, "0")
    );
  }

  function actualizarSimulador() {
    if (!controlHora || !textoHora || !sombra) return;

    const hora = Number(controlHora.value);
    textoHora.textContent = formatoHora(hora);

    // Modelo ilustrativo: cambia la dirección y la longitud
    // de la sombra según la hora seleccionada.
    const desplazamiento = hora - 12;
    const angulo = (desplazamiento * 15 - 90) * Math.PI / 180;
    const distancia = 48 + Math.abs(desplazamiento) * 5;

    const finalX = CX + Math.cos(angulo) * distancia;
    const finalY = CY + Math.sin(angulo) * distancia;

    sombra.setAttribute(
      "d",
      `M ${CX} ${CY} L ${finalX} ${finalY}`
    );

    sombra.setAttribute(
      "opacity",
      String(Math.max(0.35, 0.95 - Math.abs(desplazamiento) * 0.045))
    );

    sombra.setAttribute(
      "stroke-width",
      String(Math.max(4, 10 - Math.abs(desplazamiento) * 0.25))
    );
  }

  if (controlHora) {
    controlHora.addEventListener("input", actualizarSimulador);
    actualizarSimulador();
  }

  if (reiniciar && controlHora) {
    reiniciar.addEventListener("click", () => {
      controlHora.value = "12";
      actualizarSimulador();
    });
  }

  // =====================================================
  // 3. BUSCADOR DEL GLOSARIO
  // =====================================================

  const buscador = document.getElementById("buscar-concepto");
  const listaGlosario = document.getElementById("glosario-lista");
  const mensajeVacio = document.getElementById(
    "mensaje-sin-resultados"
  );

  function normalizarTexto(texto) {
    return texto
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  if (buscador && listaGlosario && mensajeVacio) {
    const conceptos = Array.from(
      listaGlosario.querySelectorAll(".concepto")
    );

    buscador.addEventListener("input", () => {
      const consulta = normalizarTexto(buscador.value.trim());
      let encontrados = 0;

      conceptos.forEach((concepto) => {
        const contenido = normalizarTexto(concepto.textContent);
        const coincide = contenido.includes(consulta);

        concepto.hidden = !coincide;

        if (coincide) encontrados++;
      });

      mensajeVacio.hidden = encontrados > 0;
    });
  }

  // =====================================================
  // 4. ANIMACIONES AL DESPLAZARSE
  // =====================================================

  const elementosAnimados = document.querySelectorAll(
    ".tarjeta, .foto-tarjeta, .ciencia-card, " +
    ".panel-gnomon, .evento-historico, .galeria-elemento, " +
    ".concepto, .cita-ciencia"
  );

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
      { threshold: 0.08 }
    );

    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("revelar");
      observador.observe(elemento);
    });
  }

  // =====================================================
  // 5. CONTROL DE LAS 28 FOTOGRAFÍAS
  // =====================================================

  const imagenes = document.querySelectorAll("img");
  let imagenesCargadas = 0;

  imagenes.forEach((imagen) => {
    const marcarCarga = () => {
      imagenesCargadas++;
      imagen.classList.add("imagen-cargada");
    };

    if (imagen.complete && imagen.naturalWidth > 0) {
      marcarCarga();
    } else {
      imagen.addEventListener("load", marcarCarga, { once: true });
    }

    imagen.addEventListener("error", () => {
      imagen.classList.add("imagen-no-disponible");
      imagen.setAttribute(
        "title",
        "No se encontró esta imagen. Revisa su nombre y ubicación."
      );
    }, { once: true });
  });

  // Contar los elementos de la galería.
  const galeria = document.getElementById("galeria-imagenes");
  const contador = document.getElementById("contador-imagenes");

  if (galeria && contador) {
    contador.textContent = String(
      galeria.querySelectorAll(".galeria-elemento").length + 13
    );
  }

  // =====================================================
  // 6. AÑO AUTOMÁTICO DEL PIE DE PÁGINA
  // =====================================================

  const pie = document.querySelector(".pie");

  if (pie) {
    const marcaAnio = document.createElement("p");
    marcaAnio.className = "pie-anio";
    marcaAnio.textContent =
      `© ${new Date().getFullYear()} · Proyecto educativo CBTis No. 4`;

    pie.appendChild(marcaAnio);
  }

  // Activar los estilos que dependen de JavaScript.
  document.documentElement.classList.add("js-activo");

  console.info(
    "Reloj Solar CBTis No. 4: sitio inicializado correctamente."
  );
});
