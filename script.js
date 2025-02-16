document.addEventListener("DOMContentLoaded", () => {
    const phrases = [
        "Cyrielle va se coucher tôt 😴",
        "Quelqu'un dit que c'était mieux avant (hors 3A)",
        "On est à court d'alcool 🍻",
        "Des gens se pécho 🥰",
        "Des gens dansent le rock (stop svp 😭)",
        "JB lance un coin-coin 🦆",
        "Quelqu'un fait une ref au sel 🧂",
        "Dorian dit 'Bon appétit' 🍽️",
        "Un rubik's cube apparait 🧩",
        "Quelqu'un finit au sol 🤕",
        "Quelqu'un se perd en randonnée 🌲"
    ];

    const grid = document.getElementById("bingoGrid");
    const resetButton = document.getElementById("resetButton");

    // Déterminer le nombre de colonnes (racine carrée arrondie)
    const size = Math.ceil(Math.sqrt(phrases.length));
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

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
