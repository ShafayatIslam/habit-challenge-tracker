const base_url = "http://localhost:8080";
const challenge_url = base_url + "/api/challenge";
const user_url = base_url + "/users/details";

const userId = localStorage.getItem("userId");

const allChallengeSection = document.getElementById("view-allChallenges");
const challengeContainer = document.querySelector(".challenge-container");
const allChallengesContainer = document.getElementById("all-challenges-grid");
const searchedChallengesContainer = document.getElementById("searched-challenges-grid");
const searchInput = document.getElementById("search-all");
const filterChallenges = document.getElementById("filter-all-challenges");
const filter_buttons = document.querySelectorAll(".filter-btn");
const viewDetailsSection = document.getElementById("view-challengeDetails");
const detailsContainer = document.getElementById("details-container");
const myChallengeBtn = document.getElementById("btn-goto-my-challenges");
const loadingOverlay = document.getElementById("loading-overlay");
const empty_state = document.querySelector(".empty-state");
const varificationModal = document.querySelector(".security-varification");
const varificationOverlay =document.getElementById("security-verification-overlay");

let challenges = [];
let challenge = null;

let myChallenges = [];

document.addEventListener("DOMContentLoaded", () => {
    loadAllChallenges();
});

myChallengeBtn.addEventListener("click", () => {
    loadMyChallenges();
    allChallengeSection.classList.add("hidden");
    myChallengesSection.classList.remove("hidden");
});

searchInput.addEventListener("input", () => {
    const input = searchInput.value.trim();
    if(input.length > 0){
        allChallengesContainer.classList.add("hidden");
        searchedChallengesContainer.classList.remove("hidden");
        loadSearchedChallenges(input);
    }else{
        allChallengesContainer.classList.remove("hidden");
        searchedChallengesContainer.classList.add("hidden");
        loadAllChallenges();
    }
});

filterChallenges.addEventListener("click", (e) => {
    const filter_btn = e.target.closest(".filter-btn");
    if(filter_btn){
        filter_buttons.forEach(btn => {
            btn.classList.remove("active");
        });
        filter_btn.classList.add("active");
        
        const type = filter_btn.getAttribute("type");
        
        if(type == "all"){
            loadAllChallenges();
        }else if(type == "public"){
            loadFiltleredChallenges("PUBLIC");
        }else if(type == "private"){
            loadFiltleredChallenges("PRIVATE");
        }
    }
});

challengeContainer.addEventListener("click", (e) => {
    const challengeCard = e.target.closest(".challenge-card");
    if(challengeCard){
        allChallengeSection.classList.add("hidden");
        viewDetailsSection.classList.remove("hidden");
        const challengeId = challengeCard.getAttribute("challenge-id");
        loadChallengeDetails(challengeId);
    }
});

viewDetailsSection.addEventListener("click", (e) => {
    const back_btn = e.target.closest(".back-link");
    if(back_btn){
        viewDetailsSection.classList.add("hidden");
        allChallengeSection.classList.remove("hidden");
    }

    const join_btn = e.target.closest(".join-btn");
    if(join_btn){
        const challengeId = join_btn.getAttribute("challenge-id");

        if(join_btn.getAttribute("type") == "PRIVATE"){
            const btn_varification = varificationModal.querySelector(".btn-varification");
            btn_varification.setAttribute("challenge-id", challengeId);
            varificationOverlay.classList.replace("hidden", "overlay");
        }else joinChallenge(challengeId);
    }
});

varificationModal.addEventListener("click", (e) => {
    const btn_varification = e.target.closest(".btn-varification");
    if(btn_varification){
        const challengeId = btn_varification.getAttribute("challenge-id");
        canJoinPrivateChallenge(challengeId);
    }

    const btn_cancel = e.target.closest(".btn-cancel-varification");
    if(btn_cancel){
        varificationModal.querySelector(".c-id").value = "";
        varificationModal.querySelector(".c-pin").value = "";
        varificationOverlay.classList.replace("overlay", "hidden");
    }
});

