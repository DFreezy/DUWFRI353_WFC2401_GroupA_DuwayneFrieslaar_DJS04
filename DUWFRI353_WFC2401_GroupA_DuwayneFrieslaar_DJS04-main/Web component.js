import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./scripts.js";
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        /* Include styles here */
      </style>
      <header class="header">
        <div class="header__inner">
          <div class="header__logo">
            <svg class="header__shape" viewBox="0 0 89 68" xmlns="http://www.w3.org/2000/svg">
              <!-- SVG code for logo shape -->
            </svg>
            <svg class="header__text" viewBox="0 0 652 74" xmlns="http://www.w3.org/2000/svg">
              <!-- SVG code for logo text -->
            </svg>
          </div>
          <div>
            <button class="header__button" data-header-search>
              <svg class="header__icon" viewBox="0 96 960 960" xmlns="http://www.w3.org/2000/svg">
                <!-- SVG code for search icon -->
              </svg>
            </button>
            <button class="header__button" data-header-settings>
              <svg class="header__icon" viewBox="0 0 960 960" xmlns="http://www.w3.org/2000/svg">
                <!-- SVG code for settings icon -->
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Add event listeners or additional functionality as needed
}

customElements.define('custom-header', CustomHeader);


class ElementCreator {
  createElement(tag, attributes, innerHTML) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
    element.innerHTML = innerHTML;
    return element;
  }}


// Class for rendering dropdown options based on provided data
class OptionsRenderer {
  render(data, selector, defaultValue) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(
      new ElementCreator().createElement(
        "option",
        { value: "any" },
        defaultValue
      ));
    Object.entries(data).forEach(([id, name]) =>
      fragment.appendChild(
        new ElementCreator().createElement("option", { value: id }, name)
      ));
    document.querySelector(selector).appendChild(fragment);
  }}

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
  }}


// Initial rendering of books and dropdown options
const elementCreator = new ElementCreator();
const optionsRenderer = new OptionsRenderer();
const booksRenderer = new BooksRenderer();
booksRenderer.render(books, BOOKS_PER_PAGE);
optionsRenderer.render(genres, "[data-search-genres]", "All Genres");
optionsRenderer.render(authors, "[data-search-authors]", "All Authors");
