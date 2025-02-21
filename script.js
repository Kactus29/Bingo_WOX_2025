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

    const fetchPhrases = async () => {
        const response = await fetch('phrases.json');
        const phrases = await response.json();
        return phrases;
    };

    const savePhrases = async (phrases) => {
        const token = 'YOUR_GITHUB_TOKEN'; // Remplacez par votre token GitHub
        const repo = 'YOUR_GITHUB_REPO'; // Remplacez par votre dépôt GitHub
        const path = 'phrases.json';
        const message = 'Update phrases.json';
        const content = btoa(JSON.stringify(phrases, null, 2));

        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: content,
                sha: await getFileSha(repo, path, token)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update phrases.json');
        }
    };

    const getFileSha = async (repo, path, token) => {
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get file SHA');
        }

        const data = await response.json();
        return data.sha;
    };

    const renderGrid = async () => {
        const phrases = await fetchPhrases();
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
                confirmYes.onclick = async () => {
                    phrases.splice(index, 1);
                    await savePhrases(phrases);
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
                editConfirmYes.onclick = async () => {
                    phrases[index].text = editPhraseInput.value;
                    await savePhrases(phrases);
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
            cell.addEventListener("click", async () => {
                phrase.checked = !phrase.checked;
                await savePhrases(phrases);
                cell.classList.toggle("checked");
            });

            grid.appendChild(cell);
        });
    };

    addPhraseButton.addEventListener("click", async () => {
        const newPhrase = newPhraseInput.value.trim();
        if (newPhrase) {
            const phrases = await fetchPhrases();
            phrases.push({ text: newPhrase, checked: false });
            await savePhrases(phrases);
            renderGrid();
            newPhraseInput.value = '';
        }
    });

    renderGrid();
});
