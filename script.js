const userForm = document.getElementById("user-form");
// The page was refreshing every time I hit submit and cleared the results. I found event.preventDefault() to stop this behavior and it tells the browser to ignore the browser behavior and listen to javascript from this reference https://www.tutorialspoint.com/article/how-to-stop-refreshing-the-page-on-submit-in-javascript.
userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cuisineSelect = document.getElementById("cuisine-select");
  // const priceSelect = document.getElementById("price-select");

// https://dev.to/rayan2228/the-ultimate-css-selectors-cheat-sheet-2025-45ep, https://www.javascripttutorial.net/javascript-dom/javascript-checkbox/

  const priceRadioInput = document.querySelector(".price-input:checked");
  console.log(priceRadioInput);
  console.log(priceRadioInput.checked);

  const cuisineSelection = cuisineSelect.value;
  // const priceSelection = priceSelect.value;
  const priceSelection = priceRadioInput.value;

  // I needed to capture the users dropdown selections to pass into my function . I learned from this post that you could use getElementById to grab the dropdown and .value to get the selected option, then store each for cuisine and price from stack overflow https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript.
  //   console.log(cuisineSelection);
  // add restaurant and dish suggestion to the page based on cuisine selection

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
    // console.log("empty");

    return;
  }
  //   I noticed the site was still populating results when hitting submit without selecting anything. The return is used inside the function if both fields are empty and found this from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return.

  // The `ul` where the items will be inserted.
  let dataList = document.querySelector("#selected-restaurant ul");
  let filteredCuisines;
  let filteredPrices;
  //   let filteredRestaurants = data;

  //   console.log(cuisineSelection);

  // https://www.w3schools.com/jsref/jsref_tolowercase.asp
  if (cuisineSelection !== "") {
    filteredCuisines = data.filter(
      (restaurant) => restaurant.cuisine.toLowerCase() === cuisineSelection,
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

  // I wanted the results to randomly select a different restuarant each time so the site doesnt push out the same resturants when I add more resturants to my json file.  I reviewed this article from stack overflow (https://stackoverflow.com/a/4550514) and a tutor explained it more clearly. The Math.random () generates a decimal number and multiplies it by the array length and Math.floor () rounds it down to a whole number because as I add more restuarants then the array will become longer so filteredPrices.length and filteredCuisines.length will grow. The Math.random is multiplied by however many resturants is in the data.

  let selectedRestaurant;
  if (priceSelection !== "" && filteredPrices.length !== 0) {
    selectedRestaurant =
      filteredPrices[Math.floor(Math.random() * filteredPrices.length)];
  } else {
    selectedRestaurant =
      filteredCuisines[Math.floor(Math.random() * filteredCuisines.length)];
  }
  // building template with selected restaurant
  const googleUrl = "https://maps.google.com/?q=" + selectedRestaurant.address;

  let listItem = `
				<li class="restaurant-card">
					<h2>${selectedRestaurant.restaurant}</h2>
                    <p>${selectedRestaurant.dish}</p>
                    <p>${selectedRestaurant.dishType}</p>
                    <p>${selectedRestaurant.location}</p>
                    <p>${selectedRestaurant.description}</p>
                    <a href="${googleUrl}" target="_blank">Get Directions</a>
                    </li>
                    `;
  // https://stackoverflow.com/questions/1300838/how-to-convert-an-address-into-a-google-maps-link-not-map
  // <p>${selectedRestaurant.price}</p>
  // <p>${selectedRestaurant.cuisine}</p>
  // https://stackoverflow.com/questions/3450593/how-do-i-clear-the-content-of-a-div-using-javascript, https://www.w3schools.com/jsref/prop_html_innerhtml.asp
  dataList.innerHTML = "";
  dataList.insertAdjacentHTML("beforeend", listItem); // Add it to the `ul`!
};
