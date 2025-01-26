// Add event listener for dark mode toggle
document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    // Optional: Store dark mode state in localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.removeItem("dark-mode");
    }
  });
  
  // Check for saved dark mode preference and apply it on page load
  window.onload = () => {
    if (localStorage.getItem("dark-mode") === "enabled") {
      document.body.classList.add("dark-mode");
    }
  };
  
 // Function to fetch weather data based on city name
 async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    const loadingMessage = document.getElementById("loading-message");
  
    // Show loading message and hide weather data
    loadingMessage.style.display = "block";
    weatherDataSection.style.display = "none";
  
    const apiKey = "91685d3590273b3fc0193ce599e23ef0";
  
    if (searchInput.trim() === "") {
      displayErrorMessage("Empty Input!", "Please try again with a valid <u>city name</u>.");
      loadingMessage.style.display = "none";
      return;
    }
  
    try {
      const geocodeData = await getLonAndLat(searchInput, apiKey);
      if (geocodeData) {
        await getWeatherData(geocodeData.lon, geocodeData.lat, apiKey);
      }
    } catch (error) {
      displayErrorMessage("Error!", "Something went wrong. Please try again later.");
    } finally {
      loadingMessage.style.display = "none";
    }
  
    document.getElementById("search").value = "";
  }
  
  // Function to get longitude and latitude based on city name
  async function getLonAndLat(city, apiKey) {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    const data = await response.json();
    if (!response.ok || data.length === 0) {
      throw new Error("Geocoding request failed");
    }
    return { lon: data[0].lon, lat: data[0].lat };
  }
  
  // Function to get weather data based on longitude and latitude
  async function getWeatherData(lon, lat, apiKey) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Weather data request failed");
    }
  
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }
  
  // Function to display error messages
  function displayErrorMessage(title, message) {
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
    weatherDataSection.style.display = "block";
  }