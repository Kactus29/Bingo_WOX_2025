document.addEventListener("DOMContentLoaded", () => {
    let phrases = JSON.parse(localStorage.getItem("phrases")) || [
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
    const newPhraseInput = document.getElementById("newPhrase");
    const addPhraseButton = document.getElementById("addPhraseButton");

    // Create popup
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <p>Voulez-vous vraiment supprimer cette phrase ?</p>
        <button id="confirmYes">Oui</button>
        <button id="confirmNo">Non</button>
    `;
    document.body.appendChild(popup);

    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    const renderGrid = () => {
        grid.innerHTML = '';
        const size = Math.ceil(Math.sqrt(phrases.length));
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        phrases.forEach((phrase, index) => {
            const cell = document.createElement("div");
            cell.classList.add("bingo-cell");
            cell.textContent = phrase;

            // Add delete button
            const deleteButton = document.createElement("div");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "✖";
            cell.appendChild(deleteButton);

            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation();
                popup.style.display = "block";
                confirmYes.onclick = () => {
                    phrases.splice(index, 1);
                    localStorage.setItem("phrases", JSON.stringify(phrases));
                    renderGrid();
                    popup.style.display = "none";
                };
                confirmNo.onclick = () => {
                    popup.style.display = "none";
                };
            });

            // Vérifier si cette case était déjà cochée
            const savedState = JSON.parse(localStorage.getItem("bingoState")) || [];
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
    };

    addPhraseButton.addEventListener("click", () => {
        const newPhrase = newPhraseInput.value.trim();
        if (newPhrase) {
            phrases.push(newPhrase);
            localStorage.setItem("phrases", JSON.stringify(phrases));
            renderGrid();
            newPhraseInput.value = '';
        }
    });

    renderGrid();

    // Réinitialiser le bingo
    resetButton.addEventListener("click", () => {
        document.querySelectorAll(".bingo-cell").forEach(cell => cell.classList.remove("checked"));
        localStorage.removeItem("bingoState");
    });
});
