// Начальное количество секунд
let totalSeconds = 59;

// Получаем элемент таймера
const timerElement = document.getElementById('timer');

// Функция для обновления таймера
function updateTimer() {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    // Форматируем время в hh:mm:ss
    const formattedTime = 
        String(hours).padStart(2, '0') + ':' + 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');

    // Обновляем содержимое таймера
    timerElement.textContent = formattedTime;

    // Уменьшаем количество секунд
    if (totalSeconds > 0) {
        totalSeconds--;
    } else {
        clearInterval(timerInterval);
        alert("Вы победили в конкурсе!");
        startDownload();
    }
}

// Функция для запуска скачивания
function startDownload() {
    const link = document.createElement('a');
    link.href = 'https://example.com/yourfile.zip';
    link.download = 'yourfile.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Запускаем интервал для обновления таймера
const timerInterval = setInterval(updateTimer, 1000);