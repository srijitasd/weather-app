const axios = require("axios");

const forecast = async (lon, lat) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${process.env.OPENWEATHERAPI}&units=metric`;
  try {
    const { data } = await axios.get(url);
    const { current, timezone, daily } = data;
    return {
      forecast: current.weather[0].main,
      temperature: current.temp,
      minMax: { max: daily[0].temp.max, min: daily[0].temp.min },
      feelsLike: current.feels_like,
      humidity: current.humidity,
      wind: current.wind_speed,
      timezone: timezone,
      date: current.dt,
      // daily: daily,
    };
  } catch (error) {
    console.log(error);
  }
};

const geoCode = async (address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.LOCATIONAPIKEY}&limit=1`;

  try {
    const res = await axios.get(url);

    if (res.data.features.length === 0) {
      throw new error("unable to find location");
    }
    return {
      latitude: res.data.features[0].center[1],
      longitude: res.data.features[0].center[0],
      name: res.data.features[0].place_name,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  forecast,
  geoCode,
};
