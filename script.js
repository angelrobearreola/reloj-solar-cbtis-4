
// ================================================
// LUNAR — MOTOR INTERACTIVO
// JavaScript nativo · Sin dependencias
// ================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const moon = document.getElementById("moon");
  const moonShadow = document.getElementById("moonShadow");

  // ----------------------------------------------
  // 1. ANIMACIÓN DE LA LUNA PRINCIPAL
  // ----------------------------------------------

  let rotation = 0;
  let previousTime = 0;

  function animateMoon(time) {
    if (previousTime === 0) previousTime = time;

    const delta = Math.min(time - previousTime, 50);
    previousTime = time;

    rotation = (rotation + delta * 0.004) % 360;

    if (moon) {
      moon.style.setProperty("--moon-rotation", `${rotation}deg`);
    }

    requestAnimationFrame(animateMoon);
  }

  // La textura gira lentamente para simular movimiento.
  if (moon) {
    const texture = moon.querySelector(".moon-texture");

    if (texture) {
      texture.style.animationDuration = "100s";
    }

    requestAnimationFrame(animateMoon);
  }

  // ----------------------------------------------
  // 2. FASES LUNARES INTERACTIVAS
  // ----------------------------------------------

  const phases = [
    {
      name: "Luna nueva",
      description:
        "La cara iluminada mira principalmente hacia el Sol y la cara nocturna hacia la Tierra.",
      emoji: "🌑",
      illumination: 0
    },
    {
      name: "Luna creciente",
      description:
        "Una pequeña franja iluminada empieza a ser visible desde la Tierra.",
      emoji: "🌒",
      illumination: 0.15
    },
    {
      name: "Cuarto creciente",
      description:
        "Vemos aproximadamente la mitad del disco lunar iluminado.",
      emoji: "🌓",
      illumination: 0.5
    },
    {
      name: "Gibosa creciente",
      description:
        "Más de la mitad de la cara visible está iluminada y se aproxima la Luna llena.",
      emoji: "🌔",
      illumination: 0.8
    },
    {
      name: "Luna llena",
      description:
        "La cara lunar orientada hacia la Tierra aparece casi completamente iluminada.",
      emoji: "🌕",
      illumination: 1
    },
    {
      name: "Gibosa menguante",
      description:
        "Después de la Luna llena, la parte iluminada que vemos comienza a disminuir.",
      emoji: "🌖",
      illumination: 0.8
    },
    {
      name: "Cuarto menguante",
      description:
        "Vemos aproximadamente la mitad del disco lunar iluminado, en la etapa menguante.",
      emoji: "🌗",
      illumination: 0.5
    },
    {
      name: "Luna menguante",
      description:
        "Solo queda una franja iluminada antes de comenzar un nuevo ciclo.",
      emoji: "🌘",
      illumination: 0.15
    }
  ];

  const phaseMoon = document.getElementById("phaseMoon");
  const phaseLit = document.getElementById("phaseLit");
  const phaseName = document.getElementById("phaseName");
  const phaseDescription = document.getElementById("phaseDescription");
  const phaseCounter = document.getElementById("phaseCounter");
  const phaseOptions = document.querySelectorAll(".phase-option");
  const prevButton = document.getElementById("prevPhase");
  const nextButton = document.getElementById("nextPhase");

  let currentPhase = 0;

  function renderPhase(index) {
    currentPhase = (index + phases.length) % phases.length;

    const phase = phases[currentPhase];

    if (phaseName) {
      phaseName.textContent = phase.name;
    }

    if (phaseDescription) {
      phaseDescription.textContent = phase.description;
    }

    if (phaseCounter) {
      phaseCounter.textContent =
        `FASE ${String(currentPhase + 1).padStart(2, "0")} / 08`;
    }

    if (phaseMoon) {
      phaseMoon.setAttribute("aria-label", phase.name);
    }

    // Simula la superficie iluminada mediante una elipse.
    // Es una representación didáctica, no una efeméride real.
    if (phaseLit) {
      const isWaxing = currentPhase <= 3;
      const illumination = phase.illumination;

      let width = illumination * 100;
      let position = isWaxing ? 100 : 0;

      if (currentPhase === 0) {
        width = 0;
        position = 50;
      } else if (currentPhase === 4) {
        width = 100;
        position = 50;
      } else if (currentPhase === 2 || currentPhase === 6) {
        width = 50;
        position = 50;
      }

      phaseLit.style.clipPath =
        `ellipse(${width / 2}% 50% at ${position}% 50%)`;

      phaseLit.style.backgroundColor = "#e5e1d5";
    }

    phaseOptions.forEach((option, optionIndex) => {
      const selected = optionIndex === currentPhase;

      option.classList.toggle("active", selected);

      if (selected) {
        option.setAttribute("aria-current", "true");
      } else {
        option.removeAttribute("aria-current");
      }
    });
  }

  phaseOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const index = Number(option.dataset.phase);

      if (Number.isInteger(index) && index >= 0 && index < phases.length) {
        renderPhase(index);
      }
    });
  });

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      renderPhase(currentPhase - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      renderPhase(currentPhase + 1);
    });
  }

  renderPhase(0);

  // ----------------------------------------------
  // 3. CONTROL DE LA SOMBRA DE LA LUNA PRINCIPAL
  // ----------------------------------------------

  if (moonShadow) {
    moonShadow.style.background =
      "linear-gradient(90deg, transparent 20%, #020511 100%)";
  }

  // ----------------------------------------------
  // 4. NAVEGACIÓN SUAVE
  // ----------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

  // ----------------------------------------------
  // 5. REVELAR SECCIONES AL DESPLAZARSE
  // ----------------------------------------------

  const sections = document.querySelectorAll(
    ".fact-card, .story-copy, .story-visual, " +
    ".phase-display, .phase-option, .mission-stats div"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    sections.forEach((section) => {
      section.classList.add("reveal");
      observer.observe(section);
    });
  }

  console.info("LUNAR: experiencia astronómica iniciada.");
});
     
