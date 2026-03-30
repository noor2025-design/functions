const userForm = document.getElementById("user-form");

userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cuisineSelect = document.getElementById("cuisine-select");
  const priceSelect = document.getElementById("price-select");

  const cuisineSelection = cuisineSelect.value;
  const priceSelection = priceSelect.value;
  console.log(cuisineSelection);
  //    add restaurant and dish suggestion to the page based on cuisine selection

  // Fetch gets your (local) JSON file…
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  fetch("assets/data.json")
    .then((response) => response.json())
    .then((data) => {
      // And passes the data to the function, above!
      renderItems(data, cuisineSelection, priceSelection);
    });
});

// Function to render your items.
let renderItems = (data, cuisineSelection, priceSelection) => {
  // The `ul` where the items will be inserted.
  let dataList = document.getElementById("selected-restaurant");
  const filteredCuisines = data.filter(
    (restaurant) => restaurant.cuisine === cuisineSelection,
  );
  const filteredPrices = filteredCuisines.filter(
    (restaurant) => restaurant.price === priceSelection,
  );

  // Source - https://stackoverflow.com/a/4550514
  // Posted by Jacob Relkin, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-03-28, License - CC BY-SA 4.0

  let selectedRestaurant;
if (filteredPrices.length === 0) {
      selectedRestaurant =
     filteredCuisines[Math.floor(Math.random() * filteredCuisines.length)];
} else {
    
    selectedRestaurant =
     filteredPrices[Math.floor(Math.random() * filteredPrices.length)];
}

  let listItem = `
				<li class="restaurant-card">
					<h2>${selectedRestaurant.restaurant}</h2>
                    <p>${selectedRestaurant.dish}</p>
                    <p>${selectedRestaurant.dish type}</p>
                    <p>${selectedRestaurant.cuisine}</p>
                    <p>${selectedRestaurant.location}</p>
                    <p>${selectedRestaurant.price}</p>
                    <p>${selectedRestaurant.description}</p>

				</li>
			`;

  dataList.insertAdjacentHTML("beforeend", listItem); // Add it to the `ul`!
}
