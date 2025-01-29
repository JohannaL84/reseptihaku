async function login(event) {
    event.preventDefault(); // Estää lomakkeen uudelleenlatauksen

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("loginError");

    // 🔹 Haetaan tallennetut käyttäjät localStoragesta
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const localUser = users.find(u => u.username === username && u.password === password);

    if (localUser) {
        alert("Kirjauduttiin localStoragesta!");
        window.location.href = "dashboard.html"; // Ohjaa käyttäjän eteenpäin
        return;
    }

    // 🔹 Jos käyttäjää ei löytynyt localStoragesta, yritetään back-endistä
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token); // Tallennetaan JWT-token
            alert("Kirjauduttiin MongoDB:n kautta!");
            window.location.href = "dashboard.html";
        } else {
            loginError.textContent = data.msg; // Näytetään virheilmoitus
        }
    } catch (error) {
        loginError.textContent = "Palvelinvirhe! Tarkista yhteys.";
    }
}
