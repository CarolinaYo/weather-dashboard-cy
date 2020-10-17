var citySearches = [];
var city;
var searchBtn = $("#addCityBtn");
var searchField = $("#searchCity");

function setup() {
  searchBtn.on("click", function (event) {
    event.preventDefault();

    city = searchField.val().trim();
    citySearches.push(city);

    displayPastCitySearchList();
    setCitiesToLocalStorage();
    getCurrentWeather(city);
    getFiveDayForecast(lat, lon);
    
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
    
    li.append(btn);
    $("#listView").append(li);
  }
}


function getLatLong(cityName) {
    const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=3b39c2827e08627d2c1ebcae6181db52"; 
    $.ajax({
        url: queryUrl,
        method: "GET",
      });

};

function getWeatherData(lat,lon) {
    const oneCallData ="https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=minutely,hourly&appid=3b39c2827e08627d2c1ebcae6181db52";

  $.ajax({
    url: oneCallData,
    method: "GET",
  }).then(function (response) {
    // console.log("getWeatherData response:", response);
    var weatherData = response;
    displayCurrentWeather(weatherData);
    displayFiveDayForecast(weatherData);
    
  });
}


function displayCurrentWeather() {

    var cityDiv = $("<div class='nameOfcity'>");
    var pOne = $("<h1>").text(city);
    //date
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    var currentDate = dd + "/"+ mm + "/"+ yyyy;
    var pdate = $("<p>").text("(" +currentDate+ ")");
    cityDiv.append(pOne);
    cityDiv.append(pdate);
    $("#cityWeather").append(cityDiv);
 //temperature
 var tempinF= response.current.temp;
 var weatherDiv = $("<div class='weatherInfo'>");
 
 var pTwo = $("<p>").text("Temperature: "+tempinF+" &#730F");
 weatherDiv.append(pTwo);

 //humidity
var humidity = response.main.humidity;
var pThree = $("<p>").text("Humidity: " + humidity + "%");
weatherDiv.append(pThree);

//wind speed
var wind = response.wind.speed;
var windMph = (wind * 2.24).toFixed(1);
var pFour = $("<p>").text("Wind Speed: " + windMph + " MPH");
weatherDiv.append(pFour);
$("#cityWeather").append(weatherDiv);

var uvIndex = getUvi.value;
var pFour = $("<p>").text("UV Index: " + uvIndex);

    if (uvIndex <= 2) {
    pFour.attr("id", favorable);
    } else if (uvIndex > 2 && uvIndex < 6) {
    pFour.attr("id", moderate);
    } else {
    pFour.attr("id", danger);
    }

weatherDiv.append(pFour);
$("#cityWeather").append(weatherDiv);



}




function displayFiveDayForecast() {
  //5day forecast
    for (var i = 0; i < 5; i++) {

        const newLocal = i + 1;
        var addDay = newLocal;
        var iconCode = forecast.daily[i].weather[i].icon;
        var iconUrl = "http://openweathermap.org/img/wn/"+iconCode+".png";
        var fTemp= forecast.daily[i].temp.day;
        var fHumidity = forecast.daily[i].humidity;

            var fTempInF = FtempKtoF(parseFloat(fTemp));
            function FtempKtoF(fTempInKelvin) {
            return (((fTempInKelvin - 273.15) * 9) / 5 + 32).toFixed(2);
            }

        //future date
        var fdate = new Date();
        var fd = fdate.getDate() + addDay;
        var fm = fdate.getMonth() + addDay;
        var fyyyy = fdate.getFullYear() + addDay;
        var newFutureDate = fd + "/"+ fm + "/"+ fyyyy;

        //place to print the information

        var forecastDiv = $("<div>").addClass("card col-sm-2 bg-primary text-white p-3");

        var fDate = $("<p>").text(newFutureDate);;

        forecastDiv.append(date);
        $("#forecast").append(forecastDiv);

        var ficon = $("<img>").attr("src", iconUrl);
        forecastDiv.append(ficon);

        var ftempinF = $("<p>").text("Temperature: " + fTempInF + "  F");
        forecastDiv.append(ftempinF);

        var fHumidValue = $("<p>").text("Humidity: " + fHumidity);
        forecastDiv.append(fHumidValue);

        };
}

var show =false;
function toggleDisplayWeather(show) {
    if (show) {
      $("#weatherDisplay").removeClass("hidden");
    } else {
      $("#weatherDisplay").addClass("hidden");
    }
  }

$(".city-btn").on("click", function () {
    
  getCurrentWeather(city);
  getFiveDayForecast(lat,lon);
  toggleDisplayWeather(show);
});


$(document).ready(function () {
  setup();

  if (citySearches.length > 0) {
    displayPastCitySearchList();
    city = citySearches[citySearches.length - 1];
    // getCurrentWeather(city);
    // getFiveDayForecast(lat, lon);

    getLatLong(city).then(function(response){

        let lat = response.coord.lat;
        let lon = response.coord.lon;
        getWeatherData(lat,lon);
    });

  }
});
