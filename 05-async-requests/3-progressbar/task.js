// Назначаем обработчик события отправки формы
document.getElementById("form").onsubmit = function(event) {
    // Предотвращаем стандартное поведение формы
    event.preventDefault();

    // Создаем объект FormData из текущей формы. Создаем объект XMLHttpRequest для отправки данных
    const formData = new FormData(this);
    const xhr = new XMLHttpRequest();

    // Настраиваем запрос на отправку данных методом POST 
    xhr.open("POST", this.action, true);

    // Добавляем обработчик события загрузки, срабатываемый во время отправки данных
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            const progress = document.getElementById('progress');
            if (progress) {
                progress.value = percentComplete;
            }
        }
    };

    // Добавляем обработчик события завершения загрузки
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Если статус успешный, выводим сообщение в консоль
            console.log('Файл успешно загружен!');
        } else {
            // Если произошла ошибка, выводим сообщение об ошибке
            console.error('Ошибка загрузки файла: ', xhr.statusText);
        }
    };

    // Добавляем обработчик события ошибки
    xhr.onerror = function() {
        console.error('Ошибка соединения.');
    };

    // Отправляем данные формы на сервер
    xhr.send(formData);
};