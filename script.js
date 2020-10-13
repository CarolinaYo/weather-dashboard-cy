var citySearches = [];  
var city;
var lat;
var lon;
var searchBtn = $("#addCityBtn");
var searchField = $("#searchCity");


function setup(){

    searchBtn.on("click", function(event) {

        event.preventDefault();
    
        city = searchField.val().trim();
        citySearches.push(city);
    
                 
        // setCitiesToLocalStorage();
        getCurrentWeather(city);
        // getFiveDayForecast(city);
        displayPastCitySearchList();

    
    });
    // getCitiesFromLocalStorage();
}

function displayPastCitySearchList(){

    $("#buttonView").empty();

    for (var i=0; i < citySearches.length; i++) {
        var li = $("<li>");
        var btn = $("<button>");
        btn.addClass("city-btn");
        btn.attr("data-city", citySearches[i]);
        btn.text(citySearches[i]);
        $("#buttonView").append(li); 
        li.append(btn);
    }    
}

function getCitiesFromLocalStorage() {
    if (localStorage.getItem("cities")) {
      citySearches = JSON.parse(localStorage.getItem('cities'));
    }
  }

  // Saves citySearches array to local storage
function setCitiesToLocalStorage() {
    localStorage.setItem("cities", JSON.stringify(citySearches));
  }


function getCurrentWeather(){

   
    const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3b39c2827e08627d2c1ebcae6181db52";
    //----------------------------------------------
    $.ajax({
        url: queryUrl,
        method: "GET"

    }).then(function(response) {

        console.log(response);

        //name of the city
        var cityDiv = $("<div class='nameOfcity'>");
        var pOne = $("<h1>").text(response.name);
        cityDiv.append(pOne);
        $("#cityWeather").append(cityDiv);

        //temperature
        var weatherDiv = $("<div class='weatherInfo'>");
        var temperature = convertKtoF(parseFloat(response.main.temp));
        var pTwo = $("<p>").text("Temperature: " + temperature + "  F");
        weatherDiv.append(pTwo);
   


        function convertKtoF(tempInKelvin) {
            return(((tempInKelvin-273.15)*9)/5 + 32).toFixed(2);
        }
       
        
        //humidity
        var humidity = response.main.humidity;
        var pThree = $("<p>").text("Humidity: " + humidity +"%");
        weatherDiv.append(pThree);
        
       
        //wind speed
        var wind = response.wind.speed;
        var windMph = (wind*2.24).toFixed(1);
        var pFour = $("<p>").text("Wind Speed: " + windMph +" MPH");
        weatherDiv.append(pFour);
        $("#cityWeather").append(weatherDiv);

        //UV index, another ajax call

        var lat = response.coord.lat;
        var lon = response.coord.lon;

      

        const queryUvi = "http://api.openweathermap.org/data/2.5/uvi?lat="+ lat + "&lon="+ lon + "&appid=3b39c2827e08627d2c1ebcae6181db52";

        $.ajax({
            url: queryUvi,
            method: "GET"
    
        }).then(function(getUvi) {
            console.log(getUvi);

        var uvIndex = getUvi.value;
        var pFour = $("<p>").text("UV Index: " + uvIndex);
        weatherDiv.append(pFour);
// need to do if statement for color code: green(<2), yellow(3-5), orange(6-7), red(8-10), purpple(>11) ----need if statment and add id
        })
        $("#cityWeather").append(weatherDiv);
    });
}


function getFiveDayForecast(){

    const apiForecast = "http://api.openweathermap.org/data/2.5/forecast/daily?id="+cityId+"&cnt=5&appid=3b39c2827e08627d2c1ebcae6181db5";
    
    $.ajax({
        url: apiForecast,
        method: "GET"
    
    }).then(function(forecast) {
        console.log(forecast);
    
    //the card need to have current date --- use moment? 
    //weather icon 
    //temp. ----
    //Humidity---
    //--------------------------------------
    
    });


}

$(document).ready(function(){
    setup();

});
  

