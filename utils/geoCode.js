const request = require("postman-request");

const geoCode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    address +
    ".json?access_token=pk.eyJ1Ijoic3Jpaml0LWRhcyIsImEiOiJja2VzcW1xbmEzZHBxMnZucHBrNXlueXd2In0.mpCVKlCQnkP2EMF7yehWFA&limit=1";
  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("unable to connect to location services");
    } else if (response.body.features.length === 0) {
      callback("unable to fetch weather data");
    } else {
      callback("", {
        latitude: response.body.features[0].center[1],
        longitude: response.body.features[0].center[0],
        name: response.body.features[0].place_name,
      });
    }
  });
};

module.exports = {
  geoCode: geoCode,
};
