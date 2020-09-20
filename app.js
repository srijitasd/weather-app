const path = require("path");
const location = require("./utils/geoCode.js");
const weatherData = require("./utils/forecast.js");
const yargs = require("yargs");
const express = require("express");
const hbs = require("hbs");

const app = express();

const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "./public");
const partialsPath = path.join(__dirname, "templates/partials");
const viewsPath = path.join(__dirname, "templates/views");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(staticPath));

app.get("", (req, res) => {
  res.render("index");
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "please provide a location",
    });
  }

  location.geoCode(req.query.address, (err, lonLat) => {
    if (err) {
      return res.send({
        error: err,
      });
    }

    weatherData.forecast(lonLat.longitude, lonLat.latitude, (err, data) => {
      if (err) {
        res.send({
          error: err,
        });
      }
      res.send({
        forecast: data,
        location: lonLat.name,
      });
    });
  });
});

app.listen(port, () => {
  console.log("server started at port " + port);
});