async function canJoinPrivateChallenge(challengeId){
    const id = varificationModal.querySelector(".c-id").value.trim();
    const pin = varificationModal.querySelector(".c-pin").value.trim();

    const securityData = {
        challengeId: challengeId,
        uniqueId: id,
        pin: pin
    }

    try{
        const response = await fetch(`${challenge_url}/can-join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(securityData)
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        const canJoin = await response.json();

        if(canJoin){
            joinChallenge(challengeId);
            varificationModal.querySelector(".c-id").value = "";
            varificationModal.querySelector(".c-pin").value = "";
            varificationOverlay.classList.replace("overlay", "hidden");
        }
        else{
            showPopup("error-alert", "Incorrect PIN.");
            return;
        }
    }catch(e){
        console.error(e);
    }
}

async function joinChallenge(challengeId){
    showLoading();
    try{
        const response = await fetch(`${challenge_url}/user/${userId}/${challengeId}`, {
            method: "POST"
        });
        
        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "You have successfully joined this challenge.");
        loadChallengeDetails(challengeId);
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again.");
        hideLoading();
    }finally{
        hideLoading();
    }
}

async function loadChallengeDetails(challengeId){
    try{
        const response = await fetch(`${challenge_url}/${challengeId}`);
        const challengeDetails = await response.json();
        
        const participantsResponse = await fetch(`${challenge_url}/total/participants/${challengeId}`);
        const totalParticipants = await participantsResponse.json();

        const joinResponse = await fetch(`${challenge_url}/user/can-join/${userId}/${challengeId}`);
        const canJoin = await joinResponse.json();

        const ownerResponse = await fetch(`${user_url}/${challengeDetails.userId}`)
        const owner = await ownerResponse.json();
        
        const today = new Date().toISOString().split("T")[0];
        let status = "";
        if(challengeDetails.endDate >= today){
            status = "Active";
        }else status = "Ended";
       
        detailsContainer.innerHTML = "";
        const detailsLayout = createDetailsLayout(challengeDetails, totalParticipants, status, canJoin, owner);
        detailsContainer.appendChild(detailsLayout);
    }catch(e){
        console.error(e);
    }
}

async function loadAllChallenges(){
    challenges = [];
    try{
        const response = await fetch(`${challenge_url}/all`);
        challenges = await response.json();

        allChallengesContainer.innerHTML = "";
        renderChallenges(challenges, allChallengesContainer);
        
    }catch(e){
        console.error(e);
    }
}

async function loadSearchedChallenges(input){
    challenges = [];
    try{
        const response = await fetch(`${challenge_url}/search/${input}`);
        challenges = await response.json();

        searchedChallengesContainer.innerHTML = "";
        renderChallenges(challenges, searchedChallengesContainer);
    }catch(e){
        console.error(e);
    }
}

function loadFiltleredChallenges(type){
    const filteredChallenges =  challenges.filter(challenge => challenge.type === type);
    
    allChallengesContainer.innerHTML = "";
    renderChallenges(filteredChallenges, allChallengesContainer);
}

async function renderChallenges(challenges, container){
    try{
        for(const challenge of challenges){
            const participantsResponse = await fetch(`${challenge_url}/total/participants/${challenge.id}`);
            const totalParticipants = await participantsResponse.json();

            const today = new Date().toISOString().split("T")[0];
            let status = "";
            if(challenge.endDate >= today){
                status = "Active";
            }else status = "Ended";

            const challengeCard = createChallengeCard(challenge, totalParticipants, status);
            container.appendChild(challengeCard);
        }
    }catch(e){
        console.error(e);
    }
}

function createChallengeCard(challenge, totalParticipants, status){
    const challengeCard = document.createElement("div");
    challengeCard.className = "challenge-card";
    challengeCard.setAttribute("challenge-id", challenge.id);

    const iconType = challenge.type === 'PUBLIC' ? 'fa-globe' : 'fa-lock';

    challengeCard.innerHTML = `
    <div class="card-header-top">
        <div class="card-icon"><i class="fa-solid fa-trophy"></i></div>
        <i class="fa-solid ${iconType} card-type-icon" title="${challenge.type}"></i>
    </div>
    <h3>${challenge.challengeName}</h3>
    <p class="desc">${challenge.description}</p>
            
    <div class="card-meta">
        <span><i class="fa-solid fa-user-group text-muted"></i> ${totalParticipants}</span>
        <span>${challenge.durationDays} days</span>
        <span class="${status == "Active"? 'badge-active' : 'badge-inactive'}">${status}</span>
    </div>
            
    <div class="creation-date">
        <p>Created on ${formatDate(challenge.creationDate)}</p>
    </div>
    `;

    return challengeCard;
}

function createDetailsLayout(challengeDetails, totalParticipants, status, canJoin, owner){
    const detailsLayout = document.createElement("div");
    
    detailsLayout.innerHTML = `
        <div class="details-header-card">
            <div class="details-title-row">
                <div class="title-left">
                    <div class="card-icon"><i class="fa-solid fa-trophy"></i></div>
                    <div>
                        <h1>${challengeDetails.challengeName}</h1>
                        <p class="creator-text">Created by ${challengeDetails.userId == userId ? 'you' : owner.fullName}</p>
                    </div>
                </div>
                <span class="${status == "Active"? 'badge-active' : 'badge-inactive'}">${status}</span>
            </div>
            
            <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px;"><i class="fa-solid fa-hashtag"></i> ${challengeDetails.description}</p>
            
            <div class="details-stats-row">
                <div class="stat-item">
                    <i class="fa-solid fa-user-group"></i>
                    <div>
                        <span class="stat-label">Participants</span>
                        <span class="stat-value">${totalParticipants}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-regular fa-calendar"></i>
                    <div>
                        <span class="stat-label">Duration</span>
                        <span class="stat-value">${challengeDetails.durationDays} day${challengeDetails.durationDays > 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-solid fa-fire"></i>
                    <div>
                        <span class="stat-label">Start Date</span>
                        <span class="stat-value">${formatDate(challengeDetails.creationDate)}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-regular fa-calendar-check"></i>
                    <div>
                        <span class="stat-label">End Date</span>
                        <span class="stat-value">${formatDate(challengeDetails.endDate)}</span>
                    </div>
                </div>
            </div>

            <button challenge-id="${challengeDetails.id}" type="${challengeDetails.type}" class="btn join-btn ${canJoin && status !== "Ended" ? 'btn-primary' : 'btn-disabled'}" style="width:100%;" id="btn-join-challenge" ${canJoin && status !== "Ended"? '' : 'disabled'}>${canJoin ? (status === "Ended"? 'Ended' : 'Join Challenge') : 'Already Joined ✓'}</button>
        </div>

        <div class="details-card">
            <h3>Participant Leaderboard</h3>
            <div class="leaderboard-list">
                    
            </div>
        </div>
    `;

    const leaderboard = detailsLayout.querySelector(".leaderboard-list");
    loadLeaderboard(challengeDetails.id, leaderboard);

    return detailsLayout;
}

async function loadLeaderboard(challengeId, leaderboard){
    try{
        const response = await fetch(`${challenge_url}/leaderboard/${challengeId}`);
        const users = await response.json();
        console.log(users);
        leaderboard.innerHTML = ""
        let rank = 1;
        for(const user of users){
            let rankClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "";
            let rankIcon = rank < 4 ? `<i class="fa-solid fa-crown"></i>` : rank;
            
            const leaderboard_user = document.createElement("div");
            leaderboard_user.className = "lb-item";
            leaderboard_user.innerHTML = `
            <div class="rank-badge ${rankClass}">${rankIcon}</div>
            <div class="lb-info">
                <h4>${user.fullName}</h4>
                <p>Username: ${user.username}</p>
            </div>
            <div class="lb-score">
                <h4>${user.streak}</h4>
                <p>day${user.streak > 1 ? 's' : ''} completed</p>
            </div>
            `;

            leaderboard.appendChild(leaderboard_user);
            rank++;
        }
    }catch(e){
        console.error(e);
    }
}













// ----- My Challenge Section -----
const myChallengesSection = document.getElementById("view-myChallenges");
const myChallengesContainer = document.getElementById("my-challenges-grid");
const myChallengeDetailsSection = document.getElementById("view-myChallengeDetails");
const myChallengeDetailsContainer = document.getElementById("myChallenge-details-container");
const createChallengeOverlay = document.getElementById("create-modal-overlay");

myChallengesSection.addEventListener("click", (e) => {
    const back_btn = e.target.closest(".back-link");
    if(back_btn){
        myChallengesSection.classList.add("hidden");
        allChallengeSection.classList.remove("hidden");
    }

    const explore_btn = e.target.closest(".explore-btn");
    if(explore_btn){
        myChallengesSection.classList.add("hidden");
        myChallengesSection.classList.remove("hidden");
    }

    const myChallengeCard = e.target.closest(".challenge-card");
    if(myChallengeCard){
        myChallengesSection.classList.add("hidden");
        myChallengeDetailsSection.classList.remove("hidden");
        const challengeId = myChallengeCard.getAttribute("challenge-id");
        loadMyChallengeDetails(challengeId);
    }

    const createChallengeBtn = e.target.closest(".btn-create");
    if(createChallengeBtn){
        createChallengeOverlay.classList.remove("hidden");
    }
});

createChallengeOverlay.addEventListener("click", (e) => {
    const submit_btn = e.target.closest(".btn-submit");
    if(submit_btn){
        createChallenge();
    }

    const cancel_btn = e.target.closest(".btn-cancel");
    if(cancel_btn){
        createChallengeOverlay.querySelector("form").reset();
        createChallengeOverlay.classList.add("hidden");
    }
});

createChallengeOverlay.addEventListener("change", (e) => {
    const securityDiv = createChallengeOverlay.querySelector(".security");
    const inputs = securityDiv.querySelectorAll("input");

    const challengeType = e.target.value;
    if(challengeType === "PRIVATE"){
        securityDiv.classList.remove("hidden");
        inputs[0].required = true;
        inputs[1].required = true;
    }

    if(challengeType === "PUBLIC"){
        securityDiv.classList.add("hidden");
        inputs[0].required = false;
        inputs[1].required = false;
    }
})


myChallengeDetailsSection.addEventListener("click", (e) => {
    const back_btn = e.target.closest(".back-link");
    if(back_btn){
        myChallengeDetailsSection.classList.add("hidden");
        myChallengesSection.classList.remove("hidden");
    }

    const leave_btn = e.target.closest(".btn-leave");
    if(leave_btn){
        const challengeId = leave_btn.getAttribute("challenge-id");

        let overlay = document.getElementById("overlay");
        let popup = document.getElementById("warning");
        overlay.classList.replace("hidden", "overlay");
        popup.classList.replace("hidden", "popup");
        let message = popup.querySelector("p");
        message.textContent = "Are you sure you want to leave this challenge? Your all progress will be removed.";

        let yesButton = popup.querySelector("#yes");
        let noButton = popup.querySelector("#no");

        noButton.addEventListener("click", () => {
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        });
        yesButton.onclick = () => {
            leaveChallenge(challengeId);
            overlay.classList.replace("overlay", "hidden");
            popup.classList.replace("popup", "hidden");
        };
    }
});

async function createChallenge(){
    const challengeForm = createChallengeOverlay.querySelector("form");
    const inputs = challengeForm.querySelectorAll("input, textArea, select");

    let challengeData;

    if(inputs[2].value === "PUBLIC"){
        challengeData = {
            userId: userId,
            challengeName: inputs[0].value.trim(),
            description: inputs[1].value,
            type: inputs[2].value,
            durationDays: inputs[5].value
        }
    }else{
        challengeData = {
            userId: userId,
            challengeName: inputs[0].value.trim(),
            description: inputs[1].value,
            type: inputs[2].value,
            uniqueId: inputs[3].value.trim(),
            pin: inputs[4].value.trim(),
            durationDays: inputs[5].value
        }
    }

    showLoading();
    try{
        const response = await fetch(`${challenge_url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(challengeData)
        });

        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "Challenge created successfully.");
        loadMyChallenges();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
}

async function leaveChallenge(challengeId){
    showLoading();
    try{
        const response = await fetch(`${challenge_url}/${userId}/${challengeId}`, {
            method: "DELETE"
        });

        showPopup("positive-response", "You have left this challenge.");

        myChallengeDetailsSection.classList.add("hidden");
        myChallengesSection.classList.remove("hidden");
        loadMyChallenges();
    }catch(e){
        console.error(e);
        showPopup("error-alert", "Server error. Please try again later.");
    }finally{
        hideLoading();
    }
}

async function loadMyChallenges(){
    try{
        const response = await fetch(`${challenge_url}/user/${userId}`);
        myChallenges = await response.json();

        if(myChallenges.length == 0){
            myChallengesContainer.innerHTML = "";
            empty_state.classList.remove("hidden");
            return;
        }

        empty_state.classList.add("hidden");
        myChallengesContainer.innerHTML = "";
        renderMyChallenges(myChallenges);
    }catch(e){
        console.error(e);
    }
}

async function renderMyChallenges(challenges){
    try{
        myChallengesContainer.innerHTML = "";
        for(const challenge of challenges){
            const participantsResponse = await fetch(`${challenge_url}/total/participants/${challenge.challengeId}`);
            const totalParticipants = await participantsResponse.json();

            const today = new Date().toISOString().split("T")[0];
            let status = "";
            if(challenge.endDate >= today){
                status = "Active";
            }else status = "Ended";

            const myChallengeCard = createMyChallengeCard(challenge, totalParticipants, status);
            myChallengesContainer.appendChild(myChallengeCard);
        }
    }catch(e){
        console.error(e);
    }
}

function createMyChallengeCard(challenge, totalParticipants, status){
    const challengeCard = document.createElement("div");
    challengeCard.className = "challenge-card";
    challengeCard.setAttribute("challenge-id", challenge.challengeId);

    const iconType = challenge.type === 'PUBLIC' ? 'fa-globe' : 'fa-lock';

    challengeCard.innerHTML = `
    <div class="card-header-top">
        <div class="card-icon"><i class="fa-solid fa-trophy"></i></div>
        <i class="fa-solid ${iconType} card-type-icon" title="${challenge.type}"></i>
    </div>
    <h3>${challenge.challengeName}</h3>
    <p class="desc">${challenge.description}</p>
            
    <div class="card-meta">
        <span><i class="fa-solid fa-user-group text-muted"></i> ${totalParticipants}</span>
        <span>${challenge.durationDays} days</span>
        <span class="badge-active">${status}</span>
    </div>
            
    <div class="creation-date">
        <p>Created on ${formatDate(challenge.creationDate)}</p>
    </div>
    `;

    return challengeCard;
}

async function loadMyChallengeDetails(challengeId){
    try{
        const response = await fetch(`${challenge_url}/user/${userId}/${challengeId}`);
        const challengeDetails = await response.json();

        const participantsResponse = await fetch(`${challenge_url}/total/participants/${challengeId}`);
        const totalParticipants = await participantsResponse.json();

        const ownerResponse = await fetch(`${user_url}/${challengeDetails.ownerId}`);
        const owner = await ownerResponse.json();

        const canCompleteResponse = await fetch(`${challenge_url}/user/can-complete/${userId}/${challengeId}`);
        const canComplete = await canCompleteResponse.json();
        
        const today = new Date().toISOString().split("T")[0];
        let status = "";
        if(challengeDetails.endDate >= today){
            status = "Active";
        }else status = "Ended";

        myChallengeDetailsContainer.innerHTML = "";
        const myChallengeDetailsLayout = createMyChallengeDetailsLayout(challengeDetails, totalParticipants, status, owner, canComplete);
        myChallengeDetailsContainer.appendChild(myChallengeDetailsLayout);
    }catch(e){
        console.error(e);
    }
}

function createMyChallengeDetailsLayout(challengeDetails, totalParticipants, status, owner, canComplete){
    const detailsLayout = document.createElement("div");
    detailsLayout.className = "myChallenge-details-layout";
    detailsLayout.setAttribute("challengeId", challengeDetails.challengeId);
   
    detailsLayout.innerHTML = `
        <div class="details-header-card">
            <div class="details-title-row">
                
                <div class="title-left">
                    <div class="card-icon"><i class="fa-solid fa-trophy"></i></div>
                    <div>
                        <h1>${challengeDetails.challengeName}</h1>
                        <p class="creator-text">Created by ${challengeDetails.ownerId == userId ? 'you' : owner.fullName}</p>
                    </div>
                    <span class="badge-active">${status}</span>
                </div>
                
                <button type="button" class="btn btn-leave" challenge-id="${challengeDetails.challengeId}">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Leave Challenge
                </button>
            </div>
            
            <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px;"><i class="fa-solid fa-hashtag"></i> ${challengeDetails.description}</p>
            
            <div class="details-stats-row">
                <div class="stat-item">
                    <i class="fa-regular fa-calendar"></i>
                    <div>
                        <span class="stat-label">Duration</span>
                        <span class="stat-value">${challengeDetails.durationDays} day${challengeDetails.durationDays > 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-solid fa-fire"></i>
                    <div>
                        <span class="stat-label">Streak</span>
                        <span class="stat-value">${challengeDetails.streak} day${challengeDetails.streak > 1 ? 's' : ''}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-solid fa-calendar-plus"></i>
                    <div>
                        <span class="stat-label">Last Completed</span>
                        <span class="stat-value">${challengeDetails.lastCompleted == null ? 'Not completed yet' : formatDate(challengeDetails.lastCompleted)}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-solid fa-calendar-plus"></i>
                    <div>
                        <span class="stat-label">Joining Date</span>
                        <span class="stat-value">${formatDate(challengeDetails.joiningDate)}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-solid fa-calendar-day"></i>
                    <div>
                        <span class="stat-label">Start Date</span>
                        <span class="stat-value">${formatDate(challengeDetails.creationDate)}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-regular fa-calendar-check"></i>
                    <div>
                        <span class="stat-label">End Date</span>
                        <span class="stat-value">${formatDate(challengeDetails.endDate)}</span>
                    </div>
                </div>
            </div>

            <button challenge-id="${challengeDetails.challengeId}" class="btn ${canComplete && status != "Ended" ? 'btn-green' : 'btn-disabled'} btn-complete" style="width:100%;" id="btn-join-challenge" ${canComplete && status != "Ended" ? '' : 'disabled'} >${canComplete ? (status == "Ended" ? 'Ended' : 'Complete') : 'Completed'}</button>
        </div>

        <div class="details-card">
            <h3>Participant Leaderboard</h3>
            <div class="leaderboard-list">
                    
            </div>
        </div>
    `;

    const leaderboard = detailsLayout.querySelector(".leaderboard-list");
    loadMyLeaderboard(challengeDetails.challengeId, leaderboard);

    return detailsLayout;
}

async function loadMyLeaderboard(challengeId, leaderboard){
    try{
        const response = await fetch(`${challenge_url}/leaderboard/${challengeId}`);
        const users = await response.json();
        console.log(users);
        leaderboard.innerHTML = ""
        let rank = 1;
        for(const user of users){
            let rankClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "";
            let rankIcon = rank < 4 ? `<i class="fa-solid fa-crown"></i>` : rank;
            
            const leaderboard_user = document.createElement("div");
            leaderboard_user.className = "lb-item";
            leaderboard_user.innerHTML = `
            <div class="rank-badge ${rankClass}">${rankIcon}</div>
            <div class="lb-info">
                <h4>${user.fullName}</h4>
                <p>Username: ${user.username}</p>
            </div>
            <div class="lb-score">
                <h4>${user.streak}</h4>
                <p>day${user.streak > 1 ? 's' : ''} completed</p>
            </div>
            `;

            leaderboard.appendChild(leaderboard_user);
            rank++;
        }
    }catch(e){
        console.error(e);
    }
}

const btn_complete = document.querySelector(".btn-complete");
myChallengeDetailsContainer.addEventListener("click", (e) => {
    const btn_complete = e.target.closest(".btn-complete");
    if(btn_complete){
        const challengeId = btn_complete.getAttribute("challenge-id");
        markComplete(challengeId);
    }
});

async function markComplete(challengeId){
    showLoading();
    try{
        const response = await fetch(`${challenge_url}/user/mark-complete/${userId}/${challengeId}`);
        
        if(!response.ok){
            const error = await response.json();
            showPopup("error-alert", error.message);
            return;
        }

        showPopup("positive-response", "You have completed your today's challenge.");
        loadMyChallengeDetails(challengeId);
    }catch(e){
        console.error(e);
    }finally{
        hideLoading();
    }
}



// Helper Functions
function formatDate(normalDate){
    const date = new Date(normalDate);

    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return formattedDate;
}

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
    loadingOverlay.classList.remove("hidden");
}
function hideLoading() {
    loadingOverlay.classList.add("hidden");
}