var storedRestaurants = "";
var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');
var restList = $('#rest-list');
var zipcode = "06525";
var zipcodeData = document.querySelector('#zipCode2');
var shoppingItemsLocalStorage = [];

//button to fetch the restaurant API calls
var fetchButton = document.getElementById('fetch-button');
fetchButton.addEventListener('click', getData);

runLocalStorage();

// create foods spots list the user enters
function handleFormSubmit(event) {
  event.preventDefault();

  //line below updates the variable to pull the latest data, super important
  //shoppingItemsLocalStorage = JSON.parse(localStorage.getItem("shoppingItemsLocalStorage"));

  var shoppingItem = $('input[name="shopping-input"]').val();
  if (!shoppingItem) {
    console.log('No shopping item filled out in form!');
    return;}
  shoppingListEl.append('<li>' + shoppingItem + '</li>');
  $('input[name="shopping-input"]').val('');
  shoppingItemsLocalStorage.push(shoppingItem);
  console.log(shoppingItemsLocalStorage);
  saveLocalStorage(shoppingItemsLocalStorage);
}





// Create a submit event listener on the form element
 shoppingFormEl.on('submit', handleFormSubmit);

 //this function saves local storage for user entered data.
function saveLocalStorage(shoppingItemsLocalStorage){
  
  localStorage.setItem("shoppingItemsLocalStorage", JSON.stringify(shoppingItemsLocalStorage));
  
}


// function to run the local storage
function runLocalStorage(){
   
  console.log("is this working1")
   var shoppingitemLocall = JSON.parse(localStorage.getItem("shoppingItemsLocalStorage"));
    

  if(shoppingitemLocall != null){
    console.log(shoppingitemLocall);
  for (i = 0; i < shoppingitemLocall.length; i++){ 
  shoppingListEl.append('<li>' + shoppingitemLocall[i] + '</li>');
    console.log("is this working")
    shoppingItemsLocalStorage.push(shoppingitemLocall[i])
  }
  }
}







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