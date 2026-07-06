const base_url = "http://localhost:8080";
const login_url = base_url + "/users/login";
const dashboard = base_url + "/dashboard";

const login_form = document.querySelector("form");
const loadingOverlay = document.getElementById("loading-overlay");

login_form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = login_form.querySelectorAll("input");

    const loginData = {
        username: inputs[0].value.trim(),
        password: inputs[1].value.trim()
    }
    
    showLoading();
    try{
        const response = await fetch(`${login_url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const user = await response.json();
        
        if(user.id != null){
            localStorage.setItem("userId", user.id);
            //window.location.href = `http://localhost:8080/dashboard?userId=${user.id}`;
            window.location.href = "dashboard.html";
        }else{
            showPopup("error-alert", "Invalid username or password.");
            return;
        }
    }catch(e){
        console.log(e);
    }finally{
        hideLoading();
    }
});

function showPopup(popupId, popupMsg){
    let overlay = document.getElementById("overlay");
    let popup = document.getElementById(popupId);
    overlay.classList.replace("hidden", "overlay");
    popup.classList.replace("hidden", "popup");
    let message = popup.querySelector("p");
    message.textContent = popupMsg;
    let button = popup.querySelector("button");
            
    button.addEventListener("click", () => {
        overlay.classList.replace("overlay", "hidden");
        popup.classList.replace("popup", "hidden");
    });
}


function showLoading() {
    loadingOverlay.classList.replace("hidden", "overlay");
}
function hideLoading() {
    loadingOverlay.classList.replace("overlay", "hidden");
}