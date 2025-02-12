document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const loginButton = document.querySelector('button[type="submit"]');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    }
});
