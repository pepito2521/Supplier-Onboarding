document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript cargado correctamente!");

    const formulario = document.querySelector("form");
    const totalSteps = 4;
    let currentStep = 1;

    // Mostrar el paso actual
    function showStep(step) {
        const steps = document.querySelectorAll(".form-step");
        steps.forEach((stepDiv, index) => {
            stepDiv.style.display = (index === step - 1) ? "block" : "none";
        });
        updateProgressBar(step);
    }

    // Actualizar barra de progreso
    function updateProgressBar(step) {
        const steps = document.querySelectorAll(".progress-step");
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add("progress-step-active");
            } else {
                stepEl.classList.remove("progress-step-active");
            }
        });
    }

    // Navegación siguiente
    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Navegación anterior
    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Mostrar el primer paso
    showStep(currentStep);

    // Envío del formulario
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(formulario);

        fetch("/guardar", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            formulario.reset();
            window.location.href = "success.html";
        })
        .catch(error => {
            console.error("Error al enviar el formulario:", error);
            alert("Hubo un problema al enviar el formulario");
        });
    });

    // Transparencia de la navbar al hacer scroll
    const navEl = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY >= 100) {
            navEl.classList.remove("bg-transparent");
        } else {
            navEl.classList.add("bg-transparent");
        }
    });

    // Botón volver al inicio
    const btnVolver = document.getElementById("btnVolver");
    if (btnVolver) {
        btnVolver.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});
