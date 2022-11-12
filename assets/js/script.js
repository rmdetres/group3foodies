var storedRestaurants = JSON.parse(localStorage.getItem("storedRestaurants"));
var shoppingFormEl = $('#shopping-form');
var shoppingListEl = $('#shopping-list');
var restList = $('#rest-list');
var currentLoc = {}
var zipCodeDataFinal;
var zipCodeData = document.querySelector('#zipCode2');
var imageList = ['Burger.jpg', 'Crepe.jpg', 'Dimsum.jpg', 'Hotdog.jpg', 'Pasta.jpg', 'Pizza.jpg', 'Ribs.jpg', 'Sushi.jpg', 'tacos.jpg'];
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
var favoriteRestaurants = [];


//this function saves local storage for user entered data.
function saveLocalStorage(favoriteRestaurants) {

  localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));

}

// function to run the local storage
function runLocalStorage() {

  console.log("is this working1")
  var shoppingItemLocal = JSON.parse(localStorage.getItem("favoriteRestaurants"));
  if (shoppingItemLocal != null) {
    console.log(shoppingItemLocal);
    for (let i = 0; i < shoppingItemLocal.length; i++) {
      shoppingListEl.append('<p>' + shoppingItemLocal[i] + '</p>');
      console.log("is this working")
      favoriteRestaurants.push(shoppingItemLocal[i])
    }
  }
}


// create foods spots list the user enters
function handleFormSubmit(event) {
  event.preventDefault();

  //line below updates the variable to pull the latest data, super important
  //favoriteRestaurants = JSON.parse(localStorage.getItem("favoriteRestaurants"));

  var shoppingItem = $('input[name="shopping-input"]').val();
  if (!shoppingItem) {
    console.log('No shopping item filled out in form!');
    return;
  }
  shoppingListEl.append('<li>' + shoppingItem + '</li>');
  $('input[name="shopping-input"]').val('');
  favoriteRestaurants.push(shoppingItem);
  console.log(favoriteRestaurants);
  saveLocalStorage(favoriteRestaurants);
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
function buildResponse(dataSource, buildOption) { //need input dataSource = (storedRestaurants || favoriteRestaurants)   &&  buildOption = ( 'search' || 'saved')

  document.getElementById("rest-list").innerHTML = "";

  for (let j = 0; j < dataSource.length; j++) {
    console.log(dataSource[j].time);
    var restaurantResult = $('<div>')
      .addClass('row restaurantResult rest-pos-' + j + '');

    // var resultNumber = $('<div>')
    //   .addClass('col-0 justify-center resultNumber-' + j)
    //   .text(j + '.');

    var restaurantInfo = $('<div>')
      .addClass('col-6 restaurantInfo align-items-start');

    var restaurantName = $('<h2>')
      .text((j + 1) + '. ' + dataSource[j].restaurantName);

    var restaurantAddress = $('<p>')
      .text(dataSource[j].address);

    var restaurantPostal = $('<p>')
      .text(dataSource[j].cityName + ',' + dataSource[j].stateName + ' ' + dataSource[j].zipCode);

    var restaurantPhone = $('<p>')
      .text(dataSource[j].phone);

    var restaurantDistance = $('<div>')
      .addClass('col-2 distance')
      .text(Math.trunc(dataSource[j].distance / 1609));

    var milesAway = $('<p>')
      .addClass('milesAway subtext')
      .text("miles away");

    var restaurantTime = $('<div>')
      .addClass('col-2 time')
      .text(new Date(dataSource[j].time * 1000).toISOString().substr(11, 8));

    var onFoot = $('<p>')
      .addClass('onFoot subtext')
      .text("on foot");
    if (buildOption === 'search') {
      var addFavorite = $('<button>')
        .addClass('col-2 addFavorite')
        .attr({
          type: 'button',
        })
        .on('click', function () {
          var listPos = $(this).siblings().first().text().split('.');
          console.log(listPos[0] - 1);
          favoriteRestaurants.push(dataSource[listPos[0] - 1]);
          console.log(favoriteRestaurants);
          localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));
          $(this).attr("disabled", true); //.css('background-color', "#d3d3d3");
        });
      // diables button if already favorited
      if (favoriteRestaurants.some(e => e.restaurantName === dataSource[j].restaurantName)) {
        addFavorite.attr("disabled", true);
      }
      var favIcon = $('<i>')
        .addClass('fas fa-heart fa-2x');
    } else if (buildOption === 'saved') {


    } else {
      console.log('buildOption Error');
    }

    $(restList).append(restaurantResult);
    $(restaurantResult).append(restaurantInfo);
    $(restaurantInfo).append(restaurantName);
    $(restaurantInfo).append(restaurantAddress);
    $(restaurantInfo).append(restaurantPostal);
    $(restaurantInfo).append(restaurantPhone);
    $(restaurantResult).append(restaurantDistance);
    $(restaurantDistance).append(milesAway);
    $(restaurantResult).append(restaurantTime);
    $(restaurantTime).append(onFoot);
    $(restaurantResult).append(addFavorite);
    $(addFavorite).append(favIcon);
  }
  fetchButton.attr("disabled", false);
}

async function getDistance() {
  console.log(storedRestaurants[0].distance);
  if (!storedRestaurants[0].hasOwnProperty('distance')) {
    console.log('fetching time and space');
    for (let i = 0; i < storedRestaurants.length; i++) {
      document.getElementById("rest-list").innerHTML = '<img src="./assets/images/' + imageList[Math.floor(Math.random() * imageList.length)] + '" />';


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
    buildResponse(storedRestaurants, 'search');
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
          currentLoc.zipcodeLast = zipCodeDataFinal;
        } else {
          storedRestaurants = response.restaurants;
          localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));

          console.log('fetched');
          currentLoc.zipcodeLast = zipCodeDataFinal;
          if (locationGot) {
            document.getElementById("rest-list").innerHTML = '<img src="./assets/images/' + imageList[Math.floor(Math.random() * imageList.length)] + '" />';
            getDistance();
            localStorage.setItem("currentLoc", JSON.stringify(currentLoc));


            console.log(storedRestaurants);
          }
        }
      })
      .catch(err => console.error(err));
  } else {
    buildResponse(storedRestaurants, 'search');
    console.log('localstoraged');
  }
}



//*Event Listeners
//button to fetch the restaurant API calls
var fetchButton = $('#fetch-button').on('click', function (event) {
  event.preventDefault();
  fetchButton.attr("disabled", true);
  getData();
});

// Create a submit event listener on the form element
shoppingFormEl.on('submit', handleFormSubmit);

runLocalStorage();
getLocation();
document.getElementById("rest-list").innerHTML = '<img src="./assets/images/' + imageList[Math.floor(Math.random() * imageList.length)] + '" />';


