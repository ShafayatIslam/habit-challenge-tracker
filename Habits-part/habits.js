// tui ei array ta bad diya api call kore data nis ata ami create korci dom er kaj thik hoice kina check korar jonno
let habitsArray = [
    { id: 1, name: "Morning Meditation", desc: "10 minutes of mindfulness", freq: "Daily", type: "Wellness", streak: 12, isCompleted: true },
    { id: 2, name: "Exercise", desc: "30 minutes workout", freq: "Daily", type: "Fitness", streak: 8, isCompleted: true },
    { id: 3, name: "Read", desc: "Read 20 pages", freq: "Daily", type: "Learning", streak: 15, isCompleted: false },
    { id: 4, name: "Drink Water", desc: "8 glasses per day", freq: "Daily", type: "Health", streak: 10, isCompleted: false }
];

let currentCategoryFilter = "All"; 
let deleteTargetId = null;          
let editTargetId = null;              
// DOMContentLoaded mane: HTML elements gula load hoye gele tarpor JS run hobe
document.addEventListener("DOMContentLoaded", () => {
    
    // Initial Render: page load hole prothome habits list ta UI te dekhabe
    renderHabits();
    const addModal = document.getElementById("form");
    const editModal = document.getElementById("edit-form");
    const deleteModal = document.getElementById("overlay");

    // Add Habit button click korle add form open hobe
    document.getElementById("btn-open-add-modal").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("add-habit-form").reset(); 
        addModal.classList.remove("hidden");             
    });

    // Add modal close button e click korle modal abar hide hobe
    document.getElementById("btn-close-add-modal").addEventListener("click", (e) => {
        e.preventDefault();
        addModal.classList.add("hidden");
    });

    // Add form submit hole notun habit object banabo + array te push hobe tui array te push na kore data base e push koris
    document.getElementById("add-habit-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        // New habit data collect kora hocche input theke
        const newHabit = {
            id: Date.now(), // Unique ID generation for frontend
            name: document.getElementById("name").value.trim(),
            desc: document.getElementById("desc").value.trim(),
            freq: document.getElementById("frequency").value,
            type: document.getElementById("type").value,
            streak: 0,
            isCompleted: false
        };

        habitsArray.push(newHabit);     
        renderHabits();                 
        addModal.classList.add("hidden");
    });
    //Close Edit Modal
    // Edit modal close button click korle modal hide hobe and ui reset hoibe
    document.getElementById("btn-close-edit-modal").addEventListener("click", (e) => {
        e.preventDefault();
        editModal.classList.add("hidden");
        editTargetId = null;
    });

    //   Submit Edit Form  
    // Edit form submit hole array er oi specific habit update korbo, then UI re-render hobe
    document.getElementById("edit-habit-form").addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Array te oi habit er index ber kora hocche (id match kore)
        const index = habitsArray.findIndex(h => h.id === editTargetId);
        if (index !== -1) {
            // Form theke notun value diye update kora hocche
            habitsArray[index].name = document.getElementById("edit-name").value.trim();
            habitsArray[index].desc = document.getElementById("edit-desc").value.trim();
            habitsArray[index].freq = document.getElementById("edit-frequency").value;
            habitsArray[index].type = document.getElementById("edit-type").value;
            
            renderHabits(); // Update er por UI refresh
        }
        
        editModal.classList.add("hidden"); 
        editTargetId = null;               
    });

    //   Confirm Delete  
    // Delete confirm button click korle array theke oi habit remove + UI re-render
    document.getElementById("btn-confirm-delete").addEventListener("click", (e) => {
        e.preventDefault();
        habitsArray = habitsArray.filter(h => h.id !== deleteTargetId); 
        renderHabits();                                                 
        deleteModal.classList.add("hidden");                          
        deleteTargetId = null;                                          
    });

    // Cancel Delete  
    // Cancel korle modal close hobe, ar  target reset hobe
    document.getElementById("btn-cancel-delete").addEventListener("click", (e) => {
        e.preventDefault();
        deleteModal.classList.add("hidden");
        deleteTargetId = null;
    });
    //   Category Filters (Event Delegation)  
    //  parent container e 1 t listener, vitore kono  button click hoilo seta closest() diye dora
    document.getElementById("category-filters").addEventListener("click", (e) => {
        const filterBtn = e.target.closest(".filter-btn");
        if (filterBtn) {
            e.preventDefault();
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            filterBtn.classList.add("active");
            currentCategoryFilter = filterBtn.getAttribute("data-category");
            renderHabits();
        }
    });

    
    // Habit list er vitore  button click  hole ekhan handle hobe
    document.getElementById("habitlist").addEventListener("click", (e) => {
        const targetBtn = e.target.closest("button");
        if (!targetBtn) return;
        
        e.preventDefault();
        const habitId = parseInt(targetBtn.getAttribute("data-id")); // button er data-id theke habit id neya

        // Mark as Complete
        // Complete button press korle isCompleted true kore UI re-render
        if (targetBtn.classList.contains("complete")) {
            const index = habitsArray.findIndex(h => h.id === habitId);
            if (index !== -1) {
                habitsArray[index].isCompleted = true;
                // Optional: Increment streak when completed
                // habitsArray[index].streak += 1; 
                renderHabits();
            }
        }
        // Delete button press korle deleteTargetId set hobe delete modal open hobe
        if (targetBtn.classList.contains("delete")) {
            deleteTargetId = habitId;
            deleteModal.classList.remove("hidden");
        }
        // Edit button press korle oi habit er data edit form e fill kore modal open hobe
        if (targetBtn.classList.contains("edit")) {
            const habit = habitsArray.find(h => h.id === habitId);
            if (habit) {
                editTargetId = habit.id;
                document.getElementById("edit-name").value = habit.name;
                document.getElementById("edit-desc").value = habit.desc;
                document.getElementById("edit-frequency").value = habit.freq;
                document.getElementById("edit-type").value = habit.type;
                editModal.classList.remove("hidden");
            }
        }
    });

});


  
// RENDER FUNCTION
// ei funcition er kaj UI list clear kora,Filter apply kora (All vs specific category),Prottek habit er jonno card html banano,HTML container e add kora
function renderHabits() {
    const habitListContainer = document.getElementById("habitlist");
    habitListContainer.innerHTML = ""; // Clear existing list (purono card remove)
    let filteredHabits = habitsArray;
    if (currentCategoryFilter !== "All") {
        filteredHabits = habitsArray.filter(habit => habit.type === currentCategoryFilter);
    }
    // prottek ta habit er jonno html create kora
    filteredHabits.forEach(habit => {
        const titleClass = habit.isCompleted ? "habit-completed-title" : "";
        const checkIconHTML = habit.isCompleted ? `<i class="fa-solid fa-check check-icon"></i>` : "";
    
        const btnClass = habit.isCompleted ? "completed" : "complete";
        const btnText = habit.isCompleted ? "Completed" : "Mark Complete";
        const btnDisabled = habit.isCompleted ? "disabled" : "";
        const cardHTML = `
            <div class="card">
                <h3 class="${titleClass}">${habit.name} ${checkIconHTML}</h3>
                <p id="desc-para">${habit.desc}</p>
                
                <div class="freq-type">
                    <p id="freq-para">${habit.freq}</p>
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

        habitListContainer.insertAdjacentHTML("beforeend", cardHTML); // UI te card add
    });
}


