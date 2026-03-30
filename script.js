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
  if (priceSelection === "" && cuisineSelection === "") {
    console.log("empty");

    return;
  }
  // The `ul` where the items will be inserted.
  let dataList = document.getElementById("selected-restaurant");
  let filteredCuisines;
  let filteredPrices;
  //   let filteredRestaurants = data;

  console.log(cuisineSelection);

  if (cuisineSelection !== "") {
    filteredCuisines = data.filter(
      (restaurant) => restaurant.cuisine === cuisineSelection,
    );
  }
  if (priceSelection !== "" && cuisineSelection !== "") {
    filteredPrices = filteredCuisines.filter(
      (restaurant) => restaurant.price === priceSelection,
    );
  } else if (priceSelection !== "" && cuisineSelection === "") {
    filteredPrices = data.filter(
      (restaurant) => restaurant.price === priceSelection,
    );
  }

  // Source - https://stackoverflow.com/a/4550514
  // Posted by Jacob Relkin, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-03-28, License - CC BY-SA 4.0
  let selectedRestaurant;
  if (priceSelection !== "" && filteredPrices.length !== 0) {
    selectedRestaurant =
      filteredPrices[Math.floor(Math.random() * filteredPrices.length)];
  } else {
    selectedRestaurant =
      filteredCuisines[Math.floor(Math.random() * filteredCuisines.length)];
  }

  let listItem = `
				<li class="restaurant-card">
					<h2>${selectedRestaurant.restaurant}</h2>
                    <p>${selectedRestaurant.dish}</p>
                    <p>${selectedRestaurant.dishType}</p>
                    <p>${selectedRestaurant.location}</p>
                    <p>${selectedRestaurant.description}</p>
                    </li>
                    `;

  // <p>${selectedRestaurant.price}</p>
  // <p>${selectedRestaurant.cuisine}</p>
  dataList.insertAdjacentHTML("beforeend", listItem); // Add it to the `ul`!
};
