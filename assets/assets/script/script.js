// variables

// functions
function handleCoords(searchCity) {
    const fetchUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            handleCurrentWeather(data.coord, data.name);
        });
}

function handleCurrentWeather(coordinates, city) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayCurrentWeather(data.current, city);
            displayFiveDayWeather(data.daily);
        });
}

function displayCurrentWeather(currentCityData, cityName) {
    let weatherIcon = `http://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
    // todo: add Wind, humidity, UV index DONT FORGET UNITS
    // create dynamic bg for uv index by adding class based on value of uv
    document.querySelector("#currentWeather").innerHTML = `<h2>${cityName}, ${moment.unix(currentCityData.dt).format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${currentCityData.temp} \xB0F</div> <div>Wind Speed: ${currentCityData.wind_speed} MPH</div> <div>Humidity: ${currentCityData.humidity}%</div> <div id="uvIndex">UV Index: ${currentCityData.uvi}</div>`;
    if (currentCityData.uvi >= 0 && currentCityData.uvi < 3) {
        document.querySelector("#uvIndex").classList.add("uvLow");
    } else if (currentCityData.uvi >= 3 && currentCityData.uvi < 6) {
        document.querySelector("#uvIndex").classList.add("uvModerate");
    } else if (currentCityData.uvi >= 6 && currentCityData.uvi < 8) {
        document.querySelector("#uvIndex").classList.add("uvHigh");
    } else if (currentCityData.uvi >= 8 && currentCityData.uvi < 11) {
        document.querySelector("#uvIndex").classList.add("uvVeryHigh");
    } else {
        document.querySelector("#uvIndex").classList.add("uvExtreme");
    }
}

function displayFiveDayWeather(fiveDayCityData) {
    const cityData = fiveDayCityData.slice(1, 6);
    document.querySelector("#fiveDayWeather").innerHTML = "";

    cityData.forEach((day) => {
        let weatherIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        // todo: temp, wind, humidity DONT FORGET UNITS ()
        document.querySelector("#fiveDayWeather").innerHTML += `<div><div>${moment.unix(day.dt).format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div> <div>Temp: ${day.temp.day} \xB0F</div> <div>Wind Speed: ${day.wind_speed} MPH</div> <div>Humidity: ${day.humidity}%</div></div>`;
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    const city = document.querySelector("#searchInput").value.trim();
    document.querySelector("#searchHistory").innerHTML += `<button data-city="${city}">${city}</button>`;
    handleCoords(city);
}

function handleHistory(event) {
    const city = event.target.getAttribute("data-city");
    handleCoords(city);
}

// listeners
// on page load, show any past cities searched
// search for city
// click on city to show weather
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
document.querySelector("#searchHistory").addEventListener("click", handleHistory);
