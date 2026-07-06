const url = "http://localhost:8080/habits";

const userId = localStorage.getItem("userId");

let habitsArray = [];

let currentCategoryFilter = "All"; 
let deleteTargetId = null;          
let editTargetId = null;            

async function loadHabits(){
    showLoading();
    try{
        const response = await fetch(`${url}/${userId}`);
        habitsArray = await response.json();

        if(habitsArray.length === 0){
            document.getElementById("habit-empty-state").classList.remove("hidden");
            hideLoading();
            return;
        }else
            document.getElementById("habit-empty-state").classList.add("hidden");
        
        hideLoading();
        renderHabits();
    }catch(e){
        console.error("Error loading habits: ",e);
    }
}

// DOMContentLoaded & Event Listeners
document.addEventListener("DOMContentLoaded", () => {

    loadHabits();

    // --- Modal Elements ---
    // Add/Edit/Delete 
    const addModal = document.getElementById("form");
    const editModal = document.getElementById("edit-form");
    const deleteModal = document.getElementById("overlay");

    // --- Open Add Modal ---
    // Add Habit button clicked
    document.getElementById("btn-open-add-modal").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("add-habit-form").reset(); // form clean kore dilam
        addModal.classList.remove("hidden");               // modal show
    });

    // --- Close Add Modal ---
    // Add modal cancel button clicked -> modal hide 
    document.getElementById("btn-close-add-modal").addEventListener("click", (e) => {
        e.preventDefault();
        addModal.classList.add("hidden");
    });

    // --- Submit Add Form ---
    // Add form submit button clicked -> new habit created
    document.getElementById("add-habit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const newHabit = {
            name: document.getElementById("name").value.trim(),
            description: document.getElementById("desc").value.trim(),
            frequency: document.getElementById("frequency").value,
            type: document.getElementById("type").value,
            streak: 0,
            userId: userId
        };

        showLoading();
        try{
            const response = await fetch(`${url}/creation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newHabit)
            });

            if(!response.ok){
                const error = await response.json();
                console.log(error.message);
                hideLoading();
                return;
            }

            hideLoading();
            loadHabits();
            addModal.classList.add("hidden");
        }catch(e){
            console.error(e);
        }
    });

    // --- Close Edit Modal ---
    // Edit modal close button clicked -> modal hide
    document.getElementById("btn-close-edit-modal").addEventListener("click", (e) => {
        e.preventDefault();
        editModal.classList.add("hidden");
        editTargetId = null;
    });

    // --- Submit Edit Form ---
    // Edit form submit button clicked -> habit updated
    document.getElementById("edit-habit-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const updateHabit = {
            name: document.getElementById("edit-name").value.trim(),
            description: document.getElementById("edit-desc").value.trim(),
            frequency: document.getElementById("edit-frequency").value,
            type: document.getElementById("edit-type").value
        }

        showLoading();
        try{
            const response = await fetch(`${url}/update/${editTargetId}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateHabit)
            });

            if(!response.ok){
                const error = await response.json();
                alert(error.message);
                hideLoading();
                return;
            }

            hideLoading();
            loadHabits();
        }catch(e){
            console.error(e);
        }
        
        editModal.classList.add("hidden"); // Modal close
        editTargetId = null;                // Edit state reset
    });

    // --- Confirm Delete ---
    // Delete confirm button clicked -> habit deleted
    document.getElementById("btn-confirm-delete").addEventListener("click", async (e) => {
        e.preventDefault();

        showLoading();
        try{
            const response = await fetch(`${url}/delete/${deleteTargetId}`,{
                method: "DELETE"
            });

            if(!response.ok){
                const error = await response.json();
                console.log(error.message);
                hideLoading();
                return;
            }

            hideLoading();
            habitsArray = habitsArray.filter(h => h.id !== deleteTargetId); // Remove habit
            renderHabits();
            deleteModal.classList.add("hidden");
            deleteTargetId = null;     
        }catch(e){
            console.error(e);
        }
    });

    // --- Cancel Delete ---
    document.getElementById("btn-cancel-delete").addEventListener("click", (e) => {
        e.preventDefault();
        deleteModal.classList.add("hidden");
        deleteTargetId = null;
    });

    // --- Category Filters (All/Fitness/Wellness/health/Learning) ---
    document.getElementById("category-filters").addEventListener("click", (e) => {
        const filterBtn = e.target.closest(".filter-btn");
        if (filterBtn) {
            e.preventDefault();
            
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            
            // Add active class to clicked filter button
            filterBtn.classList.add("active");
            
            // Update filter state and render
            currentCategoryFilter = filterBtn.getAttribute("data-category");
            renderHabits();
        }
    });

    // --- Habit List: Complete, Edit, Delete button action---
    // If any buttons in Habit list is clicked, will be handled here.
    document.getElementById("habitlist").addEventListener("click", (e) => {
        const targetBtn = e.target.closest("button");
        if (!targetBtn) return;
        
        e.preventDefault();
        const habitId = parseInt(targetBtn.getAttribute("data-id")); // from data-id attribute of buttons

        // Mark as Complete
        // If Complete button in habit card is clicked. 
        if (targetBtn.classList.contains("complete")) {
            markComplete(habitId);
        }

        // Open Delete Confirmation
        // Delete button clicked
        if (targetBtn.classList.contains("delete")) {
            deleteTargetId = habitId;
            deleteModal.classList.remove("hidden");
        }

        // Open Edit Modal 
        if (targetBtn.classList.contains("edit")) {
            const habit = habitsArray.find(h => h.id === habitId);
            if (habit) {
                editTargetId = habit.id;
                document.getElementById("edit-name").value = habit.name;
                document.getElementById("edit-desc").value = habit.description;
                document.getElementById("edit-frequency").value = habit.frequency;
                document.getElementById("edit-type").value = habit.type;
                editModal.classList.remove("hidden");
            }
        }
    });

});

