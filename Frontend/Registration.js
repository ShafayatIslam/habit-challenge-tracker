const form = document.querySelector(".page-form");
const inputs = form.querySelectorAll("input, select");

const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirm");

const password_strength = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

const strength_bars = password_strength.querySelectorAll("span");
const strength_text = document.getElementById("strength-text");

strength_bars.forEach(bar => {
    console.dir(bar);
});

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