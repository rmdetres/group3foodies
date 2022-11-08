// need input for zipco

var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');
var zipcode = "06525"

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

//*
//*WORKING
// *Gets restaurants near zipcode
// *Can also do   {state}   and     {state} , {city}

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
		'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
	}
};

fetch('https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/' + zipcode + '/0', options) 
	.then(response => response.json())
	.then(function(response) {
		for (i = 0; i < response.restaurants.length; i++) {
		console.log(response.restaurants[i].restaurantName);
		shoppingListEl.text(response.restaurants[i].restaurantName);
	}})
	.catch(err => console.error(err));
// */

console.log(document);

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