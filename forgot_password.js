document.addEventListener('DOMContentLoaded', function() {
    // Lisää tapahtumankuuntelija lomakkeelle
    document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Nollataan mahdolliset aiemmat viestit
        const errorElement = document.getElementById('forgotError');
        const successMessage = document.getElementById('successMessage');
        errorElement.textContent = '';
        successMessage.style.display = 'none';

        // Haetaan sähköpostin ja käyttäjätunnuksen syötteet
        const email = document.getElementById('forgotEmail').value.trim();
        const username = document.getElementById('forgotUsername').value.trim();

        // Hae käyttäjätiedot localStoragesta
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let user;

        if (email !== '') {
            user = users.find(u => u.email === email);
        } else if (username !== '') {
            user = users.find(u => u.username === username);
        }

        if (!user) {
            // Näytetään virheviesti, jos käyttäjää ei löydy
            errorElement.textContent = 'Käyttäjää ei löytynyt sähköpostilla tai käyttäjätunnuksella.';
            return;
        }

        // Generoidaan satunnainen token ja tallennetaan se
        const resetToken = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('passwordResetToken', JSON.stringify({ email: user.email, token: resetToken }));

        // Näytetään onnistumisviesti
        successMessage.style.display = 'block';

        // Näytetään simuloitu palautuslinkki (tätä ei näytettäisi oikeassa sovelluksessa)
        alert(`Palautuslinkki: reset_password.html?token=${resetToken}`);
    });

    // Tapahtumat sähköpostin ja käyttäjätunnuksen kentille
    document.getElementById('forgotEmail').addEventListener('input', toggleUsernameField);
    document.getElementById('forgotUsername').addEventListener('input', toggleEmailField);
});

function toggleUsernameField() {
    const emailField = document.getElementById('forgotEmail');
    const usernameField = document.getElementById('forgotUsername');
    if (emailField.value.trim() === '') {
        usernameField.style.display = 'block';
    } else {
        usernameField.style.display = 'none';
        usernameField.value = ''; // Tyhjennä käyttäjätunnus
    }
}

function toggleEmailField() {
    const emailField = document.getElementById('forgotEmail');
    const usernameField = document.getElementById('forgotUsername');
    if (usernameField.value.trim() === '') {
        emailField.style.display = 'block';
    } else {
        emailField.style.display = 'none';
        emailField.value = ''; // Tyhjennä sähköposti
    }
}
