// Начальное количество секунд
let totalSeconds = 59;

// Получаем элемент таймера
const timerElement = document.getElementById('timer');

// Функция для обновления таймера
function updateTimer() {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

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
        alert('Вы победили в конкурсе!');
        startDownload();
    }
}

// Функция для запуска скачивания файла
function startDownload() {
    const downloadLink = document.createElement('a');
    downloadLink.href = 'https://example.com/yourfile.zip';
    downloadLink.download = 'prize.zip';
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Запускаем интервал для обновления таймера
const timerInterval = setInterval(updateTimer, 1000);