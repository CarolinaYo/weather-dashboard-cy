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
    getCurrentWeather(city);
    getFiveDayForecast(lat, lon);
    displayPastCitySearchList();
  });
  getCitiesFromLocalStorage();
}

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
    var li = $("<li>");
    var btn = $("<button>");
    btn.addClass("city-btn");
    btn.attr("data-city", citySearches[i]);
    btn.text(citySearches[i]);
    $("#buttonView").append(li);
    li.append(btn);
  }
}

function getCurrentWeather(city) {
  const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=3b39c2827e08627d2c1ebcae6181db52";
  //----------------------------------------------
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    lat = response.coord.lat;
    lon = response.coord.lon;

    //name of the city
    var cityDiv = $("<div class='nameOfcity'>");
    var pOne = $("<h1>").text(response.name);
    var currentDate = moment().format("MMM Do YYY");
    cityDiv.append(pOne);
    cityDiv.append(currentDate);
    $("#cityWeather").append(cityDiv);

    //temperature
    var weatherDiv = $("<div class='weatherInfo'>");
    var temperature = convertKtoF(parseFloat(response.main.temp));
    var pTwo = $("<p>").text("Temperature: " + temperature + "  F");
    weatherDiv.append(pTwo);

    function convertKtoF(tempInKelvin) {
      return (((tempInKelvin - 273.15) * 9) / 5 + 32).toFixed(2);
    }

    //humidity
    var humidity = response.main.humidity;
    var pThree = $("<p>").text("Humidity: " + humidity + "%");
    weatherDiv.append(pThree);

    //wind speed
    var wind = response.wind.speed;
    var windMph = (wind * 2.24).toFixed(1);
    var pFour = $("<p>").text("Wind Speed: " + windMph + " MPH");
    weatherDiv.append(pFour);
    // $("#cityWeather").append(weatherDiv);

    //UV index

    queryUvi =
      "http://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=3b39c2827e08627d2c1ebcae6181db52";

    $.ajax({
      url: queryUvi,
      method: "GET",
    }).then(function (getUvi) {
      //   console.log(getUvi);

      var uvIndex = getUvi.value;
      var pFour = $("<p>").text("UV Index: " + uvIndex);
      if (uvIndex <= 2) {
        pFour.attr("id", favorable);
      } else if (uvIndex > 2 && uvIndex < 6) {
        pFour.attr("id", favorable);
      } else {
        pFour.attr("id", danger);
      }

      weatherDiv.append(pFour);
    });
    $("#cityWeather").append(weatherDiv);

    const apiForecast =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly&appid=3b39c2827e08627d2c1ebcae6181db52";

    $.ajax({
      url: apiForecast,
      method: "GET",
    }).then(function (forecast) {
      console.log(forecast);

      getFiveDayForecast(lat, lon);
    });
  });
}

console.log(lat);
function getFiveDayForecast(lat, lon) {
  //5day forecast
    for(var i=0, i<5, i++) {
      var fDate = ;
      var iconCode = forecast.daily[i].weather[i].icon;
      var iconUrl = "http://openweathermap.org/img/wn/"+iconCode+".png";
      var fTemp= forecast.daily[i].temp.day;
      var fHumidity = forecast.daily[i].humidity;

      //place to print the information

    var forecastDiv = $("<div class='card col-sm-2 bg-primary text-white p-3'>");
    var date = $("<p>").text(fDate);
    forecastDiv.append(date);
    $("#forecast").append(forecastDiv);

    var ficon = $("<img>").attr("src", iconUrl);


    };
}

var show =false;
function toggleMessage(show) {
    if (show) {
      $("#weatherDisplay").removeClass("hidden");
    } else {
      $("#weatherDisplay").addClass("hidden");
    }
  }

$(".city-btn").on("click", function () {
    var show = false;
    getCurrentWeather(city);
  // getFiveDayForecast(lat,lon);
});

$(document).ready(function () {
  setup();

  if (citySearches.length > 0) {
    displayPastCitySearchList();
    city = citySearches[citySearches.length - 1];
    getCurrentWeather(city);
    getFiveDayForecast(lat, lon);
  }
});
