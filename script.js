var cityName = [];  



//how to get the value for city??



function displayWeather(){
    //BROKEN----------------
    var city = $(this).attr("data-city");
    // console.log(city);
    const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3b39c2827e08627d2c1ebcae6181db52";
//----------------------------------------------
    $.ajax({
        url: queryUrl,
        method: "GET"

    }).then(function(response) {
        //name of the city
        var cityDiv = $("<div class='nameOfcity'>");
        var pOne = $("<h1>").text(response.name);
        cityDiv.append(pOne);
        $("#cityWeather").append(cityDiv);

        //temperature
        var weatherDiv = $("<div class='weatherInfo'>");
        var temperature = convertKtoF(parseFloat(response.main.temp)) + "&deg;F";
        var pTwo = $("<p>").text("Temperature" + temperature);
        weatherDiv.append(pTwo);
        
        //humidity
        var humidity = response.mail.humidity;
        var pThree = $("<p>").text("Humidity: " + humidity +"%");
        weatherDiv.append(pThree);
       
        //wind speed
        var wind = response.wind.speed;
        var windMph = (wind*2.24).toFixed(1);
        var pFour = $("<p>").text("Wind Speed: " + windMph +"MPH");
        weatherDiv.append(pFour);

        //UV index, another ajax call

        var lat= response.coord.lat;
        var lon= esponse.coord.lon;

        const queryUvi = "http://api.openweathermap.org/data/2.5/uvi?lat="+ lat + "&lon="+ lon + "&appid=3b39c2827e08627d2c1ebcae6181db52";

        $.ajax({
            url: queryUvi,
            method: "GET"
    
        }).then(function(getUvi) {
            console.log(getUvi);

        var uvIndex = response.value;
        var pFour = $("<p>").text("UV Index: " + uvIndex);
        weather.append(pFour);
// need to do if statement for color code: green(<2), yellow(3-5), orange(6-7), red(8-10), purpple(>11)


        })

        $("#cityWeather").append(weatherDiv);

    function convertKtoF(tempInKelvin) {
        return(((tempInKelvin-273.15)*9)/5 + 32).toFixed(2);
    }
    

   //------------5-day forcast function----------
var cityId = response.coord.id;
const apiForecast = "http://api.openweathermap.org/data/2.5/forecast/daily?id="+cityId+"&cnt=5&appid=3b39c2827e08627d2c1ebcae6181db5";

$.ajax({
    url: apiForecast,
    method: "GET"

}).then(function(forecast) {
    console.log(forecast);

//the card need to have current date --- can we use moment? any better way?
//weather icon 
//temp. ----
//Humidity---
//--------------------------------------

    });

    
}

function renderButtons(){

    $("#buttonView").empty();

    for (var i=0; i < cityName.length; i++) {
        var li = $("<li>");
        var btn = $("<button>");
        btn.addClass("city-btn");
        btn.attr("data-city", cityName[i]);
        btn.text(cityName[i]);
        $("#buttonView").append(li); 
        li.append(btn);
    }    
}


//click function to call 
$("#addCitybtn").on("click", function(event) {

    event.preventDefault();

    var city = $("#searchCity").val().trim();
    cityName.push(city);

    displayWeather();
    renderButtons();
   

});

$(document).on("click", "city-btn", displayWeather);
renderButtons();
