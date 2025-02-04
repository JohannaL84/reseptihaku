document.addEventListener('DOMContentLoaded', function() {
    const loginStatus = document.getElementById('loginStatus');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        loginStatus.textContent = `Olet kirjautuneena: ${loggedInUser.username}`;
    } else {
        loginStatus.textContent = 'Et ole kirjautunut sisään.';
    }
});