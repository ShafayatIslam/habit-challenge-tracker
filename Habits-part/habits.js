 const addModal = document.getElementById("form");
 const editModal = document.getElementById("edit-form");
const deleteModal = document.getElementById("overlay");
 
 // Add Habit button click korle add form open hobe
    document.getElementById("btn-open-add-modal").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("add-habit-form").reset(); // form clean kore dilam
        addModal.classList.remove("hidden");               // modal show
    });

    // --- Close Add Modal ---
    // Add modal close button e click korle modal hide hobe
    document.getElementById("btn-close-add-modal").addEventListener("click", (e) => {
        e.preventDefault();
        addModal.classList.add("hidden");
    });
    
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

        habitsArray.push(newHabit);     // Array te add hocche
        renderHabits();                 // UI update hocche
        addModal.classList.add("hidden"); // Modal close hocche
    });