const base_url = "http://localhost:8080";
const point_url = base_url + "/api/point/user";
const habit_url = base_url + "/habits";
const challenge_url = base_url + "/api/challenge"

const userId = localStorage.getItem("userId");

const point_stats = document.getElementById("points");
const habit_stats = document.getElementById("total-habits");
const challenge_stats = document.getElementById("total-challenges");

const habit_container = document.getElementById("habit-container");
const challenge_container = document.getElementById("challenge-container");

let habit_array = [];
let four_habits = [];

let challenges = [];
let three_challenges = [];

document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
    loadHabtis();
    loadChallenges();
});

async function loadDashboardStats(){
    try{
        const point_response = await fetch(`${point_url}/${userId}`);
        const points = await point_response.json();
        point_stats.textContent = points;

        const habit_response = await fetch(`${habit_url}/total/${userId}`);
        const totalHabits = await habit_response.json();
        habit_stats.textContent = totalHabits;

        const challenge_response = await fetch(`${challenge_url}/total/${userId}`);
        const totalChallenges = await challenge_response.json();
        challenge_stats.textContent = totalChallenges;
    }catch(e){
        console.error(e);
    }
}

async function loadHabtis(){
    try{
        const response = await fetch(`${habit_url}/${userId}`);
        habit_array = await response.json();
        four_habits = habit_array.slice(0,4);

        if(four_habits.length == 0) return;
        
        habit_container.innerHTML = "";
        for(const habit of four_habits){
            const response = await fetch(`${habit_url}/canComplete/${habit.id}`);
            const canComplete = await response.json();
            const habit_row = createHabitRow(habit, canComplete);
            habit_container.appendChild(habit_row);
        }
    }catch(e){
        console.error(e);
    }
}

function createHabitRow(habit, canComplete){
    const habit_row = document.createElement("div");
    habit_row.classList = `item ${canComplete ? '' : 'done'}`;

    habit_row.innerHTML = `
    <span class="item-icon">${canComplete ? '<i class="fa-solid fa-location-crosshairs"></i>' : '<i class="fa-solid fa-circle-check"></i>'}</span>
    <div>
        <p class="item-title ${canComplete ? '' : 'done-text'}">${habit.name}</p>
        <p class="item-meta">${habit.streak} day${habit.streak > 1 ? 's' : ''} streak</p>
    </div>
    `;

    return habit_row;
}

async function loadChallenges(){
    try{
        const response = await fetch(`${challenge_url}/user/${userId}`);
        challenges = await response.json();
        three_challenges = challenges.slice(0,4);

        if(three_challenges.length === 0) {
            challenge_container.className = "";
            return;
        }else challenge_container.className = "challenge-grid";
        
        challenge_container.innerHTML = "";
        for(const challenge of three_challenges){
            const response = await fetch(`${challenge_url}/total/participants/${challenge.challengeId}`);
            const totalParticipants = await response.json();
            
            const challengeCard = createChallengeCard(challenge, totalParticipants);
            challenge_container.appendChild(challengeCard);
        }
    }catch(e){
        console.error(e);
    }
}

function createChallengeCard(challenge, totalParticipants){
    const challengeCard = document.createElement("div");
    challengeCard.className = "challenge-card";

    challengeCard.innerHTML = `
    <div class="challenge-title">
        <span class="challenge-icon"><i class="fa-solid fa-trophy"></i></span>
        <div>
            <strong>${challenge.challengeName}</strong>
            <p>${totalParticipants} participant${totalParticipants > 1 ? 's' : ''}</p>
        </div>
    </div>
    <p>Created on ${formatDate(challenge.creationDate)}</p>
    <div class="challenge-progress">
        <span>Progress</span>
        <strong id="progress">40%</strong>
    </div>
    <div class="progress-bar">
        <div id="progress-bar-style" style="width: 40%"></div>
    </div>
    `;

    const progress_status = challengeCard.querySelector("#progress");
    const progress_bar = challengeCard.querySelector("#progress-bar-style");

    const progress = Math.floor((challenge.streak / challenge.durationDays) * 100);
    progress_status.textContent = `${progress}%`;
    progress_bar.style.width = `${progress}%`

    return challengeCard;
}

function formatDate(normalDate){
    const date = new Date(normalDate);

    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return formattedDate;
}