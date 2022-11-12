var storedRestaurants = JSON.parse(localStorage.getItem("storedRestaurants"));
var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');
var restList = $('#rest-list');
var currentLoc = {}
var zipCodeDataFinal;
var zipCodeData = document.querySelector('#zipCode2');
var locationGot = false;
var storedLoc = JSON.parse(localStorage.getItem("currentLoc"));
var currentLoc = {
  "latitude": "",
  "longitude": "",
  "zipcodeLast": "",
};
if (storedLoc !== null) {
  currentLoc = storedLoc;
  console.log(storedLoc);
}
var shoppingItemsLocalStorage = [];


//this function saves local storage for user entered data.
function saveLocalStorage(shoppingItemsLocalStorage) {

  localStorage.setItem("shoppingItemsLocalStorage", JSON.stringify(shoppingItemsLocalStorage));

}

// function to run the local storage
function runLocalStorage() {

  console.log("is this working1")
  var shoppingItemLocal = JSON.parse(localStorage.getItem("shoppingItemsLocalStorage"));
  if (shoppingItemLocal != null) {
    console.log(shoppingItemLocal);
    for (let i = 0; i < shoppingItemLocal.length; i++) {
      shoppingListEl.append('<p>' + shoppingItemLocal[i] + '</p>');
      console.log("is this working")
      shoppingItemsLocalStorage.push(shoppingItemLocal[i])
    }
  }
}


// create foods spots list the user enters
function handleFormSubmit(event) {
  event.preventDefault();

  //line below updates the variable to pull the latest data, super important
  //shoppingItemsLocalStorage = JSON.parse(localStorage.getItem("shoppingItemsLocalStorage"));

  var shoppingItem = $('input[name="shopping-input"]').val();
  if (!shoppingItem) {
    console.log('No shopping item filled out in form!');
    return;
  }
  shoppingListEl.append('<li>' + shoppingItem + '</li>');
  $('input[name="shopping-input"]').val('');
  shoppingItemsLocalStorage.push(shoppingItem);
  console.log(shoppingItemsLocalStorage);
  saveLocalStorage(shoppingItemsLocalStorage);
}


// *function gets the geolocation to determine distance to for the api
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    locationGot = true;
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  console.log(position);
  currentLoc.latitude = position.coords.latitude;
  currentLoc.longitude = position.coords.longitude;
}

//Function to build layout for zipcode search results
function buildResponse() {

  document.getElementById("rest-list").innerHTML = "";

  for (let j = 0; j < storedRestaurants.length; j++) {
    console.log(storedRestaurants[j].time);
    var foodSpots = document.createElement('li');
    foodSpots.innerHTML = `
<h2>${storedRestaurants[j].restaurantName}</h2>
<p>${storedRestaurants[j].address}</p>
<p>${storedRestaurants[j].cityName}, ${storedRestaurants[j].stateName}, ${storedRestaurants[j].zipCode}</p>
<p>${storedRestaurants[j].phone}</p>
<p>${locationGot ? storedRestaurants[j].distance + " distance" : ""}</p>
    `;
    restList.append(foodSpots);
  }
}

async function getDistance() {
  console.log(storedRestaurants[0].distance);
  if (!storedRestaurants[0].hasOwnProperty('distance')) {
    console.log('fetching time and space');
    for (let i = 0; i < storedRestaurants.length; i++) {

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
          'X-RapidAPI-Host': 'route-and-directions.p.rapidapi.com'
        }
      };

      console.log(storedRestaurants[i]);

      await fetch('https://route-and-directions.p.rapidapi.com/v1/routing?waypoints=' + currentLoc.latitude + ',' + currentLoc.longitude + '|' + storedRestaurants[i].latitude + ',' + storedRestaurants[i].longitude + '&mode=walk', options)
        .then(response => response.json())
        .then(function (response) {

          storedRestaurants[i].distance = response.features[0].properties.distance;
          storedRestaurants[i].time = response.features[0].properties.time;
          console.log(storedRestaurants[i].distance)
          // storedRestaurants.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
        })
        .catch(err => console.error(err));
      localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));
    }
    buildResponse();
  } else {
    console.log('data was there');
  }
}



function getData() {

  zipCodeDataFinal = zipCodeData.value.trim()
  restList.innerHTML = "";

  console.log(storedLoc);
  if (zipCodeDataFinal != currentLoc.zipcodeLast) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a9ea82fb84msh7369adc411cc5cbp18f351jsn9f009c32dbe0',
        'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
      }
    };
    fetch('https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/' + zipCodeDataFinal + '/0', options) // set static zip code for CONSTRUCTION
      .then(response => response.json())
      .then(function (response) {
        console.log(response);
        if (response === null) {
          document.getElementById("rest-list").innerHTML = "No Restaurants";
        } else {
          storedRestaurants = response.restaurants;
          localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));

          console.log('fetched');
          currentLoc.zipcodeLast = zipCodeDataFinal;
          if (locationGot) {
            getDistance();
            localStorage.setItem("currentLoc", JSON.stringify(currentLoc));


            console.log(storedRestaurants);
          }
        }
      })
      .catch(err => console.error(err));
  } else {
    buildResponse();
    console.log('localstoraged');
  }
}



//*Event Listeners
//button to fetch the restaurant API calls
var fetchButton = $('#fetch-button').on('click', function (event) {
  event.preventDefault();
  getData();
});

// Create a submit event listener on the form element
shoppingFormEl.on('submit', handleFormSubmit);

runLocalStorage();
getLocation();



