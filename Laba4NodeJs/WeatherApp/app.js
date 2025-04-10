// const express = require("express");
// const hbs = require("hbs");
// const axios = require("axios");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.use(express.static(path.join(__dirname, "public")));

// // Шлях до шаблонів
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));
// hbs.registerPartials(path.join(__dirname, "views", "partials"));

// // Меню з містами
// const cities = ["Kyiv", "Lviv", "Kharkiv", "Odesa", "Zhytomyr"];

// app.get("/", (req, res) => {
//   res.render("index", { cities });
// });

// app.use((req, res, next) => {
//     res.locals.year = new Date().getFullYear();
//     next();
//   });
  

// // Отримання погоди для міста
// app.get("/weather/:city", async (req, res) => {
//   const city = req.params.city;
//   const apiKey = "03349a204ad6803502fc9a9d0f0c0b78"; // отримаєш нижче
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//   try {
//     const response = await axios.get(url);
//     const weatherData = response.data;
//     res.render("weather", {
//       city: weatherData.name,
//       temp: weatherData.main.temp,
//       description: weatherData.weather[0].description,
//       icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
//     });
//   } catch (error) {
//     console.error("❌ ПОМИЛКА:", error.response?.data || error.message);
//     res.render("weather", { error: "Місто не знайдено або помилка API" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Сервер запущено на http://localhost:${PORT}`);
// });


const express = require("express");
const hbs = require("hbs");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3005;

// Статичні файли (CSS)
app.use(express.static(path.join(__dirname, "public")));

// Handlebars setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// Додаємо поточний рік
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear();
  next();
});

// Список міст
const cities = ["Kyiv", "Lviv", "Kharkiv", "Odesa", "Zhytomyr", "Voznesensk"];

// Головна сторінка
app.get("/", (req, res) => {
  res.render("index", { cities });
});

// Погода по місту
app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = "03349a204ad6803502fc9a9d0f0c0b78";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    res.render("weather", {
      city: weatherData.name,
      temp: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
    });
  } catch (error) {
    console.error("❌ ПОМИЛКА:", error.response?.data || error.message);
    res.render("weather", { error: "Місто не знайдено або помилка API" });
  }
});

// 🟢 Погода за координатами (браузерна геолокація)
app.get("/weather", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  if (!lat || !lon) {
    return res.render("weather", {
      error: "Не вказано координати (не надано дозвіл або не підтримується геолокація).",
    });
  }

  const apiKey = "03349a204ad6803502fc9a9d0f0c0b78";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;

    res.render("weather", {
      city: weatherData.name,
      temp: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
    });
  } catch (error) {
    console.error("❌ ПОМИЛКА GEO API:", error.message);
    res.render("weather", {
      error: "Не вдалося отримати погоду за координатами.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});
