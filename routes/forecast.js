const router = require("express").Router();
const fetch = require("node-fetch");
const config = require("config");
const groupBy = require("../helpers/groupBy");
const async = require("../middleware/asyncMiddleware");
const objToQueryParams = require("../helpers/objToQueryParams");
const { City } = require("../models/city");

const apiKey = config.get("weatherAPI.key");
const weatherAPI = config.get("weatherAPI.origin");

router.get(
  "/:id",
  async(async (req, res) => {
    const city = (await City.findOne({ id: req.params.id })).toObject();
    const exclude = ["current", "minutely", "hourly", "daily"].filter(
      (part) => !req.query.include.includes(part)
    );
    const query = objToQueryParams({
      lat: city.coord.lat,
      lon: city.coord.lon,
      appid: apiKey,
      lang: req.query.lang,
      units: req.query.units,
      exclude,
    });
    const response = await fetch(`${weatherAPI}/onecall?${query}`);
    const weather = await response.json();

    res.send(weather);
  })
);

router.get(
  "/current/:id",
  async(async (req, res) => {
    const response = await (
      await fetch(
        `${weatherAPI}/group?id=${req.params.id}&appid=${apiKey}&lang=${req.query.lang}&units=${req.query.units}`
      )
    ).json();
    const cities = [];

    for (const city of response.list) {
      cities.push({
        main: {
          tempMax: Math.round(city.main["temp_max"]),
          tempMin: Math.round(city.main["temp_min"]),
          temp: Math.round(city.main["temp"]),
          feels_like: Math.round(city.main["feels_like"]),
          pressure: Math.round(city.main["pressure"]),
          humidity: city.main["humidity"],
        },
        weather: {
          id: city.weather[0].id,
          main: city.weather[0].main,
          description: city.weather[0].description,
          icon: city.weather[0].icon,
        },
        city: {
          name: city.name,
          id: city.id,
        },
        wind: {
          speed: city.wind["speed"],
        },
      });
    }

    res.send(cities);
  })
);

router.get(
  "/5-days/:id",
  async(async (req, res) => {
    const forecast = await (
      await fetch(
        `${weatherAPI}/forecast?id=${req.params.id}&appid=${apiKey}&lang=${req.query.lang}&units=${req.query.units}`
      )
    ).json();

    let hourlyForecast = {
      days: [],
      city: {
        name: forecast.city.name,
        id: forecast.city.id,
      },
    };

    for (const weather of forecast.list) {
      hourlyForecast.days.push({
        main: {
          temp: Math.round(weather.main.temp),
        },
        weather: weather.weather[0],
        day: weather["dt_txt"].split(" ")[0],
        hour: weather["dt_txt"].split(" ")[1],
      });
    }

    hourlyForecast.days = groupBy(hourlyForecast.days, "day");

    res.send(hourlyForecast);
  })
);

module.exports = router;
