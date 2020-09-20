const request = require("postman-request");

const forecast = (lon, lat, callback) => {
  const url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly&appid=6410125143c9cdd20b9fb2b719d9d84b&units=metric";
  request({ url: url, json: true }, (err, res) => {
    if (err) {
      callback("unable to fetch weather data");
    } else if (res.body.error) {
      callback("unable to locate");
    } else {
      const predict = res.body.current.weather[0].main;
      const temp = res.body.current.temp;
      const feelsLike = res.body.current.feels_like;
      const humidity = res.body.current.humidity;
      const timezone = res.body.timezone;
      const daily = res.body.daily;
      callback("", {
        predict: predict,
        temp: temp,
        feels_like: feelsLike,
        humidity: humidity,
        timezone: timezone,
        daily: daily,
      });
    }
  });
};

module.exports = {
  forecast: forecast,
};
