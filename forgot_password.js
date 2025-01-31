document.addEventListener('DOMContentLoaded', function() {
    // Lisää tapahtumankuuntelija lomakkeelle
    document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Nollataan mahdolliset aiemmat viestit
        const errorElement = document.getElementById('forgotError');
        const successMessage = document.getElementById('successMessage');
        errorElement.textContent = '';
        successMessage.style.display = 'none';

        // Haetaan sähköpostin syöte
        const email = document.getElementById('forgotEmail').value;

        // Hae käyttäjä localStoragesta
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            // Näytetään virheviesti, jos käyttäjää ei löydy
            errorElement.textContent = 'Sähköpostiosoitetta ei löydy.';
            return;
        }

        // Generoidaan satunnainen token ja tallennetaan se
        const resetToken = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('passwordResetToken', JSON.stringify({ email, token: resetToken }));

        // Näytetään onnistumisviesti
        successMessage.style.display = 'block';

        // Näytetään simuloitu palautuslinkki (tätä ei näytettäisi oikeassa sovelluksessa)
        alert(`Palautuslinkki: reset_password.html?token=${resetToken}`);
    });
});
