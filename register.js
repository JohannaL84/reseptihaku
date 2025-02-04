document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('registerError');
        const loadingMessage = document.getElementById('loadingMessage');
        const successMessage = document.getElementById('registerSuccess');

        errorElement.textContent = '';
        successMessage.style.display = 'none';

        // Validaatiot
        if (!/^[a-zA-Z0-9]{3,}$/.test(username)) {
            errorElement.textContent = 'Käyttäjätunnus voi sisältää vain kirjaimia ja numeroita, vähintään 3 merkkiä.';
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorElement.textContent = 'Anna kelvollinen sähköpostiosoite.';
            return;
        }

        if (password.length < 12 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            errorElement.textContent = 'Salasanan on oltava vähintään 12 merkkiä pitkä ja sisältää kirjaimia sekä numeroita.';
            return;
        }

        if (password !== confirmPassword) {
            errorElement.textContent = 'Salasanat eivät täsmää!';
            return;
        }

        loadingMessage.style.display = 'block';

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.username === username || u.email === email);

        if (existingUser) {
            loadingMessage.style.display = 'none';
            errorElement.textContent = 'Käyttäjänimi tai sähköposti on jo käytössä.';
            return;
        }

        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        loadingMessage.style.display = 'none';
        successMessage.style.display = 'block';

        // Piilotetaan viesti 5 sekunnin kuluttua
        setTimeout(function() {
            successMessage.style.display = 'none';
            window.location.href = 'login.html';
        }, 5000);
    });
});
