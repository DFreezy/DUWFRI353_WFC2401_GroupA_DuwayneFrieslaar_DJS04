import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import {createElement, renderBooks, renderOptions} from "./scripts.js"

// Importing data and constants from data.js file


// Class for creating HTML elements with specified attributes and innerHTML
class ElementCreator {
  createElement(tag, attributes, innerHTML) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
    element.innerHTML = innerHTML;
    return element;
  }
}

// Class for rendering dropdown options based on provided data
class OptionsRenderer {
  render(data, selector, defaultValue) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      new ElementCreator().createElement("option", { value: "any" }, defaultValue)
    );
    Object.entries(data).forEach(([id, name]) =>
      fragment.appendChild(new ElementCreator().createElement("option", { value: id }, name))
    );
    document.querySelector(selector).appendChild(fragment);
  }
}

// Class for rendering books with preview information
class BooksRenderer {
  render(matches, limit) {
    const fragment = document.createDocumentFragment();
    matches.slice(0, limit).forEach(({ author, id, image, title }) => {
      const element = new ElementCreator().createElement(
        "button",
        { class: "preview", "data-preview": id },
        `<img class="preview__image" src="${image}" />
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>`
      );
      fragment.appendChild(element);
    });
    document.querySelector("[data-list-items]").appendChild(fragment);
  }
}

// Initial rendering of books and dropdown options
const elementCreator = new ElementCreator();
const optionsRenderer = new OptionsRenderer();
const booksRenderer = new BooksRenderer();
booksRenderer.render(books, BOOKS_PER_PAGE);
optionsRenderer.render(genres, "[data-search-genres]", "All Genres");
optionsRenderer.render(authors, "[data-search-authors]", "All Authors");

// Event listeners for cancel buttons
document.querySelector("[data-search-cancel]").addEventListener("click", () =>
  document.querySelector("[data-search-overlay]").open = false
);
document.querySelector("[data-settings-cancel]").addEventListener("click", () =>
  document.querySelector("[data-settings-overlay]").open = false
);

// Event listener to open search overlay and focus on the search input
document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

// Event listener to open settings overlay
document.querySelector("[data-header-settings]").addEventListener("click", () =>
  document.querySelector("[data-settings-overlay]").open = true
);

// Event listener to close the active book preview overlay
document.querySelector("[data-list-close]").addEventListener("click", () =>
  document.querySelector("[data-list-active]").open = false
);

// Event listener for settings form submission
document.querySelector("[data-settings-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  const colorDark = theme === "night" ? "255, 255, 255" : "10, 10, 20";
  const colorLight = theme === "night" ? "10, 10, 20" : "255, 255, 255";
  document.documentElement.style.setProperty("--color-dark", colorDark);
  document.documentElement.style.setProperty("--color-light", colorLight);
  document.querySelector("[data-settings-overlay]").open = false;
});

// Event listener for search form submission
document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = books.filter(({ title, author, genres }) =>
    (filters.title.trim() === "" || title.toLowerCase().includes(filters.title.toLowerCase())) &&
    (filters.author === "any" || author === filters.author) &&
    (filters.genre === "any" || genres.includes(filters.genre))
  );
  document.querySelector("[data-list-message]").classList[result.length < 1 ? "add" : "remove"]("list__message_show");
  document.querySelector("[data-list-items]").innerHTML = "";
  booksRenderer.render(result, BOOKS_PER_PAGE);
  document.querySelector("[data-list-button]").disabled = result.length <= BOOKS_PER_PAGE;
  document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${Math.max(result.length - BOOKS_PER_PAGE, 0)})</span>
  `;
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("[data-search-overlay]").open = false;
});

let page = 1;

// Event listener for show more button
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();
  const startIndex = (page - 1) * BOOKS_PER_PAGE;
  const endIndex = Math.min(page * BOOKS_PER_PAGE, books.length);
  for (const book of books.slice(startIndex, endIndex)) {
    const { author, id, image, title } = book;
    const element = elementCreator.createElement(
      "button", { class: "preview", "data-preview": id },
      `<img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>`
    );
    fragment.appendChild(element);
  }
  document.querySelector("[data-list-items]").appendChild(fragment);
  page++;
});

// Event listener for clicking on book previews
document.querySelector("[data-list-items]").addEventListener("click", (event) => {
  let node = event.target;
  while (node && !node.dataset.preview) {
    node = node.parentNode;
  }
  if (node) {
    const book = books.find(({ id }) => id === node.dataset.preview);
    if (book) {
      document.querySelector("[data-list-active]").open = true;
      document.querySelector("[data-list-blur]").src = book.image;
      document.querySelector("[data-list-image]").src = book.image;
      document.querySelector("[data-list-title]").innerText = book.title;
      document.querySelector("[data-list-subtitle]").innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText = book.description;
    }
  }
});
