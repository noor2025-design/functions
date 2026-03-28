const cuisineSelect = document.getElementById("cuisine-select");

const userForm = document.getElementById("user-form");

userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cuisineSelection = cuisineSelect.value;
  console.log(cuisineSelection);
  //    add restaurant and dish suggestion to the page based on cuisine selection

  // Fetch gets your (local) JSON file…
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch("assets/data.json")
    .then((response) => response.json())
    .then((data) => {
      // And passes the data to the function, above!
      renderItems(data, cuisineSelection);
    });
});

// Function to render your items.
let renderItems = (data, cuisineSelection) => {
  // The `ul` where the items will be inserted.
  let dataList = document.getElementById("selected-restaurant");
  const filteredRestaurants = data.filter(
    (restaurant) => restaurant.Cuisine.toLowerCase() === cuisineSelection,
  );
  console.log(filteredRestaurants);

  // Source - https://stackoverflow.com/a/4550514
// Posted by Jacob Relkin, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-28, License - CC BY-SA 4.0

const selectedRestaurant = filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)];

let listItem = `
				<li class="restaurant-card">
					<h2>${selectedRestaurant.Restaurant}</h2>
				</li>
			`;

    dataList.insertAdjacentHTML("beforeend", listItem); // Add it to the `ul`!

  return;
  // Loop through each item in the data array:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  data.forEach((item) => {
    let conditionalClass = ""; // Set an empty class variable.

    // Conditional if this is `false` (“not true”):
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
    // if (!item.alsoWrote) {
    // 	conditionalClass = 'faded' // Update the variable.
    // }

    // Make a “template literal” as we have before, inserting your data (and maybe the class):
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    let listItem = `
				<li class="restaurant-card">
					<h2>${item.Restaurant}</h2>
				</li>
			`;

    dataList.insertAdjacentHTML("beforeend", listItem); // Add it to the `ul`!

    // Don’t feel limited to `ul > li` for these—you can insert any DOM, anywhere!
  });
};
