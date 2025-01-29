function register(event) {
    event.preventDefault(); // Estetään lomakkeen uudelleenlataus

    const username = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const registerError = document.getElementById("registerError");

    // Tarkistetaan, että salasanat täsmäävät
    if (password !== confirmPassword) {
        registerError.textContent = "Salasanat eivät täsmää!";
        return;
    }

    // Tarkistetaan, että käyttäjänimi on uniikki
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        registerError.textContent = "Käyttäjätunnus on jo käytössä!";
        return;
    }

    // Tallennetaan käyttäjä localStorageen (testikäyttö)
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Rekisteröinti onnistui! Kirjaudu sisään.");
    window.location.href = "login.html";
}
