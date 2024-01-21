const button = document.getElementById('buttonWeather')
button.addEventListener('click', getWeather)

async function getWeather() {
  const cityInput = document.getElementById('cityInput');
  const cityName = cityInput.value;

  if (!cityName) {
    alert('Please enter a city name');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/weather?city=${cityName}`);
    const data = await response.json();

    if (response.ok) {
      console.log(data);

      displayWeather(data.weather);
      displayTimezone(data.timezone)
      displayAirport(data.airport)
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    alert('Internal server error');
  }
}

let mapContainer;
function displayWeather(weatherData) {
  const weatherInfoContainer = document.getElementById('weather-info');
  const temperature = weatherData.main.temp;
  const description = weatherData.weather[0].description;

  const html = `
      <h2>Weather in ${weatherData.name}</h2>
      <p>Temperature: ${temperature} K</p>
      <p>Description: ${description}</p>
  `;

  weatherInfoContainer.innerHTML = html;

  if (!mapContainer) {
      mapContainer = L.map('map').setView([weatherData.coord.lat, weatherData.coord.lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapContainer);
  } else {
      mapContainer.setView([weatherData.coord.lat, weatherData.coord.lon], 13);
  }

  const marker = L.marker([weatherData.coord.lat, weatherData.coord.lon]).addTo(mapContainer);
  marker.bindPopup(`Weather in ${weatherData.name}: ${description}, Temperature: ${temperature} K`).openPopup();
}

function displayTimezone(timezoneData){
  const timezoneContainer = document.getElementById('city-timezone');
  const timezone = timezoneData.timezone;

  const html = `
      <h2>Timezone</h2>
      <p>${timezone} K</p>
  `;

  timezoneContainer.innerHTML = html;
}
function displayAirport(airports) {
  const airportContainer = document.getElementById('airport');
  
  airportContainer.innerHTML = '';

  airports.forEach(airport => {
      const html = `
          <div>
              <h2>Airport Info:</h2>
              <p>ICAO: ${airport.icao}</p>
              <p>IATA: ${airport.iata}</p>
              <p>Name: ${airport.name}</p>
              <p>Country: ${airport.country}</p>
              <p>Elevation (ft): ${airport.elevation_ft}</p>
          </div>
      `;

      airportContainer.innerHTML += html;
  });
}
