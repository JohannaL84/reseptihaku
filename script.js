
const recipesDatabase = [
    {
        name: 'Spaghetti Bolognese',
        thumbnail: 'spaghetti_bolognese.jpg',
        instructions: '1. Ruskista jauheliha...'
    },
    {
        name: 'Kana Caesar-salaatti',
        thumbnail: 'chicken_caesar_salad.jpg',
        instructions: '1. Leikkaa kana...'
    },
    {
        name: 'Kasviscurry',
        thumbnail: 'vegetable_curry.jpg',
        instructions: '1. Kuumenna öljy...'
    }
        // Lisää omia reseptejäsi tähän
];

// Etsii reseptit
function searchRecipes() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filteredRecipes = recipesDatabase.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery)
    );
    displayResults(filteredRecipes); // Näyttää suodatetut tulokset
}

function displayResults(recipes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            // Näyttää reseptin ohjeen ja kuvan
            recipeDiv.innerHTML = `
                <h2>${recipe.name}</h2>
                <img src="${recipe.thumbnail}" alt="${recipe.name}" width="200">
                <p>${recipe.instructions}</p>
            `;
            resultsDiv.appendChild(recipeDiv);
        });
    } else {
            resultsDiv.innerHTML = 'Ei löytynyt reseptejä.'; // Ilmoittaa, jos reseptiä ei löydy 
    }
}
  
// Kirjautuminen
function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (email && password) {
        document.getElementById('loginMessage').textContent = 'Kirjautuminen onnistui!';
        document.getElementById('loginMessage').style.color = 'green';

        // Tyhjennä kirjautumistiedot
        document.getElementById('emailInput').value = '';
        document.getElementById('passwordInput').value = '';
    } else {
        document.getElementById('loginMessage').textContent = 'Täytä kaikki kentät!';
        document.getElementById('loginMessage').style.color = 'red';
    }
}

// Haussa voi käyttää Enteriä hakutuloksen saamiseksi
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchRecipes();
    }
});