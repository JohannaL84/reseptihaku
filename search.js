document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');

    // Mock-tietokanta avoimista resepteistä
    const openSourceRecipes = [
        { 
            title: 'Kasvispasta', 
            description: 'Herkullinen kasvispasta, jossa on paljon kasviksia.', 
            ingredients: ['pasta', 'kasvikset'], 
            link: 'https://www.example.com/kasvispasta',
            external: true
        },
        { 
            title: 'Tomaattikeitto', 
            description: 'Täyteläinen tomaattikeitto kermalla.', 
            ingredients: ['tomaatti', 'kerma'], 
            link: 'https://www.example.com/tomaattikeitto',
            external: true
        }
    ];

    // Haetaan tallennetut käyttäjän reseptit localStoragesta
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const userRecipes = loggedInUser.savedRecipes || [];

    // Hakutoiminto
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (!query) {
            resultsContainer.innerHTML = '<p>Anna hakusana.</p>';
            return;
        }

        // Suodatetaan hakutulokset
        const matchedUserRecipes = userRecipes.filter(recipe => recipe.name.toLowerCase().includes(query));
        const matchedOpenSourceRecipes = openSourceRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query) || 
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
        );

        const allResults = [...matchedUserRecipes, ...matchedOpenSourceRecipes];

        // Näytetään tulokset
        if (allResults.length === 0) {
            resultsContainer.innerHTML = '<p>Ei löytynyt reseptejä hakusanalla.</p>';
        } else {
            allResults.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe-card');
                recipeElement.innerHTML = `
                    <h3>${recipe.name || recipe.title}</h3>
                    <p>${recipe.description || 'Ei kuvausta saatavilla.'}</p>
                    <p><strong>Ainekset:</strong> ${recipe.ingredients ? recipe.ingredients.join(', ') : 'Ei aineksia määritelty.'}</p>
                `;

                // Lisätään klikkaustoiminto kortille
                recipeElement.addEventListener('click', function() {
                    if (recipe.external) {
                        // Ulkoinen resepti - avaa linkki uuteen ikkunaan
                        window.open(recipe.link, '_blank');
                    } else {
                        // Sisäinen resepti - ohjaa reseptisivulle
                        localStorage.setItem('currentRecipe', JSON.stringify(recipe));
                        window.location.href = 'resepti.html';
                    }
                });

                resultsContainer.appendChild(recipeElement);
            });
        }
    });
});
