// Importing data and constants from data.js file
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
  // Function to create HTML elements with specified attributes and innerHTML
  const createElement = (tag, attributes, innerHTML) => {
    const element = document.createElement(tag); // Create the specified HTML element
    // Set attributes for the element
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
    element.innerHTML = innerHTML; // Set the innerHTML of the element
    return element; // Return the created element
  };


  // Function to render dropdown options based on provided data
  const renderOptions = (data, selector, defaultValue) => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold the options
    // Create a default option with the provided defaultValue
    fragment.appendChild(
      createElement("option", { value: "any" }, defaultValue)
    );
    // Create options for each entry in the data object and append them to the fragment
    Object.entries(data).forEach(([id, name]) =>
      fragment.appendChild(createElement("option", { value: id }, name))
    );
    document.querySelector(selector).appendChild(fragment); // Append the fragment to the specified selector
  };


  // Function to render books with preview information
  const renderBooks = (matches, limit) => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold the book previews
    // Create a preview button for each book in the matches array
    matches.slice(0, limit).forEach(({ author, id, image, title }) => {
      const element = createElement(
        "button",
        { class: "preview", "data-preview": id },
        `<img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>`
      );
      fragment.appendChild(element); // Append the preview button to the fragment
    });
    document.querySelector("[data-list-items]").appendChild(fragment); // Append the fragment to the list items container
  };

  // Initial rendering of books and dropdown options
  renderBooks(books, BOOKS_PER_PAGE);
  renderOptions(genres, "[data-search-genres]", "All Genres");
  renderOptions(authors, "[data-search-authors]", "All Authors");

  // Function to handle canceling search and settings overlays
  const handleCancel = (selector) => () => {
    document.querySelector(selector).open = false; // Close the overlay
  };

  // Event listeners for cancel buttons
  document.querySelector("[data-search-cancel]").addEventListener("click", handleCancel("[data-search-overlay]"));
  document.querySelector("[data-settings-cancel]").addEventListener("click", handleCancel("[data-settings-overlay]"));
  // Event listener to open search overlay and focus on the search input
  document.querySelector("[data-header-search]").addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = true; // Open the search overlay
      document.querySelector("[data-search-title]").focus(); // Focus on the search input
    });
  // Event listener to open settings overlay
  document.querySelector("[data-header-settings]").addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = true; // Open the settings overlay
    });
  // Event listener to close the active book preview overlay
  document.querySelector("[data-list-close]").addEventListener("click", () => {
    document.querySelector("[data-list-active]").open = false; // Close the active book preview overlay
  });
  // Event listener for settings form submission
  document.querySelector("[data-settings-form]").addEventListener("submit", (event) => {event.preventDefault(); 
    // Prevent form submission
      const formData = new FormData(event.target); // Get form data
      const { theme } = Object.fromEntries(formData); // Extract theme from form data
      // Set CSS variables based on selected theme
      const colorDark = theme === "night" ? "255, 255, 255" : "10, 10, 20";
      const colorLight = theme === "night" ? "10, 10, 20" : "255, 255, 255";
      document.documentElement.style.setProperty("--color-dark", colorDark);
      document.documentElement.style.setProperty("--color-light", colorLight);
      document.querySelector("[data-settings-overlay]").open = false; // Close the settings overlay
    });

  // Event listener for search form submission
  document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission
      const formData = new FormData(event.target); // Get form data
      const filters = Object.fromEntries(formData); // Convert form data to object
      // Filter books based on search criteria
      const result = books.filter(
        ({ title, author, genres }) =>
          (filters.title.trim() === "" ||
            title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.author === "any" || author === filters.author) &&
          (filters.genre === "any" || genres.includes(filters.genre))
      );
      // Show or hide message based on search result
      document.querySelector("[data-list-message]").classList[result.length < 1 ? "add" : "remove"]("list__message_show");
      document.querySelector("[data-list-items]").innerHTML = ""; // Clear the list items container
      renderBooks(result, BOOKS_PER_PAGE); // Render filtered books
      document.querySelector("[data-list-button]").disabled =
        result.length <= BOOKS_PER_PAGE; // Disable show more button if necessary
      document.querySelector("[data-list-button]").innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${Math.max(
        result.length - BOOKS_PER_PAGE,
        0
      )})</span>
    `; // Update show more button text
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top of page
      document.querySelector("[data-search-overlay]").open = false; // Close the search overlay
    });

  let page = 1;
  // Event listener for show more button
  document.querySelector("[data-list-button]").addEventListener("click", () => {
    const fragment = document.createDocumentFragment(); // Create a document fragment to hold the new previews
    const startIndex = (page - 1) * BOOKS_PER_PAGE; // Calculate start index for new previews
    const endIndex = Math.min(page * BOOKS_PER_PAGE, books.length); // Calculate end index for new previews
    // Create preview buttons for the next page of books and append them to the fragment
    for (const book of books.slice(startIndex, endIndex)) {
      const { author, id, image, title } = book;
      const element = createElement(
"button", { class: "preview", "data-preview": id },
        `<img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>`
      );
      fragment.appendChild(element);
    }
    document.querySelector("[data-list-items]").appendChild(fragment); // Append the new previews to the list items container
    page++; // Increment page number
  });

  // Event listener for clicking on book previews
  document.querySelector("[data-list-items]").addEventListener("click", (event) => {
      let node = event.target; // Get the clicked element
      // Traverse up the DOM tree until a preview button is found
      while (node && !node.dataset.preview) {
        node = node.parentNode;
      }
      if (node) {
        // If a preview button is found
        const book = books.find(({ id }) => id === node.dataset.preview); // Find the corresponding book object
        if (book) {
          // If the book object is found
          // Show the active book preview overlay and fill it with book details
          document.querySelector("[data-list-active]").open = true;
          document.querySelector("[data-list-blur]").src = book.image;
          document.querySelector("[data-list-image]").src = book.image;
          document.querySelector("[data-list-title]").innerText = book.title;
          document.querySelector("[data-list-subtitle]").innerText = `${
            authors[book.author]} (${new Date(book.published).getFullYear()})`;
          document.querySelector("[data-list-description]").innerText =book.description;
        }}});
