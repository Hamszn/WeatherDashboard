const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "1e4163859e4c095643dce57ff89370dd"; 

const createWeatherCard = (cityName, weatherItem, index) => {
    const forecastDate = new Date(weatherItem.dt_txt);
    const formattedDate = forecastDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });

    if(index === 0) { 
        return `<div class="details">
                    <h2>${cityName} (${formattedDate})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp ).toFixed(2)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} MPH</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { 
        return `<li class="card">
                    <h3>(${formattedDate})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp  ).toFixed(2)}°F</h6>
                    <h6>Wind: ${weatherItem.wind.speed} MPH</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`;
    
    if (locationHistory.includes(cityName)) {
        return;
    }
    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 404) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).
    catch(() => {
        alert("An error occurred while fetching the weather forecast!");
        // Remove the searched location from history if an error occurs
        const index = locationHistory.indexOf(cityName);
        if (index > -1) {
            locationHistory.splice(index, 1);
        }
    });
 
    locationHistory.push(cityName);
  createHistoryItem(cityName);

};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    getWeatherDetails(cityName);
}

let locationHistory = []; 
const historyList = document.querySelector(".history-list");

const createHistoryItem = cityName => {
  const li = document.createElement("li");
  li.textContent = cityName;
  li.addEventListener("click", () => getWeatherDetails(cityName));
  historyList.appendChild(li);
};
const loadHistory = () => {
    locationHistory.forEach(cityName => createHistoryItem(cityName));
}

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());