
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
    const searchTerms = searchQuery.split(',').map(term => term.trim()); // Hakee useammalla hakusanalla, pilkulla erotettuna
    const filteredRecipes = recipesDatabase.filter(recipe =>
        searchTerms.some(term => recipe.name.toLowerCase().includes(term))
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
                <button onclick="addRecipe('${recipe.name}', '${recipe.thumbnail}', '${recipe.instructions.replace(/'/g, "\\'")}')">Lisää omiin resepteihin</button>
            `;
            resultsDiv.appendChild(recipeDiv);
        });
    } else {
        resultsDiv.innerHTML = 'Ei löytynyt reseptejä.';
    }
}

const userRecipes = []; // Käyttäjän reseptit

// Lisää resepti omiin resepteihin 
function addRecipe(name, thumbnail, instructions) {
    userRecipes.push({ name, thumbnail, instructions });
    alert('Resepti lisätty omiin resepteihin!');
}
  
// Kirjautuminen
function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (email && password) {
        document.getElementById('loginMessage').textContent = 'Kirjautuminen onnistui!';
        document.getElementById('loginMessage').style.color = 'green';
        document.getElementById('profileButton').style.display = 'inline-block';

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


// Lisää resepti omiin resepteihin 
function addRecipe(name, thumbnail, instructions) {
    userRecipes.push({ name, thumbnail, instructions });
    alert('Resepti lisätty omiin resepteihin!');
}


function goToProfile() {
    window.location.href = 'profile.html';
}