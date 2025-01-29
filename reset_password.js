async function resetNewPassword(event) {
    event.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;
    const resetMessage = document.getElementById("resetMessage");

    if (newPassword !== confirmNewPassword) {
        resetMessage.textContent = "❌ Salasanat eivät täsmää!";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    try {
        const response = await fetch("http://localhost:5000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert("✅ Salasana vaihdettu onnistuneesti!");
            window.location.href = "login.html";
        } else {
            resetMessage.textContent = `❌ ${data.msg || "Virhe!"}`;
        }
    } catch (error) {
        resetMessage.textContent = "❌ Palvelinvirhe!";
    }
}
