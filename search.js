document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');

    const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
    const API_KEY = 'd451e3d4e29b4796b9fa627c0c18a6ff';

    const translationDictionary = {
        'kana': 'chicken',
        'kala': 'fish',
        'liha': 'meat',
        'sieni': 'mushroom',
        'peruna': 'potato',
        'maito': 'milk',
        'pasta': 'pasta'
    };

    const systemRecipes = [
        { name: 'Kasvispasta', description: 'Herkullinen kasvispasta.', ingredients: ['pasta', 'kasvikset'], link: 'resepti.html?id=1', external: false },
        { name: 'Marjapiirakka', description: 'Maukas piirakka tuoreista marjoista.', ingredients: ['marjat', 'taikina'], link: 'resepti.html?id=2', external: false }
    ];

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const userRecipes = loggedInUser.savedRecipes || [];

    searchButton.addEventListener('click', function() {
        let query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (!query) {
            resultsContainer.innerHTML = '<p class="results-message">Kokeile hakea uudestaan kirjoittamalla hakusana.</p>';
            return;
        }

        if (translationDictionary[query]) query = translationDictionary[query];

        const matchedUserRecipes = userRecipes.filter(recipe => recipe.name.toLowerCase().includes(query));
        const matchedSystemRecipes = systemRecipes.filter(recipe => recipe.name.toLowerCase().includes(query));

        fetch(`${API_URL}?query=${query}&apiKey=${API_KEY}`)
            .then(response => {
                if (!response.ok) throw new Error('API-haku epäonnistui');
                return response.json();
            })
            .then(data => {
                const matchedOpenSourceRecipes = data.results.map(recipe => ({
                    title: recipe.title,
                    description: 'Katso tarkemmat ohjeet linkistä.',
                    link: `https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-').toLowerCase()}-${recipe.id}`,
                    external: true
                }));

                const allResults = [...matchedUserRecipes, ...matchedSystemRecipes, ...matchedOpenSourceRecipes];

                if (allResults.length === 0) {
                    resultsContainer.innerHTML = '<p>Ei löytynyt reseptejä hakusanalla. Kokeile toista hakusanaa.</p>';
                } else {
                    allResults.forEach(recipe => {
                        const recipeElement = document.createElement('div');
                        recipeElement.classList.add('recipe-card');

                        recipeElement.innerHTML = `
                            <h3>${recipe.name || recipe.title}</h3>
                            <p>${recipe.description}</p>
                            <a href="${recipe.link}" target="${recipe.external ? '_blank' : '_self'}" class="recipe-link">Katso resepti</a>
                            ${loggedInUser.username ? `
                                <span class="heart-icon" data-recipe="${recipe.name || recipe.title}">&#10084;</span>
                                <a href="#" class="share-link" data-recipe="${recipe.name || recipe.title}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-share" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M14 9V5l7 7-7 7v-4H5V9h9zm-9 0H3v6h2V9z"/>
                                    </svg>
                                    Jaa resepti
                                </a>
                            ` : ''}
                        `;

                        resultsContainer.appendChild(recipeElement);
                    });

                    // Lisätään tapahtumankuuntelijat suosikeille ja jakamiselle
                    document.querySelectorAll('.heart-icon').forEach(icon => {
                        icon.addEventListener('click', function() {
                            const recipeName = icon.getAttribute('data-recipe');
                            toggleFavoriteRecipe(icon, recipeName);
                        });
                    });

                    document.querySelectorAll('.share-link').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            const recipeName = link.getAttribute('data-recipe');
                            const shareUrl = `${window.location.origin}/resepti.html?name=${encodeURIComponent(recipeName)}`;

                            // Kopioidaan linkki leikepöydälle
                            navigator.clipboard.writeText(shareUrl)
                                .then(() => {
                                    alert('Reseptin linkki kopioitu leikepöydälle!');
                                })
                                .catch(err => {
                                    console.error('Linkin kopiointi epäonnistui:', err);
                                    alert('Linkin kopiointi epäonnistui. Yritä uudelleen.');
                                });
                        });
                    });
                }
            })
            .catch(error => {
                console.error('Virhe haun aikana:', error);
                resultsContainer.innerHTML = '<p>Virhe haun aikana. Yritä uudelleen myöhemmin.</p>';
            });
    });

    function toggleFavoriteRecipe(icon, recipeName) {
        if (!loggedInUser.username) {
            alert('Kirjaudu sisään lisätäksesi reseptin suosikkeihin.');
            return;
        }

        if (!userRecipes.some(recipe => recipe.name === recipeName)) {
            userRecipes.push({ name: recipeName });
            loggedInUser.savedRecipes = userRecipes;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            icon.classList.add('favorited');
            alert('Resepti lisätty suosikkeihin!');
        } else {
            const index = userRecipes.findIndex(recipe => recipe.name === recipeName);
            userRecipes.splice(index, 1);
            loggedInUser.savedRecipes = userRecipes;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            icon.classList.remove('favorited');
            alert('Resepti poistettu suosikeista.');
        }
    }
});
