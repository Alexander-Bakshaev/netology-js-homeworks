// Основной обработчик загрузки DOM-дерева
// Инициализирует все обработчики событий для работы с файлами
document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылки на DOM-элементы
    const fileInput = document.getElementById('file');
    const fileLabel = document.querySelector('.file-label');
    const fileNameElement = document.querySelector('.file-name');
    const sendButton = document.getElementById('send');
    const statusElement = document.getElementById('status');


    // Обработчик события выбора файла через кнопку "Выбрать файл"

    fileInput.addEventListener('change', function () {
        updateFileInfo(this.files[0]);
    });

    // Обработчики drag & drop
    fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.classList.add('drag-over');
    });

    // Обработчик события выхода указателя за пределы области загрузки
    fileLabel.addEventListener('dragleave', () => {
        fileLabel.classList.remove('drag-over');
    });

    // Обработчик события сброса файла в область загрузки
    fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateFileInfo(e.dataTransfer.files[0]);
        }
    });

    /**
     * Обновляет информацию о выбранном файле в интерфейсе
     * @param {File|null} file - Объект выбранного файла или null, если файл не выбран
     */
    function updateFileInfo(file) {
        if (file) {
            // Форматируем размер файла в мегабайты
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            // Обновляем статус и имя файла в интерфейсе
            statusElement.textContent = `Выбран файл: ${file.name} (${fileSize} МБ)`;
            fileNameElement.textContent = file.name;
            // Активируем кнопку отправки
            sendButton.disabled = false;
        } else {
            // Сбрасываем состояние, если файл не выбран
            statusElement.textContent = 'Выберите файл для загрузки';
            fileNameElement.textContent = 'или перетащите его сюда';
            sendButton.disabled = true;
        }
    }
});
