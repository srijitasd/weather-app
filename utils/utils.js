const axios = require("axios");

const forecast = async (lat, long) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${process.env.OPENWEATHERAPI}&units=metric`;
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
      // tomorrow: {
      //   forecast: daily[1].weather[0].main,
      // temperature: daily[1].temp,
      // minMax: { max: daily[0].temp.max, min: daily[0].temp.min },
      // feelsLike: current.feels_like,
      // humidity: current.humidity,
      // wind: current.wind_speed,
      // timezone: timezone,
      // date: current.dt,
      // },
      // daily: daily,
      rest: data,
    };
  } catch (error) {
    console.log(error);
  }
};

const geoCode = async (address, type = "reverse") => {
  const url = `http://api.positionstack.com/v1/${type}?access_key=${process.env.LOCATIONAPIKEY}&query=${address}&limit=1`;

  try {
    const { data: response } = await axios.get(url);
    if (response.data === undefined || response.data.length === 0) {
      throw new error("unable to find location");
    }
    return {
      latitude: response.data[0].latitude,
      longitude: response.data[0].longitude,
      name: response.data[0].name,
      county: response.data[0].county,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  forecast,
  geoCode,
};
