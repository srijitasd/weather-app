const bodyStyle = document.querySelector(".body-container");
const dataCont = document.querySelector(".data-container");
const locName = document.querySelector(".locName");
const temp = document.querySelector("#temp");
const img = document.querySelector("img");
const predict = document.querySelector("#prec");
const feel = document.querySelector(".feel");
const humidity = document.querySelector(".humidity");
const cardHolder = document.querySelector(".card-holder");
const errHandler = document.querySelector(".err-handler");
const span = document.querySelector("span").innerText;
const form = document.querySelector("form");
const show = document.querySelector(".show");
const searchField = document.querySelector("input");

var cardBody;

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    show.style.opacity = "0";
    e.preventDefault();

    const location = searchField.value;
    fetch("/weather?address=" + location).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          errHandler.textContent = data.error;
        } else {
          current(data);
          dailyData(data);
        }
      });
    });
  });

  const current = (data) => {
    dataCont.style.display = "grid";
    if (data.forecast.predict == "Haze") {
      bodyStyle.style.background =
        "linear-gradient(to right, #f0f3cc, #F6FDC2)";
      img.src = "./images/haze.svg";
    } else if (data.forecast.predict == "Sunny") {
      bodyStyle.style.background =
        "linear-gradient(to right,  #f6d265, #fda085)";
      img.src = "./images/sunny.svg";
    } else if (data.forecast.predict == "Clear") {
      bodyStyle.style.background =
        "linear-gradient(to right,  #80c9f9, #6DE9FF)";
      img.src = "./images/clear.svg";
    } else if (data.forecast.predict == "Rain") {
      bodyStyle.style.background =
        "linear-gradient(to right,  #43abf0, #589298)";
      img.src = "./images/water-drop.svg";
    } else if (data.forecast.predict == "Clouds") {
      bodyStyle.style.background =
        "linear-gradient(to right,  #9dbed3, #9DA5A6)";
      img.src = "./images/cloud.svg";
    } else {
      bodyStyle.style.background =
        "linear-gradient(to bottom right,  #f6d265, #fda085)";
      img.src = "./images/cloudy.png";
    }
    locName.textContent = data.forecast.timezone;
    temp.textContent = data.forecast.temp;
    predict.textContent = data.forecast.predict;
    feel.textContent = "feels like " + data.forecast.feels_like + " ";
    humidity.textContent = "humidity " + data.forecast.humidity + "%";
    searchField.value = "";
  };

  const dailyData = (data) => {
    const daily = data.forecast.daily;
    const filteredDaily = daily.splice(7, 2);
    daily.forEach((date) => {
      const miliseconds = date.dt * 1000;
      const dateObj = new Date(miliseconds);
      const newDate = dateObj.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
      });

      var cardBody = document.createElement("div");
      cardBody.classList.add("cards");
      const overallDiv = document.createElement("div");
      overallDiv.classList.add("overall");
      const cardText = document.createElement("p");
      const overall = document.createElement("p");
      cardText.textContent = newDate;
      overall.textContent = date.weather[0].main;
      const tempDiv = document.createElement("div");
      tempDiv.classList.add("temp");
      const maxTemp = document.createElement("max-temp");
      maxTemp.classList.add("max-temp");
      const minTemp = document.createElement("min-temp");
      minTemp.classList.add("min-temp");
      const max = document.createElement("p");
      const min = document.createElement("p");
      max.textContent = Math.round(date.temp.max) + " ";
      max.append(span);
      min.textContent = Math.round(date.temp.min) + " ";
      min.append(span);
      maxTemp.appendChild(max);
      minTemp.appendChild(min);
      tempDiv.appendChild(maxTemp);
      tempDiv.appendChild(minTemp);
      overallDiv.appendChild(cardText);
      overallDiv.appendChild(overall);
      cardBody.appendChild(overallDiv);
      cardBody.appendChild(tempDiv);
      cardHolder.appendChild(cardBody);
    });
  };
});
