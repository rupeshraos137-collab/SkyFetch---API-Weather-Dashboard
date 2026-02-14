const apiKey = "YOUR_API_KEY";
const weatherDisplay = document.getElementById("weatherDisplay");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// Show loading spinner
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    weatherDisplay.innerHTML = `
        <p class="error">${message}</p>
    `;
}

// Display weather data
function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡️ ${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    `;
}

// Fetch weather using async/await
async function getWeather(city) {

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        showLoading();
        searchBtn.disabled = true;

        const response = await axios.get(url);

        displayWeather(response.data);

    } catch (error) {
        showError("City not found. Please try again.");
    } finally {
        searchBtn.disabled = false;
    }
}

// Button click event
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    getWeather(city);
    cityInput.value = "";
});

// Enter key support
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});