document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript cargado correctamente!");

    // Capturar el formulario
    const formulario = document.querySelector("form");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que la página se recargue

        // Capturar los valores de los inputs
        const nombre = document.getElementById("name").value;
        const telefono = document.getElementById("phone").value;
        const email = document.getElementById("email").value;

        const datos = { nombre, telefono, email };

        fetch("http://localhost:5000/guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            formulario.reset(); 
            window.location.href = "success.html";
    })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al enviar el formulario");
        });
    });


    // Tranparentar Navabr cuando hay scrolling

    const NavEl = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {

        if (window.scrollY >= 100) {
            NavEl.classList.remove ('bg-transparent');
        } else if (window.screenY < 100) {
            NavEl.classList.add ('bg-transparent')
        }
    })

});