async function markComplete(habitId){
    await fetch(`${url}/markComplete/${habitId}`);
    renderHabits();
}

  
// Render habit cards
async function renderHabits() {
    showLoading();
    const habitListContainer = document.getElementById("habitlist");
    habitListContainer.innerHTML = ""; // Clear existing list (purono card remove)

    // Filter habit logic
    let filteredHabits = habitsArray;
    if (currentCategoryFilter !== "All") {
        filteredHabits = habitsArray.filter(habit => habit.type === currentCategoryFilter);
    }

    // Generate HTML for each habit
    for(habit of filteredHabits){
        
        //Check habit whether it can be completed or not.
        const response = await fetch(`${url}/canComplete/${habit.id}`);
        const canComplete = await response.json();

        const titleClass = habit.isCompleted ? "habit-completed-title" : "";
        const checkIconHTML = habit.isCompleted ? `<i class="fa-solid fa-check check-icon"></i>` : "";

        // Button state: complete vs completed (disabled)
        const btnClass = canComplete ? "complete" : "completed";
        const btnText = canComplete ? "Mark Complete" : "Completed";
        const btnDisabled = canComplete ? "" : "disabled";

        // Creating card HTML
        const cardHTML = `
            <div class="card">
                <h3 class="${titleClass}">${habit.name} ${checkIconHTML}</h3>
                <p id="desc-para">${habit.description}</p>
                
                <div class="freq-type">
                    <p id="freq-para">${habit.frequency}</p>
                    <p id="type-para">${habit.type}</p>
                </div>
                
                <div class="streak">
                    <p id="streak-para">Current streak</p>
                    <p id="streak-count">${habit.streak} days</p>
                </div>
                
                <div class="card-btn">
                    <button class="${btnClass}" ${btnDisabled} data-id="${habit.id}">${btnText}</button>
                    <button class="edit" data-id="${habit.id}">Edit</button>
                    <button class="delete" data-id="${habit.id}">Delete</button>
                </div>
            </div>
        `;

        habitListContainer.insertAdjacentHTML("beforeend", cardHTML); // Add card to UI
    }
    hideLoading();
}

const loadingOverlay = document.getElementById("loading-overlay");
function showLoading() {
    loadingOverlay.classList.replace("hidden", "overlay");
}
function hideLoading() {
    loadingOverlay.classList.replace("overlay", "hidden");
}