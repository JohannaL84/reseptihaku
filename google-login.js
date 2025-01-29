function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            alert(`Kirjautuminen onnistui: ${user.displayName}`);
            window.location.href = "dashboard.html"; // Ohjataan käyttäjä eteenpäin
        })
        .catch((error) => {
            console.error(error);
            alert("Kirjautuminen epäonnistui. Yritä uudelleen.");
        });
}
