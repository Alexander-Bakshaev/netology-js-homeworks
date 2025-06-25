// Константы
const API_URL = 'https://students.netoservices.ru/nestjs-backend/slow-get-courses';
const CACHE_KEYS = {
  CURRENCIES: 'cachedCurrencies',
  LAST_UPDATED: 'lastUpdated'
};

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const itemsContainer = document.getElementById('items');
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Обновить курсы';
  refreshButton.className = 'refresh-button';
  document.querySelector('.card').prepend(refreshButton);

  // Функция создания элемента валюты
  function createCurrencyElement(currency) {
    const item = document.createElement('div');
    item.className = 'item';

    ['code', 'value', 'currency'].forEach(type => {
      const div = document.createElement('div');
      div.className = `item__${type}`;

      switch(type) {
        case 'code':
          div.textContent = currency.CharCode;
          break;
        case 'value':
          div.textContent = currency.Value.toFixed(2);
          break;
        case 'currency':
          div.textContent = 'руб.';
          break;
      }

      item.appendChild(div);
    });

    return item;
  }

  // Функция отображения данных
  function displayCurrencyData(currencies) {
    itemsContainer.innerHTML = '';
    Object.values(currencies).forEach(currency => {
      itemsContainer.appendChild(createCurrencyElement(currency));
    });
  }

  // Функция загрузки данных
  async function loadCurrencyData() {
    try {
      loader.classList.add('loader_active');

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки данных');

      const data = await response.json();
      const currencies = data.response.Valute;

      // Кешируем данные
      localStorage.setItem(CACHE_KEYS.CURRENCIES, JSON.stringify(currencies));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATED, new Date().toLocaleString());

      displayCurrencyData(currencies);
    } catch (error) {
      console.error('Ошибка:', error);
      itemsContainer.textContent = 'Не удалось загрузить курсы валют. Пожалуйста, попробуйте позже.';
    } finally {
      loader.classList.remove('loader_active');
    }
  }

  // Загрузка данных из кеша
  function loadFromCache() {
    const cachedData = localStorage.getItem(CACHE_KEYS.CURRENCIES);
    if (cachedData) {
      try {
        displayCurrencyData(JSON.parse(cachedData));
      } catch (e) {
        console.error('Ошибка при чтении кеша:', e);
      }
    }
  }

  // Обработчики событий
  refreshButton.addEventListener('click', loadCurrencyData);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      loadCurrencyData();
    }
  });

  // Инициализация
  loadFromCache();
  loadCurrencyData(); // Загружаем свежие данные
});