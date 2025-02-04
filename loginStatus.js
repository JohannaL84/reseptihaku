document.addEventListener('DOMContentLoaded', function() {
    const loginStatus = document.getElementById('loginStatus');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        loginStatus.innerHTML = `
            Olet kirjautuneena: 
            <a href="profile.html">${loggedInUser.username}</a>
            <button class="logout-button" id="logoutButton">Kirjaudu ulos</button>
        `;

        document.getElementById('logoutButton').addEventListener('click', function() {
            // Tyhjennetään kirjautumistiedot ja päivitetään sivu
            localStorage.removeItem('loggedInUser');
            window.location.reload();
        });
    } else {
        loginStatus.textContent = 'Et ole kirjautunut sisään.';
    }
});
