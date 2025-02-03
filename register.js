function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('registerError');
        const loadingMessage = document.getElementById('loadingMessage');

        // Tyhjennetään virheilmoitus
        errorElement.textContent = '';

        // Tarkista, että salasanat täsmäävät
        if (password !== confirmPassword) {
            errorElement.textContent = 'Salasanat eivät täsmää!';
            return;
        }

        // Näytä latausviesti
        loadingMessage.style.display = 'block';

        // Tarkista olemassa olevat käyttäjät
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.username === username || u.email === email);

        if (existingUser) {
            loadingMessage.style.display = 'none';
            errorElement.textContent = 'Käyttäjänimi tai sähköposti on jo käytössä.';
            return;
        }

        // Luo uusi käyttäjä ja tallenna se localStorageen
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        loadingMessage.style.display = 'none';
        alert('Rekisteröinti onnistui! Voit nyt kirjautua sisään.');
        window.location.href = 'login.html';
    });
});
