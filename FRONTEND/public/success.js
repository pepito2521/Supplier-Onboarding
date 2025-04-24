document.addEventListener("DOMContentLoaded", () => {
    console.log("Página de éxito cargada");

    const btnVolver = document.getElementById("btnVolver");
    if (btnVolver) {
        btnVolver.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});