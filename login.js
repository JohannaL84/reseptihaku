async function login(event) {
    event.preventDefault(); // Estää lomakkeen uudelleenlatauksen

    const usernameOrEmail = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginError = document.getElementById("loginError");

    // 🔹 Jos käyttäjä on jo kirjautunut (localStorage-token)
    if (localStorage.getItem("token")) {
        alert("Olet jo kirjautunut!");
        window.location.href = "dashboard.html";
        return;
    }

    // 🔹 Haetaan tallennetut käyttäjät localStoragesta
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const localUser = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password);

    if (localUser) {
        alert("✅ Kirjauduttiin localStoragesta!");
        window.location.href = "dashboard.html";
        return;
    }

    // 🔹 Yritetään kirjautua back-endin kautta MongoDB:stä
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: username, password }) // Käyttäjänimi tai sähköposti
        });
        

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token); // Tallennetaan JWT-token
            localStorage.setItem("user", JSON.stringify(data.user)); // Tallennetaan käyttäjätiedot
            alert(`✅ Kirjauduttiin MongoDB:n kautta käyttäjänä: ${data.user.username}`);
            window.location.href = "dashboard.html";
        } else {
            loginError.textContent = `❌ ${data.msg || "Kirjautuminen epäonnistui!"}`; // Näytetään virheilmoitus
        }
    } catch (error) {
        loginError.textContent = "❌ Palvelinvirhe! Tarkista verkkoyhteys.";
        console.error("Login error:", error);
    }
}
