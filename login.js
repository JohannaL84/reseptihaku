function login(event) {
    event.preventDefault(); // Estää lomakkeen uudelleenlatauksen

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("loginError");

    // Haetaan tallennetut käyttäjät (localStorage tai palvelin)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Etsitään käyttäjä listasta
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert("Kirjautuminen onnistui!");
        window.location.href = "dashboard.html"; // Ohjaa käyttäjän eteenpäin
    } else {
        loginError.textContent = "Virheellinen käyttäjätunnus tai salasana!";
    }
}