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
    displayCurrentWeather(city);
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
    var list = $("<a>");
    list.addClass("list-group-item list-group-item-action");
    list.attr("data-city", citySearches[i]);
    list.text(citySearches[i]);
    
    li.append(list);
    $("#listView").append(li);
  }
}


function getLatLong(cityName) {
    const queryUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=3b39c2827e08627d2c1ebcae6181db52"; 
    return $.ajax({
        url: queryUrl,
        method: "GET"
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
    method: "GET"
  }).then(function (response) {
    // console.log("getWeatherData response:", response);
    var weatherData = response;
    displayCurrentWeather(weatherData);
    displayFiveDayForecast(weatherData);
    
  });
}


function displayCurrentWeather(weatherData) {

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
 var tempinF= weatherData.current.temp;
 var weatherDiv = $("<div class='weatherInfo'>");
 
 var pTwo = $("<p>").text("Temperature: "+tempinF+ "F");//.append($("<span>").text("&#730"));
 weatherDiv.append(pTwo);

 //humidity
var humidity = weatherData.current.humidity;
var pThree = $("<p>").text("Humidity: " + humidity + "%");
weatherDiv.append(pThree);

//wind speed
var wind = weatherData.current.wind_speed;
var windMph = (wind * 2.24).toFixed(1);
var pFour = $("<p>").text("Wind Speed: " + windMph + " MPH");
weatherDiv.append(pFour);
$("#cityWeather").append(weatherDiv);

var uvIndex = weatherData.current.uvi;
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


//check

function displayFiveDayForecast(weatherData) {
  //5day forecast
    for (var i = 0; i < 5; i++) {

        const newLocal = i + 1;
        var addDay = newLocal;
        var iconCode = weatherData.daily[i].weather[i].icon;
        var iconUrl = "http://openweathermap.org/img/wn/"+iconCode+".png";
        var fTemp= weatherData.daily[i].temp.day;
        var fHumidity = weatherData.daily[i].humidity;

            var fTempInF = FtempKtoF(parseFloat(fTemp));
            function FtempKtoF(fTempInKelvin) {
            return (((fTempInKelvin - 273.15) * 9) / 5 + 32).toFixed(2);
            }

        //future date
        var fdate = new Date();
        var fd = fdate.getDate() + addDay;
        var fm = fdate.getMonth() + addDay +1;
        var fyyyy = fdate.getFullYear() + addDay;
        var newFutureDate = fd + "/"+ fm + "/"+ fyyyy;

        //place to print the information

        var forecastDiv = $("<div>").addClass("card col-sm-2 bg-primary text-white p-3");

        var newDate = $("<p>").text(newFutureDate);;

        forecastDiv.append(newDate);
        // $("#forecast").append(forecastDiv);

        var ficon = $("<img>").attr("src", iconUrl);
        forecastDiv.append(ficon);

        var ftempinF = $("<p>").text("Temperature: " + fTempInF + "  F");
        forecastDiv.append(ftempinF);

        var fHumidValue = $("<p>").text("Humidity: " + fHumidity);
        forecastDiv.append(fHumidValue);
        $("#forecast").append(forecastDiv);

        };
}


function toggleDisplayWeather(show) {
    var show =false;
    if (show) {
      $("#weatherDisplay").removeClass("hidden");
    } else {
      $("#weatherDisplay").addClass("hidden");
    }
  }
//error
$("a").on("li","click", function () {
    
  getCurrentWeather(city);
  getFiveDayForecast(lat,lon);
  toggleDisplayWeather(show);
});


$(document).ready(function () {
  setup();

  if (citySearches.length > 0) {
    displayPastCitySearchList();
    city = citySearches[citySearches.length - 1];

    getLatLong(city).then(function(response){

        lat = response.coord.lat;
        lon = response.coord.lon;
        getWeatherData(lat,lon);
    });

  }
});
