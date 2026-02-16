function WeatherApp() {
  this.apiKey = "YOUR_API_KEY";

  this.searchInput = document.getElementById("search-input");
  this.searchBtn = document.getElementById("search-btn");
  this.weatherContainer = document.getElementById("weather-container");
  this.forecastContainer = document.getElementById("forecast-container");
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener(
    "click",
    this.handleSearch.bind(this)
  );

  this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
  this.weatherContainer.innerHTML = "<p>Search for a city to see weather details.</p>";
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();
  if (!city) return;

  this.getWeather(city);
};

WeatherApp.prototype.showLoading = function () {
  this.weatherContainer.innerHTML = "<p>Loading...</p>";
  this.forecastContainer.innerHTML = "";
};

WeatherApp.prototype.showError = function (message) {
  this.weatherContainer.innerHTML = `<p style="color:red;">${message}</p>`;
  this.forecastContainer.innerHTML = "";
};

WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.showLoading();

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL)
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    this.displayWeather(weatherData);

    const processedForecast = this.processForecastData(forecastData);
    this.displayForecast(processedForecast);

  } catch (error) {
    this.showError("City not found. Please try again.");
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
  `;
};

WeatherApp.prototype.processForecastData = function (data) {
  const filtered = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  return filtered.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastArray) {
  this.forecastContainer.innerHTML = "";

  forecastArray.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long"
    });

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h3>${dayName}</h3>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

const app = new WeatherApp();
app.init();