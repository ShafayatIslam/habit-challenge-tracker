const base_url = "http://localhost:8080";
const challenge_url = base_url + "/api/challenge/total";
const habit_url = base_url + "/habits/total";
const point_url = base_url + "/api/point/leaderboard";

const podium_container = document.querySelector(".podium-container");
const table_container = document.querySelector(".table-container tbody");
const loadingOverlay = document.getElementById("loading-overlay");

const userId = 19;

loadLeaderboard();

async function loadLeaderboard(){
    showLoading();
    try{
        const response = await fetch(`${point_url}`);
        const leaderboardUsers = await response.json();

        podium_container.innerHTML = "";
        table_container.innerHTML = "";

        const first = leaderboardUsers[0];
        const second = leaderboardUsers[1];
        const third = leaderboardUsers[2];

        if(second){
            const podiumCard = createPodiumCard(2, second);
            podium_container.appendChild(podiumCard);
        }

        if(first){
            const podiumCard = createPodiumCard(1, first);
            podium_container.appendChild(podiumCard);
        }

        if(third){
            const podiumCard = createPodiumCard(3, third);
            podium_container.appendChild(podiumCard);
        }

        let rank = 1;
        for(const user of leaderboardUsers){

            const challengeResponse = await fetch(`${challenge_url}/${user.userId}`);
            const totalChallenges = await challengeResponse.json();

            const habitResponse = await fetch(`${habit_url}/${user.userId}`);
            const totalHabits = await habitResponse.json();

            const table_row = createTableRow(rank, user, totalChallenges, totalHabits);
            table_container.appendChild(table_row);
            rank++;
        }
        
    }catch(e){
        console.error(e);
    }finally{
        hideLoading();
    }
}

function createPodiumCard(rank, user){
    const podiumCard = document.createElement("div");
    podiumCard.classList = `podium-card rank-${rank}`;

    if(rank === 1){
        podiumCard.innerHTML = `
        <div class="podium-icon icon-gold"><i class="fa-solid fa-crown"></i></div>
        <div class="podium-rank">1</div>
        <div class="podium-name">${user.fullName}</div>
        <div class="podium-score">${user.point}</div>
        <div class="podium-label">points</div>
        `;
    }else if(rank === 2){
        podiumCard.innerHTML = `
        <div class="podium-icon icon-silver"><i class="fa-solid fa-medal"></i></div>
        <div class="podium-rank">2</div>
        <div class="podium-name">${user.fullName}</div>
        <div class="podium-score">${user.point}</div>
        <div class="podium-label">point</div>
        `;
    }else if(rank === 3){
        podiumCard.innerHTML = `
        <div class="podium-icon icon-bronze"><i class="fa-solid fa-trophy"></i></div>
        <div class="podium-rank">3</div>
        <div class="podium-name">${user.fullName}</div>
        <div class="podium-score">${user.point}</div>
        <div class="podium-label">rating</div>
        `;
    }

    return podiumCard;
}


function createTableRow(rank, user, totalChallenges, totalHabits){
    const table_row = document.createElement("tr");
    table_row.className = `${user.userId === userId ? "row-me" : ""}`;

    if(rank < 4){
        table_row.innerHTML = `
        <td class="rank-text-purple">#${rank}</td>
        <td>${user.username} ${user.userId === userId ? '<span class="badge-you">You</span>' : ''}</td>
        <td>${user.fullName}</td>
        <td class="text-center" style="font-weight: 700;">${user.point}</td>
        <td class="text-center text-muted">${totalChallenges}</td>
        <td class="text-center text-muted">${totalHabits}</td>
        `;
    }else{
        table_row.innerHTML = `
        <td>#${rank}</td>
        <td>${user.username} ${user.userId === userId ? '<span class="badge-you">You</span>' : ''}</td>
        <td>${user.fullName}</td>
        <td class="text-center" style="font-weight: 700;">${user.point}</td>
        <td class="text-center text-muted">${totalChallenges}</td>
        <td class="text-center text-muted">${totalHabits}</td>
        `;
    }

    return table_row;
}

function showLoading() {
    loadingOverlay.classList.replace("hidden", "overlay");
}
function hideLoading() {
    loadingOverlay.classList.add("overlay", "hidden");
}