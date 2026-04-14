const userForm = document.getElementById("user-form");
let restaurantData;
let filteredRestaurants;

// fetching data on page load so that it can be available for multiple functions instead of repeating it
fetch("assets/data.json")
  .then((response) => response.json())
  .then((data) => {
    restaurantData = data;
  });

// The page was refreshing every time I hit submit and cleared the results. I found event.preventDefault() to stop this behavior and it tells the browser to ignore the browser behavior and listen to javascript from this reference https://www.tutorialspoint.com/article/how-to-stop-refreshing-the-page-on-submit-in-javascript.
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cuisineSelect = document.getElementById("cuisine-select");
  // const priceSelect = document.getElementById("price-select");

  // I used the :checked pseudo-class selector from DEV article to target only inputs that are selected by the user. The document.querySelector(".price-input:checked") grabs the single checked radio button and document.querySelectorAll(".borough-checkbox:checked") grabs all checked borough checkboxes at once. I also used the forEach loop pattern from the javascript tutorial article to loop through the checked borough checkboxes for each value in the array to filter the results. Sources: https://dev.to/rayan2228/the-ultimate-css-selectors-cheat-sheet-2025-45ep, https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/

  const priceRadioInput = document.querySelector(".price-input:checked");
  const boroughCheckboxes = document.querySelectorAll(
    ".borough-checkbox:checked",
  );
  console.log(boroughCheckboxes);

  console.log(priceRadioInput);
  console.log(priceRadioInput.checked);

  const cuisineSelection = cuisineSelect.value;
  // const priceSelection = priceSelect.value;
  const priceSelection = priceRadioInput.value;
  let boroughValues = [];
  if (boroughCheckboxes) {
    boroughCheckboxes.forEach((checkbox) => {
      boroughValues.push(checkbox.value);
    });
  }
  console.log(boroughValues);

  // **Drop Down menu reference**
  // I needed to capture the users dropdown selections to pass into my function . I learned from this post that you could use getElementById to grab the dropdown and .value to get the selected option, then store each for cuisine and price from stack overflow https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript.
  //   console.log(cuisineSelection);
  // add restaurant and dish suggestion to the page based on cuisine selection

  // Fetch gets your (local) JSON file…
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // fetch("assets/data.json")
  //   .then((response) => response.json())
  //   .then((data) => {
  // And passes the data to the function, above!
  renderItems(cuisineSelection, priceSelection, boroughValues);
  // });
});

