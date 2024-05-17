import "./scripts.js"; //Importing another js file

class OptionsRenderer { //Creating a class to render
    render(data, selector, defaultValue) { //render the data, selector, default value
      const fragment = document.createDocumentFragment();
      // Appending an option element with value "any" and text defaultValue to the fragment
      fragment.appendChild(
        new ElementCreator().createElement(
          "option",
          { value: "any" },
          defaultValue
        ));
        // Iterating over each entry in the data object
      Object.entries(data).forEach(([id, name]) =>
         // Appending an option element with value id and text name to the fragment
        fragment.appendChild(
          new ElementCreator().createElement("option", { value: id }, name)
        ));
        // Appending the fragment to the specified selector in the DOM
      document.querySelector(selector).appendChild(fragment);
    }}
    // Creating an instance of OptionsRenderer class
    const optionsRenderer = new OptionsRenderer();


