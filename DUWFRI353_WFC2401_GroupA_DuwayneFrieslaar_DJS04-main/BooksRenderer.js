import "./scripts"; // Importing a script file (assuming it contains necessary functionality)

class BooksRenderer {
  // Creating a class named BooksRenderer
  render(matches, limit) {
    // Method to render book previews with provided matches and limit
    const fragment = document.createDocumentFragment(); // Creating a document fragment to hold the previews

    // Iterating over a sliced portion of matches (up to the specified limit)
    matches.slice(0, limit).forEach(({ author, id, image, title }) => {
      // Creating a button element for each book preview
      const element = new ElementCreator().createElement(
        "button", // Button element
        { class: "preview", "data-preview": id }, // Class and data attributes
        `<img class="preview__image" src="${image}" /> // Image element
                <div class="preview__info"> // Div for book info
                    <h3 class="preview__title">${title}</h3> // Title heading
                    <div class="preview__author">${authors[author]}</div> // Author info
                </div>`
      );
      fragment.appendChild(element); // Appending each preview element to the fragment
    });

    // Appending the fragment containing previews to the specified selector in the DOM
    document.querySelector("[data-list-items]").appendChild(fragment);
  }
}

// Creating an instance of BooksRenderer class
const booksRenderer = new BooksRenderer();
