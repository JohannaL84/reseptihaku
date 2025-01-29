document.getElementById("forgotPasswordForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("resetEmail").value;
    const resetMessage = document.getElementById("resetMessage");
    resetMessage.textContent = ""; // Tyhjennetään vanhat viestit

    try {
        const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        
        if (response.ok) {
            resetMessage.style.color = "green";
            resetMessage.textContent = "✅ Palautuslinkki lähetetty sähköpostiisi!";
        } else {
            resetMessage.style.color = "red";
            resetMessage.textContent = `❌ ${data.msg || "Jokin meni pieleen!"}`;
        }
    } catch (error) {
        resetMessage.style.color = "red";
        resetMessage.textContent = "❌ Palvelinvirhe! Tarkista verkkoyhteys.";
        console.error("Reset password error:", error);
    }
});
