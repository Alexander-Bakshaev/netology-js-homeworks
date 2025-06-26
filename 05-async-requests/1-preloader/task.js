const API_URL = 'https://students.netoservices.ru/nestjs-backend/slow-get-courses';
const CACHE_KEYS = { CURRENCIES: 'cachedCurrencies', LAST_UPDATED: 'lastUpdated' };

const formatDate = (dateString) => dateString ? `Обновлено: ${new Date(dateString).toLocaleString('ru-RU')}` : '';

const getCurrencyRow = ({ CharCode, Value, Name }) => `
  <tr>
    <td>${CharCode}</td>
    <td>${Value.toFixed(2)}</td>
    <td>${Name}</td>
  </tr>`;

document.addEventListener('DOMContentLoaded', () => {
  // Основные DOM-элементы
  const loader = document.getElementById('loader');
  const itemsContainer = document.getElementById('items');
  const refreshBtn = document.getElementById('refresh-btn');
  const lastUpdatedElement = document.getElementById('last-updated');

  /**
   * Отображает данные о валютах на странице
   * @param {Object} currencies - Объект с данными о валютах
   * @param {string} timestamp - Временная метка последнего обновления
   */
  const displayCurrencyData = (currencies, timestamp = null) => {
    itemsContainer.innerHTML = `
      <table id="currency-table">
        <thead><tr><th>Код</th><th>Курс</th><th>Валюта</th></tr></thead>
        <tbody>${Object.values(currencies).map(getCurrencyRow).join('')}</tbody>
      </table>`;
    if (timestamp) lastUpdatedElement.textContent = formatDate(timestamp);
  };

  /**
   * Загружает данные о курсах валют с сервера
   * @returns {Promise<void>}
   */
  const loadCurrencyData = async () => {
    try {
      // Показываем индикатор загрузки
      loader.classList.add('loader_active');
      refreshBtn.classList.add('loading');
      refreshBtn.disabled = true;
      
      // Загружаем данные с сервера
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки');
      
      // Обрабатываем и сохраняем данные
      const { response: { Valute: currencies } } = await response.json();
      const timestamp = new Date().toISOString();
      
      // Кешируем данные
      localStorage.setItem(CACHE_KEYS.CURRENCIES, JSON.stringify(currencies));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATED, timestamp);
      
      // Отображаем данные
      displayCurrencyData(currencies, timestamp);
    } catch (error) {
      console.error('Ошибка:', error);
      itemsContainer.innerHTML = '<div class="error-message">Не удалось загрузить курсы валют</div>';
    } finally {
      // Всегда скрываем индикатор загрузки
      loader.classList.remove('loader_active');
      refreshBtn.classList.remove('loading');
      refreshBtn.disabled = false;
    }
  };

  /**
   * Загружает данные из кеша
   * @returns {boolean} true, если данные успешно загружены
   */
  const loadFromCache = () => {
    const cachedData = localStorage.getItem(CACHE_KEYS.CURRENCIES);
    if (!cachedData) return false;
    
    try {
      displayCurrencyData(JSON.parse(cachedData), localStorage.getItem(CACHE_KEYS.LAST_UPDATED));
      return true;
    } catch (e) {
      console.error('Ошибка кеша:', e);
      return false;
    }
  };

  // Обработчик клика по кнопке обновления
  refreshBtn.addEventListener('click', loadCurrencyData);
  
  // Обновляем данные при возвращении на вкладку
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadCurrencyData();
  });

  // Проверяем, устарели ли кешированные данные
  const isCacheExpired = () => {
    const lastUpdated = localStorage.getItem(CACHE_KEYS.LAST_UPDATED);
    const FIVE_MINUTES = 5 * 60 * 1000;
    return Date.now() - new Date(lastUpdated).getTime() > FIVE_MINUTES;
  };

  // Инициализация при загрузке страницы
  if (!loadFromCache() || isCacheExpired()) {
    loadCurrencyData();
  }
});