async function register(event) {
    event.preventDefault(); // Estetään lomakkeen uudelleenlataus

    const username = document.getElementById("newUsername").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const registerError = document.getElementById("registerError");
    const loadingMessage = document.getElementById("loadingMessage");

    // Näytetään latausviesti
    registerError.textContent = "";
    loadingMessage.style.display = "block";

    // Tarkistetaan, että salasanat täsmäävät
    if (password !== confirmPassword) {
        loadingMessage.style.display = "none";
        registerError.textContent = "❌ Salasanat eivät täsmää!";
        return;
    }

    // Tarkistetaan käyttäjätunnuksen ja sähköpostin uniikkius LocalStoragessa
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.username === username || u.email === email)) {
        loadingMessage.style.display = "none";
        registerError.textContent = "❌ Käyttäjätunnus tai sähköposti on jo käytössä!";
        return;
    }

    // Lähetetään tiedot back-endiin (MongoDB)
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Rekisteröinti onnistui! Kirjaudu sisään.");
            window.location.href = "login.html"; // Ohjataan kirjautumissivulle
        } else {
            registerError.textContent = `❌ ${data.msg || "Rekisteröinti epäonnistui!"}`;
        }
    } catch (error) {
        console.error("Rekisteröinti epäonnistui:", error);
        registerError.textContent = "❌ Palvelinvirhe! Tarkista verkkoyhteys.";

        // Tallennetaan localStorageen, jos back-end ei vastaa (vain testikäyttöön)
        users.push({ username, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("⚠️ Palvelin ei vastaa! Käyttäjä tallennettu vain selaimen muistiin.");
        window.location.href = "login.html";
    } finally {
        loadingMessage.style.display = "none"; // Piilotetaan latausviesti
    }
}
