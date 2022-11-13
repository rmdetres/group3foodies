var storedRestaurants = JSON.parse(localStorage.getItem("storedRestaurants"));
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
var favoriteRestaurants = JSON.parse(localStorage.getItem("favoriteRestaurants"));
if (favoriteRestaurants === null) {
  favoriteRestaurants = [];
}


//* Displays a random food image from imageList
function getRandomImage() {
  document.getElementById("rest-list").innerHTML = '<img src="./assets/images/' + imageList[Math.floor(Math.random() * imageList.length)] + '" />';
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
  currentLoc.latitude = position.coords.latitude;
  currentLoc.longitude = position.coords.longitude;
}

//* sets buttonState(boolean) for all buttons that use buildResponse()
function buttonState(isDisabled) {
  fetchButton.attr("disabled", isDisabled);
  favoritesTab.attr("disabled", isDisabled);
  resultTab.attr("disabled", isDisabled);
}

//*Function to build layout from zipcodeFetch, savedFetch, or favoriteRestaurants 
function buildResponse(dataSource, buildOption) {

  document.getElementById("rest-list").innerHTML = "";

  for (let j = 0; j < dataSource.length; j++) {
    var restaurantResult = $('<div>')
      .addClass('row restaurantResult rest-pos-' + j + ''); // d-flex justify-content-between 

    var restaurantInfo = $('<div>')
      .addClass('col-12 col-sm-6 restaurantInfo align-items-start');

    var restaurantName = $('<h2>')
      .text((j + 1) + '. ' + dataSource[j].restaurantName);

    var restaurantAddress = $('<p>')
      .text(dataSource[j].address);

    var restaurantPostal = $('<p>')
      .text(dataSource[j].cityName + ', ' + dataSource[j].stateName + ' ' + dataSource[j].zipCode);

    var restaurantPhone = $('<p>')
      .text("Phone: " + dataSource[j].phone);

    if (dataSource[j].distance > 160) {

      var restaurantDistance = $('<div>')
        .addClass('col-2 distance')
        .text(Math.round((dataSource[j].distance / 1609) * 10) / 10);

      var milesAway = $('<p>')
        .addClass('milesAway subtext')
        .text("miles away");
    } else {

      var restaurantDistance = $('<div>')
        .addClass('col-2 distance')
        .text(Math.round(dataSource[j].distance / .304))

      var milesAway = $('<p>')
        .addClass('milesAway subtext')
        .text("feet away");
    }

    //* display seconds response as hh:mm:ss
    var restaurantTime = $('<div>')
      .addClass('col-2 time')
      .text(new Date(dataSource[j].time * 1000).toISOString().substr(11, 8));

    var onFoot = $('<p>')
      .addClass('onFoot subtext')
      .text("on foot");

    if (buildOption === 'search') {
      //* builds favorite button if showing search result
      var addFavorite = $('<button>')
        .addClass('col-1 addFavorite')
        .attr({
          type: 'button',
        })
        .on('click', function () {
          //* gets the "j" value posted in restaurantInfo from the first character
          //* uses that to find array position of the button clicked
          //* pushes storedRestaunts[j] to favoriteRestaurants
          //* sorts and saves favorites & disables the button
          var listPos = $(this).siblings().first().text().split('.');
          favoriteRestaurants.push(dataSource[listPos[0] - 1]);
          favoriteRestaurants.sort((c1, c2) => (c1.distance > c2.distance) ? 1 : (c1.distance < c2.distance) ? -1 : 0);
          localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));
          $(this).attr("disabled", true).css('background-color', "#eaeaea");

        });

      // *diables button if storedRestaurants[j] is already a favorite
      if (favoriteRestaurants.some(e => e.restaurantName === dataSource[j].restaurantName)) {
        addFavorite.attr("disabled", true).css('background-color', "#eaeaea");
      }
      var favIcon = $('<i>')
        .addClass('fas fa-heart fa-1x');

    } else if (buildOption === 'saved') {
      //* builds [j] delete button if showing favorites
      var addFavorite = $('<button>')
        .addClass('col-1 delFavorite')
        .attr({
          type: 'button',
        })
        .on('click', function () {
          //* deletes the array position[j]
          //* removes button parent and rebuildResponse()
          var listPos = $(this).siblings().first().text().split('.');
          favoriteRestaurants.splice(dataSource[listPos[0] - 1], 1);
          localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));
          $(this).parent().remove();
          buttonState(true);
          buildResponse(favoriteRestaurants, 'saved');

        });

      var favIcon = $('<i>')
        .addClass('fas fa-trash fa-1x');

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
  buttonState(false);
}

