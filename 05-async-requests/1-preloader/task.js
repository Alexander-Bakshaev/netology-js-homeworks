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
  const loader = document.getElementById('loader');
  const itemsContainer = document.getElementById('items');
  const refreshBtn = document.getElementById('refresh-btn');
  const lastUpdatedElement = document.getElementById('last-updated');

  const displayCurrencyData = (currencies, timestamp = null) => {
    itemsContainer.innerHTML = `
      <table id="currency-table">
        <thead><tr><th>Код</th><th>Курс</th><th>Валюта</th></tr></thead>
        <tbody>${Object.values(currencies).map(getCurrencyRow).join('')}</tbody>
      </table>`;
    if (timestamp) lastUpdatedElement.textContent = formatDate(timestamp);
  };

  const loadCurrencyData = async () => {
    try {
      loader.classList.add('loader_active');
      refreshBtn.classList.add('loading');
      refreshBtn.disabled = true;
      
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки');
      
      const { response: { Valute: currencies } } = await response.json();
      const timestamp = new Date().toISOString();
      
      localStorage.setItem(CACHE_KEYS.CURRENCIES, JSON.stringify(currencies));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATED, timestamp);
      
      displayCurrencyData(currencies, timestamp);
    } catch (error) {
      console.error('Ошибка:', error);
      itemsContainer.innerHTML = '<div class="error-message">Не удалось загрузить курсы валют</div>';
    } finally {
      loader.classList.remove('loader_active');
      refreshBtn.classList.remove('loading');
      refreshBtn.disabled = false;
    }
  };

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

  refreshBtn.addEventListener('click', loadCurrencyData);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadCurrencyData();
  });

  if (!loadFromCache() || Date.now() - new Date(localStorage.getItem(CACHE_KEYS.LAST_UPDATED)).getTime() > 300000) {
    loadCurrencyData();
  }
});