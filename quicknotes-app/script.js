 // Select elements from the page
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

// Render notes on the page
function render() {
  notesList.textContent = "";

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchTerm);
  });

  // Update count
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }

  // Show search message if nothing matches
  if (filteredNotes.length === 0 && searchTerm !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
    return;
  }

  // Display each note
  filteredNotes.forEach(function (note) {
    const listItem = document.createElement("li");
    listItem.classList.add("note-card");

    // Add category class
    if (note.category === "Personal") {
      listItem.classList.add("category-personal");
    } else if (note.category === "Work") {
      listItem.classList.add("category-work");
    } else if (note.category === "Study") {
      listItem.classList.add("category-study");
    }

    // Note text
    const noteText = document.createElement("p");
    noteText.classList.add("note-text");
    noteText.textContent = note.text;

    // Category label
    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("category-label");
    categoryLabel.textContent = note.category;

    // Date
    const noteDate = document.createElement("p");
    noteDate.classList.add("note-date");
    noteDate.textContent = note.createdAt;

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteNote(note.id);
    });

    // Add elements to the card
    listItem.appendChild(noteText);
    listItem.appendChild(categoryLabel);
    listItem.appendChild(noteDate);
    listItem.appendChild(deleteButton);

    // Add card to list
    notesList.appendChild(listItem);
  });
}

// Add a new note
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Create note object
  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString()
  };

  // Add note to array
  notes.push(newNote);

  // Save and display
  saveNotes();
  render();

  // Clear form
  noteInput.value = "";
  errorMessage.textContent = "";
});

// Delete a note
function deleteNote(id) {
  notes = notes.filter(function (note) {
    return note.id !== id;
  });

  saveNotes();
  render();
}

// Search notes while typing
searchInput.addEventListener("input", function () {
  render();
});

// Initial display
render();