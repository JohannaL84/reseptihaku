
const recipes = [
    {
        name: 'Spaghetti Bolognese',
        thumbnail: 'spaghetti_bolognese.jpg',
        ingredients: ["spagetti", "jauheliha", "sipuli", "valkosipuli", "tomaattikastike"],
        instructions: '1. Ruskista jauheliha...'
    },
    {
        name: 'Kana Caesar-salaatti',
        thumbnail: 'chicken_caesar_salad.jpg',
        ingredients:["kana", "salaatti"],
        instructions: '1. Leikkaa kana...'
    },
    {
        name: 'Kasviscurry',
        thumbnail: 'vegetable_curry.jpg',
        ingredients: ["munakoiso", "bataatti", "paprika"],
        instructions: '1. Kuumenna öljy...'
    },
    {
        name: "Kanakeitto",
        ingredients: ["kana", "porkkana", "peruna", "sipuli", "valkosipuli", "kasvisliemi"],
        instructions: "1. Pilko ainekset ja keitä kasvisliemessä, kunnes ne ovat kypsiä."
    }
        // Lisää omia reseptejäsi tähän
];

 // Etsii reseptit
 function searchRecipes() {
    const keywords = document.getElementById("search").value.toLowerCase().split(",").map(kw => kw.trim()); // Huomioi hakusanoissa isot kirjaimet ja poistaa ylimääräiset välilyönnit
    const results = recipes.filter(recipe =>
        keywords.some(keyword =>
            recipe.name.toLowerCase().includes(keyword) ||
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(keyword))
        )
    );

    displayResults(results);
}
// Näyttää tulokset nimen ja ainesosien perusteella
function displayResults(results) {
    document.getElementById("results").innerHTML = results.map(recipe => 
        `<h2>${recipe.name}</h2>
         <p>${recipe.instructions}</p>`
    ).join("");
}

let userRecipes = []; // Alustetaan muuttuja käyttäjän resepteille

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

// Näyttää käyttäjän omat reseptit
function showUserRecipes() {
    const newRecipes = document.getElementById('newRecipes');
    newRecipes.innerHTML = results.map(recipe => 
        `<h2>${recipe.name}</h2>
        <p>${recipe.instructions}<button onclick="poista(${index})">Poista</button></p>` // Tästä tehtävä painike etusivulle
    ).join("");
};

// Poistaa oman reseptin
function removeOwnRecipe(index) {
    userRecipes.splice(index, 1);
    showUserRecipes();
}

// Järjestää omat reseptit
function shortOwnRecipe() {
    userRecipes.sort();
    showUserRecipes();
    
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
// Funktio omiin tietoihin
function goToProfile() {
    window.location.href = 'profile.html';
}

// Kirjaa käyttäjän ulos
function logout() {
    window.location.href = 'index.html';
}

// Näyttää profiilin
function showUserProfile() {
    const username = localStorage.getItem('username');
    document.getElementById('profileUsername').innerText = username;
}

// Laskee pisteet
function showUserPoints() {
    const points = localStorage.getItem('points');
    document.getElementById('userPoints').innerText = points;
}
