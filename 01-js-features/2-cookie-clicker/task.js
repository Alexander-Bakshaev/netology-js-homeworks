// Получаем необходимые элементы из HTML
const cookie = document.getElementById('cookie');
const clickerCounter = document.getElementById('clicker__counter');
const clickerSpeed = document.getElementById('clicker__speed');

// Инициализируем переменные
let counter = 0;
let lastClickTime = null;

// Функция для обработки клика
cookie.onclick = function() {
    // Увеличиваем счётчик
    counter++;
    clickerCounter.textContent = counter;

    // Получаем текущее время
    const currentTime = new Date();

     // Если это не первый клик, рассчитываем скорость клика
     if (lastClickTime) {
        const timeDifference = (currentTime - lastClickTime) / 1000;
        const clickSpeed = (1 / timeDifference).toFixed(2);
        clickerSpeed.textContent = clickSpeed;
    }

    // Сохраняем время последнего клика
    lastClickTime = currentTime;

    // Меняем размеры печеньки
    if (counter % 2 === 0) {
        cookie.style.width = '180px';
        cookie.style.height = '100px';
    } else {
        cookie.style.width = '200px';
        cookie.style.height = '120px';
    }
};
