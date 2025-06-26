document.addEventListener('DOMContentLoaded', () => {
    // Находим элементы интерфейса
    const form = document.getElementById("form");
    const progress = document.getElementById('progress');
    const statusElement = document.getElementById('status');
    const sendButton = document.getElementById('send');
    const fileInput = document.getElementById('file');
    const fileUpload = document.querySelector('.file-upload');
    const fileNameElement = document.querySelector('.file-name');

    let xhr = null; // Для хранения объекта XMLHttpRequest
    let isUploading = false; // Флаг загрузки

    // Функция для сброса состояния загрузки
    function resetUploadState() {
        isUploading = false;
        sendButton.disabled = false;
        sendButton.textContent = 'Отправить';
        sendButton.classList.remove('uploading');
        fileUpload.classList.remove('disabled');
        progress.value = 0;
        if (xhr) {
            xhr = null;
        }
    }

    // Обработчик нажатия на кнопку отправки/остановки
    sendButton.addEventListener('click', function (event) {
        event.preventDefault();

        if (isUploading) {
            // Если загрузка в процессе - останавливаем
            if (xhr) {
                xhr.abort();
                statusElement.textContent = '❌ Загрузка отменена';
                resetUploadState();
            }
        } else {
            // Если загрузка не начата - запускаем
            if (!fileInput.files.length) {
                statusElement.textContent = 'Пожалуйста, выберите файл';
                return;
            }

            // Показываем состояние загрузки
            this.textContent = 'Остановить';
            this.classList.add('uploading');

            // Запускаем загрузку
            startFileUpload();
        }
    });

    // Функция начала загрузки файла
    function startFileUpload() {
        isUploading = true;
        fileUpload.classList.add('disabled');
        statusElement.textContent = 'Начало загрузки...';
        progress.value = 0;

        // Создаем объект FormData из формы
        const formData = new FormData(form);
        xhr = new XMLHttpRequest();

        // Настраиваем запрос
        xhr.open("POST", form.action, true);

        // Обработчик прогресса загрузки
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progress.value = percentComplete;
                statusElement.textContent = `Загружено: ${Math.round(percentComplete)}%`;
            }
        };

        // Обработчик успешной загрузки
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                statusElement.textContent = '✅ Файл успешно загружен!';
                progress.value = 100;

                // Сразу сбрасываем состояние кнопки, но оставляем прогресс-бар
                isUploading = false;
                sendButton.disabled = false;
                sendButton.textContent = 'Отправить';
                sendButton.classList.remove('uploading');
                fileUpload.classList.remove('disabled');
                xhr = null;

                // Сбрасываем форму и прогресс-бар через 3 секунды
                setTimeout(() => {
                    form.reset();
                    fileNameElement.textContent = 'или перетащите его сюда';
                    statusElement.textContent = 'Выберите файл для загрузки';
                    progress.value = 0;
                    sendButton.disabled = true;
                }, 3000);
            } else {
                statusElement.textContent = `❌ Ошибка: ${xhr.statusText || 'Неизвестная ошибка'}`;
                resetUploadState();
            }
        };

        // Обработчик ошибки соединения
        xhr.onerror = function () {
            if (xhr.statusText !== 'abort') {
                statusElement.textContent = '❌ Ошибка соединения с сервером';
                resetUploadState();
            }
        };

        // Обработчик отмены загрузки
        xhr.onabort = function () {
            if (isUploading) {
                resetUploadState();
            }
        };

        // Отправляем данные
        try {
            xhr.send(formData);
        } catch (error) {
            statusElement.textContent = '❌ Ошибка при отправке файла';
            resetUploadState();
        }
    }


    // Предотвращаем стандартную отправку формы
    form.addEventListener('submit', function (event) {
        event.preventDefault();
    });
});