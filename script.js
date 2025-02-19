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

    // Create delete popup
    const deletePopup = document.createElement("div");
    deletePopup.classList.add("popup");
    deletePopup.innerHTML = `
        <p>Voulez-vous vraiment supprimer cette phrase ?</p>
        <button id="confirmYes">Oui</button>
        <button id="confirmNo">Non</button>
    `;
    document.body.appendChild(deletePopup);

    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    // Create edit popup
    const editPopup = document.createElement("div");
    editPopup.classList.add("edit-popup");
    editPopup.innerHTML = `
        <input type="text" id="editPhraseInput">
        <button id="editConfirmYes">Valider</button>
        <button id="editConfirmNo">Annuler</button>
    `;
    document.body.appendChild(editPopup);

    const editPhraseInput = document.getElementById("editPhraseInput");
    const editConfirmYes = document.getElementById("editConfirmYes");
    const editConfirmNo = document.getElementById("editConfirmNo");

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
                deletePopup.style.display = "block";
                confirmYes.onclick = () => {
                    phrases.splice(index, 1);
                    localStorage.setItem("phrases", JSON.stringify(phrases));
                    renderGrid();
                    deletePopup.style.display = "none";
                };
                confirmNo.onclick = () => {
                    deletePopup.style.display = "none";
                };
            });

            // Add edit button
            const editButton = document.createElement("div");
            editButton.classList.add("edit-button");
            editButton.textContent = "🛠";
            cell.appendChild(editButton);

            editButton.addEventListener("click", (e) => {
                e.stopPropagation();
                editPhraseInput.value = phrase;
                editPopup.style.display = "block";
                editConfirmYes.onclick = () => {
                    phrases[index] = editPhraseInput.value;
                    localStorage.setItem("phrases", JSON.stringify(phrases));
                    renderGrid();
                    editPopup.style.display = "none";
                };
                editConfirmNo.onclick = () => {
                    editPopup.style.display = "none";
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
