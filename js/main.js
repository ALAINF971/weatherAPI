/**
 * Created by ALAIN2 on 6/22/2016.
 */
var temperatures;
var locations;
var weatherIcons;
var humidity;
var wind;
var directions;
var descrip;
var pressions;
var minTemp;
var maxTemp;
var sunrise;
var sunset;
var currentDate;
var day;
var month;
var year;
var APPID = "558c1164fff96e0983dd44a36b5200e3";

function updateByZip(zip){
    var url = "http://api.openweathermap.org/data/2.5/weather?" + "zip=" + zip + "&APPID=" + APPID + "&units=" + "metric";

    sendRequest(url);
}
function getLocation(){
    if(!!window.chrome && !!window.chrome.webstore){
        value=document.getElementById('q').value;
        var url = "http://api.openweathermap.org/data/2.5/weather?" + "q=" + value + "&APPID=" + APPID + "&units=" + "metric";
        sendRequest(url);
    }

}

function updateByGeo(lat,long){
    var url =  "http://api.openweathermap.org/data/2.5/weather?" + "lat=" + lat + "&lon=" + long + "&units=metric" + "&APPID=" + APPID;
    sendRequest(url);
}

function sendRequest(url){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var data = JSON.parse(xmlhttp.responseText);
            var weather = {};
            weather.weatherIcons = data.weather[0].id;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            degreesToDirection(data.wind.deg)==undefined ? weather.directions = "" : weather.directions  = degreesToDirection(data.wind.deg);
            weather.locations = data.name;
            weather.temperatures = Math.round(data.main.temp);
            weather.descrip = data.weather[0]["description"];
            weather.pressions = Math.round(data.main.pressure);
            weather.maxTemp = Math.round(data.main.temp_max);
            weather.minTemp = Math.round(data.main.temp_min);
            weather.sunrise = data.sys.sunrise;
            weather.sunset = data.sys.sunset;
            update(weather);
        }

    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function degreesToDirection(deg){
    var range = 360/16;
    var low = 360 - range/2;
    var high = (low + range) % 360;
    var angles = ["N","NNE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    for(i in angles){
        if(deg >= low && deg < high){
            return angles[i];
        }
        low = ( low + range )% 360;
        high = ( high + range ) % 360;
    }
}

function K2C(k){
    return Math.round(k - 273.15) + "&deg;C";
}

function K2F(k){
    return Math.round(k*(9/5)-459.67) + "&deg;F";
}

//
// function FindCity()
// {
//     // $("#pbar").style.visibility = 'visible';
//     $("#pbar").show("fast");
//     $("#forecast_list_ul").html('');
//     param = document.getElementById('search_str').value;
//
//     var jsonurl = "/data/2.5/find?callback=?&q="+param+ "&type=like&sort=population&cnt=30&appid=558c1164fff96e0983dd44a36b5200e3";
//     $.getJSON(jsonurl, getSearchData).error(errorHandler);
//     return false;
// }
// var q = GetURLParameter('q');
// if ( q ) {
//     FindCity();
// }

function update(weather){
    wind.innerHTML = weather.wind;
    directions.innerHTML = weather.directions;
    humidity.innerHTML = weather.humidity;
    locations.innerHTML = weather.locations;
    temperature.innerHTML = weather.temperatures + "&deg;C";
    weatherIcons.src = "images/codes/" + weather.weatherIcons + ".png";
    descrip.innerHTML = weather.descrip;
    pressions.innerHTML = weather.pressions + " hPa";
    maxTemp.innerHTML = weather.maxTemp  + "&deg;C";
    minTemp.innerHTML = weather.minTemp  + "&deg;C";
    var date = new Date(weather.sunrise*1000);
// Hours part from the timestamp
    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    sunrise.innerHTML = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    var date = new Date(weather.sunset*1000);
// Hours part from the timestamp
    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    sunset.innerHTML = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    var currentTime = new Date();
    month = currentTime.getMonth()+1;
    day = currentTime.getDate();
    day < 10 ? day = "0" + day: day = currentTime.getDate();
    month < 10 ? month = "0" + month: month = currentTime.getMonth() + 1;
    year = currentTime.getFullYear();
    currentDate.innerHTML = month + "/" + day + "/" + year;
}

function showPosition(position){
    updateByGeo(position.coords.latitude, position.coords.longitude);
}
window.onload= function(){
    temperatures = document.getElementById("temperature");
    locations = document.getElementById("location");
    weatherIcons = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    directions = document.getElementById("direction");
    descrip = document.getElementById("descriptions");
    pressions = document.getElementById("pressions");
    maxTemp = document.getElementById("maxTemp");
    minTemp = document.getElementById("minTemp");
    sunrise = document.getElementById("sunrise");
    sunset = document.getElementById("sunset");
    currentDate = document.getElementById("currentDate");

    if(navigator.geolocation){
       navigator.geolocation.getCurrentPosition(showPosition);
    }else{

        var zip = window.prompt("Could not discover your location. What is your zip code?");
        updateByZip(zip);
    }
}