const url = "http://localhost:8080/users/registration";

const form = document.querySelector(".page-form");

const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirm");

const password_strength = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

const strength_bars = password_strength.querySelectorAll("span");
const strength_text = document.getElementById("strength-text");

passwordInput.addEventListener("input", ()=>{
    const password = passwordInput.value.trim();
    console.log(password);

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0123456789]/.test(password);
    console.log("Has number: ", hasNumber);

    disableStrengthBars();

    if(password.length == 0) disableStrengthBars();
    if((!hasNumber && !hasSpecialChar) || (password.length < 5 && (hasSpecialChar || hasNumber))){
        strength_bars[0].classList.replace("empty-bar","weaker-pass");
        strength_text.classList.add("red-text");
        strength_text.textContent = "WEAK PASSWORD";
    }
    if(password.length >= 5 && password.length < 8 && (hasSpecialChar || hasNumber)){
        strength_bars[0].classList.replace("empty-bar","weaker-pass");
        strength_bars[1].classList.replace("empty-bar","weak-pass");
        strength_text.classList.add("orange-text");
        strength_text.textContent = "NORMAL PASSWORD";
    }
    if((password.length >= 8 && hasSpecialChar) || (password.length >= 8 && hasNumber)){
        strength_bars[0].classList.replace("empty-bar","weaker-pass");
        strength_bars[1].classList.replace("empty-bar","weak-pass");
        strength_bars[2].classList.replace("empty-bar","strong-pass");
        strength_text.classList.add("lightGreen-text");
        strength_text.textContent = "STRONG PASSWORD";
    }
    if(password.length >= 8 && hasSpecialChar && hasNumber){
        strength_bars[0].classList.replace("empty-bar","weaker-pass");
        strength_bars[1].classList.replace("empty-bar","weak-pass");
        strength_bars[2].classList.replace("empty-bar","strong-pass");
        strength_bars[3].classList.replace("empty-bar","stronger-pass");
        strength_text.classList.add("green-text");
        strength_text.textContent = "VERY STRONG PASSWORD";
    }
});

function disableStrengthBars(){
    strength_bars[0].className = "empty-bar";
    strength_bars[1].className = "empty-bar";
    strength_bars[2].className = "empty-bar";
    strength_bars[3].className = "empty-bar";

    strength_text.classList = "strength-text";
}

form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select");

    const password = inputs[7].value.trim();
    const confirmPassword = inputs[8].value.trim();
    console.log("password: ",password," confirm password: ",confirmPassword);

    if(password !== confirmPassword){
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('password-confirmation');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });
    }

    const userData = {
        fullName: (inputs[0].value+" "+inputs[1].value).trim(),
        email: inputs[2].value.trim(),
        dateOfBirth: inputs[3].value,
        gender: inputs[4].value,
        address: inputs[5].value.trim(),
        username: inputs[6].value.trim(),
        password: password
    }

    console.log(userData);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if(!response.ok){
        const error = await response.json();
        
        let overlay = document.getElementById('overlay');
        let popup = document.getElementById('error-alert');
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");

        if(error.status === 111){
            popup.querySelector("p").textContent = error.message;
        }

        let button = popup.querySelector("button");
        button.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });

        return;
    }

    let overlay = document.getElementById('overlay');
    let popup = document.getElementById('reg-success');
    overlay.classList.replace("hidden", "overlay");
    popup.classList.replace("hidden", "popup");

    let cancel_btn = document.getElementById('cancel-btn');
    let go_to_login_btn = document.getElementById('go-to-login-page');

    cancel_btn.addEventListener("click", () => {
        overlay.classList.replace("overlay", "hidden");
        popup.classList.replace("popup", "hidden");
    });

    go_to_login_btn.addEventListener("click", () => {
        window.location.href = "";
    });
});