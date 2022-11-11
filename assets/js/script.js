var storedRestaurants = JSON.parse(localStorage.getItem("storedRestaurants"));
var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');
var restList = $('#rest-list');
var currentLoc = {}
var zipCodeData = document.querySelector('#zipCode2');
var locationGot = false;
var shoppingItemsLocalStorage = [];

//button to fetch the restaurant API calls
var fetchButton = $('#fetch-button').on('click', function (event) {
  event.preventDefault();
  getData();
});

runLocalStorage();

// // create foods spots list the user enters
// var shoppingItemsBtn = $('shopping-input-button').on('click', function (event) {
//   event.preventDefault();

//   //line below updates the variable to pull the latest data, super important
//   //shoppingItemsLocalStorage = JSON.parse(localStorage.getItem("shoppingItemsLocalStorage"));

//   var shoppingItem = $('input[name="shopping-input"]').val();
//   if (!shoppingItem) {
//     console.log('No shopping item filled out in form!');
//     return;}
//   shoppingListEl.append('<li>' + shoppingItem + '</li>');
//   $('input[name="shopping-input"]').val('');
//   shoppingItemsLocalStorage.push(shoppingItem);
//   console.log(shoppingItemsLocalStorage);
//   saveLocalStorage(shoppingItemsLocalStorage);
// })


// Create a submit event listener on the form element
shoppingFormEl.on('submit', handleFormSubmit);

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
    for (i = 0; i < shoppingItemLocal.length; i++) {
      shoppingListEl.append('<p>' + shoppingItemLocal[i] + '</p>');
      console.log("is this working")
      shoppingItemsLocalStorage.push(shoppingItemLocal[i])
    }
  }
}

shoppingFormEl.on('submit', handleFormSubmit);

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
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  console.log(position);
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  locationGot = true;
  currentLoc = { longitude: position.coords.longitude, latitude: position.coords.latitude };
}

getLocation();
//*
//*WORKING
// *Gets restaurants near zipcode
// *Can also do   {state}   and     {state} , {city}

function getData() {

  var zipCodeDataFinal = zipCodeData.value.trim()
  storedRestaurants = null;
  restList.innerHTML = "";
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'a9ea82fb84msh7369adc411cc5cbp18f351jsn9f009c32dbe0',
      'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
    }
  };

  if (storedRestaurants === null) {
    fetch('https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/' + zipCodeDataFinal + '/0', options) // set static zip code for CONSTRUCTION
      .then(response => response.json())
      .then(function (response) {
        console.log(response);
        storedRestaurants = response.restaurants;
        localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));
        buildResponse(zipCodeDataFinal);
        console.log('fetched');
      })
      .catch(err => console.error(err));
  } else {
    buildResponse(zipCodeDataFinal);
    console.log('localstoraged');
  }
}

//Function to build layout for zipcode search results
function buildResponse(zipCodeDataFinal) {
  if (locationGot) {
    getDistance(zipCodeDataFinal);
    storedRestaurants.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));
    console.log(storedRestaurants);
  }
  document.getElementById("rest-list").innerHTML = "";

  for (let i = 0; i < storedRestaurants.length; i++) {
    console.log(storedRestaurants[i].restaurantName);
    var foodSpots = document.createElement('li');
    foodSpots.innerHTML = `
<h2>${storedRestaurants[i].restaurantName}</h2>
<p>${storedRestaurants[i].address}</p>
<p>${storedRestaurants[i].cityName}, ${storedRestaurants[i].stateName}, ${storedRestaurants[i].zipCode}</p>
<p>${storedRestaurants[i].phone}</p>
<p>${locationGot ? storedRestaurants[i].distance + " distance" : ""}</p>
    `
    restList.append(foodSpots);
  }
}

function getDistance() {
  console.log(storedRestaurants);
  if (!Object.keys(storedRestaurants[0]).includes('distance')) {
    console.log('fetching distance');

    for (let i = 0; i < storedRestaurants.length; i++) {

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
          'X-RapidAPI-Host': 'route-and-directions.p.rapidapi.com'
        }
      };

      console.log(storedRestaurants[i]);

      fetch('https://route-and-directions.p.rapidapi.com/v1/routing?waypoints=' + currentLoc.latitude + ',' + currentLoc.longitude + '|' + storedRestaurants[i].latitude + ',' + storedRestaurants[i].longitude + '&mode=walk', options)
        .then(response => response.json())
        .then(function (response) {
          console.log(response)
          console.log(response.features[0].properties.distance)
          console.log(storedRestaurants[i]);
          storedRestaurants[i].distance = response.features[0].properties.distance;
          storedRestaurants[i].time = response.features[0].properties.time;
        })
        .catch(err => console.error(err));
      ;
    }
  } else {
    console.log('data was there');
  }
}





