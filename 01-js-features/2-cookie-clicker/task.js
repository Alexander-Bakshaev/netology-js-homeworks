// Получаем необходимые элементы из HTML
const cookie = document.getElementById('cookie');
const clickerCounter = document.getElementById('clicker__counter');
const clickerSpeed = document.getElementById('clicker__speed');

// Инициализируем переменные
let counter = 0;
const clickTimes = []; // Массив для хранения времени кликов
const SPEED_CALCULATION_WINDOW = 5; // Количество кликов для усреднения скорости

// Функция для обработки клика
cookie.onclick = function () {
    // Увеличиваем счётчик и обновляем отображение
    counter++;
    clickerCounter.textContent = counter;

    // Получаем текущее время
    const currentTime = new Date();

    // Добавляем текущее время в массив кликов
    clickTimes.push(currentTime);

    // Удаляем старые клики, если превысили окно усреднения
    if (clickTimes.length > SPEED_CALCULATION_WINDOW) {
        clickTimes.shift();
    }

    // Рассчитываем среднюю скорость, если есть хотя бы 2 клика
    if (clickTimes.length > 1) {
        const timeDiff = (clickTimes[clickTimes.length - 1] - clickTimes[0]) / 1000;
        const clicksInWindow = clickTimes.length - 1;
        const clicksPerSecond = (clicksInWindow / timeDiff).toFixed(2);
        clickerSpeed.textContent = clicksPerSecond;
    }

    // Анимация печеньки
    cookie.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cookie.style.transform = 'scale(1.0)';
    }, 100);


};
