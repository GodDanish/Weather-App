const apiKey = '6ac3bfc1641a8600e1c2015513131cec';
let defaultCity = 'Clanton';
const weatherDiv = document.getElementById('weather');
const body = document.body;
const cachedData = localStorage.getItem('weatherData');

if (cachedData) {
  // Parse the cached data and display it
  const weatherData = JSON.parse(cachedData);
  displayWeatherData(weatherData);
} else {
  // Fetch weather data from the API
  fetchWeatherDataFromAPI()
    .then(data => {
      // Cache the fetched data in localStorage
      localStorage.setItem('weatherData', JSON.stringify(data));
      // Display the weather data
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function getCurrentTime() {
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  return currentTime;
}

function getCurrentTimeForCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const timezoneOffset = data.timezone; 
      const currentDate = new Date();
      const currentUTC = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000); 
      const cityTime = currentUTC + (timezoneOffset * 1000); 
      const cityDate = new Date(cityTime);
      return cityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    })
    .catch(error => {
      console.error('Error:', error);
      return 'Time Unavailable'; 
    });
}

function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const tempInCelsius = (data.main.temp - 273.15).toFixed(2);
      const rainfall = data.rain ? data.rain['1h'] : 0;
      const snowfall = data.snow ? data.snow['1h'] : 0;
      const weatherCondition = data.weather[0].description;
      const weatherIconCode = data.weather[0].icon;
      weatherDiv.innerHTML = '';
      const weatherIcon = document.createElement('img');
      weatherIcon.src = `http://openweathermap.org/img/wn/${weatherIconCode}.png`;
      weatherIcon.alt = 'Weather Icon';
      weatherDiv.appendChild(weatherIcon);

      getCurrentTimeForCity(city)
        .then(cityTime => {
          weatherDiv.innerHTML += `
            <h2>${data.name}</h2>
            <p>Time: ${cityTime}</p>
            <p>Temperature: ${tempInCelsius} °C</p>
            <p>Rainfall: ${rainfall} mm</p>
            <p>Snowfall: ${snowfall} mm</p>
            <p>Weather Condition: ${weatherCondition}</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Humidity: ${data.main.humidity}%</p>
          `;
          if (weatherCondition.includes('rain')) {
            body.style.backgroundImage = "url('https://cdn.cbeditz.com/cbeditz/preview/real-rain-high-resolution-background-download-11624195405dohd3ogqkp.jpg')";
          } else if (weatherCondition.includes('snow')) {
            body.style.backgroundImage = "url('https://www.freepik.com/free-photos-vectors/snowy')";
          } else if (weatherCondition.includes('cloud')) {
            body.style.backgroundImage = "url('https://cdn.wallpapersafari.com/12/97/cEbCwW.jpg')";
          } else {
            body.style.backgroundImage = "url('https://th.bing.com/th/id/R.bf79f74ce4650f4ead4015365836afa0?rik=IuLWDsQZyFDiWw&riu=http%3a%2f%2fnewsexpressngr.com%2fimages%2fnews%2fsunny_6.jpg&ehk=r5VM6s5sbcZmz9eIC0Rtm%2fMYei6sVGWQb2Z3LdiB7RU%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1";
          }
        });
    })
    .catch(error => {
      weatherDiv.innerHTML = `<p>No data for this city.</p>`;
    });
}
getWeather(defaultCity);
document.getElementById('search-button').addEventListener('click', () => {
  const city = document.getElementById('city').value;
  if (city) {
    defaultCity = city;
    getWeather(city);
  } else {
    weatherDiv.innerHTML = `<p>Please enter a city.</p>`;
  }
});

document.getElementById('past-search-button').addEventListener('click', () => {
  fetch('weather.php')  
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayPastWeatherData(data);
    })
    .catch(error => {
      console.error('Error:', error);
      pastWeatherDataDiv.innerHTML = `<p>Error fetching cached data: ${error.message}</p>`;
    });
});

const pastWeatherDataDiv = document.getElementById('past-weather-data');

function displayPastWeatherData(data) {
  pastWeatherDataDiv.innerHTML = '';  // Clear previous data

  const rowContainer = document.createElement('div');
  rowContainer.classList.add('weather-row'); 

  data.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('weather-entry'); 

    entryDiv.innerHTML = `
      <p>Date: ${entry.date}</p>
      <p>City: ${entry.city}</p>
      <p>Temperature: ${entry.temperature} °C</p>
      <p>Humidity: ${entry.humidity}%</p>
      <p>Wind Speed: ${entry.wind_speed} m/s</p>
    `;

    rowContainer.appendChild(entryDiv);
  });

  pastWeatherDataDiv.appendChild(rowContainer);
}
