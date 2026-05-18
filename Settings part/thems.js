
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    
    if (darkModeToggle) {
      
        if (currentTheme === "dark") {
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.body.classList.add("dark-mode");
                localStorage.setItem("theme", "dark"); 
            } else {
                document.body.classList.remove("dark-mode");
                localStorage.setItem("theme", "light"); 
            }
        });
    }
});


