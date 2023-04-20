const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const rateLimit = require("express-rate-limit");

const { geoCode, forecast } = require("./utils/utils.js");

app.set("view engine", "hbs");
app.set("views", process.cwd() + "/templates/views");
hbs.registerPartials(process.cwd() + "/templates/partials");

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/public"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again after few minutes",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("", (req, res) => {
  res.json({ msg: "hello" });
});

app.post("/weather", async (req, res) => {
  const { location, type } = req.body;
  if (!location) {
    return res.status(400).json({
      error: "please provide a location",
    });
  }

  try {
    const { latitude, longitude, name, county } = await geoCode(location, type);
    const data = await forecast(latitude, longitude);

    res.send({
      weather: data,
      location: { name, county },
    });
  } catch (error) {
    res.status(400).send({
      error: "unable to find location",
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
