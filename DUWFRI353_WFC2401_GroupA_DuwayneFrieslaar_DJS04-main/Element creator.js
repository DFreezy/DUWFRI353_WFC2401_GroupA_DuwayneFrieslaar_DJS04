// Importing necessary data and scripts
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
import "./scripts.js";

// Custom Web Component for the header
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    // Creating a shadow DOM to encapsulate the component
    this.attachShadow({ mode: 'open' });
    // Setting up the HTML and styles for the header component within the shadow DOM
    this.shadowRoot.innerHTML = `
      <header class="header">
        <div class="header__inner">
          <div class="header__logo">
            <!-- SVG code for logo shape -->
            <svg class="header__shape" viewBox="0 0 89 68" xmlns="http://www.w3.org/2000/svg">
            </svg>
            <!-- SVG code for logo text -->
            <svg class="header__text" viewBox="0 0 652 74" xmlns="http://www.w3.org/2000/svg">
            </svg>
          </div>
          <div>
            <!-- Search button with search icon -->
            <button class="header__button" data-header-search>
              <svg class="header__icon" viewBox="0 96 960 960" xmlns="http://www.w3.org/2000/svg">
              </svg>
            </button>
            <!-- Settings button with settings icon -->
            <button class="header__button" data-header-settings>
              <svg class="header__icon" viewBox="0 0 960 960" xmlns="http://www.w3.org/2000/svg">
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  // Add event listeners or additional functionality as needed
}

// Define the custom element 'custom-header' with the CustomHeader class
customElements.define('custom-header', CustomHeader);

// Helper class for creating DOM elements
class ElementCreator {
  createElement(tag, attributes, innerHTML) {
    // Creating a new element with specified tag
    const element = document.createElement(tag);
    // Setting attributes for the element
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
    // Setting inner HTML content for the element
    element.innerHTML = innerHTML;
    return element;
  }
}

// Initial rendering of books and dropdown options
const elementCreator = new ElementCreator();
// Rendering books with the specified limit
booksRenderer.render(books, BOOKS_PER_PAGE);
// Rendering dropdown options for genres and authors
optionsRenderer.render(genres, "[data-search-genres]", "All Genres");
optionsRenderer.render(authors, "[data-search-authors]", "All Authors");
