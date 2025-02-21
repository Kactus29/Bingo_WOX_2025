document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("bingoGrid");
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

    const confirmYes = deletePopup.querySelector("#confirmYes");
    const confirmNo = deletePopup.querySelector("#confirmNo");

    // Create edit popup
    const editPopup = document.createElement("div");
    editPopup.classList.add("edit-popup");
    editPopup.innerHTML = `
        <input type="text" id="editPhraseInput">
        <button id="editConfirmYes">Valider</button>
        <button id="editConfirmNo">Annuler</button>
    `;
    document.body.appendChild(editPopup);

    const editPhraseInput = editPopup.querySelector("#editPhraseInput");
    const editConfirmYes = editPopup.querySelector("#editConfirmYes");
    const editConfirmNo = editPopup.querySelector("#editConfirmNo");

    const fetchPhrases = () => {
        const phrases = localStorage.getItem('phrases');
        return phrases ? JSON.parse(phrases) : [];
    };

    const savePhrases = (phrases) => {
        localStorage.setItem('phrases', JSON.stringify(phrases));
    };

    const renderGrid = () => {
        const phrases = fetchPhrases();
        grid.innerHTML = '';
        const size = Math.ceil(Math.sqrt(phrases.length));
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

        phrases.forEach((phrase, index) => {
            const cell = document.createElement("div");
            cell.classList.add("bingo-cell");
            cell.textContent = phrase.text;

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
                    savePhrases(phrases);
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
                editPhraseInput.value = phrase.text;
                editPopup.style.display = "block";
                editConfirmYes.onclick = () => {
                    phrases[index].text = editPhraseInput.value;
                    savePhrases(phrases);
                    renderGrid();
                    editPopup.style.display = "none";
                };
                editConfirmNo.onclick = () => {
                    editPopup.style.display = "none";
                };
            });

            // Vérifier si cette case était déjà cochée
            if (phrase.checked) {
                cell.classList.add("checked");
            }

            // Ajouter l'événement de clic
            cell.addEventListener("click", () => {
                phrase.checked = !phrase.checked;
                savePhrases(phrases);
                cell.classList.toggle("checked");
            });

            grid.appendChild(cell);
        });
    };

    addPhraseButton.addEventListener("click", () => {
        const newPhrase = newPhraseInput.value.trim();
        if (newPhrase) {
            const phrases = fetchPhrases();
            phrases.push({ text: newPhrase, checked: false });
            savePhrases(phrases);
            renderGrid();
            newPhraseInput.value = '';
        }
    });

    renderGrid();
});