// login.js: Käsittelee kirjautumisen

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            loginMessage.textContent = 'Kirjauduit sisään onnistuneesti!';
            loginMessage.style.color = 'green';
            
            // Näytä viesti 3 sekunnin ajan, sitten siirry dashboardiin
            setTimeout(() => {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            }, 3000);
        } else {
            loginMessage.textContent = 'Virheellinen käyttäjänimi tai salasana.';
            loginMessage.style.color = 'red';
        }
    });
});
