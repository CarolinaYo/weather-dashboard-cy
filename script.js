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

    displayPastCitySearchList();
    setCitiesToLocalStorage();
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
  $("#buttonView").empty();

  var listOfCities = citySearches.reverse();

  for (var i = 0; i < listOfCities.length; i++) {
    // var li = $("<li>");
    var a = $("<a>");
    a.addClass("list-group-item list-group-item-action city-link");
    a.attr("data-city", citySearches[i]);
    a.text(citySearches[i]);

    // li.append(list);
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
    let unixTimeStamp;
    $("#cityWeather").empty();

  var cityDiv = $("<div>").addClass(".nameOfcity");
  var pOne = $("<h1>").text(city);
  //date
//   var date = new Date(unixTimeStamp * 1000); it returns NaN/NaN/NaN
  var date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  var currentDate = dd + "/" + mm + "/" + yyyy;
  var pdate = $("<p>").text("(" + currentDate + ")");

  cityDiv.append(pOne);
  cityDiv.append(pdate);
  $("#cityWeather").append(cityDiv);
  //temperature
  var tempinF = parseFloat(weatherData.current.temp);
  var weatherDiv = $("<div>").addClass(".weatherInfo");

  var pTwo = $("<p>").text("Temperature: " + tempinF + " &deg;F");
  weatherDiv.append(pTwo);

  //humidity
  var humidity = weatherData.current.humidity;
  var pThree = $("<p>").text("Humidity: " + humidity + "%");
  weatherDiv.append(pThree);

  //wind speed
  var wind = weatherData.current.wind_speed;
//   var windMph = (wind * 2.24).toFixed(1);
  var pFour = $("<p>").text("Wind Speed: " + wind + " MPH");
  weatherDiv.append(pFour);
  $("#cityWeather").append(weatherDiv);

  var uvIndex = weatherData.current.uvi;
  var pFour = $("<p>").text("UV Index: " + uvIndex);

  //is this the right way of writing it?
  //   if (uvIndex <= 2) {
  //     pFour = pFour.attr("id", favorable);
  //   } else if (uvIndex > 2 && uvIndex < 6) {
  //     pFour = pFour.attr("id", moderate);
  //   } else {
  //     pFour = pFour.attr("id", danger);
  //   }

  weatherDiv.append(pFour);
  $("#cityWeather").append(weatherDiv);
  
}

//check

function displayFiveDayForecast(fData) {
  //5day forecast
  var fTitle = $("<h1>").text("5-Day forecast");
  $("#forecastHeading").append(fTitle);

  for (var i = 0; i < 5; i++) {
    var iconCode = fData.daily[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    var fTemp = fData.daily[i].temp.day;
    var fHumidity = fData.daily[i].humidity;

    //future date
    var fdate = new Date();
    var fd = fdate.getDate() + i + 1;
    var fm = fdate.getMonth() + 1;
    var fyyyy = fdate.getFullYear();
    var newFutureDate = fd + "/" + fm + "/" + fyyyy;

    //place to print the information

    var forecastDiv = $("<div>").addClass(
      "card col-sm-2 bg-primary text-white p-3"
    );

    var newDate = $("<p>").text(newFutureDate);

    forecastDiv.append(newDate);

    var ficon = $("<img>").attr("src", iconUrl);
    forecastDiv.append(ficon);

    var ftempinF = $("<p>").text("Temperature: " + fTemp + "  F");
    forecastDiv.append(ftempinF);

    var fHumidValue = $("<p>").text("Humidity: " + fHumidity);
    forecastDiv.append(fHumidValue);
    $("#forecast").append(forecastDiv);
  }
}

function toggleDisplayWeather(show) {
  var show = false;
  if (show) {
    $("#weatherDisplay").removeClass("hidden");
  } else {
    $("#weatherDisplay").addClass("hidden");
  }
}
//click does not work
$("a").on("li", "click", function () {
  getWeatherData(lat, lon);
  toggleDisplayWeather(show);
});
 
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
