/* =========================================
   RELOJ SOLAR CBTis No. 4
   JavaScript nativo, sin dependencias
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // 1. ELEMENTOS DEL SIMULADOR
  const controlHora = document.getElementById("hora");
  const valorHora = document.getElementById("valor-hora");
  const sombra = document.getElementById("sombra");
  const reloj = document.querySelector(".reloj");
  const gnomon = document.querySelector(".gnomon");

  // 2. SIMULADOR DE HORA SOLAR
  function actualizarSimulador() {
    if (!controlHora || !valorHora || !sombra) return;

    const hora = Number(controlHora.value);
    if (!Number.isFinite(hora)) return;

    const horas = Math.floor(hora);
    const minutos = Math.round((hora - horas) * 60);

    const horaFormateada =
      String(horas).padStart(2, "0") +
      ":" +
      String(minutos).padStart(2, "0");

    valorHora.textContent = horaFormateada;

    // Modelo visual ilustrativo, no astronómico.
    const desviacion = hora - 12;
    const angulo = desviacion * 15;
    const distanciaMediodia = Math.abs(desviacion);
    const longitud = 12 + distanciaMediodia * 3;

    sombra.style.height = `${Math.min(longitud, 34)}%`;
    sombra.style.transform =
      `translate(-50%, 0) rotate(${angulo}deg)`;

    sombra.setAttribute(
      "aria-label",
      `Sombra ilustrativa a las ${horaFormateada}`
    );

    controlHora.setAttribute("aria-valuetext", horaFormateada);

    if (reloj) {
      reloj.setAttribute(
        "aria-label",
        `Simulador ilustrativo. Hora: ${horaFormateada}`
      );
    }

    if (gnomon) {
      gnomon.setAttribute(
        "aria-label",
        "Gnomon del reloj solar"
      );
    }
  }

  if (controlHora) {
    controlHora.addEventListener("input", actualizarSimulador);
    controlHora.addEventListener("change", actualizarSimulador);
  }

  actualizarSimulador();

  // 3. NAVEGACIÓN SUAVE
  const enlacesNavegacion = document.querySelectorAll(
    '.encabezado nav a[href^="#"], a.boton[href^="#"]'
  );

  enlacesNavegacion.forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destinoId = enlace.getAttribute("href");
      if (!destinoId || destinoId === "#") return;

      const destino = document.querySelector(destinoId);
      if (!destino) return;

      evento.preventDefault();

      destino.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", destinoId);
      }
    });
  });

  // 4. RESALTAR LA SECCIÓN ACTUAL EN EL MENÚ
  const secciones = document.querySelectorAll(
    "#inicio, #historia, #ciencia, #simulador"
  );

  const enlacesPorDestino = new Map();

  enlacesNavegacion.forEach((enlace) => {
    const destino = enlace.getAttribute("href");

    if (destino && destino.startsWith("#")) {
      enlacesPorDestino.set(destino.slice(1), enlace);
    }
  });

  if ("IntersectionObserver" in window && secciones.length > 0) {
    const observadorSecciones = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;

          enlacesPorDestino.forEach((enlace) => {
            enlace.classList.remove("activo");
            enlace.removeAttribute("aria-current");
          });

          const enlaceActual = enlacesPorDestino.get(
            entrada.target.id
          );

          if (enlaceActual) {
            enlaceActual.classList.add("activo");
            enlaceActual.setAttribute("aria-current", "location");
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    secciones.forEach((seccion) => {
      observadorSecciones.observe(seccion);
    });
  }

  // 5. ANIMACIONES DE APARICIÓN
  const elementosAnimados = document.querySelectorAll(
    ".seccion, .tarjeta"
  );

  const movimientoReducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    !movimientoReducido &&
    "IntersectionObserver" in window
  ) {
    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("revelar-pendiente");
    });

    const observadorAnimaciones = new IntersectionObserver(
      (entradas, observador) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;

          entrada.target.classList.add("visible");
          entrada.target.classList.remove("revelar-pendiente");
          observador.unobserve(entrada.target);
        });
      },
      { threshold: 0.12 }
    );

    elementosAnimados.forEach((elemento) => {
      observadorAnimaciones.observe(elemento);
    });
  } else {
    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("visible");
    });
  }

  // 6. BOTONES CON ATRIBUTO data-destino
  document.querySelectorAll("[data-destino]").forEach((boton) => {
    boton.addEventListener("click", () => {
      const idDestino = boton.dataset.destino;
      const destino = idDestino
        ? document.getElementById(idDestino)
        : null;

      if (destino) {
        destino.scrollIntoView({
          behavior: movimientoReducido ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // 7. PREGUNTAS FRECUENTES
  const preguntas = document.querySelectorAll(
    ".pregunta-frecuente details, .faq details"
  );

  preguntas.forEach((pregunta) => {
    pregunta.addEventListener("toggle", () => {
      if (!pregunta.open) return;

      preguntas.forEach((otraPregunta) => {
        if (
          otraPregunta !== pregunta &&
          otraPregunta.parentElement === pregunta.parentElement
        ) {
          otraPregunta.open = false;
        }
      });
    });
  });

  // 8. AÑO AUTOMÁTICO
  document.querySelectorAll(
    "#anio-actual, [data-anio-actual]"
  ).forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
  });

  // 9. BOTÓN PARA VOLVER ARRIBA
  const botonArriba = document.querySelector(
    "#volver-arriba, .volver-arriba"
  );

  if (botonArriba) {
    const actualizarBotonArriba = () => {
      botonArriba.hidden = window.scrollY < 350;
    };

    window.addEventListener(
      "scroll",
      actualizarBotonArriba,
      { passive: true }
    );

    actualizarBotonArriba();

    botonArriba.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: movimientoReducido ? "auto" : "smooth"
      });
    });
  }

  console.info(
    "Reloj Solar CBTis No. 4: JavaScript cargado correctamente."
  );
});