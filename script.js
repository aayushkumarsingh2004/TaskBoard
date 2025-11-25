function addTask() {
    // 1. Get the text box and the text inside it
    const input = document.getElementById("taskInput");
    const taskText = input.value;

    // 2. If the box is empty, stop here (don't create an empty card)
    if (taskText === "") return;

    // 3. Create a new "div" element (the card)
    const newCard = document.createElement("div");
    newCard.className = "card"; // Give it the CSS class for styling
    newCard.draggable = "true"; // Make it draggable
    newCard.innerText = taskText; // Put the text inside

    // 4. Find the first column (To Do) and add the new card to it
    const todoColumn = document.querySelector(".column");
    todoColumn.appendChild(newCard);

    // 5. Clear the text box so you can type a new task
    input.value = "";
}

// Variable to keep track of what we are dragging
let draggedCard = null;

// 1. LISTEN FOR DRAG START (When you pick up a card)
document.addEventListener("dragstart", function(e) {
    if (e.target.classList.contains("card")) {
        draggedCard = e.target; // "Remember this card!"
        e.target.style.opacity = "0.5"; // Make it look ghost-like
    }
});

// 2. LISTEN FOR DRAG END (When you let go anywhere)
document.addEventListener("dragend", function(e) {
    if (e.target.classList.contains("card")) {
        e.target.style.opacity = "1"; // Make it solid again
        draggedCard = null; // Forget the card
    }
});

// 3. ALLOW DROPPING (By default, browsers stop this, so we must prevent that)
document.addEventListener("dragover", function(e) {
    e.preventDefault(); 
});

// 4. LISTEN FOR DROP (When you let go over a column)
document.addEventListener("drop", function(e) {
    e.preventDefault();
    // Find the closest column (even if you drop on the header text)
    const column = e.target.closest(".column");
    
    // If we found a column and we are holding a card, move it!
    if (column && draggedCard) {
        column.appendChild(draggedCard);
    }
});

