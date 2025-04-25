document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript cargado correctamente!");

    const formulario = document.querySelector("#multiStepForm");
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

    // ACTUALIZAR BARRA DE PROGRESO

    function updateProgressBar(currentStep) {
        const steps = document.querySelectorAll(".progress-step");
        const line = document.querySelector(".progress-line");
        const progressBar = document.querySelector(".progressbar");
    
        steps.forEach((step, index) => {
            step.classList.remove("progress-step-active", "completed");
    
            if (index < currentStep - 1) {
                step.classList.add("completed");
            } else if (index === currentStep - 1) {
                step.classList.add("progress-step-active");
            }
        });
    
        if (line && progressBar) {
            const totalSteps = steps.length;
            const distanceBetweenSteps = steps[1].offsetLeft - steps[0].offsetLeft;
    
            const newWidth = distanceBetweenSteps * (currentStep - 1);
            line.style.width = `${newWidth}px`;
        }
    }
    

    

    // NAVEGACION SIGUIENTE
    document.querySelectorAll(".btn-next").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // NAVEGACION ANTEIOR
    document.querySelectorAll(".btn-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // MOSTRAR EL PRIMER PASO
    showStep(currentStep);

    // ENVIO DEL FORMULARIO AL BACKEND
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

    // TRANSPARENT NAVBAR AL HACER SCROLL
    const navEl = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY >= 100) {
            navEl.classList.remove("bg-transparent");
        } else {
            navEl.classList.add("bg-transparent");
        }
    });
});