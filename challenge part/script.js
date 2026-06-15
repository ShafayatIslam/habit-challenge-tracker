 

/// damy data 
let challengesArray = [
    {
        id: 1,
        title: "30-Day Fitness Challenge",
        description: "Complete daily workouts for 30 days to build a consistent fitness routine and improve overall health.",
        creator: "Sarah Johnson",
        type: "public",
        participants: 24,
        duration: 30,
        progress: 40,
        status: "active",
        startDate: "2026-04-01",
        endDate: "2026-04-30",
        joined: true, 
        rules: [
            "Complete at least 30 minutes of exercise daily",
            "Log your workout in the app",
            "Stay consistent - max 2 rest days per week",
            "Support fellow participants"
        ],
        leaderboard: [
            { name: "Sarah Johnson", rating: 2850, days: 12 },
            { name: "Mike Chen", rating: 2720, days: 12 },
            { name: "Emma Davis", rating: 2680, days: 11 },
            { name: "John Smith", rating: 2540, days: 11 },
            { name: "Lisa Anderson", rating: 2480, days: 10 }
        ]
    },
    {
        id: 2,
        title: "Healthy Eating Challenge",
        description: "Cook healthy meals daily and avoid processed sugar for an entire month.",
        creator: "Admin",
        type: "public",
        participants: 45,
        duration: 30,
        progress: 20,
        status: "active",
        startDate: "2026-05-01",
        endDate: "2026-05-30",
        joined: true,
        rules: ["Eat 3 servings of veggies", "No processed sugar", "Drink 2L water"],
        leaderboard: []
    },
    {
        id: 3,
        title: "Morning Routine Master",
        description: "Perfect your morning routine by waking up at 6 AM and reading for 20 minutes.",
        creator: "Productivity Group",
        type: "private",
        participants: 5,
        duration: 21,
        progress: 50,
        status: "active",
        startDate: "2026-06-01",
        endDate: "2026-06-21",
        joined: false,
        rules: ["Wake up at 6 AM", "Drink a glass of water immediately", "Read 20 pages"],
        leaderboard: []
    },
    {
        id: 4,
        title: "Read Every Day",
        description: "Read at least 20 pages daily to build a sustainable reading habit.",
        creator: "Book Club",
        type: "public",
        participants: 18,
        duration: 21,
        progress: 65,
        status: "active",
        startDate: "2026-04-10",
        endDate: "2026-04-30",
        joined: false,
        rules: ["Read 20 pages daily", "Share key takeaways weekly"],
        leaderboard: []
    }
];

