const userForm = document.getElementById("user-form");
const introSection = document.querySelector(".intro-section");
const cuisineSection = document.querySelector(".cuisine-select-section");
const boroughSection = document.querySelector(".borough-selection");
const priceSection = document.querySelector(".price-section");
const selectedRestaurantSection = document.querySelector(".selected-restaurant");
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
  

  const cuisineSelection = cuisineSelect.value;
  // const priceSelection = priceSelect.value;
  const priceSelection = priceRadioInput.value;
  let boroughValues = [];
  if (boroughCheckboxes) {
    boroughCheckboxes.forEach((checkbox) => {
      boroughValues.push(checkbox.value);
    });
  }
  

  // **Capturing Drop-Down menu**
  // I needed to capture the users dropdown selections to pass into my function. I used getElementById to grab the dropdown and .value to get the selected option, then stored each for cuisine and price from stack overflow https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript.
 

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
    
    return;
  }
  //   I noticed the site was still populating results when hitting submit without selecting anything. The return is used inside the function if both fields are empty and found this from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return.


  let dataList = document.querySelector(".selected-restaurant ul");
  
  if (boroughValues.length !== 0) {
    filteredRestaurants = filteredRestaurants.filter((restaurant) =>
      restaurant.borough.some((borough) => boroughValues.includes(borough)),
    );
  }
  // The if statement filters restuarants by borough if the user selected one or more boroughs. Now that filteredRestaurants is alrady narrrowed down by cuisine and price, the borough then filters for results. I found out about .some() and .includes() syntax to check if any borough in a restaurants array matches any of the users selections from stack overflow and the other articles. The .some() stops when it finds its first match instead of looping through everything and .includes() checks for specific values in the array which would return true or false.  Sources: https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  // https://www.w3schools.com/jsref/jsref_some.asp



  // I wanted the results to randomly select a different restuarant each time so that the site doesn't push out the same one when I add more resturants to my json file. I reviewed this article from stack overflow (https://stackoverflow.com/a/4550514) and a tutor helped clarify it more. The Math.random() generates a random decimal number and multiplies it by filteredRestaurants.length which matches the number of resaurants with the users filters. The Math.floor()rounds it down to a whole number because as I add more restuarants then the array will become longer so filteredRestaurants.length will grow. 

  let selectedRestaurant =
    filteredRestaurants[Math.floor(Math.random() * filteredRestaurants.length)];


  // building template with selected restaurant

  const googleUrl = "https://maps.google.com/?q=" + selectedRestaurant.address;

  // I wanted to create a clickable google maps link for each restaurant using the address stored in my JSON data. I found a stack overflow post that showed that you can create a google maps link by appending an address string to a base url for the location. A tutor helped me understand how to connect my JSON data so that the selectedRestaurant.address pulls the address string and appends the URL. Source: https://stackoverflow.com/questions/1300838/how-to-convert-an-address-into-a-google-maps-link-not-map

  let listItem = `
				<li class="restaurant-card">
					<h3>${selectedRestaurant.restaurant}</h3>
          <figure>
            <div class="image-wrapper">
             <img src=${selectedRestaurant.cusineImage} alt=${selectedRestaurant.cuisine} />
            </div>
            <figcaption>${selectedRestaurant.cuisine}</figcaption>
          </figure>
          <section class="restaurant-details">
            <h4>Restuarant Details</h4>
            <p>${selectedRestaurant.location}</p>
            <p>${selectedRestaurant.hoursOfOperation}</p>
          </section>
          <h3>DISH RECOMMENDATION</h3>
          <p class="dish-name">${selectedRestaurant.dish}</p>
          <div class="image-wrapper">
            <img src=${selectedRestaurant.dishImage} alt=${selectedRestaurant.dish} />
          </div>
          <p class="dish-description">${selectedRestaurant.description}</p>
          <a class="directions-link" href="${googleUrl}" target="_blank">Get Directions!</a>
        </li>
                    `;
  
 

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
  // I used .includes() to check if a price already exists in the array before adding it and .push() to add the value only if it is not already present so that there are no duplicates. The articles helped me understand how .push() works and tutor helped me understand how to combine them. A tutor also helped me better understand how this logic works togther in practice. Sources: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push,https://bobbyhadz.com/blog/javascript-array-push-if-not-exist.
  // 2. Push available prices to an array
  let availablePrices = [];
  filteredRestaurants.forEach((restaurant) => {
    if (!availablePrices.includes(restaurant.price)) {
      availablePrices.push(restaurant.price);
    }
  });
  
  // 3. Disable the price radio inputs based on the available prices
  // "any price" was also disabled with this change but fixed 
  let radioOptions = document.querySelectorAll(".price-input");
  console.log(radioOptions);
  radioOptions.forEach((option) => {
    if (option.value !== "") {
      option.disabled = !availablePrices.includes(option.value);
    }
  });
  handlePrices();
}
// Disabled the price radio inputs based on availablePrices so that users can only select options that are available in teh dataset.The .disabled property evaulates whether the value is in availablePrices using .includes(). The article helped me understand to target using this selector. Sources: https://www.w3schools.com/jsref/prop_select_disabled.asp, https://dev.to/rayan2228/the-ultimate-css-selectors-cheat-sheet-2025-45ep.

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
  
// This article helped with understanding how the spread operator works because it can expand an array into individual elements.  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax. The (...restaurant.borough) in my code adds each borough seperately into the array.

  console.log(availableBoroughs);

  const boroughCheckboxes = document.querySelectorAll(".borough-checkbox");
  boroughCheckboxes.forEach((checkbox) => {
    if (checkbox.value !== "") {
      checkbox.disabled = !availableBoroughs.includes(checkbox.value);
    }
  });
}



const cuisineFigures = document.querySelectorAll(
  ".cuisine-select-section figure",
);



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

// These articles helped with accessing the element the event handler is connected to and how to add/remove classes to update an active state. I was running into issue getting the function to work. After reviewing with a tutor, I was able to resolve the issue. Sources:
// https://stackoverflow.com/questions/44676281/plain-javascript-event-target-get-the-next-sibling-the-first-child

// https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget
// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

const priceBackButton = document.querySelector(".price-back-button")
const priceNextButton = document.querySelector(".price-next-button")
const boroughBackButton = document.querySelector(".borough-back-button")
const selectedRestaurantBackButton = document.querySelector(".selected-restaurant-back-button")
const introButton = document.querySelector(".intro-button")



function goToCuisines(){
  introSection.classList.add("hidden");
  cuisineSection.classList.remove("hidden");
}

function goToPrices(){
  cuisineSection.classList.add("hidden");
  priceSection.classList.remove("hidden");
}

function goToBoroughs(){
  priceSection.classList.add("hidden");
  boroughSection.classList.remove("hidden");
}

function backToCuisine(){
  priceSection.classList.add("hidden");
  cuisineSection.classList.remove("hidden");
}

function backToPrices(){
  boroughSection.classList.add("hidden");
  priceSection.classList.remove("hidden");
}

function backToIntro(){
  selectedRestaurantSection.classList.add("hidden");
  introSection.classList.remove("hidden");
}