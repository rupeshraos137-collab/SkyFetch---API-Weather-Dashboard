const API_KEY = "YOUR_API_KEY";   // <-- Replace this
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Function to fetch weather
function getWeather(city) {

    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    axios.get(url)
        .then(function (response) {
            console.log("Weather Data:", response.data);
            displayWeather(response.data);
        })
        .catch(function (error) {
            console.error("Error fetching weather:", error);
        });
}

// Function to display weather on page
function displayWeather(data) {

    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    document.getElementById("city").innerText = cityName;
    document.getElementById("temperature").innerText = `Temperature: ${temperature} °C`;
    document.getElementById("description").innerText = description;

    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById("icon").src = iconUrl;
}

// Call function for hardcoded city
getWeather("London");