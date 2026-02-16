function WeatherApp() {
  this.apiKey = "YOUR_API_KEY";

  this.searchInput = document.getElementById("search-input");
  this.searchBtn = document.getElementById("search-btn");
  this.weatherContainer = document.getElementById("weather-container");
  this.forecastContainer = document.getElementById("forecast-container");

  this.recentContainer = document.getElementById("recent-container");
  this.clearBtn = document.getElementById("clear-history");
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
  this.clearBtn.addEventListener("click", this.clearHistory.bind(this));

  this.loadRecentSearches();
  this.loadLastCity();
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();
  if (!city) return;

  this.getWeather(city);
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
    const processed = this.processForecastData(forecastData);
    this.displayForecast(processed);

    this.saveRecentSearch(city);
    localStorage.setItem("lastCity", city);

  } catch (error) {
    this.showError("City not found.");
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p>Temp: ${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
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
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    this.forecastContainer.innerHTML += `
      <div class="forecast-card">
        <h3>${dayName}</h3>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

WeatherApp.prototype.showLoading = function () {
  this.weatherContainer.innerHTML = "<p>Loading...</p>";
  this.forecastContainer.innerHTML = "";
};

WeatherApp.prototype.showError = function (message) {
  this.weatherContainer.innerHTML = `<p style="color:red;">${message}</p>`;
  this.forecastContainer.innerHTML = "";
};

/* ========== LOCAL STORAGE PART ========== */

WeatherApp.prototype.loadRecentSearches = function () {
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  this.displayRecentSearches(searches);
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  searches = searches.filter(item => item !== city);
  searches.unshift(city);

  if (searches.length > 5) {
    searches.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(searches));
  this.displayRecentSearches(searches);
};

WeatherApp.prototype.displayRecentSearches = function (searches) {
  this.recentContainer.innerHTML = "";

  searches.forEach(function (city) {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.classList.add("recent-btn");

    btn.addEventListener("click", function () {
      this.getWeather(city);
    }.bind(this));

    this.recentContainer.appendChild(btn);
  }.bind(this));
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  } else {
    this.weatherContainer.innerHTML = "<p>Search for a city to see weather.</p>";
  }
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");
  this.recentContainer.innerHTML = "";
};

const app = new WeatherApp();
app.init();