document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
        // Piilotetaan login-formin submit-painike, jos käyttäjä on kirjautunut
        const loginButton = document.querySelector('button[type="submit"]');
        if (loginButton) {
            loginButton.style.display = 'none';
        }

        // Piilotetaan "Kirjaudu" -painike muilla sivuilla
        const kirjauduButton = document.querySelector('button[onclick*="login.html"]');
        if (kirjauduButton) {
            kirjauduButton.style.display = 'none';
        }
    }
});
