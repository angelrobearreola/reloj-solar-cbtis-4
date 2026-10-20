
"use strict";

// Menú de navegación para celulares
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      menuToggle.textContent = "☰";
    });
  });
}

// Año automático en el pie de página
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Colocar la fecha actual como fecha inicial
const dateInput = document.getElementById("solarDate");

if (dateInput) {
  const now = new Date();
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");

  dateInput.value = localDate;
}

// Calculadora educativa de tiempo solar
const solarForm = document.getElementById("solarForm");
const solarResult = document.getElementById("solarResult");

function calcularEcuacionDelTiempo(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayNumber = Math.floor(
    (date - startOfYear) / (24 * 60 * 60 * 1000)
  );

  const B = (2 * Math.PI * (dayNumber - 81)) / 364;

  // Aproximación de la ecuación del tiempo, en minutos
  return (
    9.87 * Math.sin(2 * B) -
    7.53 * Math.cos(B) -
    1.5 * Math.sin(B)
  );
}

function formatearHora(totalMinutos) {
  const minutesInDay = 24 * 60;

  // Mantener la hora dentro del rango de un día
  const normalized = ((totalMinutos % minutesInDay) + minutesInDay)
    % minutesInDay;

  const hours = Math.floor(normalized / 60);
  const minutes = Math.floor(normalized % 60);

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0")
  );
}

if (solarForm && solarResult) {
  solarForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const timeValue = document.getElementById("civilTime").value;
    const dateValue = document.getElementById("solarDate").value;
    const longitude = Number(
      document.getElementById("longitude").value
    );
    const meridian = Number(
      document.getElementById("meridian").value
    );

    if (
      !timeValue ||
      !dateValue ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(meridian) ||
      longitude < -180 ||
      longitude > 180 ||
      meridian < -180 ||
      meridian > 180
    ) {
      solarResult.textContent =
        "Revisa la fecha, la hora y las longitudes ingresadas.";
      return;
    }

    const [hours, minutes] = timeValue.split(":").map(Number);
    const civilMinutes = hours * 60 + minutes;

    // Crear una fecha local para obtener el día del año
    const [year, month, day] = dateValue.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day, 12);

    // Corrección geográfica en minutos.
    // Longitudes al este son positivas; al oeste, negativas.
    const longitudeCorrection = 4 * (longitude - meridian);

    const equationOfTime = calcularEcuacionDelTiempo(selectedDate);

    const totalCorrection =
      longitudeCorrection + equationOfTime;

    const solarMeanMinutes = civilMinutes + longitudeCorrection;
    const apparentSolarMinutes =
      civilMinutes + totalCorrection;

    const sign = totalCorrection >= 0 ? "+" : "−";

    solarResult.textContent =
      "Hora solar media aproximada: " +
      formatearHora(solarMeanMinutes) +
      ". Hora solar aparente aproximada: " +
      formatearHora(apparentSolarMinutes) +
      ". Corrección total estimada: " +
      sign +
      Math.abs(totalCorrection).toFixed(1) +
      " minutos respecto de la hora civil ingresada.";
  });
    }
     
