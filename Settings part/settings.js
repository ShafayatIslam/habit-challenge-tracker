document.addEventListener("DOMContentLoaded", () => {

    
    const passwordForm = document.getElementById("password-form");

    if (passwordForm) {
        passwordForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentPass = document.getElementById("current-password").value;
            const newPass = document.getElementById("new-password").value;
            const confirmPass = document.getElementById("confirm-password").value;

            // Basic validation
            if (newPass !== confirmPass) {
                alert("New password and confirm password do not match!");
                return;
            }

            if (newPass.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            // Success scenario
            alert("Password updated successfully!");
            passwordForm.reset(); 
        });
    }
});