document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');

    // Mock-tietokanta avoimista resepteistä
    const openSourceRecipes = [
        { title: 'Kasvispasta', description: 'Herkullinen kasvispasta.', ingredients: ['pasta', 'kasvikset'] },
        { title: 'Tomaattikeitto', description: 'Täyteläinen tomaattikeitto.', ingredients: ['tomaatti', 'kerma'] }
    ];

    // Hakutoiminto
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (!query) {
            resultsContainer.innerHTML = '<p>Anna hakusana.</p>';
            return;
        }

        // Hae käyttäjän tallentamat reseptit localStoragesta
        const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || [];
        const matchedUserRecipes = userRecipes.filter(recipe => recipe.title.toLowerCase().includes(query));

        // Hae avoimet reseptit
        const matchedOpenSourceRecipes = openSourceRecipes.filter(recipe => recipe.title.toLowerCase().includes(query));

        // Näytä hakutulokset
        const allResults = [...matchedUserRecipes, ...matchedOpenSourceRecipes];
        if (allResults.length === 0) {
            resultsContainer.innerHTML = '<p>Ei löytynyt reseptejä hakusanalla.</p>';
        } else {
            allResults.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe-card');
                recipeElement.innerHTML = `
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description}</p>
                    <p><strong>Ainekset:</strong> ${recipe.ingredients.join(', ')}</p>
                `;
                resultsContainer.appendChild(recipeElement);
            });
        }
    });
});