// Current UI state track korar jonno
let currentFilter = "all"; // 'all', 'public', 'private'
let searchQueryAll = "";
let searchQueryMy = "";
let activeChallengeId = null;


 

 
// DOMContentLoaded mane: HTML load hoye gele tarpor JS event attach hobe
document.addEventListener("DOMContentLoaded", () => {

    
    showPage("allChallenges");

    document.getElementById("btn-goto-my-challenges").addEventListener("click", (e) => {
        e.preventDefault();
        showPage("myChallenges");
    });

    document.getElementById("btn-back-to-challenges").addEventListener("click", (e) => {
        e.preventDefault();
        showPage("allChallenges");
    });

    
    document.getElementById("btn-explore-challenges").addEventListener("click", (e) => {
        e.preventDefault();
        showPage("allChallenges");
    });

    const btnSearchRedirect = document.getElementById("btn-search-redirect");
    if(btnSearchRedirect) {
        btnSearchRedirect.addEventListener("click", (e) => {
            e.preventDefault();
            const searchInput = document.getElementById("search-my");
            searchInput.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => searchInput.focus(), 300);
        });
    }


    
    document.getElementById("search-all").addEventListener("input", (e) => {
        searchQueryAll = e.target.value.toLowerCase();
        renderAllChallenges();
    });

    document.getElementById("search-my").addEventListener("input", (e) => {
        searchQueryMy = e.target.value.toLowerCase();
        renderMyChallenges();
    });

    document.getElementById("filter-all-challenges").addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (btn) {
            e.preventDefault();
            
            document.querySelectorAll("#filter-all-challenges .filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            renderAllChallenges();
        }
    });

    
    const createModal = document.getElementById("create-modal-overlay");
    const createForm = document.getElementById("form-create-challenge");

    document.getElementById("btn-open-create-modal").addEventListener("click", (e) => {
        e.preventDefault();
        // Form reset kore fresh modal open kora hocche
        createForm.reset();
        createModal.classList.remove("hidden");
    });

    document.getElementById("btn-cancel-create").addEventListener("click", (e) => {
        e.preventDefault();
        createModal.classList.add("hidden");
    });

    // Create form submit hole notun challenge object banabo + array te push + UI update
    createForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Input theke date/duration ber kore basic validation kora hocche
        const duration = parseInt(document.getElementById("c-duration").value);
        const start = document.getElementById("c-start").value;
        const end = document.getElementById("c-end").value;

        if (duration <= 0) {
            alert("Duration must be greater than 0"); return;
        }
        if (new Date(end) <= new Date(start)) {
            alert("End date must be after start date"); return;
        }

        const newChallenge = {
            id: Date.now(),
            title: document.getElementById("c-name").value.trim(),
            description: document.getElementById("c-desc").value.trim(),
            creator: "Current User",
            type: document.getElementById("c-type").value,
            participants: 1,
            duration: duration,
            progress: 0,
            status: "active",
            startDate: start,
            endDate: end,
            joined: true, // Creator auto joins
            rules: ["Follow challenge guidelines"],
            leaderboard: [{ name: "Current User", rating: 100, days: 0 }]
        };

        // New challenge ta array er shuru te add kora hocche
        challengesArray.unshift(newChallenge);
        createModal.classList.add("hidden");
        
        // User join koreche bole My Challenges view e fire jawa hocche
        showPage("myChallenges");
    });


    // --- Grid event delegation (View Details open) ---
    const allGrid = document.getElementById("all-challenges-grid");
    const myGrid = document.getElementById("my-challenges-grid");

    function handleCardClick(e) {
        const card = e.target.closest(".challenge-card");
        if (card) {
            e.preventDefault();
            // Card theke id dhore details page open kora hocche
            activeChallengeId = parseInt(card.getAttribute("data-id"));
            showPage("challengeDetails");
        }
    }

    allGrid.addEventListener("click", handleCardClick);
    myGrid.addEventListener("click", handleCardClick);


    // --- Details page e join button handle kora hocche ---
    document.getElementById("details-container").addEventListener("click", (e) => {
        const joinBtn = e.target.closest("#btn-join-challenge");
        if (joinBtn) {
            e.preventDefault();
            // Join korle challenge state update hoye details abar render hocche
            const index = challengesArray.findIndex(c => c.id === activeChallengeId);
            if (index !== -1) {
                challengesArray[index].joined = true;
                challengesArray[index].participants += 1;
                renderChallengeDetails(activeChallengeId); // re-render details to hide join button
                alert("Successfully joined the challenge!");
            }
        }
    });

});


 
// 3. RENDER & HELPER FUNCTIONS
 

