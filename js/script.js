"use strict";

const citySelect = document.querySelector("#city-select");
const planButton = document.querySelector("#plan-button");
const result = document.querySelector("#result");
const status = document.querySelector("#status");

// Эти три функции уже возвращают Promise. Их переписывать не нужно.
function getCity(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cities = { spb: "Санкт-Петербург", kazan: "Казань" };
      if (cities[code]) resolve(cities[code]);
      else reject(new Error("Город не найден"));
    }, 500);
  });
}
function getWeather(city) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({ city, weather: city === "Казань" ? "солнечно" : "ветрено" }),
      500,
    );
  });
}
function getAdvice(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tip =
        data.weather === "солнечно"
          ? "Возьмите солнцезащитные очки."
          : "Захватите ветровку.";
      resolve(`${data.city}: ${data.weather}. ${tip}`);
    }, 500);
  });
}

// Вариант с .then() уже работает. Ваша задача — переписать его.
// TODO 1. Создайте async function buildPlan().
// TODO 2. Используйте три await последовательно: getCity, getWeather, getAdvice.
// TODO 3. Добавьте try/catch/finally для результата, ошибки и разблокировки кнопки.
// TODO 4. Подключите новую функцию к кнопке, убрав цепочку .then().
planButton.addEventListener("click", () => {
  planButton.disabled = true;
  result.textContent = "Составляем совет...";
  status.className = "status status--working";
  status.textContent = "Получаем данные...";

  getCity(citySelect.value)
    .then((city) => getWeather(city))
    .then((weather) => getAdvice(weather))
    .then((advice) => {
      result.textContent = advice;
      status.className = "status status--success";
      status.textContent = "Совет готов.";
    })
    .catch((error) => {
      result.textContent = error.message;
      status.className = "status status--error";
      status.textContent = "Не удалось составить совет.";
    })
    .finally(() => {
      planButton.disabled = false;
    });
});

async function buildPlan() {
  planButton.disabled = true;
  result.textContent = "Составляем совет...";
  status.className = "status status--working";
  status.textContent = "Получаем данные...";

  try {
    const city = await getCity(citySelect.value);
    const weather = await getWeather(city);
    const advice = await getAdvice(weather);

    result.textContent = advice;
    status.className = "status status--success";
    status.textContent = "Совет готов.";
  } catch (error) {
    result.textContent = error.message;
    status.className = "status status--error";
    status.textContent = "Не удалось составить совет.";
  } finally {
    planButton.disabled = false;
  }
}

planButton.addEventListener("click", buildPlan);