// Function to render your items.
let renderItems = (cuisineSelection, priceSelection, boroughValues) => {
  if (
    priceSelection === "" &&
    cuisineSelection === "" &&
    boroughValues.length === 0
  ) {
    // console.log("empty");

    return;
  }
  //   I noticed the site was still populating results when hitting submit without selecting anything. The return is used inside the function if both fields are empty and found this from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return.

  // The `ul` where the items will be inserted.
  let dataList = document.querySelector("#selected-restaurant ul");
  // let filteredCuisines;
  // let filteredPrices;
  // let filteredBoroughs;

  // Alternate filtering method
  // let filteredRestaurants = data;

  // if (cuisineSelection !== "") {
  //   filteredRestaurants = filteredRestaurants.filter(
  //     (restaurant) => restaurant.cuisine.toLowerCase() === cuisineSelection,
  //   );
  // }
  // if (priceSelection !== "") {
  //   let isEmpty =
  //     filteredRestaurants.filter(
  //       (restaurant) => restaurant.price === priceSelection,
  //     ).length === 0;
  //   if (!isEmpty) {
  //     filteredRestaurants = filteredRestaurants.filter(
  //       (restaurant) => restaurant.price === priceSelection,
  //     );
  //   }
  // }

  // Source: I used the toLowerCase() to make the cuisine filter not be case sensitive. My dropdown option values are all lowercase but my JSON dats has cuisine names with the first letter capital. I used toLowerCase() on the restaurant cuisine value from JSON to match the user selection so both uppercase and lowercase selections are treated the same. Source: https://www.w3schools.com/jsref/jsref_tolowercase.asp
  // if (cuisineSelection !== "") {
  //   filteredCuisines = data.filter(
  //     (restaurant) => restaurant.cuisine.toLowerCase() === cuisineSelection,
  //   );
  // }
  // if (priceSelection !== "" && cuisineSelection !== "") {
  //   filteredPrices = filteredCuisines.filter(
  //     (restaurant) => restaurant.price === priceSelection,
  //   );
  // } else if (priceSelection !== "" && cuisineSelection === "") {
  //   filteredPrices = data.filter(
  //     (restaurant) => restaurant.price === priceSelection,
  //   );
  // }

  // right logic - using boroughValues want to match restaurants filtered by price and if there are no matches for cuisine and price then filter only by cuisine?
  // if (
  //   boroughValues.length !== 0 &&
  //   priceSelection !== "" &&
  //   filteredPrices.length !== 0
  // ) {
  //   filteredBoroughs = filteredPrices.filter((restaurant) =>
  //     restaurant.borough.some((borough) => boroughValues.includes(borough)),
  //   );
  // } else if (boroughValues.length !== 0 && cuisineSelection !== "") {
  //   filteredBoroughs = filteredCuisines.filter((restaurant) =>
  //     restaurant.borough.some((borough) => boroughValues.includes(borough)),
  //   );
  // } else if (boroughValues.length !== 0 && cuisineSelection === "") {
  //   filteredBoroughs = data.filter((restaurant) =>
  //     restaurant.borough.some((borough) => boroughValues.includes(borough)),
  //   );
  // }
  if (boroughValues.length !== 0) {
    filteredRestaurants = filteredRestaurants.filter((restaurant) =>
      restaurant.borough.some((borough) => boroughValues.includes(borough)),
    );
  }

  // The if/else statements filters restuarants by borough depending on what other filters were or were not selected by the user. If the user selected a price AND boroughs, it filters from the price results. If the user only selected boroughs with no other filters then it filters through the whole dataset. I found out about .some and .includes syntax to check if any borough in a restaurants array matches any of the users selections from stack overflow and the other articles. The .some stops when it finds its first match instead of looping through everytghing and .includes checks for specific values in the array which would return true or false.  Sources: https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  // https://www.w3schools.com/jsref/jsref_some.asp

  // I wanted the results to randomly select a different restuarant each time so the site doesnt push out the same restaurants when I add more resturants to my json file. I reviewed this article from stack overflow (https://stackoverflow.com/a/4550514) and a tutor explained it more clearly. The Math.random () generates a decimal number and multiplies it by the array length and Math.floor () rounds it down to a whole number because as I add more restuarants then the array will become longer so filteredPrices.length and filteredCuisines.length will grow. The Math.random is multiplied by however many resturants is in the data.
  // let selectedRestaurant;
  // if (boroughValues.length !== 0 && filteredBoroughs.length !== 0) {
  //   selectedRestaurant =
  //     filteredBoroughs[Math.floor(Math.random() * filteredBoroughs.length)];
  // } else if (priceSelection !== "" && filteredPrices.length !== 0) {
  //   selectedRestaurant =
  //     filteredPrices[Math.floor(Math.random() * filteredPrices.length)];
  // } else {
  //   selectedRestaurant =
  //     filteredCuisines[Math.floor(Math.random() * filteredCuisines.length)];
  // }
  let selectedRestaurant =
    filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)];
  // building template with selected restaurant
  const googleUrl = "https://maps.google.com/?q=" + selectedRestaurant.address;

  let listItem = `
				<li class="restaurant-card">
					<h2>${selectedRestaurant.restaurant}</h2>
                    <p>${selectedRestaurant.cuisine}</p>
                    <p>${selectedRestaurant.dish}</p>
                    <p>${selectedRestaurant.dishType}</p>
                    <p>${selectedRestaurant.description}</p>
                    <p>${selectedRestaurant.price}</p>
                    <p>${selectedRestaurant.location}</p>
                    <p>${selectedRestaurant.hoursOfOperation}</p>
                    <a class="directions-link" href="${googleUrl}" target="_blank">Get Directions</a>
                    </li>
                    `;
  // I wanted to create a clickable google maps link for each restaurant using the address stored in my JSON data. I learned from stack overflow that you can create a google maps link by appending an address string that would search for the location. A tutor helped me understand how to connect this to my JSON data so that the selectedRestaurant.address pulls the address string and appends the URL. Source: https://stackoverflow.com/questions/1300838/how-to-convert-an-address-into-a-google-maps-link-not-map
  // need to add message if match is not found - Hmmm...nothing matched that exactly but we found something close. Give this one a try:.

  // When I first tested the submit button, every time the user clicked the submit button the new results were being added on top of the previous results instead of one time. I found from stack overflow and W3 that I needed to clear the div before rendering new results each time the form was submitted and that setting innerHTML to "" would clear out results. Sources: https://stackoverflow.com/questions/3450593/how-do-i-clear-the-content-of-a-div-using-javascript, https://www.w3schools.com/jsref/prop_html_innerhtml.asp
  dataList.innerHTML = "";
  dataList.insertAdjacentHTML("beforeend", listItem); // Add it to the `ul`!
};

