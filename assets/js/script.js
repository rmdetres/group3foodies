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
  var shoppingItem = JSON.parse(localStorage.getItem("shoppingItemsLocalStorage"));
  console.log(shoppingItem);
  for (i = 0; i < shoppingItem.length; i++){ 
  shoppingListEl.append('<li>' + shoppingItem[i] + '</li>');
    console.log("is this working")
  }
}



