var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');

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



/*
const options = {
	method: 'GET',
	headers: {
		'x-api-key': '<REQUIRED>',
		'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
		'X-RapidAPI-Host': 'documenu.p.rapidapi.com'
	}
};
fetch('https://documenu.p.rapidapi.com/restaurants/search/geo?lat=40.68919&lon=-73.992378&distance=5&size=30&page=2&fullmenu=true&cuisine=Italian&top_cuisines=true', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
___________________________________________________________________
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
		'X-RapidAPI-Host': 'distanceto.p.rapidapi.com'
	}
};
fetch('https://distanceto.p.rapidapi.com/get?route=%3CREQUIRED%3E&car=false', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
  */