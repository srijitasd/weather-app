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
  res.render("index");
});

app.post("/weather", async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({
      error: "please provide a location",
    });
  }

  try {
    const { longitude, latitude, name } = await geoCode(address);
    const data = await forecast(longitude, latitude);

    res.send({
      weather: data,
      location: name,
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
