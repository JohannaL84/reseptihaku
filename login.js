// login.js: Käsittelee kirjautumisen

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            alert('Kirjauduit sisään onnistuneesti!');
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            document.getElementById('loginError').textContent = 'Virheellinen käyttäjänimi tai salasana.';
        }
    });
});
