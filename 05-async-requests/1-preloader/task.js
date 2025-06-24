document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const itemsContainer = document.getElementById("items");

  // Функция для отображения данных о валютах на странице
  function displayCurrencyData(currencies) {
    // Очистка контейнера перед добавлением данных
    itemsContainer.innerHTML = '';
    
    currencies.forEach((currency) => {
      // Создаем отдельный элемент для конкретной валюты
      const item = document.createElement("div");
      item.className = "item";

      // Создаем блок с кодом валюты
      const codeElement = document.createElement("div");
      codeElement.className = "item__code";
      codeElement.textContent = currency.CharCode;

      // Создаем блок со значением курса
      const valueElement = document.createElement("div");
      valueElement.className = "item__value";
      valueElement.textContent = currency.Value;

      // Создаем блок с текстом "руб."
      const currencyElement = document.createElement("div");
      currencyElement.className = "item__currency";
      currencyElement.textContent = "руб.";

      // Добавляем созданные элементы в item
      item.appendChild(codeElement);
      item.appendChild(valueElement);
      item.appendChild(currencyElement);

      // Добавляем элемент с конкретной валютой в основной контейнер
      itemsContainer.appendChild(item);
    });
  }

  // Функция для загрузки данных о курсах валют из API
  function loadCurrencyData() {
    fetch("https://students.netoservices.ru/nestjs-backend/slow-get-courses")
      // Выводим данные о курсах валют из API
      .then((response) => response.json())
      .then((data) => {
        const currencies = Object.values(data.response.Valute);

        // Сохраняем полученные данные в localStorage для кеширования
        localStorage.setItem("cachedCurrencies", JSON.stringify(currencies));
        localStorage.setItem("lastUpdated", Date.now().toString());

        // Скрываем анимацию загрузки и отображаем данные на странице
        loader.classList.remove("loader_active");
        displayCurrencyData(currencies);
      })

      // Выводим ошибку в консоль при возникновении ошибки загрузки данных
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        loader.classList.remove("loader_active");
      });
  }

  // Проверка и отображение данных из кэша, если они есть
  const cachedCurrencies = localStorage.getItem("cachedCurrencies");
  if (cachedCurrencies) {
    // Если данные есть в кэше, отображаем их сразу
    displayCurrencyData(JSON.parse(cachedCurrencies));
  }

  loader.classList.add("loader_active");
  loadCurrencyData();
});