// SPA routing controller
function showPage(pageId) {
    // Age sob view hide kora hocche
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
    // Tarpor target view show kora hocche
    document.getElementById(`view-${pageId}`).classList.remove("hidden");

    // Page onujayi relevant render call hocche
    if (pageId === "allChallenges") renderAllChallenges();
    else if (pageId === "myChallenges") renderMyChallenges();
    else if (pageId === "challengeDetails") renderChallengeDetails(activeChallengeId);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper: ekta challenge card er HTML generate kore
function generateCardHTML(challenge) {
    const iconType = challenge.type === 'public' ? 'fa-globe' : 'fa-lock';
    
    return `
        <div class="challenge-card" data-id="${challenge.id}">
            <div class="card-header-top">
                <div class="card-icon"><i class="fa-solid fa-trophy"></i></div>
                <i class="fa-solid ${iconType} card-type-icon" title="${challenge.type}"></i>
            </div>
            <h3>${challenge.title}</h3>
            <p class="desc">${challenge.description}</p>
            
            <div class="card-meta">
                <span><i class="fa-solid fa-user-group text-muted"></i> ${challenge.participants}</span>
                <span>${challenge.duration} days</span>
                <span class="badge-active">${challenge.status}</span>
            </div>
            
            <div class="progress-wrapper">
                <div class="progress-header">
                    <span>Progress</span>
                    <span>${challenge.progress}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${challenge.progress}%;"></div>
                </div>
            </div>
        </div>
    `;
}

// All challenges list render kora hocche
function renderAllChallenges() {
    const grid = document.getElementById("all-challenges-grid");
    grid.innerHTML = "";

    // Search + category filter apply kora hocche
    let filtered = challengesArray.filter(c => {
        // Search text match
        const matchSearch = c.title.toLowerCase().includes(searchQueryAll) || c.description.toLowerCase().includes(searchQueryAll);
        // Category/type filter
        const matchType = currentFilter === "all" ? true : c.type === currentFilter;
        return matchSearch && matchType;
    });

    filtered.forEach(challenge => {
        grid.insertAdjacentHTML("beforeend", generateCardHTML(challenge));
    });
}

// My challenges list render kora hocche
function renderMyChallenges() {
    const grid = document.getElementById("my-challenges-grid");
    const emptyState = document.getElementById("empty-state-my");
    grid.innerHTML = "";

    let joinedChallenges = challengesArray.filter(c => c.joined);

    // Jodi joined challenge na thake tahole empty state dekhabo
    if (joinedChallenges.length === 0) {
        emptyState.classList.remove("hidden");
        document.getElementById("btn-search-redirect").style.display = "none";
        return;
    } else {
        emptyState.classList.add("hidden");
        document.getElementById("btn-search-redirect").style.display = "block";
    }

    // Joined challenges er moddhe search filter apply kora hocche
    let filtered = joinedChallenges.filter(c => {
        return c.title.toLowerCase().includes(searchQueryMy) || c.description.toLowerCase().includes(searchQueryMy);
    });

    filtered.forEach(challenge => {
        grid.insertAdjacentHTML("beforeend", generateCardHTML(challenge));
    });
}

// Challenge details page render kora hocche
function renderChallengeDetails(id) {
    const container = document.getElementById("details-container");
    const challenge = challengesArray.find(c => c.id === id);
    if (!challenge) return;

    // Rules list er HTML create kora hocche
    let rulesHTML = "";
    challenge.rules.forEach((rule, index) => {
        rulesHTML += `<li><div class="rule-num">${index + 1}</div> <p>${rule}</p></li>`;
    });

    // Leaderboard list er HTML create kora hocche
    let leaderboardHTML = "";
    if (challenge.leaderboard.length === 0) {
        leaderboardHTML = `<p class="text-muted">No participants yet. Be the first to join!</p>`;
    } else {
        challenge.leaderboard.forEach((user, index) => {
            let rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "";
            let rankIcon = index < 3 ? `<i class="fa-solid fa-crown"></i>` : index + 1;
            
            leaderboardHTML += `
                <div class="lb-item">
                    <div class="rank-badge ${rankClass}">${rankIcon}</div>
                    <div class="lb-info">
                        <h4>${user.name}</h4>
                        <p>Rating: ${user.rating}</p>
                    </div>
                    <div class="lb-score">
                        <h4>${user.days}</h4>
                        <p>days completed</p>
                    </div>
                </div>
            `;
        });
    }

    // User already joined thakle join button disable kora hocche
    const joinBtnHTML = challenge.joined ? 
        `<button class="btn btn-primary" style="width:100%;" disabled>Already Joined ✓</button>` :
        `<button class="btn btn-primary" style="width:100%;" id="btn-join-challenge">Join Challenge</button>`;

    // Details page er main layout build kora hocche
    container.innerHTML = `
        <div class="details-header-card">
            <div class="details-title-row">
                <div class="title-left">
                    <div class="card-icon"><i class="fa-solid fa-trophy"></i></div>
                    <div>
                        <h1>${challenge.title}</h1>
                        <p class="creator-text">Created by ${challenge.creator}</p>
                    </div>
                </div>
                <span class="badge-active">${challenge.status}</span>
            </div>
            
            <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px;">${challenge.description}</p>
            
            <div class="details-stats-row">
                <div class="stat-item">
                    <i class="fa-solid fa-user-group"></i>
                    <div>
                        <span class="stat-label">Participants</span>
                        <span class="stat-value">${challenge.participants}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-regular fa-calendar"></i>
                    <div>
                        <span class="stat-label">Duration</span>
                        <span class="stat-value">${challenge.duration} days</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-solid fa-fire"></i>
                    <div>
                        <span class="stat-label">Start Date</span>
                        <span class="stat-value">${new Date(challenge.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fa-regular fa-calendar-check"></i>
                    <div>
                        <span class="stat-label">End Date</span>
                        <span class="stat-value">${new Date(challenge.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <div class="progress-wrapper">
                <div class="progress-header">
                    <span class="text-muted">Challenge Progress</span>
                    <span>${challenge.progress}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${challenge.progress}%;"></div>
                </div>
            </div>
        </div>

        <div class="details-layout">
            <div class="details-card">
                <h3>Challenge Rules</h3>
                <ul class="rules-list">
                    ${rulesHTML}
                </ul>
                ${joinBtnHTML}
            </div>
            
            <div class="details-card">
                <h3>Participant Leaderboard</h3>
                <div class="leaderboard-list">
                    ${leaderboardHTML}
                </div>
            </div>
        </div>
    `;
}