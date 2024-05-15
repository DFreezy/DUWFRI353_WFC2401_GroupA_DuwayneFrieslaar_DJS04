import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
try {
    //Import to get books from a source
    
  
    // Function to create a DOM element
    function createElement(tag, attributes, innerHTML) {
      const element = document.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
      element.innerHTML = innerHTML;
      return element;
    }
  
    // Function to render a book element
    function renderBook({ author, id, image, title }) {
      const element = createElement("button", {
        class: "preview",
        "data-preview": id
      }, `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `);
      return element;
    }
  
    // Function to render initial books
    function renderInitialBooks(matches, BOOKS_PER_PAGE) {
      const starting = document.createDocumentFragment();
      matches.slice(0, BOOKS_PER_PAGE).forEach(book => {
        const bookElement = renderBook(book);
        starting.appendChild(bookElement);
      });
      document.querySelector("[data-list-items]").appendChild(starting);
    }
  
    // Function to render a genre option
    function renderGenreOption(id, name) {
      return createElement("option", { value: id }, name);
    }
  
    // Function to render genre options
    function renderGenreOptions(genres) {
      const genreHtml = document.createDocumentFragment();
      genreHtml.appendChild(renderGenreOption("any", "All Genres"));
      for (const [id, name] of Object.entries(genres)) {
        genreHtml.appendChild(renderGenreOption(id, name));
      }
      document.querySelector("[data-search-genres]").appendChild(genreHtml);
    }
  
    // Function to render an author option
    function renderAuthorOption(id, name) {
      return createElement("option", { value: id }, name);
    }
  
    // Function to render author options
    function renderAuthorOptions(authors) {
      const authorsHtml = document.createDocumentFragment();
      authorsHtml.appendChild(renderAuthorOption("any", "All Authors"));
      for (const [id, name] of Object.entries(authors)) {
        authorsHtml.appendChild(renderAuthorOption(id, name));
      }
      document.querySelector("[data-search-authors]").appendChild(authorsHtml);
    }
  
    // Render initial books
    renderInitialBooks(books, BOOKS_PER_PAGE);
  
    // Render genre options
    renderGenreOptions(genres);
  
    // Render author options
    renderAuthorOptions(authors);
  
    // Add event listeners...
  
    // Add event listener for search cancel button
    document.querySelector("[data-search-cancel]").addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = false;
    });
  
    // Add event listener for settings cancel button
    document.querySelector("[data-settings-cancel]").addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = false;
    });
  
    // Add event listener for header search button
    document.querySelector("[data-header-search]").addEventListener("click", () => {
      document.querySelector("[data-search-overlay]").open = true;
      document.querySelector("[data-search-title]").focus();
    });
  
    // Add event listener for header settings button
    document.querySelector("[data-header-settings]").addEventListener("click", () => {
      document.querySelector("[data-settings-overlay]").open = true;
    });
  
    // Add event listener for list close button
    document.querySelector("[data-list-close]").addEventListener("click", () => {
      document.querySelector("[data-list-active]").open = false;
    });
  
    // Add event listener for settings form submission
    document.querySelector("[data-settings-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
  
      if (theme === "night") {
        document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
        document.documentElement.style.setProperty("--color-light", "10, 10, 20");
      } else {
        document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
        document.documentElement.style.setProperty("--color-light", "255, 255, 255");
      }
  
      document.querySelector("[data-settings-overlay]").open = false;
    });
  
    // Add event listener for search form submission
    document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const filters = Object.fromEntries(formData);
      const result = [];
  
      for (const book of books) {
        let genreMatch = filters.genre === "any";
  
        for (const singleGenre of book.genres) {
          if (genreMatch) break;
          if (singleGenre === filters.genre) {
            genreMatch = true;
          }
        }
  
        if (
          (filters.title.trim() === "" ||
            book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.author === "any" || book.author === filters.author) &&
          genreMatch
        ) {
          result.push(book);
        }
      }
  
      let page = 1;
      let matches = result;
  
      document
      .querySelector("[data-list-message]")
      .classList[result.length < 1 ? "add" : "remove"]("list__message_show");
      document.querySelector("[data-list-items]").innerHTML = "";
      const newItems = document.createDocumentFragment();
  
      for (const { author, id, image, title } of result.slice(
        0,
        BOOKS_PER_PAGE
      )) {
        const element = createElement("button", {
          class: "preview",
          "data-preview": id
        }, `
          <img
            class="preview__image"
            src="${image}"
          />
          
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
          </div>
        `);
  
        newItems.appendChild(element);
      }
  
      document.querySelector("[data-list-items]").appendChild(newItems);
      document.querySelector("[data-list-button]").disabled =
        matches.length - page * BOOKS_PER_PAGE < 1;
  
      document.querySelector("[data-list-button]").innerHTML = `
          <span>Show more</span>
          <span class="list__remaining"> (${
            matches.length - page * BOOKS_PER_PAGE > 0
              ? matches.length - page * BOOKS_PER_PAGE
              : 0
          })</span>
      `;
  
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector("[data-search-overlay]").open = false;
    });
  
    // Add event listener for list button
    document.querySelector("[data-list-button]").addEventListener("click", () => {
      const fragment = document.createDocumentFragment();
  
      for (const { author, id, image, title } of matches.slice(
        page * BOOKS_PER_PAGE,
        (page + 1) * BOOKS_PER_PAGE
      )) {
        const element = createElement("button", {
          class: "preview",
          "data-preview": id
        }, `
          <img
            class="preview__image"
            src="${image}"
          />
          
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
          </div>
        `);
  
        fragment.appendChild(element);
      }
  
      document.querySelector("[data-list-items]").appendChild(fragment);
      page += 1;
    });
  
    // Add event listener for list items
    document.querySelector("[data-list-items]").addEventListener("click", (event) => {
      const pathArray = Array.from(event.path || event.composedPath());
      let active = null;
  
      for (const node of pathArray) {
        if (active) break;
  
        if (node?.dataset?.preview) {
          let result = null;
  
          for (const singleBook of books) {
            if (result) break;
            if (singleBook.id === node?.dataset?.preview) result = singleBook;
          }
  
          active = result;
        }
      }
  
      if (active) {
        document.querySelector("[data-list-active]").open = true;
        document.querySelector("[data-list-blur]").src = active.image;
        document.querySelector("[data-list-image]").src = active.image;
        document.querySelector("[data-list-title]").innerText = active.title;
        document.querySelector("[data-list-subtitle]").innerText = `${
          authors[active.author]
        } (${new Date(active.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerText =
          active.description;
      }
    });
  
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
  