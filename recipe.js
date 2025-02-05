document.addEventListener('DOMContentLoaded', () => {
    // Simuloidaan esimerkkitietoja. Voit hakea nämä tietokannasta tai API:sta.
    const recipeData = {
        title: "Herkullinen pasta bolognese",
        description: "Tämä klassinen pasta bolognese sopii täydellisesti arjen kiireisiin.",
        ingredients: [
            "400 g jauhelihaa",
            "1 sipuli",
            "2 valkosipulinkynttä",
            "400 g tomaattimurskaa",
            "300 g pastaa",
            "Suolaa ja pippuria maun mukaan"
        ],
        instructions: "Kuullota sipuli ja valkosipuli öljyssä. Lisää jauheliha ja ruskista. Kaada joukkoon tomaattimurska. Mausta ja hauduta 15 minuuttia. Keitä pasta ja tarjoile kastikkeen kanssa."
    };
 
    // Päivitetään reseptin tiedot sivulle
    document.getElementById('recipe-title').textContent = recipeData.title;
    document.getElementById('recipe-description').textContent = recipeData.description;
 
    const ingredientList = document.getElementById('ingredient-list');
    recipeData.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientList.appendChild(li);
    });
 
    document.getElementById('instructions').textContent = recipeData.instructions;
});