document.addEventListener("DOMContentLoaded", () => {
    const phrases = [
        "Quelqu'un arrive en retard ⏳",
        "Une blague pourrie est racontée 🤡",
        "Quelqu'un casse un verre 🍷💥",
        "Une référence à un vieux souvenir 📸",
        "Quelqu'un chante faux 🎤",
        "Le GPS nous perd 🗺️",
        "Un débat inutile démarre 🤔",
        "Quelqu'un s'endort en premier 🛏️",
        "Quelqu'un oublie un truc essentiel 🎒"
    ];

    const grid = document.getElementById("bingoGrid");
    const resetButton = document.getElementById("resetButton");

    // Charger l'état des cases cochées
    const savedState = JSON.parse(localStorage.getItem("bingoState")) || [];

    // Générer les cases dynamiquement
    phrases.forEach((phrase, index) => {
        const cell = document.createElement("div");
        cell.classList.add("bingo-cell");
        cell.textContent = phrase;

        // Vérifier si cette case était déjà cochée
        if (savedState.includes(index)) {
            cell.classList.add("checked");
        }

        // Ajouter l'événement de clic
        cell.addEventListener("click", () => {
            cell.classList.toggle("checked");

            // Sauvegarder l'état dans localStorage
            const checkedCells = document.querySelectorAll(".bingo-cell.checked");
            const checkedIndexes = [...checkedCells].map(cell => [...grid.children].indexOf(cell));
            localStorage.setItem("bingoState", JSON.stringify(checkedIndexes));
        });

        grid.appendChild(cell);
    });

    // Réinitialiser le bingo
    resetButton.addEventListener("click", () => {
        document.querySelectorAll(".bingo-cell").forEach(cell => cell.classList.remove("checked"));
        localStorage.removeItem("bingoState");
    });
});
