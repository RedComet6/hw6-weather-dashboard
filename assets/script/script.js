// variables
const searchCities = [];

// functions
// finds the latitude and longitude of input
function handleCoords(searchCity) {
    const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("There was an issue with the response");
            }
        })
        .then(function (data) {
            // handles current weather at given lat and lon
            handleCurrentWeather(data.coord, data.name);
        })
        .catch((error) => {
            console.log(error);
        });
}

// populates current weather and 5 day forecast for a given city with coordinates
function handleCurrentWeather(coordinates, city) {
    // assigns vars to latitude and longitude
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // populates current weather area
            displayCurrentWeather(data.current, city);
            // populates 5 day forecast
            displayFiveDayWeather(data.daily);
        });
}

// displays information in current weather area
function displayCurrentWeather(currentCityData, cityName) {
    // icon representing weather conditions
    let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
    // adds "card" styling from Bootstrap, is not added in index.html because initializing with the card style causes an annoying background empty space
    document.querySelector("#currentWeather").classList.add("card");
    // adds rows of information and displays values
    document.querySelector("#currentWeather").innerHTML = `<h2 class="h2">${cityName}, ${moment.unix(currentCityData.dt).format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${currentCityData.temp} \xB0F</div> <div>Wind Speed: ${currentCityData.wind_speed} MPH</div> <div>Humidity: ${currentCityData.humidity}%</div> <div>UV Index: <span  id="uvIndex" class="px-2">${currentCityData.uvi}</span></div>`;
    // checks how severe the UV Index is, and changes background color of data to indicate severity
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

// displays information in the 5 day forecast area
function displayFiveDayWeather(fiveDayCityData) {
    // removes data points that are not the next 5 following days
    const cityData = fiveDayCityData.slice(1, 6);
    // initializes 5 day forecast display area
    document.querySelector("#fiveDayWeather").innerHTML = "";

    // creates a card for each day and displays the relevant information inside the card
    cityData.forEach((day) => {
        // icon representing weather conditions
        let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        // adds rows of information and displays values
        document.querySelector("#fiveDayWeather").innerHTML += `<div class="bg-dark card m-1 p-2 text-white"><div class="h3">${moment.unix(day.dt).format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div> <div>Temp: ${day.temp.day} \xB0F</div> <div>Wind Speed: ${day.wind_speed} MPH</div> <div>Humidity: ${day.humidity}%</div></div>`;
    });
}

// accepts user input from form, populates search history, kicks off weather data retrieval
function handleFormSubmit(event) {
    // initializes history buttons
    document.querySelector("#searchHistory").innerHTML = "";
    event.preventDefault();

    // assigns var to input data
    const city = document.querySelector("#searchInput").value.trim();
    // adds input data to history array
    searchCities.push(city.toLowerCase());

    // filters out repeat city names in the history array
    const filteredCities = searchCities.filter((city, index) => {
        return searchCities.indexOf(city) === index;
    });

    // creates clickable button for each city in the history array
    filteredCities.forEach((city) => {
        document.querySelector("#searchHistory").innerHTML += `<button class="btn btn-secondary d-block m-2" data-city="${city}">${city}</button>`;
    });
    // finds the latitude and longitude of input
    handleCoords(city);
}

// runs data retrieval if user clicks on a search history button
function handleHistory(event) {
    // assigns var to city name, pulled from data-attribute on the search history button
    const city = event.target.getAttribute("data-city");
    // finds the latitude and longitude of input
    handleCoords(city);
}

// listeners
// data retrieval when user uses the form
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
// data retrieval when user uses the search history
document.querySelector("#searchHistory").addEventListener("click", handleHistory);
