const express = require('express')
const axios = require('axios')

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const apiKey = '394f7ad19bb5c5525c4ddb18324358d7';
//GtZNuWgkB1bJn4kjXYVWmQ==xRl5srEeKmlP9QEq

app.get('/weather', async (req, res) => {
  try {
    const cityName = req.query.city;

    if (!cityName) {
      return res.status(400).json({ error: 'City name missing' });
    }

    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
    const weatherData = weatherResponse.data;

    
    let timezoneData;
    await axios.get(`https://api.api-ninjas.com/v1/timezone?city=${cityName}`, {
      headers: {
        'X-Api-Key': 'GtZNuWgkB1bJn4kjXYVWmQ==xRl5srEeKmlP9QEq'
      }
    })
    .then(response => {
      timezoneData = response.data
    })
    .catch(error => {
      if (error.response) {
        console.error('Error:', error.response.status, error.response.data);
      } else {
        console.error('Request failed:', error.message);
      }
    });


    let airportStatic;
    try {
      const response = await axios.get(`https://api.api-ninjas.com/v1/airports?city=${cityName}`, {
        headers: {
          'X-Api-Key': 'GtZNuWgkB1bJn4kjXYVWmQ==xRl5srEeKmlP9QEq'
        }
      });
  
      if (response.status === 200) {
        airportStatic = response.data;
        console.log(response.data);
      } else {
        console.error('Error:', response.status, response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.status, error.response.data);
      } else {
        console.error('Request failed:', error.message);
      }
    }
    

    res.json({ weather: weatherData, timezone:timezoneData, airport:airportStatic });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
