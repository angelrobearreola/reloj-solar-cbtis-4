```javascript
/* ==========================================================
   RELOJ SOLAR HORIZONTAL · CBTis No. 4
   Motor astronómico e interactividad
   JavaScript nativo · Sin dependencias externas
   ========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ========================================================
  // 1. FUNCIONES MATEMÁTICAS
  // ========================================================

  const RAD = Math.PI / 180;
  const DEG = 180 / Math.PI;

  const rad = grados => grados * RAD;
  const deg = radianes => radianes * DEG;

  const limitar = (valor, minimo, maximo) =>
    Math.min(maximo, Math.max(minimo, valor));

  const normalizar360 = angulo =>
    ((angulo % 360) + 360) % 360;

  function formatoGrados(valor) {
    return Number.isFinite(valor)
      ? `${valor.toFixed(2)}°`
      : "No disponible";
  }

  function formatoHora(horasDecimales) {
    const totalMinutos = Math.round(horasDecimales * 60);
    const normalizado = ((totalMinutos % 1440) + 1440) % 1440;

    const horas = Math.floor(normalizado / 60);
    const minutos = normalizado % 60;

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }

  function direccionCardinal(azimut) {
    const direcciones = [
      "Norte",
      "Noreste",
      "Este",
      "Sureste",
      "Sur",
      "Suroeste",
      "Oeste",
      "Noroeste"
    ];

    return direcciones[
      Math.round(normalizar360(azimut) / 45) % 8
    ];
  }

  // ========================================================
  // 2. MENÚ RESPONSIVO
  // ========================================================

  const botonMenu = document.getElementById("menu-toggle");
  const navegacion = document.getElementById("navegacion");

  function cerrarMenu() {
    if (!botonMenu || !navegacion) return;

    navegacion.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
  }

  if (botonMenu && navegacion) {
    botonMenu.setAttribute("aria-expanded", "false");

    botonMenu.addEventListener("click", () => {
      const abierto = navegacion.classList.toggle("abierto");

      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
      );
    });

    navegacion.querySelectorAll("a").forEach(enlace => {
      enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("keydown", evento => {
      if (evento.key === "Escape") cerrarMenu();
    });

    document.addEventListener("click", evento => {
      if (
        !navegacion.contains(evento.target) &&
        !botonMenu.contains(evento.target)
      ) {
        cerrarMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) cerrarMenu();
    });
  }

  // ========================================================
  // 3. MODELO ASTRONÓMICO
  // ========================================================
  //
  // Aproximación solar basada en el día del año.
  // Declinación en radianes y ecuación del tiempo en minutos.
  // Es un modelo educativo, no un efemérides de alta precisión.
  // ========================================================

  function obtenerDiaDelAnio(fecha) {
    const inicio = Date.UTC(fecha.getUTCFullYear(), 0, 1);
    const actual = Date.UTC(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth(),
      fecha.getUTCDate()
    );

    return Math.floor((actual - inicio) / 86400000) + 1;
  }

  function parametrosSolares(fecha) {
    const dia = obtenerDiaDelAnio(fecha);
    const gamma = 2 * Math.PI / 365 * (dia - 1);

    const declinacion =
      0.006918
      - 0.399912 * Math.cos(gamma)
      + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2 * gamma)
      + 0.000907 * Math.sin(2 * gamma)
      - 0.002697 * Math.cos(3 * gamma)
      + 0.001480 * Math.sin(3 * gamma);

    const ecuacionTiempo =
      229.18 * (
        0.000075
        + 0.001868 * Math.cos(gamma)
        - 0.032077 * Math.sin(gamma)
        - 0.014615 * Math.cos(2 * gamma)
        - 0.040849 * Math.sin(2 * gamma)
      );

    return {
      dia,
      declinacion,
      ecuacionTiempo
    };
  }

  function calcularSol(fecha, horaSolar, latitud, longitud, huso) {
    const parametros = parametrosSolares(fecha);

    const phi = rad(latitud);
    const delta = parametros.declinacion;

    // La hora introducida representa hora solar aparente.
    const anguloHorario = rad(15 * (horaSolar - 12));

    // Altura solar sobre el horizonte.
    const senoAltura =
      Math.sin(phi) * Math.sin(delta)
      + Math.cos(phi) * Math.cos(delta)
      * Math.cos(anguloHorario);

    const altura = Math.asin(limitar(senoAltura, -1, 1));
    const alturaGrados = deg(altura);

    // Azimut: 0° norte, 90° este, 180° sur, 270° oeste.
    const componenteEste =
      -Math.cos(delta) * Math.sin(anguloHorario);

    const componenteNorte =
      Math.cos(phi) * Math.sin(delta)
      - Math.sin(phi) * Math.cos(delta)
      * Math.cos(anguloHorario);

    const azimut = normalizar360(
      deg(Math.atan2(componenteEste, componenteNorte))
    );

    const declinacionGrados = deg(delta);
    const anguloHorarioGrados = deg(anguloHorario);

    // Longitud relativa de la sombra:
    // L / H = 1 / tan(altura solar).
    const sombraRelativa = alturaGrados > 0.01
      ? 1 / Math.tan(altura)
      : null;

    const azimutSombra = normalizar360(azimut + 180);

    // Conversión aproximada a hora civil.
    // Longitud oeste negativa; huso UTC-6 representado como -6.
    const horaSolarMedia =
      horaSolar - parametros.ecuacionTiempo / 60;

    const horaUTC = horaSolarMedia - longitud / 15;
    const horaCivil = horaUTC + huso;

    return {
      dia: parametros.dia,
      altura: alturaGrados,
      azimut,
      declinacion: declinacionGrados,
      anguloHorario: anguloHorarioGrados,
      sombraRelativa,
      azimutSombra,
      ecuacionTiempo: parametros.ecuacionTiempo,
      horaCivil
    };
  }

  // ========================================================
  // 4. ELEMENTOS DE LA CALCULADORA
  // ========================================================

  const formulario = document.getElementById("formulario-solar");
  const campoFecha = document.getElementById("fecha-solar");
  const campoHora = document.getElementById("hora-solar");
  const valorHora = document.getElementById("hora-solar-valor");
  const campoLatitud = document.getElementById("latitud-solar");
  const campoLongitud = document.getElementById("longitud-solar");
  const campoZona = document.getElementById("zona-horaria");

  const salidaAltura = document.getElementById("resultado-altura");
  const salidaAzimut = document.getElementById("resultado-azimut");
  const salidaDeclinacion =
    document.getElementById("resultado-declinacion");
  const salidaHorario = document.getElementById("resultado-horario");
  const salidaSombra = document.getElementById("resultado-sombra");
  const salidaCivil = document.getElementById("resultado-civil");
  const salidaDireccion =
    document.getElementById("resultado-direccion");
  const diagrama = document.getElementById("diagrama-sombra");
  const salidaFormulas =
    document.getElementById("formulas-utilizadas");

  function actualizarEtiquetaHora() {
    if (!campoHora || !valorHora) return;

    valorHora.textContent = formatoHora(Number(campoHora.value));
  }

  function dibujarSombra(altura, azimutSombra) {
    if (!diagrama) return;

    diagrama.replaceChildren();

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    svg.setAttribute("viewBox", "0 0 320 220");
    svg.setAttribute("width", "100%");
    svg.setAttribute("role", "img");
    svg.setAttribute(
      "aria-label",
      "Orientación aproximada de la sombra sobre el plano horizontal"
    );

    const agregar = (nombre, atributos, texto) => {
      const elemento = document.createElementNS(svgNS, nombre);

      Object.entries(atributos).forEach(([clave, valor]) => {
        elemento.setAttribute(clave, String(valor));
      });

      if (texto !== undefined) elemento.textContent = texto;

      svg.appendChild(elemento);
      return elemento;
    };

    agregar("circle", {
      cx: 160,
      cy: 110,
      r: 76,
      fill: "rgba(7,21,46,0.85)",
      stroke: "rgba(232,199,120,0.55)",
      "stroke-width": 1.5
    });

    [
      { texto: "N", x: 160, y: 22 },
      { texto: "E", x: 253, y: 115 },
      { texto: "S", x: 160, y: 204 },
      { texto: "O", x: 67, y: 115 }
    ].forEach(p => {
      agregar("text", {
        x: p.x,
        y: p.y,
        fill: "#fff0bd",
        "font-size": 13,
        "font-weight": 700,
        "text-anchor": "middle"
      }, p.texto);
    });

    const longitudVisual = altura > 0
      ? limitar(25 + 12 / Math.tan(rad(altura)), 25, 65)
      : 65;

    const angulo = rad(azimutSombra);
    const x = 160 + Math.sin(angulo) * longitudVisual;
    const y = 110 - Math.cos(angulo) * longitudVisual;

    agregar("line", {
      x1: 160,
      y1: 110,
      x2: x,
      y2: y,
      stroke: "#e8c778",
      "stroke-width": 5,
      "stroke-linecap": "round"
    });

    agregar("circle", {
      cx: 160,
      cy: 110,
      r: 6,
      fill: "#ffffff"
    });

    diagrama.appendChild(svg);

    const leyenda = document.createElement("small");
    leyenda.textContent =
      `Sombra hacia el ${direccionCardinal(azimutSombra)} ` +
      `(${azimutSombra.toFixed(1)}°).`;

    diagrama.appendChild(leyenda);
  }

  function calcularYMostrar(evento) {
    if (evento) evento.preventDefault();
    if (!formulario) return;

    if (!formulario.reportValidity()) return;

    const [anio, mes, dia] = campoFecha.value.split("-").map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));

    const hora = Number(campoHora.value);
    const latitud = Number(campoLatitud.value);
    const longitud = Number(campoLongitud.value);
    const huso = Number(campoZona.value);

    if (
      !Number.isFinite(fecha.getTime()) ||
      !Number.isFinite(hora) ||
      !Number.isFinite(latitud) ||
      !Number.isFinite(longitud) ||
      !Number.isFinite(huso) ||
      latitud < -90 || latitud > 90 ||
      longitud < -180 || longitud > 180 ||
      huso < -12 || huso > 14 ||
      hora < 0 || hora >= 24
    ) {
      if (salidaDireccion) {
        salidaDireccion.textContent =
          "Verifica los valores introducidos.";
      }
      return;
    }

    const r = calcularSol(fecha, hora, latitud, longitud, huso);

    if (salidaAltura) salidaAltura.textContent = formatoGrados(r.altura);
    if (salidaAzimut) salidaAzimut.textContent = formatoGrados(r.azimut);
    if (salidaDeclinacion) {
      salidaDeclinacion.textContent = formatoGrados(r.declinacion);
    }
    if (salidaHorario) {
      salidaHorario.textContent = formatoGrados(r.anguloHorario);
    }

    if (salidaSombra) {
      salidaSombra.textContent = r.sombraRelativa === null
        ? "Sin sombra solar directa calculable"
        : `${r.sombraRelativa.toFixed(3)} × altura del gnomon`;
    }

    if (salidaCivil) {
      salidaCivil.textContent = `${formatoHora(r.horaCivil)} aprox.`;
    }

    if (salidaDireccion) {
      salidaDireccion.textContent = r.altura <= 0
        ? "El Sol está en el horizonte o debajo de él."
        : `Sol hacia el ${direccionCardinal(r.azimut)}; ` +
          `sombra hacia el ${direccionCardinal(r.azimutSombra)}.`;
    }

    dibujarSombra(r.altura, r.azimutSombra);

    if (salidaFormulas) {
      salidaFormulas.textContent =
        `Día del año: ${r.dia}. ` +
        `Declinación solar: ${r.declinacion.toFixed(3)}°. ` +
        `Ecuación del tiempo: ${r.ecuacionTiempo.toFixed(2)} minutos. ` +
        `Altura solar: sin(h) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(H). ` +
        `Relación de sombra: L/H = 1/tan(h), cuando h > 0°.`;
    }
  }

  if (campoHora) {
    campoHora.addEventListener("input", actualizarEtiquetaHora);
  }

  if (formulario) {
    formulario.addEventListener("submit", calcularYMostrar);

    formulario.addEventListener("reset", () => {
      window.setTimeout(() => {
        actualizarEtiquetaHora();
        calcularYMostrar();
      }, 0);
    });
  }

  // Establecer fecha de hoy si el campo está vacío.
  if (campoFecha && !campoFecha.value) {
    const hoy = new Date();

    campoFecha.value = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, "0"),
      String(hoy.getDate()).padStart(2, "0")
    ].join("-");
  }

  actualizarEtiquetaHora();

  // ========================================================
  // 5. BUSCADOR DEL GLOSARIO
  // ========================================================

  const buscador = document.getElementById("buscar-concepto");
  const conceptos = document.querySelectorAll(".concepto");
  const contenedorGlosario = document.getElementById("glosario-lista");

  function normalizarTexto(texto) {
    return texto
      .toLocaleLowerCase("es-MX")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  if (buscador) {
    const sinResultados = document.createElement("p");

    sinResultados.className = "texto-largo";
    sinResultados.textContent =
      "No se encontraron conceptos con esa búsqueda.";
    sinResultados.hidden = true;

    if (contenedorGlosario) {
      contenedorGlosario.insertAdjacentElement(
        "afterend",
        sinResultados
      );
    }

    buscador.addEventListener("input", () => {
      const consulta = normalizarTexto(buscador.value);
      let encontrados = 0;

      conceptos.forEach(concepto => {
        const coincide = normalizarTexto(
          concepto.textContent
        ).includes(consulta);

        concepto.hidden = !coincide;

        if (coincide) encontrados++;
      });

      sinResultados.hidden = encontrados > 0;
    });
  }

  // ========================================================
  // 6. INICIALIZACIÓN
  // ========================================================

  // La calculadora muestra resultados al cargar la página,
  // sin que el usuario tenga que pulsar el botón primero.
  if (formulario) {
    calcularYMostrar();
  }

  console.info(
    "Reloj Solar Horizontal CBTis No. 4: JavaScript iniciado."
  );

});
```
