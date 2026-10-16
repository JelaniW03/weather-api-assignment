const apiKey = "c2683770b5bc4bcbbc014010261310";

// Get the HTML elements.
const citySelect = document.getElementById("city-select");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const weatherResult = document.getElementById("weather-result");
const errorMessage = document.getElementById("error-message");

// Run the search when the button is clicked.
searchButton.addEventListener("click", getWeather);

// Allow the Enter key to start a search.
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

// Get and display the current weather.
async function getWeather() {
    const city = cityInput.value.trim() || citySelect.value;

    errorMessage.textContent = "";

    if (!apiKey || apiKey === "YOUR_NEW_API_KEY") {
        errorMessage.textContent = "Please add your WeatherAPI key in script.js.";
        return;
    }

    if (!city) {
        errorMessage.textContent = "Please enter or select a city.";
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Loading...";
    weatherResult.innerHTML = "<p>Loading weather...</p>";

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`;

    try {
        // Request weather data from WeatherAPI.
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Unable to get weather. Please try again."
            );
        }

        // Get the information from the API response.
        const location = data.location.name;
        const country = data.location.country;
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const icon = "https:" + data.current.condition.icon;
        const feelsLike = data.current.feelslike_c;
        const humidity = data.current.humidity;
        const lastUpdated = data.current.last_updated;

        // Display the weather information on the webpage.
        weatherResult.innerHTML = `
            <h3>${location}, ${country}</h3>
            <img src="${icon}" alt="${condition} weather icon">
            <p class="temperature">${temperature}°C</p>
            <p class="condition">${condition}</p>

            <div class="weather-details">
                <p>Feels like: ${feelsLike}°C</p>
                <p>Humidity: ${humidity}%</p>
            </div>

            <p class="updated">Last updated: ${lastUpdated}</p>
        `;
    } catch (error) {
        // Display an error if the request fails.
        weatherResult.innerHTML = "";
        errorMessage.textContent = error.message;
    } finally {
        // Restore the button after the request finishes.
        searchButton.disabled = false;
        searchButton.textContent = "Get Weather";
    }
}