//* Gets distance for each item in search, if it hasnt already searched
//* Sorts/Saves storedRestaurants
//* awaits each fetch and starts buildResponse()
async function getDistance() {
  if (!storedRestaurants[0].hasOwnProperty('distance')) {
    console.log('fetching time and space');
    for (let i = 0; i < storedRestaurants.length; i++) {
      getRandomImage();
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '0cab365bcfmsh9bc2df3c26f4a8dp178b26jsn2eeb80f2d94d',
          'X-RapidAPI-Host': 'route-and-directions.p.rapidapi.com'
        }
      };

      await fetch('https://route-and-directions.p.rapidapi.com/v1/routing?waypoints=' + currentLoc.latitude + ',' + currentLoc.longitude + '|' + storedRestaurants[i].latitude + ',' + storedRestaurants[i].longitude + '&mode=walk', options)
        .then(response => response.json())
        .then(function (response) {
          storedRestaurants[i].distance = response.features[0].properties.distance;
          storedRestaurants[i].time = response.features[0].properties.time;
          storedRestaurants.sort((c1, c2) => (c1.distance > c2.distance) ? 1 : (c1.distance < c2.distance) ? -1 : 0);
        })
        .catch(err => console.error(err));
      localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));
    }
    buildResponse(storedRestaurants, 'search');
  } else {
    console.log('data was there');
  }
}

//* Gets data based on zipcode input
//* skips API call when repeating last used zipcode
//*skips the buildResponse() if there are no reults
function getData() {

  zipCodeDataFinal = zipCodeData.value.trim()
  restList.innerHTML = "";

  console.log(storedLoc);
  if (zipCodeDataFinal != currentLoc.zipcodeLast) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '456ed3b828msh153bbf70fb39ab5p12acfdjsn29c133b9476c',
        'X-RapidAPI-Host': 'restaurants-near-me-usa.p.rapidapi.com'
      }
    };
    fetch('https://restaurants-near-me-usa.p.rapidapi.com/restaurants/location/zipcode/' + zipCodeDataFinal + '/0', options)
      .then(response => response.json())
      .then(function (response) {
        console.log(response);
        if (response === null) {
          document.getElementById("rest-list").innerHTML = "No Restaurants";
          currentLoc.zipcodeLast = zipCodeDataFinal;
          localStorage.setItem("currentLoc", JSON.stringify(currentLoc));
          fetchButton.attr("disabled", false);
        } else {
          storedRestaurants = response.restaurants;
          localStorage.setItem("storedRestaurants", JSON.stringify(storedRestaurants));

          console.log('fetched');
          currentLoc.zipcodeLast = zipCodeDataFinal;
          if (locationGot) {
            getRandomImage();
            getDistance();
            localStorage.setItem("currentLoc", JSON.stringify(currentLoc));
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
  buttonState(true);
  getData();
});

//view favorites button
var favoritesTab = $('#toSaved').on('click', function (event) {
  event.preventDefault();
  buttonState(true);
  buildResponse(favoriteRestaurants, 'saved');
});

//back to previous search button
var resultTab = $('#toResult').on('click', function (event) {
  event.preventDefault();
  buttonState(true);
  buildResponse(storedRestaurants, 'search');
});

getRandomImage();
getLocation();