function handleCuisine() {
  console.log("test");
  // when the user makes a selection from the dropdown menu, want to disable prices that are not available
  // 1. Filter data based on cuisine type
  const cuisineSelect = document.getElementById("cuisine-select");
  const cuisineSelection = cuisineSelect.value;
  filteredRestaurants = restaurantData;
  if (cuisineSelection !== "") {
    filteredRestaurants = restaurantData.filter(
      (restaurant) => restaurant.cuisine.toLowerCase() === cuisineSelection,
    );
  }
  // tutor helped me understand  https://bobbyhadz.com/blog/javascript-array-push-if-not-exist
  // 2. Push available prices to an array
  let availablePrices = [];
  filteredRestaurants.forEach((restaurant) => {
    if (!availablePrices.includes(restaurant.price)) {
      availablePrices.push(restaurant.price);
    }
  });
  console.log(availablePrices);

  // 3. Disable the price radio inputs based on the available prices
  // "any price" was also disabled with this change but fixed with tutor help
  let radioOptions = document.querySelectorAll(".price-input");
  console.log(radioOptions);
  radioOptions.forEach((option) => {
    if (option.value !== "") {
      option.disabled = !availablePrices.includes(option.value);
    }
  });
  handlePrices();
}
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event, https://dev.to/rayan2228/the-ultimate-css-selectors-cheat-sheet-2025-45ep

function handlePrices() {
  console.log("test 2");
  const priceRadioInput = document.querySelector(".price-input:checked");
  const priceSelection = priceRadioInput.value;
  if (priceSelection !== "") {
    filteredRestaurants = filteredRestaurants.filter(
      (restaurant) => restaurant.price === priceSelection,
    );
  }
  console.log(filteredRestaurants);

  let availableBoroughs = [];
  filteredRestaurants.forEach((restaurant) => {
    // if (!restaurant.borough.some((borough) => availableBoroughs.includes(borough))) {
    availableBoroughs.push(...restaurant.borough);
    console.log(restaurant.borough);

    // }
  });
  console.log(availableBoroughs);

  const boroughCheckboxes = document.querySelectorAll(".borough-checkbox");
  boroughCheckboxes.forEach((checkbox) => {
    if (checkbox.value !== "") {
      checkbox.disabled = !availableBoroughs.includes(checkbox.value);
    }
  });
}

// how to push an array to another array -https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat

const cuisineFigures = document.querySelectorAll(
  ".cuisine-select-section figure",
);
// how to select the clicked event element in js
// https://stackoverflow.com/questions/1553661/how-to-get-the-onclick-calling-object
// https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget

function handleCuisineFigure(event) {
  console.log(event.currentTarget);
  const figureElement = event.currentTarget;
  const figCaptionElement = figureElement.querySelector("figCaption");
  const figCaptionValue = figCaptionElement.textContent.toLowerCase();
  // querySelector can be used off document to search the page or can be used off a specific element on the page
  // change the custom UI by adding a class
  const cuisineFigures = document.querySelectorAll(
    ".cuisine-select-section figure",
  );
  cuisineFigures.forEach((figure) => figure.classList.remove("active-figure"));
  figureElement.classList.add("active-figure");
  // Change the value of the select element
  const cuisineSelect = document.getElementById("cuisine-select");
  cuisineSelect.value = figCaptionValue;
  handleCuisine();
}
// https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector

// https://stackoverflow.com/questions/44676281/plain-javascript-event-target-get-the-next-sibling-the-first-child
