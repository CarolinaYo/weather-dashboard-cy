var citySearches = [];
var city;
var lat;
var lon;
var searchBtn = $("#addCityBtn");
var searchField = $("#searchCity");

function setup() {
  searchBtn.on("click", function (event) {
    event.preventDefault();
    city = searchField.val().trim();
    citySearches.push(city);

    setCitiesToLocalStorage();
    displayPastCitySearchList();

    getLatLong(city).then(function (response) {
      lat = response.coord.lat;
      lon = response.coord.lon;
      getWeatherData(lat, lon);
    });
  });
  getCitiesFromLocalStorage();
}

// Get saved citySearched array from local storage
function getCitiesFromLocalStorage() {
  if (localStorage.getItem("cities")) {
    citySearches = JSON.parse(localStorage.getItem("cities"));
  }
}

// Saves citySearches array to local storage
function setCitiesToLocalStorage() {
  localStorage.setItem("cities", JSON.stringify(citySearches));
}

function displayPastCitySearchList() {
  var a;
  $("#buttonView").empty();
  $("#listView").empty();

  // var listOfCities = citySearches.reverse();

  for (var i = citySearches.length - 1; i >= 0; i--) {
    a = $("<a>");
    a.addClass("list-group-item list-group-item-action city-link");
    a.attr("data-city", citySearches[i]);
    a.text(citySearches[i]);

    //click listener
    a.on("click", function (event) {
      event.preventDefault();
      city = $(event.target).data("city");
      getLatLong(city).then(function (response) {
        lat = response.coord.lat;
        lon = response.coord.lon;
        getWeatherData(lat, lon);
      });
    });
    $("#listView").append(a);
  }
}

function getLatLong(cityName) {
  const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=3b39c2827e08627d2c1ebcae6181db52";
  return $.ajax({
    url: queryUrl,
    method: "GET",
  });
}

function getWeatherData(lat, lon) {
  const oneCallData =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=minutely,hourly&appid=3b39c2827e08627d2c1ebcae6181db52";

  $.ajax({
    url: oneCallData,
    method: "GET",
  }).then(function (response) {
    console.log("getWeatherData response:", response);
    var weatherData = response;
    displayCurrentWeather(weatherData);
    displayFiveDayForecast(weatherData);
  });
}

function displayCurrentWeather(weatherData) {
  //date stamp is using UNIX UTC format from API date
  let unixTimeStamp = weatherData.current.dt;
  $("#cityWeather").empty();

  var cityDiv = $("<div>").addClass(".nameOfcity");

  //date
  var date = new Date(unixTimeStamp * 1000);
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  var currentDate = dd + "/" + mm + "/" + yyyy;
  var pdate = $("<span>").text("  (" + currentDate + ")");

  var pOne = $("<h1>").text(city).append(pdate);
  cityDiv.append(pOne);

  $("#cityWeather").append(cityDiv);
  //temperature
  var tempinF = parseFloat(weatherData.current.temp);
  var weatherDiv = $("<div>").addClass(".weatherInfo");

  var pTwo = $("<p>").text("Temperature: " + tempinF + " F"); //&deg; does not work
  weatherDiv.append(pTwo);

  //humidity
  var humidity = weatherData.current.humidity;
  var pThree = $("<p>").text("Humidity: " + humidity + "%");
  weatherDiv.append(pThree);

  //wind speed
  var wind = weatherData.current.wind_speed;
  var pFour = $("<p>").text("Wind Speed: " + wind + " MPH");
  weatherDiv.append(pFour);
  $("#cityWeather").append(weatherDiv);

  var uvIndex = weatherData.current.uvi;
  var alertIndex;

  if (uvIndex < 3) {
    alertIndex = $("<span>").addClass("badge badge-success").text(uvIndex);
  } else if (uvIndex >= 3 && uvIndex < 6) {
    alertIndex = $("<span>").addClass("badge badge-warning").text(uvIndex);
  } else {
    alertIndex = $("<span>").addClass("badge badge-danger").text(uvIndex);
  }

  //I thought this would work...
  var pFour = $("<p>").text("UV Index: ").append(alertIndex);

  weatherDiv.append(pFour);
  $("#cityWeather").append(weatherDiv);
}

function displayFiveDayForecast(fData) {
  $("#forecast").empty();
  $(".forecastHeading").text("5-Day Forecast");

  for (var i = 0; i < 5; i++) {
    var iconCode = fData.daily[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    var fTemp = fData.daily[i + 1].temp.day;
    var fparseTemp = parseFloat(fTemp);
    var fHumidity = fData.daily[i + 1].humidity;

    //future date
    var unixTimeStamp = fData.daily[i + 1].dt;
    var fDate = new Date(unixTimeStamp * 1000);
    var fd = fDate.getDate();
    var fm = fDate.getMonth() + 1;
    var fyyyy = fDate.getFullYear();
    var newFutureDate = fd + "/" + fm + "/" + fyyyy;

    //place to print the information

    var forecastDiv = $("<div>").addClass(
      "card col-sm-2 bg-primary text-white p-3 mr-2 mb-2"
    );

    var newDate = $("<p>").text(newFutureDate);

    forecastDiv.append(newDate);

    var fIcon = $("<img>").attr("src", iconUrl);
    fIcon.addClass("weather-icon");
    forecastDiv.append(fIcon);

    var ftempinF = $("<p>").text("Temperature: " + fparseTemp + "  F");
    forecastDiv.append(ftempinF);

    var fHumidValue = $("<p>").text("Humidity: " + fHumidity);
    forecastDiv.append(fHumidValue);
    $("#forecast").append(forecastDiv);
  }
}

$(document).ready(function () {
  setup();

  if (citySearches.length > 0) {
    displayPastCitySearchList();
    city = citySearches[citySearches.length - 1];

    getLatLong(city).then(function (response) {
      lat = response.coord.lat;
      lon = response.coord.lon;
      getWeatherData(lat, lon);
    });
  }
});
