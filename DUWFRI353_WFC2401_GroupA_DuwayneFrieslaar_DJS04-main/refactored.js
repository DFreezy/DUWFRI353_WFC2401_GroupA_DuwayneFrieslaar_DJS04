import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./scripts.js"

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


