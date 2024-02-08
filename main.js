//1.  getting all the data when page gets rendered
window.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.querySelector(".card-container");
  const noBooksAddedMessage = document.createElement("h1");
  noBooksAddedMessage.classList.add("no-books-added");
  noBooksAddedMessage.textContent = "No Books Added..";

  // Retrieve books from local storage
  let books = JSON.parse(localStorage.getItem("books")) || [];

  // Populate books from local storage
  if (books.length === 0) {
    cardContainer.appendChild(noBooksAddedMessage);
  } else {
    books.forEach((book) => {
      addBookToDOM(book);
    });
  }
});

const form = document.querySelector(".data-form");
const cards = document.querySelector(".card-container");
const searchInput = document.getElementById("search");
let booksArr = [];

// Function to save books to local storage
function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Class representing a Book
class Book {
  constructor(title, author, genre, isbn, available) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this._isbn = isbn;
    this.available = available;
  }

  // Getter method
  get isbn() {
    return this._isbn;
  }

  // Setter method for ISBN with validation
  set isbn(newIsbn) {
    if (/^\d{3}-\d{3}-\d{3}$/.test(newIsbn)) {
      this._isbn = newIsbn;
    } else {
      alert("Please Enter Valid ISBN");
    }
  }
}

// Function to save books to local storage
function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Event listener for form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form input values
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let genre = document.getElementById("genre").value;
  let isbn = document.getElementById("isbn").value;
  let available = document.getElementById("available").checked;

  // Check if it's a regular book or a reference book
  let edition = document.getElementById("edition").value;
  let book;
  if (edition) {
    // If edition is provided, create a ReferenceBook object
    book = new ReferenceBook(title, author, genre, isbn, available, edition);
  } else {
    // Otherwise, create a regular Book object
    book = new Book(title, author, genre, isbn, available);
  }

  // Add book to DOM and array if ISBN is in the correct format
  if (/^\d{3}-\d{3}-\d{3}$/.test(isbn)) {
    addBookToDOM(book);
    booksArr.push(book);
    saveBooksToLocalStorage(booksArr);
    form.reset();
  } else {
    alert("Please Enter Valid ISBN");
  }
});

// Function to add a book to the DOM
function addBookToDOM(book) {
  const card = document.createElement("div");
  card.classList.add("each-card");
  card.innerHTML = `
    <h1>${book.title}</h1>
    <div class="card-content">
      <div class="author-genre">
        <div class="card-author">
          <p class="heading">Author</p>
          <p class="name">${book.author}</p>
        </div>
        <div class="card-genre">
          <p class="heading">Genre</p>
          <p class="name">${book.genre}</p>
        </div>
      </div>
      <div class="card-info">
      <p>Available - ${book.available ? "Yes" : "No"}</p>
      ${book instanceof ReferenceBook ? `<p>Edition - ${book.edition}</p>` : ""}
      </div>
      <div class="card-buttons">
        <button class="delete">Delete</button>
        <button class="return">Return</button>
      </div>
    </div>
  `;
  cards.appendChild(card);

  // Remove the "No Books Added" message if it exists after adding a new book
  const noBooksAddedMessage = document.querySelector(".no-books-added");
  if (noBooksAddedMessage) {
    noBooksAddedMessage.remove();
  }
}

// Delete the Book functionality
cards.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("delete")) {
    const card = target.closest(".each-card");
    card.remove();

    // Remove the deleted book from the books array
    const title = card.querySelector("h1").textContent;
    booksArr = booksArr.filter((book) => book.title !== title);

    // Save updated books to local storage
    saveBooksToLocalStorage(booksArr);
  }
});

// Return the Book functionality
cards.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("return")) {
    const card = target.closest(".each-card");
    card.remove();
    alert("Book is returned successfully!\nThank You");

    // Remove the returned book from the books array
    const title = card.querySelector("h1").textContent;
    booksArr = booksArr.filter((book) => book.title !== title);

    // Save updated books to local storage
    saveBooksToLocalStorage(booksArr);
  }
});

// Searching the Book
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  searchBooks(searchTerm);
});

//Search Function is called when ever user enters any input in search field
function searchBooks(searchTerm) {
  const cards = document.querySelectorAll(".each-card");
  let foundBooks = 0;

  cards.forEach((card) => {
    const title = card.querySelector("h1").textContent.toLowerCase();
    const author = card
      .querySelector(".card-author .name")
      .textContent.toLowerCase();
    const genre = card
      .querySelector(".card-genre .name")
      .textContent.toLowerCase();
    const isbn = card.querySelector(".card-content").textContent.toLowerCase();
    // checking if any  of the fields contains the search term if found just add them to foundBooks count
    if (
      title.includes(searchTerm) ||
      author.includes(searchTerm) ||
      genre.includes(searchTerm) ||
      isbn.includes(searchTerm)
    ) {
      card.style.display = "block";
      foundBooks++;
    } else {
      card.style.display = "none";
    }
  });

  // adding h1 on No-search Msg
  const parentContainer = document.querySelector(".card-container");
  const noBooksFoundMessage = parentContainer.querySelector(".no-books-found");

  // if search results not found and there if h1 not exists just create one and display msg
  if (foundBooks === 0 && !noBooksFoundMessage) {
    const noBooksFound = document.createElement("h1");
    noBooksFound.classList.add("no-books-found");
    noBooksFound.textContent = "No Books Found";
    parentContainer.appendChild(noBooksFound);
    // if search results found and h1 exists remove h1 with its parent div i.e, .no-books-found
  } else if (foundBooks > 0 && noBooksFoundMessage) {
    noBooksFoundMessage.remove();
  }
}

// checkout functionality
const checkoutBtn = document.getElementById("checkoutBtn");
const successOverlay = document.getElementById("successOverlay");

checkoutBtn.addEventListener("click", function () {
  // Show the success message overlay
  successOverlay.style.display = "flex";

  // Clear local storage
  localStorage.removeItem("books");

  // Clear the cards from the DOM
  cards.innerHTML = "";

  // Hide the success message and redirect after 2 seconds
  setTimeout(() => {
    successOverlay.style.display = "none";
    window.location.reload();
  }, 2000);
});
