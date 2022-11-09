
var storedRestaurants = JSON.parse(localStorage.getItem("storedRestaurants"));
var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');
var restList = $('#rest-list');
var zipcode = "06525";
var zipcodeData = document.querySelector('#zipCode2');


var fetchButton = document.getElementById('fetch-button');

fetchButton.addEventListener('click', getData);


// create function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  // select form element by its `name` attribute and get its value
  var shoppingItem = $('input[name="shopping-input"]').val();

  // if there's nothing in the form entered, don't print to the page
  if (!shoppingItem) {
    console.log('No shopping item filled out in form!');
    return;
  }

  // print to the page
  shoppingListEl.append('<li>' + shoppingItem + '</li>');

  // clear the form input element
  $('input[name="shopping-input"]').val('');
}

// Create a submit event listener on the form element
 shoppingFormEl.on('submit', handleFormSubmit);

// *function gets the geolocation to determine distance to for the api
// function getLocation() {
// 	if (navigator.geolocation) {
// 		navigator.geolocation.getCurrentPosition(showPosition);
// 	} else {
// 		console.log("Geolocation is not supported by this browser.");
// 	}
// }
// function showPosition(position) {
// 	console.log(position);
// 	console.log(position.coords.latitude);
// 	console.log(position.coords.longitude);
// }

// getLocation();

//*
//*WORKING
// *Gets restaurants near zipcode
// *Can also do   {state}   and     {state} , {city}


function getData(){
  var zipcodeDataFinal  = zipcodeData.value.trim()

  const options = {
    method: 'GET',
    headers: {
			'X-RapidAPI-Key': 'a9ea82fb84msh7369adc411cc5cbp18f351jsn9f009c32dbe0',
			'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
    }
  };
  
	if (storedRestaurants === null) {
		fetch('https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/' + zipcode + '/0', options) // set static zip code for CONSTRUCTION
			.then(response => response.json())
			.then(function (response) {
				storedRestaurants = response.restaurants;
				localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));
				buildResponse();
				console.log('fetched');
			})
			.catch(err => console.error(err));
	} else {
		buildResponse();
		console.log('localstoraged');
	}

}
// */

//Function to build layout for zipcode search results
function buildResponse() {
	for (i = 0; i < storedRestaurants.length; i++) {
		console.log(storedRestaurants[i].restaurantName);
		var foodSpots = document.createElement('li');
		foodSpots.textContent = storedRestaurants[i].restaurantName;
		restList.append(foodSpots);
	}
}



// *
// *WORKING // 
// distance: (in meters) = this.steps.0.distance.car.distance
// est Time: (in seconds) = this.steps.0.distance.car.duration

// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
// 		'X-RapidAPI-Host': 'distanceto.p.rapidapi.com'
// 	}
// };

// fetch('https://distanceto.p.rapidapi.com/get?route=[{"t":"New York, New York"},{"t":"Bethlehem, Connecticut"}]&car=true', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));

//   */


// *
// *WORKING // DISTANCE BETWEEN TWO GEO LOCS
// *would need an additional way to find user's geo loc*
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
// 		'X-RapidAPI-Host': 'trueway-matrix.p.rapidapi.com'
// 	}
// };

// fetch('https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=40.629041%2C-74.025606%3B40.630099%2C-73.993521%3B40.644895%2C-74.013818%3B40.627177%2C-73.980853&destinations=40.629041%2C-74.025606%3B40.630099%2C-73.993521%3B40.644895%2C-74.013818%3B40.627177%2C-73.980853', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));